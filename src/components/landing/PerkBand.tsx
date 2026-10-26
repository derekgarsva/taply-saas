'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PerkBand() {
  return (
    <section className="pb-16 pt-6 bg-[#F8FAF9]">
      <div className="perk-wrap">
        <div className="bg-[#0A3D2C] text-center rounded-[18px] p-8 sm:p-14 relative overflow-hidden">
          {/* Perk Star Ornaments for .band */}
          <div
            className="perk-star"
            style={{
              width: '140px',
              height: '140px',
              top: '-40px',
              left: '-30px',
              transform: 'rotate(20deg)',
              background: '#0B5C40',
              opacity: 0.5,
            }}
          />
          <div
            className="perk-star"
            style={{
              width: '100px',
              height: '100px',
              bottom: '-30px',
              right: '40px',
              transform: 'rotate(-12deg)',
              background: '#0B5C40',
              opacity: 0.5,
            }}
          />

          <div className="relative z-10 max-w-[580px] mx-auto">
            <h2 className="text-white text-[26px] sm:text-[34px] font-semibold tracking-[-0.01em] mb-3 leading-tight">
              Convierte tus conversaciones de WhatsApp en ventas cerradas
            </h2>
            <p className="text-[#E4F4EC] text-[16px] mb-8 leading-relaxed font-normal">
              Comienza tus 14 días sin costo, te cargamos tus primeros 30 productos gratis y activa tu catálogo hoy mismo.
            </p>

            <Link
              href="/onboarding"
              className="perk-cta-white"
            >
              <span>Activar mi negocio en 24 horas</span>
              <ArrowRight className="w-4 h-4 text-[#0A3D2C]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
