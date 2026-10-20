// tests/tier4_scenarios.mjs
// Tier 4: Real-World Application Scenarios (5 Comprehensive Workload Scenarios)
// Grounded directly in TEST_INFRA.md and ORIGINAL_REQUEST.md.

import {
  TestSuite,
  api,
  assert,
  assertEqual,
  assertStatus,
  assertArray,
  assertIncludes,
} from './config.mjs';

export function createTier4Suite() {
  const suite = new TestSuite('Tier 4: Real-World Application Scenarios (5 Scenarios)');

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 1: Full Buyer Journey (F1, F4, F5, F6)
  // Catalog viewed -> Cart built -> Order posted -> WhatsApp URL verified -> Dashboard sync
  // ─────────────────────────────────────────────────────────────
  suite.test('Scenario 1: Full Buyer Journey (Public Storefront to Owner Dashboard Fulfillment)', async () => {
    // 1. Buyer lands on public storefront
    const pubRes = await api('/api/public/panaderia-la-estrella');
    assertStatus(pubRes, 200);
    const store = pubRes.data.business;
    assert(store, 'Storefront business must load');
    assertEqual(store.slug, 'panaderia-la-estrella');
    assert(pubRes.data.products.length >= 2, 'Storefront must have products available');

    // 2. Buyer selects 2 items
    const prod1 = pubRes.data.products[0];
    const prod2 = pubRes.data.products[1];
    const qty1 = 2;
    const qty2 = 1;
    const itemTotal1 = prod1.price * qty1;
    const itemTotal2 = prod2.price * qty2;
    const grandTotal = Number((itemTotal1 + itemTotal2).toFixed(2));

    const cartItems = [
      { productId: prod1.id, name: prod1.name, price: prod1.price, quantity: qty1 },
      { productId: prod2.id, name: prod2.name, price: prod2.price, quantity: qty2 },
    ];

    // 3. Buyer provides delivery details and notes
    const customerNote = 'Por favor incluir cubiertos y servilletas';
    const deliveryAddress = 'Av. Francisco de Miranda, Edif. Centro, Piso 4';
    const customerPhone = '0414-998-7654';

    // 4. Construct normalized WhatsApp message and URL
    let cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '58' + cleanPhone.slice(1);
    }
    assertEqual(cleanPhone, '584149987654');

    let waMessage = `🛒 *Nuevo Pedido para ${store.name}*\n\n`;
    cartItems.forEach(it => {
      waMessage += `• ${it.quantity}x ${it.name} — $${(it.quantity * it.price).toFixed(2)}\n`;
    });
    waMessage += `\n📍 *Entrega:* Delivery (${deliveryAddress})\n`;
    waMessage += `📝 *Nota:* ${customerNote}\n`;
    waMessage += `\n*Total a Pagar:* $${grandTotal.toFixed(2)} USD`;

    const encodedMsg = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
    assert(waUrl.startsWith('https://wa.me/584149987654?text='), 'WhatsApp URL correctly generated');
    assertIncludes(decodeURIComponent(encodedMsg), store.name);
    assertIncludes(decodeURIComponent(encodedMsg), grandTotal.toFixed(2));

    // 5. Submit order to /api/orders
    const orderRes = await api('/api/orders', {
      method: 'POST',
      body: {
        businessId: store.id,
        items: cartItems,
        total: grandTotal,
        customerNote,
        whatsappMessage: waMessage,
      },
    });
    assertStatus(orderRes, 201);
    const order = orderRes.data;
    assert(order.id, 'Order ID must be generated');
    assertEqual(order.businessId, store.id);
    assertEqual(Number(order.total), grandTotal);
    assertEqual(order.status, 'nuevo');

    // 6. Store Owner checks Owner Dashboard (/dashboard)
    const dashboardOrders = await api(`/api/orders?businessId=${store.id}`);
    assertStatus(dashboardOrders, 200);
    const orderInDashboard = dashboardOrders.data.find(o => o.id === order.id);
    assert(orderInDashboard, 'Order must appear in Owner Dashboard orders list');
    assertEqual(Number(orderInDashboard.total), grandTotal);
    assertEqual(orderInDashboard.items.length, 2);

    // 7. Owner moves order to en_proceso
    const processRes = await api('/api/orders', {
      method: 'PATCH',
      body: { businessId: store.id, orderId: order.id, status: 'en_proceso' },
    });
    assertStatus(processRes, 200);
    assertEqual(processRes.data.status, 'en_proceso');

    // 8. Owner completes order
    const completeRes = await api('/api/orders', {
      method: 'PATCH',
      body: { businessId: store.id, orderId: order.id, status: 'completado' },
    });
    assertStatus(completeRes, 200);
    assertEqual(completeRes.data.status, 'completado');

    // 9. Verify final status in dashboard query
    const finalDashboard = await api(`/api/orders?businessId=${store.id}`);
    const completedOrder = finalDashboard.data.find(o => o.id === order.id);
    assert(completedOrder, 'Order must persist after completion');
    assertEqual(completedOrder.status, 'completado');
  });

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 2: Category & Product Lifecycle (F1, F2, F3)
  // Owner creates category -> Adds product -> Both appear in storefront -> Product updated
  // ─────────────────────────────────────────────────────────────
  suite.test('Scenario 2: Category & Product Lifecycle (Create, Selector Binding, Storefront Sync & Live Update)', async () => {
    const businessId = 'biz_burger_2';
    const slug = 'burger-station';
    const timestamp = Date.now();
    const newCategoryName = `Gourmet Shakes ${timestamp}`;

    // 1. Owner creates new category
    const catRes = await api('/api/categories', {
      method: 'POST',
      body: { businessId, name: newCategoryName },
    });
    assertStatus(catRes, 201);
    const categoryId = catRes.data.id;
    assertEqual(catRes.data.name, newCategoryName);

    // 2. Category selector in dashboard loads active categories including new one
    const selectorRes = await api(`/api/categories?businessId=${businessId}`);
    assertStatus(selectorRes, 200);
    const categoryOption = selectorRes.data.find(c => c.name === newCategoryName);
    assert(categoryOption, 'Category selector must include newly created category');

    // 3. Owner creates product bound to new category
    const initialPrice = 6.5;
    const initialName = `Oreo Shake ${timestamp}`;
    const prodRes = await api('/api/products', {
      method: 'POST',
      body: {
        businessId,
        name: initialName,
        price: initialPrice,
        category: newCategoryName,
        description: 'Batido artesanal con galletas Oreo',
      },
    });
    assertStatus(prodRes, 200);
    const productId = prodRes.data.id;
    assertEqual(prodRes.data.name, initialName);
    assertEqual(prodRes.data.category, newCategoryName);

    // 4. Owner verifies product in dashboard products list
    const ownerProdList = await api(`/api/products?businessId=${businessId}`);
    assertStatus(ownerProdList, 200);
    const ownerProduct = ownerProdList.data.find(p => p.id === productId);
    assert(ownerProduct, 'Product must appear in owner dashboard product list');
    assertEqual(ownerProduct.category, newCategoryName);

    // 5. Customer accesses public storefront: dynamic route immediately shows new category and product
    const pubStore = await api(`/api/public/${slug}`);
    assertStatus(pubStore, 200);
    const catInPub = pubStore.data.categories.some(c => c.name === newCategoryName);
    assert(catInPub, 'Public storefront must immediately display the new category');
    const prodInPub = pubStore.data.products.find(p => p.id === productId);
    assert(prodInPub, 'Public storefront must immediately display the new product');
    assertEqual(Number(prodInPub.price), initialPrice);

    // 6. Owner updates the product (price increase and name change)
    const updatedPrice = 7.5;
    const updatedName = `Oreo Shake Deluxe ${timestamp}`;
    const updateRes = await api('/api/products', {
      method: 'POST',
      body: {
        id: productId,
        businessId,
        name: updatedName,
        price: updatedPrice,
        category: newCategoryName,
        description: 'Batido artesanal con doble galleta Oreo y crema batida',
      },
    });
    assertStatus(updateRes, 200);
    assertEqual(updateRes.data.name, updatedName);
    assertEqual(Number(updateRes.data.price), updatedPrice);

    // 7. Customer views public storefront again: live update is visible immediately
    const pubStoreUpdated = await api(`/api/public/${slug}`);
    assertStatus(pubStoreUpdated, 200);
    const updatedProdInPub = pubStoreUpdated.data.products.find(p => p.id === productId);
    assert(updatedProdInPub, 'Updated product must be found in public storefront');
    assertEqual(updatedProdInPub.name, updatedName);
    assertEqual(Number(updatedProdInPub.price), updatedPrice);

    // 8. Cleanup product and category
    await api(`/api/products?businessId=${businessId}&productId=${productId}`, { method: 'DELETE' });
    await api(`/api/categories?businessId=${businessId}&categoryId=${categoryId}`, { method: 'DELETE' });

    // Verify cleanup
    const cleanPub = await api(`/api/public/${slug}`);
    assertStatus(cleanPub, 200);
    const cleanedProd = cleanPub.data.products.find(p => p.id === productId);
    assert(!cleanedProd, 'Product should be removed after cleanup');
  });

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 3: Demo Resilience under Adversarial Degradation (F7, F8)
  // Demo store accessed -> catalog cleared -> auto-recovery reconstitutes canonical catalog
  // ─────────────────────────────────────────────────────────────
  suite.test('Scenario 3: Demo Store Resilience & Auto-Recovery (Recovery from Adversarial Degradation)', async () => {
    const slug = 'panaderia-la-estrella';
    const businessId = 'biz_estrella_1';

    // 1. Verify healthy baseline
    const baseRes = await api(`/api/public/${slug}`);
    assertStatus(baseRes, 200);
    assertEqual(baseRes.data.business.active, true);
    const initialProductCount = baseRes.data.products.length;
    assert(initialProductCount >= 4, 'Demo store should have initial products');

    // 2. Adversarial action: delete a product from demo store
    const victimProduct = baseRes.data.products[0];
    const delRes = await api(`/api/products?businessId=${businessId}&productId=${victimProduct.id}`, {
      method: 'DELETE',
    });
    assertStatus(delRes, 200);

    // Verify product was deleted
    const degradedRes = await api(`/api/public/${slug}`);
    assertStatus(degradedRes, 200);
    const stillThere = degradedRes.data.products.some(p => p.id === victimProduct.id);
    assert(!stillThere, 'Product was successfully removed in adversarial step');

    // 3. Trigger demo restore / auto-recovery mechanism
    const restoreRes = await api('/api/business/restore-demo', {
      method: 'POST',
      body: { slug },
    });
    assertStatus(restoreRes, 200);
    assertEqual(restoreRes.data.success, true);

    // 4. Verify public catalog is fully reconstituted
    const recoveredRes = await api(`/api/public/${slug}`);
    assertStatus(recoveredRes, 200);
    assertEqual(recoveredRes.data.business.active, true);
    assertEqual(recoveredRes.data.business.slug, slug);
    assert(recoveredRes.data.categories.length >= 3, 'Categories restored to canonical set');
    assert(recoveredRes.data.products.length >= 4, 'Products restored to canonical set');

    // 5. Verify protected credentials: PIN 543543 still authenticates
    const loginRes = await api('/api/auth/login', {
      method: 'POST',
      body: { identifier: slug, pin: '543543' },
    });
    assertStatus(loginRes, 200);
    assertEqual(loginRes.data.success, true);
  });

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 4: High-Concurrency Flash Order Burst (F4, F9)
  // 50 concurrent orders submitted simultaneously -> 0 errors (<1%) -> all persisted
  // ─────────────────────────────────────────────────────────────
  suite.test('Scenario 4: High-Concurrency Flash Order Burst (50 Concurrent Orders at Scale)', async () => {
    const businessId = 'biz_burger_2';
    const burstBatchId = `burst50-${Date.now()}`;
    const CONCURRENCY_COUNT = 50;

    const orderPayloads = Array.from({ length: CONCURRENCY_COUNT }, (_, i) => ({
      businessId,
      items: [
        {
          productId: `flash_item_${i}`,
          name: `Flash Smash Burger #${i}`,
          price: 8.0,
          quantity: 1,
        },
      ],
      total: 8.0,
      customerNote: `${burstBatchId}-order-${i}`,
      whatsappMessage: `🛒 *Nuevo Pedido Flash #${i}*`,
    }));

    const startTime = performance.now();
    const responses = await Promise.all(
      orderPayloads.map(payload =>
        api('/api/orders', {
          method: 'POST',
          body: payload,
        })
      )
    );
    const totalDuration = performance.now() - startTime;
    const avgLatency = Math.round(totalDuration / CONCURRENCY_COUNT);

    // Analyze results
    let successCount = 0;
    let failureCount = 0;
    const returnedOrderIds = [];

    responses.forEach((res, idx) => {
      if (res.status === 201 && res.data && res.data.id) {
        successCount++;
        returnedOrderIds.push(res.data.id);
      } else {
        failureCount++;
        console.error(`Order #${idx} failed: status=${res.status}, body=${res.text}`);
      }
    });

    const errorRate = (failureCount / CONCURRENCY_COUNT) * 100;
    console.log(`       Burst results: ${successCount}/50 succeeded | Error rate: ${errorRate.toFixed(2)}% | Total time: ${Math.round(totalDuration)}ms | Avg latency: ${avgLatency}ms`);

    // Acceptance criteria from ORIGINAL_REQUEST R4:
    // Error rate must remain below 1.0% (0 errors out of 50 = 0.0%)
    assertEqual(failureCount, 0, `Expected 0 failures in 50 concurrent orders, got ${failureCount} (${errorRate}%)`);
    assertEqual(successCount, CONCURRENCY_COUNT);

    // Check unique order IDs
    const uniqueIds = new Set(returnedOrderIds);
    assertEqual(uniqueIds.size, CONCURRENCY_COUNT, 'All 50 orders must receive distinct UUIDs');

    // Verify all 50 orders are persisted in database
    const dbOrders = await api(`/api/orders?businessId=${businessId}`);
    assertStatus(dbOrders, 200);
    const dbNotes = new Set(dbOrders.data.map(o => o.customerNote));

    for (let i = 0; i < CONCURRENCY_COUNT; i++) {
      const expectedNote = `${burstBatchId}-order-${i}`;
      assert(dbNotes.has(expectedNote), `Order ${expectedNote} must be found in database`);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 5: Multitenant Cross-Store Integrity (F7)
  // Simultaneous cross-tenant operations -> strictly partitioned catalogs, products, and orders
  // ─────────────────────────────────────────────────────────────
  suite.test('Scenario 5: Multitenant Cross-Store Integrity (Concurrent Multi-Store Isolation)', async () => {
    const tenantA = { id: 'biz_estrella_1', slug: 'panaderia-la-estrella' };
    const tenantB = { id: 'biz_burger_2', slug: 'burger-station' };
    const runTag = Date.now();

    // 1. Concurrently add categories to both tenants
    const catNameA = `Cat-Estrella-${runTag}`;
    const catNameB = `Cat-Burger-${runTag}`;
    const [catA, catB] = await Promise.all([
      api('/api/categories', { method: 'POST', body: { businessId: tenantA.id, name: catNameA } }),
      api('/api/categories', { method: 'POST', body: { businessId: tenantB.id, name: catNameB } }),
    ]);
    assertStatus(catA, 201);
    assertStatus(catB, 201);

    // 2. Concurrently add products to both tenants
    const prodNameA = `Pan-Isol-${runTag}`;
    const prodNameB = `Burger-Isol-${runTag}`;
    const [prodA, prodB] = await Promise.all([
      api('/api/products', {
        method: 'POST',
        body: { businessId: tenantA.id, name: prodNameA, price: 3.0, category: catNameA },
      }),
      api('/api/products', {
        method: 'POST',
        body: { businessId: tenantB.id, name: prodNameB, price: 9.5, category: catNameB },
      }),
    ]);
    assertStatus(prodA, 200);
    assertStatus(prodB, 200);

    // 3. Concurrently submit orders to both tenants
    const [orderA, orderB] = await Promise.all([
      api('/api/orders', {
        method: 'POST',
        body: {
          businessId: tenantA.id,
          items: [{ productId: prodA.data.id, name: prodNameA, price: 3.0, quantity: 2 }],
          total: 6.0,
          customerNote: `Note-TenantA-${runTag}`,
        },
      }),
      api('/api/orders', {
        method: 'POST',
        body: {
          businessId: tenantB.id,
          items: [{ productId: prodB.data.id, name: prodNameB, price: 9.5, quantity: 1 }],
          total: 9.5,
          customerNote: `Note-TenantB-${runTag}`,
        },
      }),
    ]);
    assertStatus(orderA, 201);
    assertStatus(orderB, 201);

    // 4. Verify public catalogs show only their own items
    const [pubA, pubB] = await Promise.all([
      api(`/api/public/${tenantA.slug}`),
      api(`/api/public/${tenantB.slug}`),
    ]);
    assertStatus(pubA, 200);
    assertStatus(pubB, 200);

    assert(pubA.data.products.some(p => p.id === prodA.data.id), 'Tenant A public has prodA');
    assert(!pubA.data.products.some(p => p.id === prodB.data.id), 'Tenant A public does NOT have prodB');
    assert(pubB.data.products.some(p => p.id === prodB.data.id), 'Tenant B public has prodB');
    assert(!pubB.data.products.some(p => p.id === prodA.data.id), 'Tenant B public does NOT have prodA');

    // 5. Verify category lists are strictly partitioned
    const [catsA, catsB] = await Promise.all([
      api(`/api/categories?businessId=${tenantA.id}`),
      api(`/api/categories?businessId=${tenantB.id}`),
    ]);
    assertStatus(catsA, 200);
    assertStatus(catsB, 200);

    assert(catsA.data.some(c => c.name === catNameA), 'Tenant A categories has catA');
    assert(!catsA.data.some(c => c.name === catNameB), 'Tenant A categories does NOT have catB');
    assert(catsB.data.some(c => c.name === catNameB), 'Tenant B categories has catB');
    assert(!catsB.data.some(c => c.name === catNameA), 'Tenant B categories does NOT have catA');

    // 6. Verify orders lists are strictly partitioned
    const [ordersA, ordersB] = await Promise.all([
      api(`/api/orders?businessId=${tenantA.id}`),
      api(`/api/orders?businessId=${tenantB.id}`),
    ]);
    assertStatus(ordersA, 200);
    assertStatus(ordersB, 200);

    assert(ordersA.data.some(o => o.id === orderA.data.id), 'Tenant A orders has orderA');
    assert(!ordersA.data.some(o => o.id === orderB.data.id), 'Tenant A orders does NOT have orderB');
    assert(ordersB.data.some(o => o.id === orderB.data.id), 'Tenant B orders has orderB');
    assert(!ordersB.data.some(o => o.id === orderA.data.id), 'Tenant B orders does NOT have orderA');

    // 7. Cleanup
    await Promise.all([
      api(`/api/products?businessId=${tenantA.id}&productId=${prodA.data.id}`, { method: 'DELETE' }),
      api(`/api/products?businessId=${tenantB.id}&productId=${prodB.data.id}`, { method: 'DELETE' }),
      api(`/api/categories?businessId=${tenantA.id}&categoryId=${catA.data.id}`, { method: 'DELETE' }),
      api(`/api/categories?businessId=${tenantB.id}&categoryId=${catB.data.id}`, { method: 'DELETE' }),
    ]);
  });

  return suite;
}
