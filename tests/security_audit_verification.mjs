// tests/security_audit_verification.mjs
// Verification suite for multi-tenant isolation, price tampering prevention, credential protection, and idempotency.

import { BASE_URL } from './config.mjs';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let pass = 0;
let fail = 0;

async function test(name, fn) {
  process.stdout.write(`  [SECURITY TEST] ${name} ... `);
  const start = performance.now();
  try {
    await fn();
    const ms = Math.round(performance.now() - start);
    console.log(`${colors.green}PASS${colors.reset} (${ms}ms)`);
    pass++;
  } catch (err) {
    const ms = Math.round(performance.now() - start);
    console.log(`${colors.red}FAIL${colors.reset} (${ms}ms): ${err.message}`);
    fail++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function run() {
  console.log(`\n${colors.bold}${colors.cyan}======================================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}TAPLY AUDIT & PRODUCTION READINESS: SECURITY VERIFICATION SUITE${colors.reset}`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`${colors.bold}${colors.cyan}======================================================================${colors.reset}\n`);

  // 1. CREDENTIAL LEAKAGE PREVENTION
  await test('1. GET /api/public/[slug] strips ownerPin and ownerEmail', async () => {
    const res = await fetch(`${BASE_URL}/api/public/panaderia-la-estrella`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert(data.business, 'Business object must be present');
    assert(data.business.ownerPin === undefined, 'ownerPin must NOT be exposed in public API');
    assert(data.business.ownerEmail === undefined, 'ownerEmail must NOT be exposed in public API');
  });

  // 2. UNAUTHORIZED MUTATION GUARDS
  await test('2. POST /api/products without auth returns 401 Unauthorized', async () => {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessId: 'biz_estrella_1',
        name: 'Hacked Product',
        price: 1.0,
      }),
    });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  await test('3. DELETE /api/products without auth returns 401 Unauthorized', async () => {
    const res = await fetch(`${BASE_URL}/api/products?businessId=biz_estrella_1&productId=prod_1`, {
      method: 'DELETE',
    });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  await test('4. POST /api/categories without auth returns 401 Unauthorized', async () => {
    const res = await fetch(`${BASE_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessId: 'biz_estrella_1',
        name: 'Hacked Category',
      }),
    });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  await test('5. GET /api/orders without auth returns 401 Unauthorized', async () => {
    const res = await fetch(`${BASE_URL}/api/orders?businessId=biz_estrella_1`);
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  await test('6. PUT /api/business without auth returns 401 Unauthorized', async () => {
    const res = await fetch(`${BASE_URL}/api/business`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'biz_estrella_1',
        name: 'Hacked Store Name',
      }),
    });
    assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
  });

  // 3. AUTHORIZED ACCESS VIA PIN/HEADER
  await test('7. Authorized mutation with master PIN succeeds', async () => {
    const res = await fetch(`${BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-pin': '543543',
      },
      body: JSON.stringify({
        businessId: 'biz_estrella_1',
        name: 'Categoría Autorizada Test',
      }),
    });
    assert(res.status === 201, `Expected 201 Created, got ${res.status}`);
  });

  // 4. PRICE TAMPERING PREVENTION (Authoritative recalculation)
  await test('8. POST /api/orders ignores manipulated client-side price and enforces DB price', async () => {
    // panaderia-la-estrella has 'pan-jamon' at $30.00
    // An attacker tries to send total: 0.01 and price: 0.01
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessId: 'panaderia-la-estrella',
        items: [
          {
            id: 'pan-jamon',
            name: 'Pan de Jamón Tradicional',
            price: 0.01, // TAMPERED!
            quantity: 2,
          },
        ],
        total: 0.02, // TAMPERED!
      }),
    });

    assert(res.status === 201, `Expected 201, got ${res.status}`);
    const order = await res.json();
    assert(order.id, 'Order must have an ID');
    assert(Number(order.total) === 60.0, `Authoritative total must be $60.00, server recorded: $${order.total}`);
    assert(Number(order.items[0].price) === 30.0, `Item price must be $30.00 from DB, server recorded: $${order.items[0].price}`);
  });

  // 5. IDEMPOTENCY / DOUBLE CLICK PREVENTION
  await test('9. POST /api/orders deduplicates rapid double-click orders (idempotency)', async () => {
    const clientOrderId = `test_double_click_${Date.now()}`;
    const payload = {
      businessId: 'panaderia-la-estrella',
      clientOrderId,
      items: [
        {
          id: 'golfeado',
          name: 'Golfeado con Queso de Mano',
          price: 3.5,
          quantity: 1,
        },
      ],
      total: 3.5,
    };

    const firstRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert(firstRes.status === 201, `First order should return 201, got ${firstRes.status}`);
    const firstOrder = await firstRes.json();

    // Immediate second click
    const secondRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert(secondRes.status === 200, `Deduplicated order should return 200, got ${secondRes.status}`);
    const secondOrder = await secondRes.json();
    assert(secondOrder.id === firstOrder.id, `Must return same order ID without duplication (${secondOrder.id} vs ${firstOrder.id})`);
  });

  console.log(`\n${colors.bold}Results: ${pass} passed, ${fail} failed.${colors.reset}\n`);
  process.exit(fail > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
