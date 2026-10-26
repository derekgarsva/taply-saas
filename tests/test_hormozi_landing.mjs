// tests/test_hormozi_landing.mjs
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

function testHormoziLanding() {
  console.log('🧪 Verificando Landing Page Taply (Metodología Hormozi - Mercado Venezuela)...\n');

  const phoneUtilPath = path.resolve('src/lib/utils/phone.ts');
  const pagePath = path.resolve('src/app/page.tsx');
  const bentoPricingPath = path.resolve('src/components/landing/PricingAndBento.tsx');
  const faqFooterPath = path.resolve('src/components/landing/FaqAndFooter.tsx');

  const phoneCode = fs.readFileSync(phoneUtilPath, 'utf8');
  const pageCode = fs.readFileSync(pagePath, 'utf8');
  const bentoPricingCode = fs.readFileSync(bentoPricingPath, 'utf8');
  const faqFooterCode = fs.readFileSync(faqFooterPath, 'utf8');

  // ── 1. Utilidad de Teléfonos ──
  assert(phoneCode.includes('normalizeVenezuelaPhone'), 'Función normalizeVenezuelaPhone debe existir');
  assert(phoneCode.includes('58'), 'Debe anteponer o normalizar con código 58');
  console.log('✅ 1. Utilidad lib/utils/phone.ts verificada.');

  // ── 2. Estilo General Dark Mode de Alto Contraste ──
  assert(pageCode.includes('bg-neutral-950'), 'Fondo base debe ser bg-neutral-950');
  assert(bentoPricingCode.includes('bg-neutral-900'), 'Tarjetas deben usar bg-neutral-900');
  assert(bentoPricingCode.includes('border-neutral-800'), 'Bordes deben usar border-neutral-800');
  assert(pageCode.includes('emerald-600') || pageCode.includes('emerald-500'), 'Acentos en emerald');
  // Sin barras de navegador simuladas
  assert(!pageCode.includes('safari') && !pageCode.includes('chrome-tab'), 'Sin barras simuladas de navegador');
  console.log('✅ 2. Estética Dark Mode de alto contraste verificada.');

  // ── 3. Sección Hero ──
  assert(
    pageCode.includes('Para comercios que venden por Instagram y WhatsApp'),
    'Badge superior del Hero incorrecto'
  );
  assert(
    pageCode.includes('Convierte tu WhatsApp en una caja registradora automática y maneja todo tu negocio desde un solo panel.'),
    'H1 del Hero incorrecto'
  );
  assert(
    pageCode.includes('Tus clientes compran en 3 toques con cálculo a tasa del día y pago verificado.') &&
    pageCode.includes('sin tocar una hoja de Excel.'),
    'Subtítulo del Hero incorrecto'
  );
  assert(
    pageCode.includes('Activar mi negocio en 24 horas'),
    'CTA Principal del Hero incorrecto'
  );
  assert(
    pageCode.includes('Sin tarjeta de crédito • Te montamos tus primeros 30 productos gratis • Cero comisiones por venta'),
    'Micro-copy del Hero incorrecto'
  );
  console.log('✅ 3. Sección Hero (Badge, H1, Subtítulo, CTA, Micro-copy) verificada.');

  // ── 4. Sección El Dolor ──
  assert(
    pageCode.includes('La matemática de las ventas que pierdes cada día'),
    'Título de la sección El Dolor ausente'
  );
  assert(
    pageCode.includes('La regla mortal de los 5 minutos') &&
    pageCode.includes('-80% de probabilidad de cierre') &&
    pageCode.includes('900 al mes'),
    'Tarjeta 1 de El Dolor ausente o incompleta'
  );
  assert(
    pageCode.includes('El caos de la tasa manual') &&
    pageCode.includes('Fuga silenciosa de margen'),
    'Tarjeta 2 de El Dolor ausente o incompleta'
  );
  assert(
    pageCode.includes('Desorden en mostrador y notas de voz') &&
    pageCode.includes('+4 horas diarias en chat'),
    'Tarjeta 3 de El Dolor ausente o incompleta'
  );
  console.log('✅ 4. Sección El Dolor (Matemática de Ventas Perdidas - 3 tarjetas) verificada.');

  // ── 5. Bento Grid (4 Bloques Operativos) ──
  assert(
    bentoPricingCode.includes('340.00') &&
    bentoPricingCode.includes('Bs. 14.280') &&
    bentoPricingCode.includes('120.00') &&
    bentoPricingCode.includes('45.00') &&
    bentoPricingCode.includes('35.00'),
    'Bloque 1 (Pulso de Caja) con montos exactos ausente'
  );
  assert(
    bentoPricingCode.includes('124.50') || bentoPricingCode.includes('activeRate'),
    'Bloque 2 (Switch de Tasa activa) ausente'
  );
  assert(
    bentoPricingCode.includes('#1042') &&
    bentoPricingCode.includes('drag="x"') &&
    bentoPricingCode.includes('Descartar') &&
    bentoPricingCode.includes('Confirmar'),
    'Bloque 3 (Gestión por Gestos / Swipe action) ausente'
  );
  assert(
    bentoPricingCode.includes('Retiro en Local') &&
    bentoPricingCode.includes('Para Delivery') &&
    bentoPricingCode.includes('WhatsApp Cliente'),
    'Bloque 4 (Subpanel Despacho con separación de roles) ausente'
  );
  console.log('✅ 5. Bento Grid (4 Bloques Operativos desacoplados) verificado.');

  // ── 6. Sección de Pricing con Toggle ──
  assert(
    bentoPricingCode.includes('Mensual') &&
    bentoPricingCode.includes('Trimestral') &&
    bentoPricingCode.includes('Ahorra 21%'),
    'Toggle de precios Mensual vs Trimestral ausente'
  );
  assert(
    bentoPricingCode.includes('19') &&
    bentoPricingCode.includes('0% comisiones'),
    'Plan Mensual 19 ausente'
  );
  assert(
    bentoPricingCode.includes('15') &&
    bentoPricingCode.includes('45 cada trimestre') &&
    bentoPricingCode.includes('Plan Negocio Pro'),
    'Plan Negocio Pro 15 (facturado 45) ausente'
  );
  assert(
    bentoPricingCode.includes('Garantía de Riesgo Cero por 14 Días'),
    'Bloque de garantía cero riesgo de 14 días ausente'
  );
  console.log('✅ 6. Sección de Pricing (Toggle, Plan Mensual 19, Plan Trimestral 15, Garantía) verificada.');

  // ── 7. Sección FAQ y Footer de Conversión ──
  assert(
    faqFooterCode.includes('¿Realmente montan mis primeros 30 productos gratis?') &&
    faqFooterCode.includes('¿Cobran comisiones por cada venta que haga en mi catálogo?') &&
    faqFooterCode.includes('¿Cómo se actualizan los montos en bolívares según la tasa del día?') &&
    faqFooterCode.includes('¿Mis clientes tienen que descargar alguna aplicación o crearse una cuenta?') &&
    faqFooterCode.includes('¿Cómo funciona la garantía de 14 días de riesgo cero?'),
    'Accordion de 5 preguntas estratégicas incompleto'
  );
  assert(
    faqFooterCode.includes('Deja de perder clientes por responder tarde en WhatsApp.') &&
    faqFooterCode.includes('Activar mi tienda en 24 horas') &&
    faqFooterCode.includes('Hablar con un asesor') &&
    faqFooterCode.includes('14 días sin riesgo • Cancelas con 1 mensaje • Cero comisiones'),
    'Footer de conversión incompleto'
  );
  console.log('✅ 7. Sección FAQ (5 preguntas) y Footer de Conversión verificado.');

  console.log('\n🎉 ¡TODOS LOS REQUISITOS DE LA LANDING PAGE DE ALTO IMPACTO VERIFICADOS AL 100%!');
}

testHormoziLanding();
