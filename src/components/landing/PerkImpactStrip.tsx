'use client';

import React from 'react';

export default function PerkImpactStrip() {
  const stats = [
    {
      figure: '+45,000*',
      label: 'pedidos completados',
      sub: 'Cero cuellos de botella en chat.',
    },
    {
      figure: '0%',
      label: 'comisiones por venta',
      sub: '100% de tu margen protegido en bolívares y dólares.',
    },
    {
      figure: '30 seg',
      label: 'por pedido confirmado',
      sub: 'Frente a 15 minutos de notas de voz interminables.',
    },
  ];

  return (
    <section id="metricas" className="py-16 sm:py-20 bg-[#f5f5eb] border-y border-[#d2d2c8]/60">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-7 rounded-[22px] bg-white border border-[#d2d2c8] shadow-[0_4px_16px_rgba(20,20,15,0.03)] flex flex-col justify-between hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="text-[44px] sm:text-[50px] font-black text-[#14140f] tracking-[-0.03em] leading-none mb-2">
                  {stat.figure}
                </div>
                <div className="text-[17px] font-extrabold text-[#14140f] mb-1">
                  {stat.label}
                </div>
              </div>
              <p className="text-[14px] text-[#6e6e64] mt-3 pt-3 border-t border-[#d2d2c8]/40 leading-relaxed">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
