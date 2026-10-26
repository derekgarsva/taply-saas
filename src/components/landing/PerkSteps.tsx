'use client';

import React from 'react';

export default function PerkSteps() {
  const steps = [
    {
      num: '1',
      title: 'Tus clientes eligen en 1 toque',
      desc: 'Navegan tu catálogo visual súper rápido en cualquier celular sin crear cuenta ni descargar apps pesadas.',
    },
    {
      num: '2',
      title: 'Tasa del día y método de entrega',
      desc: 'Eligen Retiro en Local o Delivery con cálculo en USD y Bolívares a la tasa oficial del día sin errores de cálculo.',
    },
    {
      num: '3',
      title: 'Deslizan y la orden llega lista',
      desc: 'Al deslizar, el pedido entra a tu panel en tiempo real y el cliente abre WhatsApp con el mensaje pre-escrito perfecto.',
    },
  ];

  return (
    <section id="como-funciona" className="py-16 sm:py-20 bg-[#F8FAF9]">
      <div className="perk-wrap">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4 pb-2">
          {steps.map((step) => (
            <div key={step.num} className="text-left p-2">
              <div className="w-[30px] h-[30px] rounded-full bg-[#0A3D2C] text-white flex items-center justify-center font-medium text-[14px] mb-3">
                {step.num}
              </div>
              <h3 className="text-[#0A3D2C] text-[17px] font-semibold mb-1.5 tracking-tight">
                {step.title}
              </h3>
              <p className="text-[#5B6B63] text-[14.5px] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
