import assert from 'assert';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'http://127.0.0.1:3000';

async function runPendingOrdersTests() {
  console.log('======================================================================');
  console.log('TAPLY PENDING ORDERS & SWIPE ACTIONS TEST SUITE');
  console.log('======================================================================\n');

  const businessId = 'biz_estrella_1';
  const testOrderId = '#test_swipe_' + Math.floor(1000 + Math.random() * 9000);

  // Read Supabase credentials
  const env = fs.readFileSync('.env.local', 'utf8');
  const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
  const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim();

  let sb = null;
  if (url && key) {
    sb = createClient(url, key);
  }

  // 1. Create a test pending order in database
  console.log('1. Creating test pending order...');
  if (sb) {
    const { data: order, error: insertErr } = await sb.from('orders').insert({
      id: testOrderId,
      business_id: businessId,
      items: [{ productId: 'p_jamon', name: 'Pan de Jamón Navideño', price: 30, quantity: 2 }],
      total: 60,
      status: 'pendiente',
      delivery_type: 'delivery',
      customer_notes: 'Cliente: María Gómez | Dir: Calle 72 | Pago: Pago Móvil',
      whatsapp_message: '*Nuevo Pedido ' + testOrderId + '*',
    }).select().single();

    assert(!insertErr, `Insert failed: ${insertErr?.message}`);
    console.log(`   ✓ Created pending order: ${order.id} with status "${order.status}"\n`);
  }

  // 2. Test POST /api/orders/confirm-payment without auth returns 401
  console.log('2. Testing /api/orders/confirm-payment authentication security...');
  const unauthRes = await fetch(`${BASE_URL}/api/orders/confirm-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ businessId, orderId: testOrderId }),
  });
  console.log(`   Unauthenticated response status: ${unauthRes.status}`);
  assert.strictEqual(unauthRes.status, 401, 'Must require auth');
  console.log('   ✓ Security check passed: 401 Unauthorized returned.\n');

  // 3. Test Authorized Payment Confirmation via internal test auth header
  console.log('3. Testing Payment Confirmation (Swipe Right Equivalent)...');
  const confirmRes = await fetch(`${BASE_URL}/api/orders/confirm-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-taply-test-auth': 'taply-e2e-internal',
    },
    body: JSON.stringify({ businessId, orderId: testOrderId }),
  });

  console.log(`   Confirm payment response status: ${confirmRes.status}`);
  assert.strictEqual(confirmRes.status, 200, 'Confirm payment must succeed');
  const confirmData = await confirmRes.json();
  console.log(`   Response:`, confirmData);
  assert.strictEqual(confirmData.success, true);
  assert.strictEqual(confirmData.status, 'pagado');
  console.log('   ✓ Payment confirmed and status set to "pagado".\n');

  // 4. Verify in Supabase
  if (sb) {
    console.log('4. Verifying order status in Supabase...');
    const { data: verifiedOrder } = await sb.from('orders').select('*').eq('id', testOrderId).single();
    assert(verifiedOrder, 'Order must exist in Supabase');
    assert.strictEqual(verifiedOrder.status.toLowerCase(), 'pagado', 'Supabase status must be pagado');
    console.log(`   ✓ Supabase verified: order ${verifiedOrder.id} status is "${verifiedOrder.status}"\n`);

    // Clean up test order
    await sb.from('orders').delete().eq('id', testOrderId);
    console.log('   ✓ Cleaned up test order.\n');
  }

  console.log('✅ ALL PENDING ORDERS & SWIPE ACTION TESTS PASSED 100%!\n');
}

runPendingOrdersTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
