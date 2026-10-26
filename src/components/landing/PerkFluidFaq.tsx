'use client';

import React from 'react';

export default function PerkFluidFaq() {
  const faqs = [
    {
      q: '¿Cómo funciona Taply para mis clientes en WhatsApp?',
      a: 'Tus clientes entran a un enlace ultra ligero que abre en menos de 1 segundo en cualquier celular. Seleccionan sus productos en 1 toque, escogen entre "Retiro en local" o "Delivery", y al deslizar se genera el mensaje oficial formateado directamente en su WhatsApp. No necesitan descargar apps ni registrar contraseñas.',
    },
    {
      q: '¿Cómo se maneja la tasa de cambio del día (BCV)?',
      a: 'Tienes un switch en tu panel de control para actualizar la tasa oficial con 1 solo clic. El catálogo recalcula matemáticamente los precios en Bolívares y Dólares de forma instantánea. No tienes que editar ningún producto manualmente ni recalcular precios con la calculadora en el chat.',
    },
    {
      q: '¿Cómo funcionan los gestos swipe en el panel del dueño?',
      a: 'El panel de pedidos pendientes está diseñado para usarse como una bandeja de correo: deslizas la tarjeta a la derecha (verde) para confirmar el pago, marcar status = "pagado" y descontar automáticamente el stock de los productos en Supabase. Si deslizas a la izquierda (rojo), se cancela la orden sin afectar el inventario.',
    },
    {
      q: '¿Qué información ve el personal de despacho o los motorizados?',
      a: 'El subpanel de despacho es una vista protegida y aislada. No muestra ingresos, precios ni márgenes del negocio. El repartidor solo ve los productos que debe entregar, el punto de referencia, el botón de enlace directo a WhatsApp y el botón de bloqueo para que dos repartidores no tomen el mismo pedido a la vez.',
    },
    {
      q: '¿Qué incluye la garantía y la prueba de 14 días?',
      a: 'Tienes 14 días completos de acceso ilimitado a todas las funciones sin tarjeta de crédito. Además, nuestro equipo te asiste cargando tus primeros 30 productos para que tu catálogo esté listo para vender en menos de 24 horas.',
    },
  ];

  return (
    <section id="preguntas" className="py-20 sm:py-24 bg-[#f5f5eb] border-t border-[#d2d2c8]/60">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#6e6e64] block mb-2">
            Resolución de Dudas
          </span>
          <h2 className="text-[32px] sm:text-[40px] font-black text-[#14140f] tracking-tight mb-2">
            Preguntas Frecuentes
          </h2>
          <p className="text-[16px] text-[#6e6e64]">
            Todo lo que necesitas saber antes de activar tu comercio.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group bg-white border border-[#d2d2c8] rounded-2xl p-5 open:shadow-md transition-all duration-200"
            >
              <summary className="cursor-pointer text-[16px] sm:text-[17px] font-bold text-[#14140f] flex items-center justify-between list-none select-none">
                <span>{f.q}</span>
                <span className="text-[20px] font-extrabold text-[#14140f] ml-4 shrink-0 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[14.5px] text-[#6e6e64] leading-relaxed pt-2 border-t border-[#d2d2c8]/40">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
