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

  // 2. Hero Subtitle Check
  assert(
    html.includes('Tus clientes compran en 3 toques') && html.includes('tasa del día'),
    'Hero subtitle addressing 3 touches & daily rate missing'
  );
  console.log('✅ 2. Hero subtitle verified.');

  // 3. CTA & Microcopy Check
  assert(
    html.includes('Activar mi negocio en 24 horas'),
    'CTA "Activar mi negocio en 24 horas" missing'
  );
  assert(
    html.includes('Sin tarjeta de crédito • Te montamos tus primeros 30 productos gratis • Cero comisiones por venta'),
    'Microcopy missing'
  );
  console.log('✅ 3. CTA and Microcopy verified exact match.');

  // 4. Bento Grid Section Check
  assert(
    html.includes('Recaudado hoy') && html.includes('340.00'),
    'Bento Grid: Recaudado hoy 340.00 missing'
  );
  assert(
    html.includes('Pago Móvil') && html.includes('Zelle') && html.includes('Binance') && html.includes('Efectivo'),
    'Bento Grid: Desglose por método missing'
  );
  assert(
    html.includes('Para Delivery') && html.includes('Retiro en Local'),
    'Bento Grid: Subpanel Despacho missing'
  );
  assert(
    html.includes('1042') && html.includes('Descartar') && html.includes('Confirmar'),
    'Bento Grid: Swipe actions missing'
  );
  console.log('✅ 4. Bento Grid (4 bloques operativos) verified.');

  // 5. Value Stack & Inverted Guarantee Check
  assert(
    html.includes('Garantía de Riesgo Cero por 14 Días'),
    'Inverted guarantee (14 days) missing'
  );
  assert(
    html.includes('30 productos'),
    'Guarantee 30 products free offer missing'
  );
  console.log('✅ 5. Value Stack & Inverted Guarantee (14 Days) verified.');

  // 6. FAQ & Footer Check
  assert(
    html.includes('Deja de perder clientes por responder tarde en WhatsApp.'),
    'Footer conversion H3 missing'
  );
  assert(
    html.includes('Hablar con un asesor'),
    'Footer WhatsApp asesor button missing'
  );
  console.log('✅ 6. FAQ & Conversion Footer verified.');

  console.log('\n🎉 ALL LANDING PAGE REQUIREMENTS VERIFIED 100% SUCCESSFULLY!');
}

verifyLandingPage().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
