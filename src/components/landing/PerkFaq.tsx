'use client';

import React from 'react';

export default function PerkFaq() {
  const faqs = [
    {
      q: '¿Qué es Taply y cómo ayuda a mi negocio?',
      a: 'Taply es un sistema de pedidos y catálogo en 3 toques diseñado para comercios que venden por WhatsApp e Instagram en Venezuela. Tus clientes seleccionan sus productos, el sistema calcula el total en USD y Bolívares a la tasa del día, y genera una orden formateada y lista para pagar enviada directo a tu WhatsApp y a tu panel de control.',
    },
    {
      q: '¿Mis clientes tienen que descargar alguna app o registrarse?',
      a: 'No. El catálogo de Taply funciona como una web ultra ligera que carga en menos de 1 segundo en cualquier teléfono inteligente. El cliente no necesita crear contraseñas ni descargar archivos. Su nombre y dirección se recuerdan automáticamente en su navegador para que sus próximas compras sean en 1 solo toque.',
    },
    {
      q: '¿Cómo funciona la tasa del día (BCV)?',
      a: 'Tú defines tu tasa activa desde tu panel de dueño en 1 solo clic. Al cambiar la tasa, todos los precios en Bolívares de tu catálogo se actualizan al instante de forma matemática exacta, eliminando errores de cálculo manuales o disputas de cotización en el chat.',
    },
    {
      q: '¿Qué pasa cuando confirmo un pedido con el gesto de swipe?',
      a: 'Al hacer swipe a la derecha en la tarjeta de un pedido recibido, se ejecuta una función atómica en Supabase que cambia el estado a "pagado" y descuenta el stock de los productos vendidos automáticamente. Si haces swipe a la izquierda, la orden se cancela sin tocar tu inventario.',
    },
    {
      q: '¿Cómo funciona el subpanel de despacho para mis motorizados y mostrador?',
      a: 'Es una vista protegida y aislada para tu equipo de cocina, empaque o repartidores. No muestra precios, margen de ganancia ni configuraciones del negocio. Los repartidores ven las órdenes confirmadas, el punto de referencia y un enlace directo a WhatsApp. Cuenta con un candado que bloquea pedidos tomados para evitar que dos repartidores lleven la misma entrega.',
    },
    {
      q: '¿Cómo funciona la prueba gratuita de 14 días?',
      a: 'Puedes probar Taply durante 14 días completos sin costo y sin ingresar tarjeta de crédito. Además, nuestro equipo te asiste cargando tus primeros 30 productos con sus fotos y precios para que tu tienda quede operativa en menos de 24 horas.',
    },
  ];

  return (
    <section id="preguntas" className="py-16 sm:py-20 bg-[#F8FAF9]">
      <div className="perk-wrap">
        <div className="text-center max-w-[620px] mx-auto mb-10">
          <h2 className="text-[#0A3D2C] text-[28px] sm:text-[34px] font-semibold tracking-[-0.01em] mb-2.5">
            Preguntas Frecuentes
          </h2>
          <p className="text-[#5B6B63] text-[16.5px] sm:text-[17px] leading-relaxed">
            Todo lo que necesitas saber sobre cómo funciona Taply para tu comercio.
          </p>
        </div>

        {/* Perk details FAQ container */}
        <div className="max-w-[760px] mx-auto">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white border border-[#E3E8E5] rounded-[12px] mb-3.5 px-6 py-1 transition-all duration-150 open:shadow-[0_8px_24px_rgba(22,32,28,0.06)]"
            >
              <summary className="cursor-pointer text-[#0A3D2C] text-[16.5px] font-medium py-4 flex items-center justify-between list-none focus:outline-none select-none">
                <span>{faq.q}</span>
                <span className="text-[#0D7A53] text-[22px] font-semibold leading-none ml-4 shrink-0 transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="text-[#5B6B63] text-[15px] sm:text-[15.5px] pb-5 leading-relaxed font-normal">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
