'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PerkFluidBand() {
  return (
    <section className="py-16 sm:py-24 bg-[#f6f5f0]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="bg-[#14140f] text-white rounded-[32px] sm:rounded-[44px] p-8 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle Corner Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#beff50]/15 rounded-full blur-[110px] pointer-events-none" />

          <div className="relative z-10 max-w-[680px] mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#beff50] text-[12px] font-bold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Garantía Incondicional de 14 Días</span>
            </div>

            <h2 className="text-[32px] sm:text-[48px] font-black tracking-[-0.03em] leading-[1.08] mb-4 text-white">
              Vamos a poner tu WhatsApp a facturar como una caja registradora
            </h2>

            <p className="text-[16px] sm:text-[18px] text-[#d2d2c8] mb-8 leading-relaxed font-normal">
              Comienza hoy sin tarjeta de crédito. Te ayudamos a cargar tus primeros 30 productos y dejamos tu catálogo activo en menos de 24 horas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#beff50] hover:bg-[#aef038] text-[#14140f] font-black text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(190,255,80,0.35)] transition-all active:scale-95"
              >
                <span>Activar mi negocio en 24 horas</span>
                <ArrowRight className="w-4 h-4 text-[#14140f]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
