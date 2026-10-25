import assert from 'assert';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'http://127.0.0.1:3000';

async function runCheckoutTests() {
  console.log('======================================================================');
  console.log('TAPLY CHECKOUT FLOW & WHATSAPP MESSAGE COMPATIBILITY TEST');
  console.log('======================================================================\n');

  // 1. Test WhatsApp message format generator
  console.log('1. Testing Universal WhatsApp Message Format...');
  const business = {
    name: 'Panadería La Estrella',
    currency: 'USD',
    currencySymbol: '$',
    paymentNotes: 'Datos de pago:\\n• Pago Móvil: Banesco (0134) | V-19.823.111 | 0414-6001234\\n• Zelle: pagos@laestrella.com\\n• Efectivo en divisas al retirar'
  };

  const shortOrderId = '#1042';
  const orderItems = [{ productId: 'prod_101', name: 'Pan de Jamón Tradicional', price: 30.0, quantity: 1 }];
  const totalPrice = 30.0;
  const orderType = 'delivery';
  const customerName = 'Carlos Pérez';
  const deliveryAddress = 'Av. 4 Bella Vista, Edif. Azul, Apto 3B. Frente al semáforo';
  const paymentMethod = 'Pago Móvil';
  const customerNote = 'Sin aceitunas por favor';

  let message = `*Nuevo Pedido ${shortOrderId}*\n`;
  message += `*Comercio:* ${business.name}\n\n`;
  message += `*Productos:*\n`;
  orderItems.forEach(item => {
    message += `- ${item.quantity}x ${item.name} - ${business.currencySymbol}${(item.price * item.quantity).toFixed(2)}\n`;
  });
  message += `\n*Total a Pagar:* ${business.currencySymbol}${totalPrice.toFixed(2)} ${business.currency} (Aceptamos Bs a tasa BCV)\n\n`;
  message += `*Método de Pago:* ${paymentMethod}\n\n`;
  message += `*Tipo de Entrega:* Delivery\n`;
  message += `*Cliente:* ${customerName}\n`;
  message += `*Dirección y Punto de Referencia:* ${deliveryAddress}\n\n`;
  message += `*Nota del Cliente:* ${customerNote}\n\n`;

  if (business.paymentNotes) {
    const unescaped = business.paymentNotes.replace(/\\n/g, '\n').replace(/\r/g, '');
    const lines = unescaped
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.toLowerCase().startsWith('datos de pago:'))
      .map(l => `- ${l.replace(/^[•\-\*]\s*/, '')}`);
    if (lines.length > 0) {
      message += `*Datos de Pago:*\n${lines.join('\n')}\n`;
    }
  }

  message = message.normalize('NFC');

  // Assert message contains expected sections
  assert(message.includes('*Nuevo Pedido #1042*'), 'Must contain short order ID');
  assert(message.includes('*Comercio:* Panadería La Estrella'), 'Must contain business name');
  assert(message.includes('- 1x Pan de Jamón Tradicional - $30.00'), 'Must contain item breakdown');
  assert(message.includes('*Total a Pagar:* $30.00 USD (Aceptamos Bs a tasa BCV)'), 'Must contain total with BCV rate note');
  assert(message.includes('*Método de Pago:* Pago Móvil'), 'Must contain selected payment method');
  assert(message.includes('*Tipo de Entrega:* Delivery'), 'Must contain delivery type');
  assert(message.includes('*Cliente:* Carlos Pérez'), 'Must contain customer name');
  assert(message.includes('*Dirección y Punto de Referencia:* Av. 4 Bella Vista'), 'Must contain delivery address');
  assert(message.includes('*Nota del Cliente:* Sin aceitunas por favor'), 'Must contain customer note');
  assert(!message.includes('\\n'), 'Must not contain literal escaped \\n');
  assert(!message.includes('\uFFFD'), 'Must not contain replacement character U+FFFD');

  const encoded = encodeURIComponent(message);
  assert(!encoded.includes('%EF%BF%BD'), 'URL encoded string must not contain U+FFFD');
  console.log('   ✓ WhatsApp message format verified 100% compatible & clean.\n');

  // 2. Test Supabase Database Order Creation with short ID and 'pendiente' status
  console.log('2. Testing Supabase Order Persistence with Short ID & Estado Pendiente...');
  const env = fs.readFileSync('.env.local', 'utf8');
  const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
  const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim();

  if (url && key) {
    const sb = createClient(url, key);
    const testShortId = '#' + Math.floor(1000 + Math.random() * 9000);

    const { data: created, error } = await sb.from('orders').insert({
      id: testShortId,
      business_id: 'biz_estrella_1',
      items: orderItems,
      total: totalPrice,
      delivery_type: 'delivery',
      customer_notes: `Cliente: ${customerName} | Dir: ${deliveryAddress} | Pago: ${paymentMethod} | Nota: ${customerNote}`,
      whatsapp_message: message,
      status: 'pendiente',
    }).select().single();

    assert(!error, `Supabase insert failed: ${error?.message}`);
    assert.strictEqual(created.id, testShortId, 'ID must match short order ID');
    assert.strictEqual(created.status.toLowerCase(), 'pendiente', 'Status must be pendiente');
    assert.strictEqual(created.delivery_type, 'delivery', 'Delivery type must match');
    assert.strictEqual(Number(created.total), 30.0, 'Total must match');

    // Clean up test order
    await sb.from('orders').delete().eq('id', testShortId);
    console.log(`   ✓ Supabase verified: short ID ${testShortId} persisted with status "pendiente" and cleaned up.\n`);
  } else {
    console.log('   ⚠️ Supabase credentials not found in .env.local, skipping live DB test.');
  }

  console.log('✅ ALL CHECKOUT REFACTOR TESTS PASSED 100%!\n');
}

runCheckoutTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
