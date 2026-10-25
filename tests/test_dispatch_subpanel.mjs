// tests/test_dispatch_subpanel.mjs
// Automated verification of Subpanel de Despacho (/despacho/[businessId]):
// 1. Strict Privacy: Prices, totals, revenues, bank credentials stripped.
// 2. Anti-Collision Mutation: Conditional update prevents 2 riders taking same order (409 Conflict).
// 3. Tab flows: Retiro en Local ("Entregado en Local") & Para Delivery ("Tomar Despacho" -> "Entrega Completada").

import assert from 'node:assert';

const BASE_URL = 'http://127.0.0.1:3000';

async function runTests() {
  console.log('🧪 Starting Subpanel de Despacho & Anti-Collision Automated Tests...\n');

  const bizSlug = 'panaderia-la-estrella';

  // 1. Test GET /api/dispatch/orders - Strict Privacy Test
  console.log('1️⃣ Testing GET /api/dispatch/orders (Strict Privacy verification)...');
  const getRes = await fetch(`${BASE_URL}/api/dispatch/orders?businessId=${bizSlug}`);
  assert.strictEqual(getRes.status, 200, `Expected 200, got ${getRes.status}`);
  const getData = await getRes.json();

  assert(getData.business, 'Response must include business information');
  assert(getData.business.name, 'Response must include business name');
  assert.strictEqual(getData.business.paymentNotes, undefined, 'Must NOT include payment notes / bank credentials');
  assert.strictEqual(getData.business.revenues, undefined, 'Must NOT include revenues');
  assert.strictEqual(getData.business.ownerPin, undefined, 'Must NOT include owner PIN');
  assert.strictEqual(getData.business.ownerEmail, undefined, 'Must NOT include owner email');

  assert(Array.isArray(getData.orders), 'Orders must be an array');
  for (const ord of getData.orders) {
    assert.strictEqual(ord.total, undefined, `Order ${ord.id} must NOT have total price`);
    assert.strictEqual(ord.whatsappMessage, undefined, `Order ${ord.id} must NOT have full whatsappMessage`);
    assert(['pagado', 'en_camino'].includes(ord.status), `Order status must be pagado or en_camino, got ${ord.status}`);
    for (const it of ord.items) {
      assert.strictEqual(it.price, undefined, `Item ${it.name} must NOT contain price`);
      assert(it.quantity > 0, `Item ${it.name} must have quantity`);
    }
  }
  console.log('✅ Strict Privacy Passed: Zero prices, totals, or business secrets in dispatch responses.\n');

  // 2. Test Anti-Collision on Delivery Order
  console.log('2️⃣ Testing Anti-Collision Mutation on Delivery Order...');
  const orderId = `#DSP-${Math.floor(1000 + Math.random() * 9000)}`;

  // Create delivery order
  const createRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-taply-test-auth': 'taply-e2e-internal',
    },
    body: JSON.stringify({
      orderId,
      clientOrderId: orderId,
      businessId: bizSlug,
      items: [{ name: 'Pan de Jamón Navideño', quantity: 2, price: 30.0 }],
      total: 60.0,
      deliveryType: 'delivery',
      customerName: 'Manuel Delivery',
      deliveryAddress: 'Av. Bella Vista con Calle 72, Edif. Torre Mar, Apto 5B',
      customerNote: 'Tlf: 0414-9998877',
      status: 'pendiente',
    }),
  });
  assert(createRes.status === 200 || createRes.status === 201, `Failed to create order: ${createRes.status}`);

  // Confirm payment so order becomes 'pagado'
  const confirmRes = await fetch(`${BASE_URL}/api/orders/confirm-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-taply-test-auth': 'taply-e2e-internal',
    },
    body: JSON.stringify({
      businessId: bizSlug,
      orderId,
    }),
  });
  if (confirmRes.status !== 200) {
    const errText = await confirmRes.text();
    console.error('Confirm payment error body:', errText);
  }
  assert.strictEqual(confirmRes.status, 200, `Failed to confirm payment: ${confirmRes.status}`);

  // Rider A takes the delivery order
  console.log('🛵 Repartidor A (Carlos) intenta tomar la orden...');
  const takeResA = await fetch(`${BASE_URL}/api/dispatch/take-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessId: bizSlug,
      orderId,
      riderName: 'Carlos Repartidor',
    }),
  });
  assert.strictEqual(takeResA.status, 200, `Rider A should take order successfully: ${takeResA.status}`);
  const takeDataA = await takeResA.json();
  assert.strictEqual(takeDataA.success, true);
  assert.strictEqual(takeDataA.order.status, 'en_camino');
  assert.strictEqual(takeDataA.order.assignedTo, 'Carlos Repartidor');
  assert.strictEqual(takeDataA.order.total, undefined, 'Sanitized response must not contain total');
  console.log('✅ Repartidor A tomó la orden correctamente.');

  // Rider B attempts to take the SAME order -> MUST return 409 Conflict
  console.log('🛵 Repartidor B (Pedro) intenta tomar la misma orden (debe rebotar con 409 Conflict)...');
  const takeResB = await fetch(`${BASE_URL}/api/dispatch/take-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessId: bizSlug,
      orderId,
      riderName: 'Pedro Repartidor',
    }),
  });
  if (takeResB.status !== 409) {
    const errBText = await takeResB.text();
    console.error('Take B error body:', errBText);
  }
  assert.strictEqual(takeResB.status, 409, `Expected 409 Conflict for duplicate take, got ${takeResB.status}`);
  const takeDataB = await takeResB.json();
  assert.strictEqual(takeDataB.code, 'ALREADY_TAKEN');
  console.log('✅ Anti-Colisión Exitosa: Repartidor B recibió 409 Conflict y fue prevenido de tomar la misma orden.\n');

  // Rider A completes the delivery
  console.log('🏁 Repartidor A marca "Entrega Completada"...');
  const completeRes = await fetch(`${BASE_URL}/api/dispatch/complete-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessId: bizSlug,
      orderId,
      deliveryType: 'delivery',
    }),
  });
  assert.strictEqual(completeRes.status, 200, `Complete order should return 200, got ${completeRes.status}`);
  const completeData = await completeRes.json();
  assert.strictEqual(completeData.success, true);
  console.log('✅ Entrega de delivery completada con éxito.\n');

  // 3. Test Pickup Order Flow ("Retiro en Local")
  console.log('3️⃣ Testing Pickup Order Flow ("Retiro en Local")...');
  const pickupOrderId = `#PCK-${Math.floor(1000 + Math.random() * 9000)}`;

  const createPickupRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-taply-test-auth': 'taply-e2e-internal',
    },
    body: JSON.stringify({
      orderId: pickupOrderId,
      clientOrderId: pickupOrderId,
      businessId: bizSlug,
      items: [{ name: 'Golfeado Meloso con Queso de Mano', quantity: 3, price: 3.5 }],
      total: 10.5,
      deliveryType: 'pickup',
      customerName: 'Valeria Mostrador',
      status: 'pendiente',
    }),
  });
  assert(createPickupRes.status === 200 || createPickupRes.status === 201);

  // Confirm payment
  await fetch(`${BASE_URL}/api/orders/confirm-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-taply-test-auth': 'taply-e2e-internal',
    },
    body: JSON.stringify({
      businessId: bizSlug,
      orderId: pickupOrderId,
    }),
  });

  // Verify pickup order appears in dispatch orders
  const getPickupRes = await fetch(`${BASE_URL}/api/dispatch/orders?businessId=${bizSlug}`);
  const getPickupData = await getPickupRes.json();
  const foundPickup = getPickupData.orders.find((o) => o.id === pickupOrderId);
  assert(foundPickup, 'Pickup order must appear in dispatch orders');
  assert.strictEqual(foundPickup.deliveryType, 'pickup');
  assert.strictEqual(foundPickup.status, 'pagado');

  // Dispatcher marks "Entregado en Local"
  console.log('🏪 Marcando orden de retiro como "Entregado en Local"...');
  const completePickupRes = await fetch(`${BASE_URL}/api/dispatch/complete-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessId: bizSlug,
      orderId: pickupOrderId,
      deliveryType: 'pickup',
    }),
  });
  assert.strictEqual(completePickupRes.status, 200);

  // Verify completed pickup order is now cleared from active dispatch
  const getAfterRes = await fetch(`${BASE_URL}/api/dispatch/orders?businessId=${bizSlug}`);
  const getAfterData = await getAfterRes.json();
  const clearedPickup = getAfterData.orders.find((o) => o.id === pickupOrderId);
  assert.strictEqual(clearedPickup, undefined, 'Completed pickup order must be removed from dispatch view');
  console.log('✅ Retiro en Local completado y removido de la vista de despacho.\n');

  console.log('🎉 ALL DISPATCH SUBPANEL & ANTI-COLLISION TESTS PASSED 100%!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
