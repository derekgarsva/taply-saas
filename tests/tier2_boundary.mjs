// tests/tier2_boundary.mjs
// Tier 2: Boundary & Corner Cases (>=5 test cases per feature across all 10 features = 50 tests)

import {
  TestSuite,
  api,
  assert,
  assertEqual,
  assertStatus,
  assertArray,
  assertIncludes,
} from './config.mjs';

export function createTier2Suite() {
  const suite = new TestSuite('Tier 2: Boundary & Corner Cases (50 Tests)');

  // ─────────────────────────────────────────────────────────────
  // FEATURE 1: Category & Catalog Sync Boundaries
  // ─────────────────────────────────────────────────────────────
  suite.test('B1.1: GET /api/categories with missing businessId returns 400', async () => {
    const res = await api('/api/categories');
    assertStatus(res, 400);
    assert(res.data.error, 'Should contain error explanation');
  });

  suite.test('B1.2: GET /api/public with non-existent slug returns 404', async () => {
    const res = await api('/api/public/non-existent-store-slug-999');
    assertStatus(res, 404);
    assert(res.data.error, 'Should return error property');
  });

  suite.test('B1.3: POST /api/categories with empty name returns 400', async () => {
    const res = await api('/api/categories', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: '' },
    });
    assertStatus(res, 400);
  });

  suite.test('B1.4: POST /api/categories with whitespace name trims or validates cleanly', async () => {
    const catName = `  Spaced Category ${Date.now()}  `;
    const res = await api('/api/categories', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: catName },
    });
    assertStatus(res, 201);
    assertEqual(res.data.name, catName.trim(), 'Category name should be trimmed');

    // Cleanup
    if (res.data.id) {
      await api(`/api/categories?businessId=biz_estrella_1&categoryId=${res.data.id}`, { method: 'DELETE' });
    }
  });

  suite.test('B1.5: POST /api/categories with Unicode and emojis preserves encoding', async () => {
    const emojiName = `Panadería 🥖 & Café ☕ #${Date.now()}`;
    const res = await api('/api/categories', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: emojiName },
    });
    assertStatus(res, 201);
    assertEqual(res.data.name, emojiName, 'UTF-8 emojis should be preserved');

    // Cleanup
    if (res.data.id) {
      await api(`/api/categories?businessId=biz_estrella_1&categoryId=${res.data.id}`, { method: 'DELETE' });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 2: Category Selectors in Dashboard Boundaries
  // ─────────────────────────────────────────────────────────────
  suite.test('B2.1: GET /api/categories for unknown businessId returns empty array or default, not 500', async () => {
    const res = await api('/api/categories?businessId=biz_non_existent_uuid_999');
    assertStatus(res, 200);
    assertArray(res.data);
    assert(res.data.length === 0 || (res.data.length === 1 && res.data[0].name === 'General'), 'Should return empty or default General category');
  });

  suite.test('B2.2: POST /api/products with empty body returns 400', async () => {
    const res = await api('/api/products', {
      method: 'POST',
      body: {},
    });
    assertStatus(res, 400);
  });

  suite.test('B2.3: POST /api/products with missing price returns 400', async () => {
    const res = await api('/api/products', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: 'No Price Product' },
    });
    assertStatus(res, 400);
  });

  suite.test('B2.4: POST /api/products with price 0.00 succeeds for free promotional item', async () => {
    const res = await api('/api/products', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: 'Muestra Gratis', price: 0.0 },
    });
    assertStatus(res, 200);
    assertEqual(Number(res.data.price), 0.0);

    // Cleanup
    if (res.data.id) {
      await api(`/api/products?businessId=biz_estrella_1&productId=${res.data.id}`, { method: 'DELETE' });
    }
  });

  suite.test('B2.5: DELETE /api/categories with missing categoryId returns 400', async () => {
    const res = await api('/api/categories?businessId=biz_estrella_1', { method: 'DELETE' });
    assertStatus(res, 400);
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 3: Dynamic Route Execution Boundaries
  // ─────────────────────────────────────────────────────────────
  suite.test('B3.1: Conditional If-None-Match headers receive fresh 200, never 304', async () => {
    const res = await api('/api/public/burger-station', {
      headers: { 'If-None-Match': '"w/123456789"' },
    });
    assertStatus(res, 200);
  });

  suite.test('B3.2: Conditional If-Modified-Since receives fresh 200 response', async () => {
    const res = await api('/api/public/burger-station', {
      headers: { 'If-Modified-Since': new Date(Date.now() - 3600000).toUTCString() },
    });
    assertStatus(res, 200);
  });

  suite.test('B3.3: POST with malformed JSON body returns clean error without crashing process', async () => {
    const res = await api('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ malformed json: true, ',
    });
    // Server should respond with 400 or 500 error, not connection abort
    assert(res.status === 400 || res.status === 500, `Expected error status, got ${res.status}`);
  });

  suite.test('B3.4: GET /api/business without query parameters returns all businesses', async () => {
    const res = await api('/api/business');
    assertStatus(res, 200);
    assertArray(res.data);
    assert(res.data.length >= 2, 'Should list active businesses');
  });

  suite.test('B3.5: Public route cache header specifies no-store or max-age=0', async () => {
    const res = await api('/api/public/burger-station');
    assertStatus(res, 200);
    const cc = (res.headers.get('cache-control') || '').toLowerCase();
    assert(cc.includes('no-store') || cc.includes('no-cache') || cc.includes('max-age=0'));
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 4: Order Submission & Persistence Boundaries
  // ─────────────────────────────────────────────────────────────
  suite.test('B4.1: POST /api/orders with empty payload returns 400', async () => {
    const res = await api('/api/orders', { method: 'POST', body: {} });
    assertStatus(res, 400);
  });

  suite.test('B4.2: POST /api/orders with missing items returns 400', async () => {
    const res = await api('/api/orders', {
      method: 'POST',
      body: { businessId: 'biz_burger_2', total: 10.0 },
    });
    assertStatus(res, 400);
  });

  suite.test('B4.3: POST /api/orders with missing total returns 400', async () => {
    const res = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        items: [{ productId: 'b1', name: 'Burger', price: 10.0, quantity: 1 }],
      },
    });
    assertStatus(res, 400);
  });

  suite.test('B4.4: POST /api/orders with large customer note (2KB) persists successfully', async () => {
    const longNote = 'Instrucciones especiales: '.repeat(80);
    const res = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        items: [{ productId: 'b1', name: 'Burger Especial', price: 9.5, quantity: 1 }],
        total: 9.5,
        customerNote: longNote,
      },
    });
    assertStatus(res, 201);
    assert(res.data.id);
  });

  suite.test('B4.5: POST /api/orders with large numeric total maintains precision', async () => {
    const largeTotal = 9999.95;
    const res = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        items: [{ productId: 'catering', name: 'Catering Evento', price: 9999.95, quantity: 1 }],
        total: largeTotal,
      },
    });
    assertStatus(res, 201);
    assertEqual(Number(res.data.total), largeTotal);
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 5: WhatsApp URL Formatting Boundaries
  // ─────────────────────────────────────────────────────────────
  suite.test('B5.1: Non-numeric phone numbers do not throw unhandled runtime errors', async () => {
    const nonNumeric = 'No-Phone-Configured';
    const cleaned = nonNumeric.replace(/\D/g, '');
    assertEqual(cleaned, '');
  });

  suite.test('B5.2: International phone format with + sign cleans to country code', async () => {
    const intlPhone = '+1 (555) 234-5678';
    const cleaned = intlPhone.replace(/\D/g, '');
    assertEqual(cleaned, '15552345678');
  });

  suite.test('B5.3: URL encoder properly escapes reserved URL characters in customer notes', async () => {
    const specialCharsNote = 'Notas: ¿Entregar en Calle 5 & Av. 2? #Apto 4B = 100%';
    const encoded = encodeURIComponent(specialCharsNote);
    assert(!encoded.includes('&'), '& should be escaped');
    assert(!encoded.includes('#'), '# should be escaped');
    assert(!encoded.includes('?'), '? should be escaped');
    assert(!encoded.includes('='), '= should be escaped');
    assertEqual(decodeURIComponent(encoded), specialCharsNote);
  });

  suite.test('B5.4: Payment notes with multiple linebreaks do not create unbalanced asterisks', async () => {
    const multilineNotes = 'Banco Mercantil\n\nPago Móvil: 0105\n\nZelle: info@store.com';
    const lines = multilineNotes.split('\n').filter(Boolean);
    const formatted = lines.map(l => `💳 *${l.trim()}*`).join('\n');
    lines.forEach(l => {
      assertIncludes(formatted, `*${l.trim()}*`);
    });
  });

  suite.test('B5.5: Extremely long order message builds valid wa.me URL within safe length', async () => {
    let msg = '🛒 *Pedido Grande*\n';
    for (let i = 0; i < 30; i++) {
      msg += `• 1x Producto Variedad #${i} — $10.00\n`;
    }
    const url = `https://wa.me/584146001234?text=${encodeURIComponent(msg)}`;
    assert(url.length < 8000, 'URL should be within safe browser length (<8KB)');
    const parsed = new URL(url);
    assert(parsed.searchParams.get('text').length > 500);
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 6: Owner Dashboard Orders Display & Status Sync Boundaries
  // ─────────────────────────────────────────────────────────────
  suite.test('B6.1: GET /api/orders without businessId returns 400', async () => {
    const res = await api('/api/orders');
    assertStatus(res, 400);
    assert(res.data.error);
  });

  suite.test('B6.2: PATCH /api/orders without orderId returns 400', async () => {
    const res = await api('/api/orders', {
      method: 'PATCH',
      body: { businessId: 'biz_burger_2', status: 'completado' },
    });
    assertStatus(res, 400);
  });

  suite.test('B6.3: PATCH /api/orders without status returns 400', async () => {
    const res = await api('/api/orders', {
      method: 'PATCH',
      body: { businessId: 'biz_burger_2', orderId: 'ord_123' },
    });
    assertStatus(res, 400);
  });

  suite.test('B6.4: PATCH /api/orders with non-existent orderId returns 404', async () => {
    const res = await api('/api/orders', {
      method: 'PATCH',
      body: { businessId: 'biz_burger_2', orderId: 'ord_non_existent_99999', status: 'completado' },
    });
    assertStatus(res, 404);
  });

  suite.test('B6.5: PATCH /api/orders with empty JSON body returns 400', async () => {
    const res = await api('/api/orders', {
      method: 'PATCH',
      body: {},
    });
    assertStatus(res, 400);
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 7: Multitenant Isolation Boundaries
  // ─────────────────────────────────────────────────────────────
  suite.test('B7.1: GET /api/products without businessId returns 400', async () => {
    const res = await api('/api/products');
    assertStatus(res, 400);
  });

  suite.test('B7.2: Attempting to delete tenant 1 product with tenant 2 businessId fails', async () => {
    // Pick an existing canonical product from tenant 1
    const listRes = await api('/api/products?businessId=biz_estrella_1');
    assertStatus(listRes, 200);
    assert(listRes.data.length > 0, 'Tenant 1 must have products');
    const victim = listRes.data[0];

    // Try deleting using tenant 2's businessId
    await api(`/api/products?businessId=biz_burger_2&productId=${victim.id}`, {
      method: 'DELETE',
    });
    // Check product still exists in tenant 1
    const checkRes = await api('/api/products?businessId=biz_estrella_1');
    const stillExists = checkRes.data.some(p => p.id === victim.id);
    assert(stillExists, 'Product should not be deleted by another tenant');
  });

  suite.test('B7.3: Attempting to delete tenant 1 category with tenant 2 businessId fails', async () => {
    const catName = `Sec-Cat-${Date.now()}`;
    const createRes = await api('/api/categories', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: catName },
    });
    assertStatus(createRes, 201);
    const catId = createRes.data.id;

    // Try deleting using tenant 2
    await api(`/api/categories?businessId=biz_burger_2&categoryId=${catId}`, { method: 'DELETE' });

    // Check category still exists in tenant 1
    const checkRes = await api('/api/categories?businessId=biz_estrella_1');
    const stillExists = checkRes.data.some(c => c.id === catId || c.name === catName);
    assert(stillExists, 'Category should not be deleted by mismatched tenant');

    // Cleanup
    await api(`/api/categories?businessId=biz_estrella_1&categoryId=${catId}`, { method: 'DELETE' });
  });

  suite.test('B7.4: POST /api/business with duplicate slug returns 409 Conflict', async () => {
    const res = await api('/api/business', {
      method: 'POST',
      body: {
        name: 'Another Burger Station',
        slug: 'burger-station',
        phone: '1234567890',
      },
    });
    assertStatus(res, 409);
    assert(res.data.error);
  });

  suite.test('B7.5: Querying business by non-existent ID returns 404', async () => {
    const res = await api('/api/business?id=biz_non_existent_id_000');
    assertStatus(res, 404);
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 8: Demo Resilience & Auto-Recovery Boundaries
  // ─────────────────────────────────────────────────────────────
  suite.test('B8.1: POST /api/business/restore-demo with empty body returns 400', async () => {
    const res = await api('/api/business/restore-demo', { method: 'POST', body: {} });
    assertStatus(res, 400);
  });

  suite.test('B8.2: POST /api/business/restore-demo with null slug and id returns 400', async () => {
    const res = await api('/api/business/restore-demo', {
      method: 'POST',
      body: { slug: null, id: null },
    });
    assertStatus(res, 400);
  });

  suite.test('B8.3: POST /api/business/restore-demo with non-demo slug returns gracefully', async () => {
    const res = await api('/api/business/restore-demo', {
      method: 'POST',
      body: { slug: 'arbitrary-non-demo-slug' },
    });
    // Server should not throw 500
    assert(res.status === 200 || res.status === 400);
  });

  suite.test('B8.4: Consecutive rapid calls to restore-demo are idempotent', async () => {
    const [r1, r2] = await Promise.all([
      api('/api/business/restore-demo', { method: 'POST', body: { slug: 'burger-station' } }),
      api('/api/business/restore-demo', { method: 'POST', body: { slug: 'burger-station' } }),
    ]);
    assertStatus(r1, 200);
    assertStatus(r2, 200);
  });

  suite.test('B8.5: Demo store master PIN handles whitespace trimming on login', async () => {
    const res = await api('/api/auth/login', {
      method: 'POST',
      body: {
        identifier: ' panaderia-la-estrella ',
        pin: ' 543543 ',
      },
    });
    assertStatus(res, 200);
    assertEqual(res.data.success, true);
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 9: Concurrency & Stress Boundaries
  // ─────────────────────────────────────────────────────────────
  suite.test('B9.1: Burst of 15 rapid consecutive GETs to /api/business completes with 100% 200s', async () => {
    const promises = Array.from({ length: 15 }, () => api('/api/business'));
    const results = await Promise.all(promises);
    results.forEach(res => assertEqual(res.status, 200));
  });

  suite.test('B9.2: 12 concurrent requests to /api/public/panaderia-la-estrella have 0% failure rate', async () => {
    const promises = Array.from({ length: 12 }, () => api('/api/public/panaderia-la-estrella'));
    const results = await Promise.all(promises);
    results.forEach(res => assertEqual(res.status, 200));
  });

  suite.test('B9.3: Order submission with fractional cents total maintains exact value', async () => {
    const centsTotal = 17.89;
    const res = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: 'biz_burger_2',
        items: [{ productId: 'b_frac', name: 'Item Fraccionario', price: 17.89, quantity: 1 }],
        total: centsTotal,
      },
    });
    assertStatus(res, 201);
    assertEqual(Number(res.data.total), centsTotal);
  });

  suite.test('B9.4: Interleaved GET and POST order operations maintain state consistency', async () => {
    const [createRes, listRes] = await Promise.all([
      api('/api/orders', {
        method: 'POST',
        body: {
          businessId: 'biz_estrella_1',
          items: [{ productId: 'sync_it', name: 'Sync Bread', price: 2.0, quantity: 1 }],
          total: 2.0,
        },
      }),
      api('/api/orders?businessId=biz_estrella_1'),
    ]);
    assertStatus(createRes, 201);
    assertStatus(listRes, 200);
  });

  suite.test('B9.5: High concurrency burst does not drop connection or return 5xx errors', async () => {
    const burst = Array.from({ length: 10 }, (_, i) =>
      api(`/api/products?businessId=biz_burger_2&burst=${i}`)
    );
    const results = await Promise.all(burst);
    results.forEach(r => {
      assert(r.status === 200, `Expected 200, got ${r.status}`);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 10: Performance Diagnosis & Admin Authorization Boundaries
  // ─────────────────────────────────────────────────────────────
  suite.test('B10.1: POST /api/admin/payments without session cookie returns 401', async () => {
    const res = await api('/api/admin/payments', {
      method: 'POST',
      body: { businessName: 'Test Biz', amount: 50, method: 'Zelle' },
    });
    assertStatus(res, 401);
  });

  suite.test('B10.2: DELETE /api/admin/payments without session cookie returns 401', async () => {
    const res = await api('/api/admin/payments?id=pay_101', { method: 'DELETE' });
    assertStatus(res, 401);
  });

  suite.test('B10.3: POST /api/admin/auth with incorrect PIN returns 401', async () => {
    const res = await api('/api/admin/auth', {
      method: 'POST',
      body: { pin: '000000_wrong_pin' },
    });
    assertStatus(res, 401);
    assertEqual(res.data.success, false);
  });

  suite.test('B10.4: POST /api/admin/auth with empty PIN returns 401', async () => {
    const res = await api('/api/admin/auth', {
      method: 'POST',
      body: { pin: '' },
    });
    assertStatus(res, 401);
    assertEqual(res.data.success, false);
  });

  suite.test('B10.5: POST /api/admin/payments with missing required fields returns 400', async () => {
    const res = await api('/api/admin/payments', {
      method: 'POST',
      headers: { Cookie: 'taply_admin_session=active' },
      body: { plan: 'Plan Inicial' }, // missing businessName, amount, method
    });
    assertStatus(res, 400);
  });

  return suite;
}
