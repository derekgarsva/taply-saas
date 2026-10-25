// tests/test_landing_page_copy.mjs
import assert from 'node:assert';

const BASE_URL = 'http://127.0.0.1:3000';

async function verifyLandingPage() {
  console.log('🧪 Verifying Landing Page Copywriting & Structure...\n');

  const res = await fetch(`${BASE_URL}/`, { cache: 'no-store' });
  assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
  const html = await res.text();

  // 1. Hero H1 Check
  const expectedH1 = 'Convierte tu WhatsApp en una caja registradora automática y maneja todo tu negocio desde un solo panel.';
  assert(html.includes(expectedH1), `H1 missing: "${expectedH1}"`);
  console.log('✅ 1. Hero H1 verified exact match.');

  // 2. Hero Subtitle Cuello de Botella Check
  assert(
    html.includes('Elimina las horas perdidas') && html.includes('3 toques'),
    'Hero subtitle addressing bottleneck missing'
  );
  console.log('✅ 2. Hero subtitle addressing bottleneck verified.');

  // 3. CTA & Microcopy Check
  assert(
    html.includes('Probar 14 días sin costo'),
    'CTA "Probar 14 días sin costo" missing'
  );
  assert(
    html.includes('Te montamos tus primeros 30 productos gratis • Listo en 24h • Cero comisiones'),
    'Microcopy missing'
  );
  console.log('✅ 3. CTA and Microcopy verified exact match.');

  // 4. Bento Grid Section Check
  assert(
    html.includes('Cuadre Diario Automático') || html.includes('Ventas Netas Hoy'),
    'Bento Grid: Cuadre de caja diario missing'
  );
  assert(
    html.includes('Pago Móvil') && html.includes('Zelle') && html.includes('Efectivo'),
    'Bento Grid: Desglose por método missing'
  );
  assert(
    html.includes('Pipeline de Despacho en Vivo') || html.includes('Para Delivery'),
    'Bento Grid: Pipeline de despacho en vivo missing'
  );
  assert(
    html.includes('Control de Stock a 1 Toque') || html.includes('unidades disponibles'),
    'Bento Grid: Control de stock missing'
  );
  console.log('✅ 4. Bento Grid (Caja Diario, Pipeline Despacho, Control Stock) verified.');

  // 5. Value Stack & Inverted Guarantee Check
  assert(
    html.includes('Stack de Valor') || html.includes('Todo lo que recibes'),
    'Value Stack section missing'
  );
  assert(
    html.includes('Garantía Invertida de 14 Días') && html.includes('El riesgo lo asumimos nosotros al 100%'),
    'Inverted guarantee (14 days) missing'
  );
  assert(
    html.includes('30 productos gratis'),
    'Guarantee 30 products free offer missing'
  );
  console.log('✅ 5. Value Stack & Inverted Guarantee (14 Days) verified.');

  console.log('\n🎉 ALL LANDING PAGE REQUIREMENTS VERIFIED 100% SUCCESSFULLY!');
}

verifyLandingPage().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
