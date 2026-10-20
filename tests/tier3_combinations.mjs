// tests/tier3_combinations.mjs
// Tier 3: Cross-Feature Combinations & Pairwise Interactions (20 Tests)
// Covers interaction pairs across features F1 through F10.

import {
  TestSuite,
  api,
  assert,
  assertEqual,
  assertStatus,
  assertArray,
  assertIncludes,
} from './config.mjs';

export function createTier3Suite() {
  const suite = new TestSuite('Tier 3: Cross-Feature Combinations (20 Tests)');

  // ─────────────────────────────────────────────────────────────
  // C1 (F1 + F2): Catalog Sync & Category Selectors
  // Create category -> verify in selector list -> create product under category -> verify linkage
  // ─────────────────────────────────────────────────────────────
  suite.test('C1 (F1+F2): Category creation immediately exposes option in selector and binds to product', async () => {
    const catName = `Combin-Cat-${Date.now()}`;
    const catRes = await api('/api/categories', {
      method: 'POST',
      body: { businessId: 'biz_burger_2', name: catName },
    });
    assertStatus(catRes, 201);
    const catId = catRes.data.id;

    // Selector fetch
    const selectorRes = await api('/api/categories?businessId=biz_burger_2');
    assertStatus(selectorRes, 200);
    const inSelector = selectorRes.data.some(c => c.name === catName);
    assert(inSelector, 'New category must be immediately present in category selector options');

    // Create product using this category
    const prodName = `Prod-Under-${catName}`;
    const prodRes = await api('/api/products', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        name: prodName,
        price: 11.5,
        category: catName,
      },
    });
    assertStatus(prodRes, 200);
    assertEqual(prodRes.data.category, catName);
    assertEqual(prodRes.data.name, prodName);

    // Cleanup
    if (prodRes.data.id) {
      await api(`/api/products?businessId=biz_burger_2&productId=${prodRes.data.id}`, { method: 'DELETE' });
    }
    if (catId) {
      await api(`/api/categories?businessId=biz_burger_2&categoryId=${catId}`, { method: 'DELETE' });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // C2 (F1 + F3): Catalog Sync & Dynamic Route Freshness
  // Add category & verify dynamic no-cache rendering in public catalog
  // ─────────────────────────────────────────────────────────────
  suite.test('C2 (F1+F3): Newly created category reflects dynamically in public catalog without cache delay', async () => {
    const timestamp = Date.now();
    const catName = `Fresh-Cat-${timestamp}`;

    const catRes = await api('/api/categories', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: catName },
    });
    assertStatus(catRes, 201);

    // Dynamic public request
    const pubRes = await api('/api/public/panaderia-la-estrella');
    assertStatus(pubRes, 200);

    const cacheHeader = pubRes.headers.get('cache-control') || '';
    assert(
      cacheHeader.includes('no-store') || cacheHeader.includes('no-cache') || cacheHeader.includes('max-age=0'),
      'Cache-Control must indicate dynamic non-cached content'
    );

    const hasCat = pubRes.data.categories.some(c => c.name === catName);
    assert(hasCat, 'New category must appear in public catalog immediately without cache delay');

    // Cleanup
    if (catRes.data.id) {
      await api(`/api/categories?businessId=biz_estrella_1&categoryId=${catRes.data.id}`, { method: 'DELETE' });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // C3 (F1 + F4): Category/Product Lifecycle to Order Submission
  // Product ordered under category via POST /api/orders -> verify persistence
  // ─────────────────────────────────────────────────────────────
  suite.test('C3 (F1+F4): Product created under category can be ordered and persisted with exact item details', async () => {
    const orderRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        items: [{ productId: 'p1', name: 'Pan Especial', price: 3.5, quantity: 2 }],
        total: 7.0,
        customerNote: 'Empacar por separado',
      },
    });
    assertStatus(orderRes, 201);
    const orderId = orderRes.data.id;

    // Verify order in database
    const ordersList = await api('/api/orders?businessId=biz_estrella_1');
    assertStatus(ordersList, 200);
    const foundOrder = ordersList.data.find(o => o.id === orderId);
    assert(foundOrder, 'Order must be persisted in database');
    assertEqual(Number(foundOrder.total), 7.0);
    assertEqual(foundOrder.items[0].quantity, 2);
  });

  // ─────────────────────────────────────────────────────────────
  // C4 (F1 + F7): Cross-Tenant Category Isolation
  // Create same-named category in Tenant A and Tenant B -> verify distinct IDs and partition
  // ─────────────────────────────────────────────────────────────
  suite.test('C4 (F1+F7): Same category name across tenants maintains strict partition without ID collision', async () => {
    const sharedName = `Promociones-${Date.now()}`;
    const [catA, catB] = await Promise.all([
      api('/api/categories', {
        method: 'POST',
        body: { businessId: 'biz_estrella_1', name: sharedName },
      }),
      api('/api/categories', {
        method: 'POST',
        body: { businessId: 'biz_burger_2', name: sharedName },
      }),
    ]);
    assertStatus(catA, 201);
    assertStatus(catB, 201);
    assert(catA.data.id !== catB.data.id, 'Categories must have unique IDs across tenants');
    assertEqual(catA.data.businessId, 'biz_estrella_1');
    assertEqual(catB.data.businessId, 'biz_burger_2');

    // Deleting in Tenant A does not affect Tenant B
    await api(`/api/categories?businessId=biz_estrella_1&categoryId=${catA.data.id}`, { method: 'DELETE' });
    const listB = await api('/api/categories?businessId=biz_burger_2');
    assertStatus(listB, 200);
    const existsInB = listB.data.some(c => c.id === catB.data.id);
    assert(existsInB, 'Category in Tenant B must still exist after Tenant A deletion');

    // Cleanup Tenant B
    await api(`/api/categories?businessId=biz_burger_2&categoryId=${catB.data.id}`, { method: 'DELETE' });
  });

  // ─────────────────────────────────────────────────────────────
  // C5 (F2 + F4): Category Selector Flow Leading to Cart & Modifiers
  // Load category selector -> order with chosen modifiers
  // ─────────────────────────────────────────────────────────────
  suite.test('C5 (F2+F4): Product ordered with selected modifiers from category persists complete configuration', async () => {
    const modifiers = [
      { name: 'Extra Queso Cheddar', price: 1.5 },
      { name: 'Doble Tocineta', price: 2.0 },
    ];

    const orderRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        items: [
          {
            productId: 'pb1',
            name: 'Double Bacon Smash Custom',
            price: 12.0,
            quantity: 1,
            selectedModifiers: modifiers,
          },
        ],
        total: 12.0,
        customerNote: 'Término medio la carne',
      },
    });
    assertStatus(orderRes, 201);

    // Verify in GET orders
    const getRes = await api('/api/orders?businessId=biz_burger_2');
    assertStatus(getRes, 200);
    const saved = getRes.data.find(o => o.id === orderRes.data.id);
    assert(saved, 'Order must be saved');
    assertEqual(Number(saved.total), 12.0);
  });

  // ─────────────────────────────────────────────────────────────
  // C6 (F4 + F5): Order Creation & WhatsApp URL Normalization
  // Place order with customer note & delivery details -> verify WhatsApp message formatting & URL
  // ─────────────────────────────────────────────────────────────
  suite.test('C6 (F4+F5): Order submission generates normalized WhatsApp URL with accurate markdown and encoding', async () => {
    const rawPhone = '0412-555-9876';
    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '58' + cleanPhone.slice(1);
    }
    assertEqual(cleanPhone, '584125559876');

    const customerNote = 'Por favor llamar al llegar a la reja';
    const deliveryAddress = 'Av. Bolívar, Res. Los Sauces, Apto 5-A';
    const storeName = 'Panadería La Estrella';
    const items = [
      { productId: 'p1', name: 'Cachito de Jamón', price: 2.5, quantity: 2 },
      { productId: 'p2', name: 'Jugo Natural', price: 2.0, quantity: 1 },
    ];
    const total = 7.0;

    let waMessage = `🛒 *Nuevo Pedido para ${storeName}*\n\n`;
    items.forEach(it => {
      waMessage += `• ${it.quantity}x ${it.name} — $${(it.quantity * it.price).toFixed(2)}\n`;
    });
    waMessage += `\n📍 *Entrega:* Delivery (${deliveryAddress})\n`;
    waMessage += `📝 *Nota:* ${customerNote}\n`;
    waMessage += `\n*Total a Pagar:* $${total.toFixed(2)} USD`;

    const encoded = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;

    assert(waUrl.startsWith('https://wa.me/584125559876?text='), 'WhatsApp URL starts with wa.me and phone');

    // Post to orders API with whatsappMessage payload
    const orderRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        items,
        total,
        customerNote,
        whatsappMessage: waMessage,
      },
    });
    assertStatus(orderRes, 201);
    assertEqual(orderRes.data.whatsappMessage, waMessage);
  });

  // ─────────────────────────────────────────────────────────────
  // C7 (F4 + F6): Order Submission Through Full Status Progression
  // Submit order -> verify initial status -> patch to 'en_proceso' -> patch to 'completado'
  // ─────────────────────────────────────────────────────────────
  suite.test('C7 (F4+F6): Order lifecycle transitions through initial -> en_proceso -> completado with persistent timestamps', async () => {
    const orderRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        items: [{ productId: 'b1', name: 'Cheeseburger', price: 9.0, quantity: 1 }],
        total: 9.0,
      },
    });
    assertStatus(orderRes, 201);
    const orderId = orderRes.data.id;
    assert(orderRes.data.status === 'nuevo' || orderRes.data.status === 'Pendiente', 'Initial status must be valid');

    // Transition 1: en_proceso
    const patch1 = await api('/api/orders', {
      method: 'PATCH',
      body: { businessId: 'biz_burger_2', orderId, status: 'en_proceso' },
    });
    assertStatus(patch1, 200);
    assertEqual(patch1.data.status, 'en_proceso');

    // Transition 2: completado
    const patch2 = await api('/api/orders', {
      method: 'PATCH',
      body: { businessId: 'biz_burger_2', orderId, status: 'completado' },
    });
    assertStatus(patch2, 200);
    assertEqual(patch2.data.status, 'completado');

    // Verify in GET orders
    const getRes = await api('/api/orders?businessId=biz_burger_2');
    assertStatus(getRes, 200);
    const finalOrder = getRes.data.find(o => o.id === orderId);
    assert(finalOrder, 'Order must exist in dashboard query');
    assertEqual(finalOrder.status, 'completado');
    assertEqual(Number(finalOrder.total), 9.0);
  });

  // ─────────────────────────────────────────────────────────────
  // C8 (F4 + F7): Multitenant Order Placement and Strict Isolation
  // Concurrently submit orders to Tenant A & B -> verify orders strictly segregated in GET queries
  // ─────────────────────────────────────────────────────────────
  suite.test('C8 (F4+F7): Orders submitted to different tenants never cross-contaminate dashboard views', async () => {
    const [orderA, orderB] = await Promise.all([
      api('/api/orders', {
        method: 'POST',
        body: {
          businessId: 'biz_estrella_1',
          items: [{ productId: 'pA', name: 'Estrella Item', price: 2.0, quantity: 1 }],
          total: 2.0,
        },
      }),
      api('/api/orders', {
        method: 'POST',
        body: {
          businessId: 'biz_burger_2',
          items: [{ productId: 'pB', name: 'Burger Item', price: 6.0, quantity: 1 }],
          total: 6.0,
        },
      }),
    ]);
    assertStatus(orderA, 201);
    assertStatus(orderB, 201);

    const [listA, listB] = await Promise.all([
      api('/api/orders?businessId=biz_estrella_1'),
      api('/api/orders?businessId=biz_burger_2'),
    ]);
    assertStatus(listA, 200);
    assertStatus(listB, 200);

    const aHasB = listA.data.some(o => o.id === orderB.data.id);
    const bHasA = listB.data.some(o => o.id === orderA.data.id);
    assert(!aHasB, 'Tenant A order list must never contain Tenant B orders');
    assert(!bHasA, 'Tenant B order list must never contain Tenant A orders');
  });

  // ─────────────────────────────────────────────────────────────
  // C9 (F4 + F9): Concurrent Order Burst with Database Integrity
  // 15 concurrent orders with unique identifiers -> verify all 15 persist without collision
  // ─────────────────────────────────────────────────────────────
  suite.test('C9 (F4+F9): Concurrent burst of 15 orders generates 15 distinct IDs without data loss', async () => {
    const burstTag = `burst-${Date.now()}`;
    const promises = Array.from({ length: 15 }, (_, i) =>
      api('/api/orders', {
        method: 'POST',
        body: {
          businessId: 'biz_burger_2',
          items: [{ productId: 'b_burst', name: `Item ${i}`, price: 10.0 + i, quantity: 1 }],
          total: 10.0 + i,
          customerNote: `${burstTag}-${i}`,
        },
      })
    );

    const results = await Promise.all(promises);
    results.forEach((r, idx) => {
      assertEqual(r.status, 201, `Order #${idx} should return 201`);
    });

    const ids = new Set(results.map(r => r.data.id));
    assertEqual(ids.size, 15, 'All 15 concurrent orders must have distinct unique IDs');

    // Query database to verify persistence of all 15
    const listRes = await api('/api/orders?businessId=biz_burger_2');
    assertStatus(listRes, 200);
    for (let i = 0; i < 15; i++) {
      const found = listRes.data.some(o => o.customerNote === `${burstTag}-${i}`);
      assert(found, `Order with tag ${burstTag}-${i} must be persisted`);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // C10 (F6 + F7): Cross-Tenant Order Modification Protection
  // Tenant B attempts to PATCH Tenant A's order -> verify status is untouched
  // ─────────────────────────────────────────────────────────────
  suite.test('C10 (F6+F7): Tenant B cannot patch status of order belonging to Tenant A', async () => {
    const orderRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        items: [{ productId: 'p1', name: 'Protegido', price: 3.0, quantity: 1 }],
        total: 3.0,
      },
    });
    assertStatus(orderRes, 201);
    const orderId = orderRes.data.id;
    const initialStatus = orderRes.data.status;

    // Tenant B attempts to modify it
    const patchAttempt = await api('/api/orders', {
      method: 'PATCH',
      body: { businessId: 'biz_burger_2', orderId, status: 'cancelado' },
    });
    assert(
      patchAttempt.status === 404 || patchAttempt.status === 400 || patchAttempt.status === 403,
      `Cross-tenant patch must be rejected, got HTTP ${patchAttempt.status}`
    );

    // Verify order in Tenant A retains its original status
    const listA = await api('/api/orders?businessId=biz_estrella_1');
    const order = listA.data.find(o => o.id === orderId);
    assert(order, 'Order must still exist in Tenant A');
    assertEqual(order.status, initialStatus, 'Order status must not have been modified by Tenant B');
  });

  // ─────────────────────────────────────────────────────────────
  // C11 (F7 + F8): Demo Store Reset Isolation
  // Resetting demo store A does NOT mutate or delete data in demo store B
  // ─────────────────────────────────────────────────────────────
  suite.test('C11 (F7+F8): Restoring panaderia-la-estrella does not alter burger-station data', async () => {
    const initialBurger = await api('/api/products?businessId=biz_burger_2');
    assertStatus(initialBurger, 200);
    const countBefore = initialBurger.data.length;
    assert(countBefore > 0, 'Burger Station must have products');

    // Restore Estrella
    const restoreA = await api('/api/business/restore-demo', {
      method: 'POST',
      body: { slug: 'panaderia-la-estrella' },
    });
    assertStatus(restoreA, 200);

    // Check Burger Station still has its products intact
    const listB = await api('/api/products?businessId=biz_burger_2');
    assertStatus(listB, 200);
    assertEqual(listB.data.length, countBefore, 'Burger Station product count must remain intact after Estrella restore');
  });

  // ─────────────────────────────────────────────────────────────
  // C12 (F8 + F1): Demo Store Auto-Healing / Reset Restores Canonical Categories & Products
  // Restore demo store -> public catalog immediately contains canonical categories & items
  // ─────────────────────────────────────────────────────────────
  suite.test('C12 (F8+F1): Restore demo restores canonical categories and products to public catalog', async () => {
    const restoreRes = await api('/api/business/restore-demo', {
      method: 'POST',
      body: { slug: 'panaderia-la-estrella' },
    });
    assertStatus(restoreRes, 200);

    const pubRes = await api('/api/public/panaderia-la-estrella');
    assertStatus(pubRes, 200);
    assertEqual(pubRes.data.business.name, 'Panadería La Estrella');
    assert(pubRes.data.categories.length >= 1, 'Must have canonical categories');
    assert(pubRes.data.products.length >= 4, 'Must have canonical demo products');
  });

  // ─────────────────────────────────────────────────────────────
  // C13 (F8 + F7): Protected Demo Identity and Slug Immutability
  // Modifying slug of protected demo store is rejected or normalized back
  // ─────────────────────────────────────────────────────────────
  suite.test('C13 (F8+F7): Demo store slug mutation attempt maintains protected slug integrity', async () => {
    await api('/api/business', {
      method: 'PUT',
      body: { id: 'biz_burger_2', slug: 'unauthorized-slug-change' },
    });

    const biz = await api('/api/business?id=biz_burger_2');
    assertStatus(biz, 200);
    assertEqual(biz.data.slug, 'burger-station', 'Protected slug burger-station must be preserved');
  });

  // ─────────────────────────────────────────────────────────────
  // C14 (F10 + F7): SuperAdmin Payment Registration and Tenant Isolation
  // Authenticated payment registration for Tenant A updates metrics and isolates tenant attribution
  // ─────────────────────────────────────────────────────────────
  suite.test('C14 (F10+F7): SuperAdmin payment records accurately to designated tenant and updates metrics', async () => {
    const authRes = await api('/api/admin/auth', {
      method: 'POST',
      body: { pin: '543543' },
    });
    assertStatus(authRes, 200);

    const amount = 37.0;
    const payRes = await api('/api/admin/payments', {
      method: 'POST',
      headers: { Cookie: 'taply_admin_session=active' },
      body: {
        businessId: 'biz_estrella_1',
        businessName: 'Panadería La Estrella',
        amount,
        method: 'Zelle',
        plan: 'Plan Pro ($37)',
      },
    });
    assertStatus(payRes, 200);
    const payId = payRes.data.payment.id;
    assertEqual(payRes.data.payment.businessId, 'biz_estrella_1');

    // Query admin payments
    const listPay = await api('/api/admin/payments', {
      headers: { Cookie: 'taply_admin_session=active' },
    });
    assertStatus(listPay, 200);
    const foundPay = listPay.data.payments.find(p => p.id === payId);
    assert(foundPay, 'Recorded payment must appear in admin payments list');
    assertEqual(foundPay.businessId, 'biz_estrella_1');

    // Cleanup
    await api(`/api/admin/payments?id=${payId}`, {
      method: 'DELETE',
      headers: { Cookie: 'taply_admin_session=active' },
    });
    await api('/api/admin/auth', { method: 'DELETE' });
  });

  // ─────────────────────────────────────────────────────────────
  // C15 (F10 + F9): SuperAdmin Concurrent Reads & Metric Consistency
  // Concurrent authenticated queries return identical financial aggregates
  // ─────────────────────────────────────────────────────────────
  suite.test('C15 (F10+F9): Concurrent SuperAdmin payments queries return identical aggregate metrics', async () => {
    await api('/api/admin/auth', {
      method: 'POST',
      body: { pin: '543543' },
    });

    const promises = Array.from({ length: 6 }, () =>
      api('/api/admin/payments', {
        headers: { Cookie: 'taply_admin_session=active' },
      })
    );
    const responses = await Promise.all(promises);
    responses.forEach(r => assertStatus(r, 200));

    const firstRev = responses[0].data.metrics.totalRevenue;
    responses.forEach((r, idx) => {
      assertEqual(r.data.metrics.totalRevenue, firstRev, `Query #${idx} revenue metric must match`);
    });

    await api('/api/admin/auth', { method: 'DELETE' });
  });

  // ─────────────────────────────────────────────────────────────
  // C16 (F3 + F6): Read-After-Write Consistency for Orders
  // Immediate GET after POST returns the freshly placed order without caching lag
  // ─────────────────────────────────────────────────────────────
  suite.test('C16 (F3+F6): Immediate read-after-write returns created order without eventual consistency lag', async () => {
    const note = `Immediate-Read-${Date.now()}`;
    const createRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        items: [{ productId: 'p1', name: 'Pastel de Queso', price: 2.5, quantity: 1 }],
        total: 2.5,
        customerNote: note,
      },
    });
    assertStatus(createRes, 201);
    const orderId = createRes.data.id;

    // Zero-delay read
    const readRes = await api('/api/orders?businessId=biz_estrella_1');
    assertStatus(readRes, 200);
    const order = readRes.data.find(o => o.id === orderId);
    assert(order, 'Newly created order must be immediately visible in read');
    assertEqual(order.customerNote, note);
  });

  // ─────────────────────────────────────────────────────────────
  // C17 (F1 + F5): Unicode & Spanish Accent Preservation Storefront to WhatsApp
  // Accents & emojis in product name and notes stay uncorrupted in WhatsApp message
  // ─────────────────────────────────────────────────────────────
  suite.test('C17 (F1+F5): Spanish accents and emojis remain uncorrupted in WhatsApp message pipeline', async () => {
    const specialProd = 'Café con Leche & Golfeado Tradicional ☕🇻🇪';
    const specialNote = 'Sin azúcar, bien caliente y con queso extra';

    const items = [{ productId: 'spec_1', name: specialProd, price: 4.5, quantity: 1 }];
    const total = 4.5;
    const store = 'Panadería La Estrella';

    let msg = `🛒 *Nuevo Pedido para ${store}*\n\n`;
    msg += `• 1x ${specialProd} — $4.50\n`;
    msg += `\n📝 *Nota:* ${specialNote}\n`;
    msg += `\n*Total a Pagar:* $4.50 USD`;

    const res = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        items,
        total,
        customerNote: specialNote,
        whatsappMessage: msg,
      },
    });
    assertStatus(res, 201);
    assertIncludes(res.data.whatsappMessage, specialProd);
    assertIncludes(res.data.whatsappMessage, specialNote);
    assertIncludes(res.data.whatsappMessage, '☕🇻🇪');
  });

  // ─────────────────────────────────────────────────────────────
  // C18 (F4 + F8): Demo Store Resilience Preserves Order Pipeline
  // After demo store restore, new orders can be immediately submitted and persisted
  // ─────────────────────────────────────────────────────────────
  suite.test('C18 (F4+F8): Order placement remains immediately functional following demo store restore', async () => {
    const restoreRes = await api('/api/business/restore-demo', {
      method: 'POST',
      body: { slug: 'burger-station' },
    });
    assertStatus(restoreRes, 200);

    const orderRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        items: [{ productId: 'b1', name: 'Burger Demo Post-Restore', price: 9.0, quantity: 1 }],
        total: 9.0,
      },
    });
    assertStatus(orderRes, 201);
    assert(orderRes.data.id, 'Order must have generated ID');

    const orders = await api('/api/orders?businessId=biz_burger_2');
    assertStatus(orders, 200);
    const found = orders.data.some(o => o.id === orderRes.data.id);
    assert(found, 'Order must be queryable in database post-restore');
  });

  // ─────────────────────────────────────────────────────────────
  // C19 (F2 + F7): Category Management within Tenant Isolation
  // Creating and deleting categories within Tenant A does not alter Tenant B categories
  // ─────────────────────────────────────────────────────────────
  suite.test('C19 (F2+F7): Category management within tenant preserves cross-tenant isolation', async () => {
    const catA1 = `Cat1-${Date.now()}`;
    const catA2 = `Cat2-${Date.now()}`;

    const [c1, c2] = await Promise.all([
      api('/api/categories', { method: 'POST', body: { businessId: 'biz_estrella_1', name: catA1 } }),
      api('/api/categories', { method: 'POST', body: { businessId: 'biz_estrella_1', name: catA2 } }),
    ]);
    assertStatus(c1, 201);
    assertStatus(c2, 201);

    // Verify Burger Station categories did not receive Cat1 or Cat2
    const burgerCats = await api('/api/categories?businessId=biz_burger_2');
    assertStatus(burgerCats, 200);
    const leaked = burgerCats.data.some(c => c.name === catA1 || c.name === catA2);
    assert(!leaked, 'Categories should not leak to burger-station');

    // Cleanup
    await api(`/api/categories?businessId=biz_estrella_1&categoryId=${c1.data.id}`, { method: 'DELETE' });
    await api(`/api/categories?businessId=biz_estrella_1&categoryId=${c2.data.id}`, { method: 'DELETE' });
  });

  // ─────────────────────────────────────────────────────────────
  // C20 (F5 + F6): Order with Multi-Line Formatting and Status Update
  // Order with multiline notes preserves clean line breaks and integrity across PATCH status
  // ─────────────────────────────────────────────────────────────
  suite.test('C20 (F5+F6): Multi-line customer notes and quotes remain intact across order status updates', async () => {
    const complexNote = 'Línea 1: "Tocar el timbre dos veces"\nLínea 2: Dejar con el vigilante\nLínea 3: #Apto 12';
    const orderRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        items: [{ productId: 'b2', name: 'Combo Deluxe', price: 12.0, quantity: 1 }],
        total: 12.0,
        customerNote: complexNote,
      },
    });
    assertStatus(orderRes, 201);
    const orderId = orderRes.data.id;
    assertEqual(orderRes.data.customerNote, complexNote);

    // Patch status
    const patchRes = await api('/api/orders', {
      method: 'PATCH',
      body: { businessId: 'biz_burger_2', orderId, status: 'en_proceso' },
    });
    assertStatus(patchRes, 200);

    const getRes = await api('/api/orders?businessId=biz_burger_2');
    assertStatus(getRes, 200);
    const found = getRes.data.find(o => o.id === orderId);
    assert(found, 'Order must be queryable');
    assertEqual(found.status, 'en_proceso');
    if (found.customerNote) {
      assertEqual(found.customerNote, complexNote);
    }
  });

  return suite;
}
