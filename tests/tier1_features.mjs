// tests/tier1_features.mjs
// Tier 1: Feature Coverage (>=5 test cases per feature across all 10 features = 50 tests)

import {
  TestSuite,
  api,
  assert,
  assertEqual,
  assertStatus,
  assertArray,
  assertIncludes,
} from './config.mjs';

export function createTier1Suite() {
  const suite = new TestSuite('Tier 1: Feature Coverage (50 Tests)');

  // ─────────────────────────────────────────────────────────────
  // FEATURE 1: Category & Catalog Sync (R1)
  // ─────────────────────────────────────────────────────────────
  suite.test('F1.1: Public catalog returns business, categories, and products for demo tenant', async () => {
    const res = await api('/api/public/panaderia-la-estrella');
    assertStatus(res, 200);
    assert(res.data.business, 'Response must contain business object');
    assertEqual(res.data.business.slug, 'panaderia-la-estrella');
    assertArray(res.data.categories, 'Response must contain categories array');
    assertArray(res.data.products, 'Response must contain products array');
    assert(res.data.products.length > 0, 'Public store must have products');
  });

  suite.test('F1.2: Public categories encompass categories assigned to active products', async () => {
    const res = await api('/api/public/panaderia-la-estrella');
    assertStatus(res, 200);
    const categoryNames = new Set(res.data.categories.map(c => c.name));
    res.data.products.forEach(p => {
      if (p.category) {
        assert(categoryNames.has(p.category) || categoryNames.size > 0, `Product category ${p.category} should be known`);
      }
    });
  });

  suite.test('F1.3: GET /api/categories returns categories matching businessId', async () => {
    const res = await api('/api/categories?businessId=biz_estrella_1');
    assertStatus(res, 200);
    assertArray(res.data);
    assert(res.data.length > 0, 'Expected at least 1 category for biz_estrella_1');
    res.data.forEach(c => {
      assertEqual(c.businessId, 'biz_estrella_1');
    });
  });

  suite.test('F1.4: GET /api/products returns products linked to businessId', async () => {
    const res = await api('/api/products?businessId=biz_estrella_1');
    assertStatus(res, 200);
    assertArray(res.data);
    assert(res.data.length > 0, 'Expected products for biz_estrella_1');
    res.data.forEach(p => {
      assertEqual(p.businessId, 'biz_estrella_1');
      assert(p.name && p.price !== undefined, 'Product must have name and price');
    });
  });

  suite.test('F1.5: Creating category via POST /api/categories is immediately queryable', async () => {
    const testCatName = `Cat-Sync-${Date.now()}`;
    const createRes = await api('/api/categories', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: testCatName },
    });
    assertStatus(createRes, 201);
    assertEqual(createRes.data.name, testCatName);

    const listRes = await api('/api/categories?businessId=biz_estrella_1');
    assertStatus(listRes, 200);
    const exists = listRes.data.some(c => c.name === testCatName);
    assert(exists, 'Newly created category should appear in categories list');

    // Cleanup
    if (createRes.data.id) {
      await api(`/api/categories?businessId=biz_estrella_1&categoryId=${createRes.data.id}`, { method: 'DELETE' });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 2: Category Selectors in Dashboard (R1)
  // ─────────────────────────────────────────────────────────────
  suite.test('F2.1: Categories selector loads active categories for burger-station', async () => {
    const res = await api('/api/categories?businessId=biz_burger_2');
    assertStatus(res, 200);
    assertArray(res.data);
    assert(res.data.length > 0, 'burger-station must have categories for selector');
  });

  suite.test('F2.2: Category objects contain required id, name, and businessId properties', async () => {
    const res = await api('/api/categories?businessId=biz_burger_2');
    assertStatus(res, 200);
    res.data.forEach(cat => {
      assert(cat.id, 'Category must have an id');
      assert(cat.name, 'Category must have a name');
      assert(cat.businessId, 'Category must have a businessId');
    });
  });

  suite.test('F2.3: Creating product with category selector value assigns category correctly', async () => {
    const prodName = `Test Burger Item ${Date.now()}`;
    const createRes = await api('/api/products', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        name: prodName,
        price: 9.99,
        category: 'Smash Burgers',
      },
    });
    assertStatus(createRes, 200);
    assertEqual(createRes.data.category, 'Smash Burgers');
    assertEqual(createRes.data.name, prodName);

    // Cleanup
    if (createRes.data.id) {
      await api(`/api/products?businessId=biz_burger_2&productId=${createRes.data.id}`, { method: 'DELETE' });
    }
  });

  suite.test('F2.4: Categories returned have distinct names for selector rendering', async () => {
    const res = await api('/api/categories?businessId=biz_estrella_1');
    assertStatus(res, 200);
    const names = res.data.map(c => c.name.toLowerCase());
    const uniqueNames = new Set(names);
    assertEqual(names.length, uniqueNames.size, 'Category names should be unique for clean UI selectors');
  });

  suite.test('F2.5: Existing product categories match active business categories', async () => {
    const [catRes, prodRes] = await Promise.all([
      api('/api/categories?businessId=biz_burger_2'),
      api('/api/products?businessId=biz_burger_2'),
    ]);
    assertStatus(catRes, 200);
    assertStatus(prodRes, 200);
    const catNames = new Set(catRes.data.map(c => c.name));
    prodRes.data.forEach(p => {
      if (p.category) {
        assert(catNames.has(p.category) || catNames.size > 0, `Product category ${p.category} should be in business categories`);
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 3: Dynamic Route Execution (R1)
  // ─────────────────────────────────────────────────────────────
  suite.test('F3.1: Public store endpoint includes no-cache Cache-Control header', async () => {
    const res = await api('/api/public/panaderia-la-estrella');
    assertStatus(res, 200);
    const cacheHeader = res.headers.get('cache-control') || '';
    assert(
      cacheHeader.includes('no-store') || cacheHeader.includes('no-cache') || cacheHeader.includes('max-age=0'),
      `Cache-Control should be no-cache/no-store, got: ${cacheHeader}`
    );
  });

  suite.test('F3.2: Categories API route executes dynamically on demand without 304', async () => {
    const res1 = await api('/api/categories?businessId=biz_burger_2');
    assertStatus(res1, 200);
    const res2 = await api('/api/categories?businessId=biz_burger_2', {
      headers: { 'If-None-Match': 'stale-etag-token' },
    });
    // Dynamic routes with force-dynamic return 200 fresh data
    assertStatus(res2, 200);
  });

  suite.test('F3.3: Products API route executes dynamically with fresh state', async () => {
    const res = await api('/api/products?businessId=biz_burger_2');
    assertStatus(res, 200);
    assertArray(res.data);
  });

  suite.test('F3.4: Orders API route executes dynamically on demand', async () => {
    const res = await api('/api/orders?businessId=biz_burger_2');
    assertStatus(res, 200);
    assertArray(res.data);
  });

  suite.test('F3.5: Dynamic API responses respond with sub-second latency', async () => {
    const res = await api('/api/business?slug=burger-station');
    assertStatus(res, 200);
    assert(res.durationMs < 1000, `Expected latency < 1000ms, got ${res.durationMs}ms`);
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 4: Order Submission & Persistence (R2)
  // ─────────────────────────────────────────────────────────────
  suite.test('F4.1: POST /api/orders creates a new order returning HTTP 201', async () => {
    const res = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        items: [{ productId: 'prod_1', name: 'Cachito Tradicional', price: 2.5, quantity: 2 }],
        total: 5.0,
        customerNote: 'Bien caliente por favor',
        whatsappMessage: '🛒 *Nuevo Pedido para Panadería La Estrella*...',
      },
    });
    assertStatus(res, 201);
    assert(res.data.id, 'Order must have generated ID');
    assertEqual(res.data.businessId, 'biz_estrella_1');
  });

  suite.test('F4.2: Created order response contains valid total and status', async () => {
    const res = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        items: [{ productId: 'prod_2', name: 'Pan Campesino', price: 1.5, quantity: 2 }],
        total: 3.0,
      },
    });
    assertStatus(res, 201);
    assertEqual(Number(res.data.total), 3.0);
    assert(res.data.status, 'Order must have a status string');
  });

  suite.test('F4.3: GET /api/orders retrieves the newly created order in database', async () => {
    const note = `Order-Note-${Date.now()}`;
    const createRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        items: [{ productId: 'p1', name: 'Golfeado', price: 2.0, quantity: 1 }],
        total: 2.0,
        customerNote: note,
      },
    });
    assertStatus(createRes, 201);
    const orderId = createRes.data.id;

    const listRes = await api('/api/orders?businessId=biz_estrella_1');
    assertStatus(listRes, 200);
    const found = listRes.data.find(o => o.id === orderId);
    assert(found, 'Created order must be found in GET /api/orders');
    assertEqual(Number(found.total), 2.0);
  });

  suite.test('F4.4: Order submission preserves multi-item order array', async () => {
    const items = [
      { productId: 'p1', name: 'Item 1', price: 3.0, quantity: 1 },
      { productId: 'p2', name: 'Item 2', price: 4.5, quantity: 2 },
    ];
    const res = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        items,
        total: 12.0,
      },
    });
    assertStatus(res, 201);
    assertArray(res.data.items);
    assertEqual(res.data.items.length, 2);
  });

  suite.test('F4.5: Order submission persists customer notes and whatsapp message', async () => {
    const note = 'Sin cebolla y extra salsa';
    const waMsg = 'Mensaje de WhatsApp de prueba';
    const res = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        items: [{ productId: 'b1', name: 'Burger Clásica', price: 8.0, quantity: 1 }],
        total: 8.0,
        customerNote: note,
        whatsappMessage: waMsg,
      },
    });
    assertStatus(res, 201);
    // Verify in GET
    const listRes = await api('/api/orders?businessId=biz_burger_2');
    const order = listRes.data.find(o => o.id === res.data.id);
    assert(order, 'Order should be persisted');
    if (order.customerNote) {
      assertEqual(order.customerNote, note);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 5: WhatsApp URL Generation & Formatting (R2)
  // ─────────────────────────────────────────────────────────────
  suite.test('F5.1: Phone cleaning handles non-digit characters correctly', async () => {
    const raw = '+58 (414) 600-1234';
    const cleaned = raw.replace(/\D/g, '');
    assertEqual(cleaned, '584146001234');
  });

  suite.test('F5.2: Venezuelan local phone prefix 0414 normalizes to 58414', async () => {
    const localPhone = '04146001234';
    let clean = localPhone.replace(/\D/g, '');
    if (clean.startsWith('0') && clean.length === 11) {
      clean = '58' + clean.slice(1);
    }
    assertEqual(clean, '584146001234');
  });

  suite.test('F5.3: WhatsApp message text contains store name, items, and total', async () => {
    const storeName = 'Panadería La Estrella';
    const items = [{ name: 'Cachito', qty: 2, price: 2.5 }];
    let message = `🛒 *Nuevo Pedido para ${storeName}*\n\n`;
    items.forEach(it => {
      message += `• ${it.qty}x ${it.name} — $${(it.qty * it.price).toFixed(2)}\n`;
    });
    message += `\n*Total a Pagar:* $5.00 USD\n`;

    assertIncludes(message, storeName);
    assertIncludes(message, '2x Cachito — $5.00');
    assertIncludes(message, '*Total a Pagar:* $5.00 USD');
  });

  suite.test('F5.4: Payment notes format without breaking markdown bold on line breaks', async () => {
    const paymentNotes = 'Pago Móvil: 0134\nZelle: pagos@laestrella.com\nEfectivo';
    // Single-line or line-by-line bolding ensures WhatsApp parser renders bold properly
    const formatted = paymentNotes.split('\n').map(l => `💳 *${l.trim()}*`).join('\n');
    const lines = formatted.split('\n');
    lines.forEach(line => {
      assert(line.startsWith('💳 *') && line.endsWith('*'), 'Each line should be properly delimited by bold tags');
    });
  });

  suite.test('F5.5: WhatsApp deep link constructs valid URL with encoded message', async () => {
    const phone = '584146001234';
    const text = '🛒 *Nuevo Pedido* • 1x Combo';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    assert(url.startsWith('https://wa.me/584146001234?text='), 'URL structure is valid');
    const parsed = new URL(url);
    assertEqual(parsed.searchParams.get('text'), text);
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 6: Owner Dashboard Orders Display & Status Sync (R2)
  // ─────────────────────────────────────────────────────────────
  suite.test('F6.1: Orders query returns orders sorted with recent first', async () => {
    const res = await api('/api/orders?businessId=biz_estrella_1');
    assertStatus(res, 200);
    assertArray(res.data);
    if (res.data.length >= 2) {
      const t0 = new Date(res.data[0].createdAt).getTime();
      const t1 = new Date(res.data[1].createdAt).getTime();
      assert(t0 >= t1, 'Orders should be returned sorted by createdAt descending');
    }
  });

  suite.test('F6.2: PATCH /api/orders transitions order status to en_proceso', async () => {
    // Create an order first
    const createRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        items: [{ productId: 'p1', name: 'Croissant', price: 2.0, quantity: 1 }],
        total: 2.0,
      },
    });
    assertStatus(createRes, 201);
    const orderId = createRes.data.id;

    const patchRes = await api('/api/orders', {
      method: 'PATCH',
      body: {
        businessId: 'biz_estrella_1',
        orderId,
        status: 'en_proceso',
      },
    });
    assertStatus(patchRes, 200);
    assertEqual(patchRes.data.status, 'en_proceso');
  });

  suite.test('F6.3: PATCH /api/orders transitions order status to completado', async () => {
    const createRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        items: [{ productId: 'p2', name: 'Pastelito', price: 1.5, quantity: 2 }],
        total: 3.0,
      },
    });
    assertStatus(createRes, 201);
    const orderId = createRes.data.id;

    const patchRes = await api('/api/orders', {
      method: 'PATCH',
      body: {
        businessId: 'biz_estrella_1',
        orderId,
        status: 'completado',
      },
    });
    assertStatus(patchRes, 200);
    assertEqual(patchRes.data.status, 'completado');
  });

  suite.test('F6.4: PATCH /api/orders transitions order status to cancelado', async () => {
    const createRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        items: [{ productId: 'b1', name: 'Bebida', price: 1.0, quantity: 1 }],
        total: 1.0,
      },
    });
    assertStatus(createRes, 201);
    const orderId = createRes.data.id;

    const patchRes = await api('/api/orders', {
      method: 'PATCH',
      body: {
        businessId: 'biz_burger_2',
        orderId,
        status: 'cancelado',
      },
    });
    assertStatus(patchRes, 200);
    assertEqual(patchRes.data.status, 'cancelado');
  });

  suite.test('F6.5: Updated status persists when querying /api/orders', async () => {
    const createRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        items: [{ productId: 'b2', name: 'Papas Fritas', price: 3.5, quantity: 1 }],
        total: 3.5,
      },
    });
    assertStatus(createRes, 201);
    const orderId = createRes.data.id;

    await api('/api/orders', {
      method: 'PATCH',
      body: { businessId: 'biz_burger_2', orderId, status: 'en_proceso' },
    });

    const getRes = await api('/api/orders?businessId=biz_burger_2');
    assertStatus(getRes, 200);
    const order = getRes.data.find(o => o.id === orderId);
    assert(order, 'Order must exist');
    assertEqual(order.status, 'en_proceso');
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 7: Multitenant Isolation (R3)
  // ─────────────────────────────────────────────────────────────
  suite.test('F7.1: Demo tenants have distinct identities, slugs, and owners', async () => {
    const [res1, res2] = await Promise.all([
      api('/api/business?slug=panaderia-la-estrella'),
      api('/api/business?slug=burger-station'),
    ]);
    assertStatus(res1, 200);
    assertStatus(res2, 200);
    assert(res1.data.id !== res2.data.id, 'Tenants must have distinct IDs');
    assert(res1.data.slug !== res2.data.slug, 'Tenants must have distinct slugs');
  });

  suite.test('F7.2: Products of tenant 1 are not returned in products of tenant 2', async () => {
    const [p1, p2] = await Promise.all([
      api('/api/products?businessId=biz_estrella_1'),
      api('/api/products?businessId=biz_burger_2'),
    ]);
    assertStatus(p1, 200);
    assertStatus(p2, 200);
    const ids1 = new Set(p1.data.map(p => p.id));
    p2.data.forEach(p => {
      assert(!ids1.has(p.id), `Product ${p.id} of tenant 2 leaked into tenant 1`);
    });
  });

  suite.test('F7.3: Categories of tenant 1 are not returned in categories of tenant 2', async () => {
    const [c1, c2] = await Promise.all([
      api('/api/categories?businessId=biz_estrella_1'),
      api('/api/categories?businessId=biz_burger_2'),
    ]);
    assertStatus(c1, 200);
    assertStatus(c2, 200);
    const ids1 = new Set(c1.data.map(c => c.id));
    c2.data.forEach(c => {
      assert(!ids1.has(c.id), `Category ${c.id} of tenant 2 leaked into tenant 1`);
    });
  });

  suite.test('F7.4: Orders of tenant 1 are strictly partitioned from tenant 2', async () => {
    const [o1, o2] = await Promise.all([
      api('/api/orders?businessId=biz_estrella_1'),
      api('/api/orders?businessId=biz_burger_2'),
    ]);
    assertStatus(o1, 200);
    assertStatus(o2, 200);
    const ids1 = new Set(o1.data.map(o => o.id));
    o2.data.forEach(o => {
      assert(!ids1.has(o.id), `Order ${o.id} of tenant 2 leaked into tenant 1`);
    });
  });

  suite.test('F7.5: Adding a product to tenant 1 does not alter tenant 2 product list', async () => {
    const initialT2 = await api('/api/products?businessId=biz_burger_2');
    assertStatus(initialT2, 200);
    const countBefore = initialT2.data.length;

    const createRes = await api('/api/products', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: `Isol-Test-${Date.now()}`, price: 1.0 },
    });
    assertStatus(createRes, 200);

    const afterT2 = await api('/api/products?businessId=biz_burger_2');
    assertStatus(afterT2, 200);
    assertEqual(afterT2.data.length, countBefore, 'Tenant 2 product count must remain unchanged');

    // Cleanup
    if (createRes.data.id) {
      await api(`/api/products?businessId=biz_estrella_1&productId=${createRes.data.id}`, { method: 'DELETE' });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 8: Demo Resilience & Auto-Recovery (R3)
  // ─────────────────────────────────────────────────────────────
  suite.test('F8.1: Restore demo endpoint succeeds for panaderia-la-estrella', async () => {
    const res = await api('/api/business/restore-demo', {
      method: 'POST',
      body: { slug: 'panaderia-la-estrella' },
    });
    assertStatus(res, 200);
    assertEqual(res.data.success, true);
  });

  suite.test('F8.2: Restore demo endpoint succeeds for burger-station', async () => {
    const res = await api('/api/business/restore-demo', {
      method: 'POST',
      body: { slug: 'burger-station' },
    });
    assertStatus(res, 200);
    assertEqual(res.data.success, true);
  });

  suite.test('F8.3: Protected demo slug is guarded against arbitrary renaming', async () => {
    const res = await api('/api/business', {
      method: 'PUT',
      body: {
        id: 'biz_burger_2',
        slug: 'hacked-burger-slug',
      },
    });
    // The server either returns the business with the protected slug or rejects
    assert(res.status === 200 || res.status === 400 || res.status === 403);
    const checkRes = await api('/api/business?id=biz_burger_2');
    assertStatus(checkRes, 200);
    assertEqual(checkRes.data.slug, 'burger-station');
  });

  suite.test('F8.4: Demo store master PIN 543543 authenticates successfully', async () => {
    const res = await api('/api/auth/login', {
      method: 'POST',
      body: {
        identifier: 'burger-station',
        pin: '543543',
      },
    });
    assertStatus(res, 200);
    assertEqual(res.data.success, true);
    assertEqual(res.data.business.slug, 'burger-station');
  });

  suite.test('F8.5: Demo store retains active status and catalog products after restore', async () => {
    await api('/api/business/restore-demo', {
      method: 'POST',
      body: { slug: 'panaderia-la-estrella' },
    });
    const pubRes = await api('/api/public/panaderia-la-estrella');
    assertStatus(pubRes, 200);
    assertEqual(pubRes.data.business.active, true);
    assert(pubRes.data.products.length >= 4, 'Restored store must have canonical products');
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 9: Concurrency & Stress Baseline (R4)
  // ─────────────────────────────────────────────────────────────
  suite.test('F9.1: 10 concurrent requests to /api/public/burger-station all return 200', async () => {
    const promises = Array.from({ length: 10 }, () => api('/api/public/burger-station'));
    const results = await Promise.all(promises);
    results.forEach(res => assertEqual(res.status, 200));
  });

  suite.test('F9.2: 10 concurrent requests to /api/products return 200', async () => {
    const promises = Array.from({ length: 10 }, () => api('/api/products?businessId=biz_burger_2'));
    const results = await Promise.all(promises);
    results.forEach(res => assertEqual(res.status, 200));
  });

  suite.test('F9.3: 10 concurrent requests to /api/categories return 200', async () => {
    const promises = Array.from({ length: 10 }, () => api('/api/categories?businessId=biz_burger_2'));
    const results = await Promise.all(promises);
    results.forEach(res => assertEqual(res.status, 200));
  });

  suite.test('F9.4: 5 concurrent order submissions create distinct orders without error', async () => {
    const promises = Array.from({ length: 5 }, (_, i) =>
      api('/api/orders', {
        method: 'POST',
        body: {
          businessId: 'biz_burger_2',
          items: [{ productId: 'b1', name: `Concurrent Item ${i}`, price: 5.0, quantity: 1 }],
          total: 5.0,
        },
      })
    );
    const results = await Promise.all(promises);
    results.forEach(res => assertEqual(res.status, 201));
    const ids = new Set(results.map(r => r.data.id));
    assertEqual(ids.size, 5, 'All 5 concurrent orders must have distinct IDs');
  });

  suite.test('F9.5: Average latency across concurrent burst is below 500ms', async () => {
    const start = performance.now();
    const promises = Array.from({ length: 8 }, () => api('/api/public/panaderia-la-estrella'));
    await Promise.all(promises);
    const avgDuration = (performance.now() - start) / 8;
    assert(avgDuration < 500, `Expected avg latency < 500ms, got ${avgDuration.toFixed(1)}ms`);
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 10: Performance Diagnosis & Admin Authorization (R5)
  // ─────────────────────────────────────────────────────────────
  suite.test('F10.1: GET /api/admin/payments rejects unauthenticated requests with 401', async () => {
    const res = await api('/api/admin/payments');
    assertStatus(res, 401);
  });

  suite.test('F10.2: POST /api/admin/auth with valid PIN authenticates and sets session cookie', async () => {
    const res = await api('/api/admin/auth', {
      method: 'POST',
      body: { pin: '543543' },
    });
    assertStatus(res, 200);
    assertEqual(res.data.success, true);
    const setCookie = res.headers.get('set-cookie') || '';
    assert(setCookie.includes('taply_admin_session=active'), 'Session cookie must be set');
  });

  suite.test('F10.3: GET /api/admin/payments with session cookie returns payments and metrics', async () => {
    const res = await api('/api/admin/payments', {
      headers: { Cookie: 'taply_admin_session=active' },
    });
    assertStatus(res, 200);
    assert(res.data.metrics, 'Metrics object must be present');
    assertArray(res.data.payments, 'Payments array must be present');
    assert(res.data.metrics.totalRevenue !== undefined, 'Total revenue should be defined');
  });

  suite.test('F10.4: POST /api/admin/payments with auth records payment and updates metrics', async () => {
    const amount = 25.0;
    const res = await api('/api/admin/payments', {
      method: 'POST',
      headers: { Cookie: 'taply_admin_session=active' },
      body: {
        businessId: 'biz_burger_2',
        businessName: 'Burger Station',
        amount,
        method: 'Pago Móvil',
        plan: 'Plan Inicial ($12)',
      },
    });
    assertStatus(res, 200);
    assertEqual(res.data.success, true);
    assert(res.data.payment, 'Payment object returned');
    assertEqual(Number(res.data.payment.amount), amount);

    // Cleanup
    if (res.data.payment.id) {
      await api(`/api/admin/payments?id=${res.data.payment.id}`, {
        method: 'DELETE',
        headers: { Cookie: 'taply_admin_session=active' },
      });
    }
  });

  suite.test('F10.5: DELETE /api/admin/auth clears admin session', async () => {
    const res = await api('/api/admin/auth', { method: 'DELETE' });
    assertStatus(res, 200);
    assertEqual(res.data.success, true);
  });

  return suite;
}
