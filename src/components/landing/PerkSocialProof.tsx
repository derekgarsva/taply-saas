'use client';

import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

export default function PerkSocialProof() {
  const businesses = [
    { name: 'Panadería La Estrella', cat: 'Panadería & Pastelería', loc: 'Caracas, Chacao', items: '45 productos' },
    { name: 'Café Grano Real', cat: 'Café de Especialidad', loc: 'Valencia, El Viñedo', items: '28 productos' },
    { name: 'Dulce Canela Bakery', cat: 'Repostería Artesanal', loc: 'Lechería', items: '34 productos' },
    { name: 'Bodegón Gourmet', cat: 'Vinos & Delicatessen', loc: 'Caracas, Las Mercedes', items: '90 productos' },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#f5f5eb] border-b border-[#d2d2c8]/60">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 text-center">
        <span className="text-[12px] font-bold uppercase tracking-wider text-[#6e6e64] block mb-2">
          Confianza Comprobada
        </span>
        <h2 className="text-[28px] sm:text-[36px] font-black text-[#14140f] tracking-tight mb-10">
          Comercios que facturan todos los días con Taply
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {businesses.map((b, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-[#d2d2c8] text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                ))}
              </div>
              <h3 className="text-[16px] font-bold text-[#14140f] mb-0.5">
                {b.name}
              </h3>
              <p className="text-[12.5px] text-[#6e6e64] mb-2">{b.cat}</p>
              <div className="pt-2 border-t border-[#d2d2c8]/40 flex items-center justify-between text-[11px] font-semibold text-[#6e6e64]">
                <span>{b.loc}</span>
                <span className="text-[#14140f]">{b.items}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
