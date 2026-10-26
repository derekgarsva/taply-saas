'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export default function PerkPricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'quarterly'>('quarterly');

  return (
    <section id="planes" className="py-20 bg-[#F8FAF9]">
      <div className="perk-wrap">
        {/* Section Head */}
        <div className="text-center max-w-[620px] mx-auto mb-10">
          <h2 className="text-[#0A3D2C] text-[28px] sm:text-[34px] font-semibold tracking-[-0.01em] mb-2.5">
            Precios transparentes, cero comisiones
          </h2>
          <p className="text-[#5B6B63] text-[16.5px] sm:text-[17px] leading-relaxed">
            Sin letras pequeñas ni porcentajes de tus ventas. Prueba Taply gratis por 14 días sin tarjeta de crédito.
          </p>
        </div>

        {/* Toggle Period */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <button
            type="button"
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-[#0A3D2C] text-white shadow-sm'
                : 'bg-white border border-[#E3E8E5] text-[#5B6B63] hover:text-[#0A3D2C]'
            }`}
          >
            Mensual
          </button>

          <button
            type="button"
            onClick={() => setBillingPeriod('quarterly')}
            className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all flex items-center gap-2 ${
              billingPeriod === 'quarterly'
                ? 'bg-[#0A3D2C] text-white shadow-sm'
                : 'bg-white border border-[#E3E8E5] text-[#5B6B63] hover:text-[#0A3D2C]'
            }`}
          >
            <span>Trimestral</span>
            <span className="bg-[#FF6A3D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Ahorra 21%
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-[820px] mx-auto">
          {/* Card 1: Mensual */}
          <div className="bg-white border border-[#E3E8E5] rounded-[18px] p-8 flex flex-col justify-between hover:shadow-[0_10px_28px_rgba(22,32,28,0.06)] transition-all">
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#5B6B63]">
                Flexibilidad Mensual
              </span>
              <h3 className="text-[22px] font-bold text-[#0A3D2C] mt-1 mb-4">
                Plan Mensual
              </h3>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[44px] font-extrabold text-[#0A3D2C] tracking-tight">
                  19
                </span>
                <span className="text-[15px] font-medium text-[#5B6B63]">
                  USD / mes
                </span>
              </div>

              <ul className="space-y-3.5 text-[14.5px] text-[#5B6B63] pb-8 border-b border-[#E3E8E5]">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D7A53] mt-0.5 shrink-0" />
                  <span>Catálogo visual en 3 toques ilimitado</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D7A53] mt-0.5 shrink-0" />
                  <span>Cálculo automático a tasa BCV del día</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D7A53] mt-0.5 shrink-0" />
                  <span>Panel de dueño con gestos táctiles (Swipe)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D7A53] mt-0.5 shrink-0" />
                  <span>Subpanel de despacho para motorizados y mostrador</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D7A53] mt-0.5 shrink-0" />
                  <span>Carga asistida de tus primeros 30 productos</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D7A53] mt-0.5 shrink-0" />
                  <span>0% comisiones por venta</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/onboarding"
                className="w-full py-3.5 px-4 rounded-[10px] bg-white border border-[#E3E8E5] hover:bg-[#F8FAF9] text-[#0A3D2C] font-semibold text-[15px] transition-colors flex items-center justify-center gap-2"
              >
                <span>Probar 14 días gratis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Trimestral (Highlighted) */}
          <div className="bg-white border-2 border-[#0D7A53] rounded-[18px] p-8 flex flex-col justify-between relative shadow-[0_12px_32px_rgba(13,122,83,0.12)]">
            <div className="absolute top-[-13px] right-6 bg-[#0D7A53] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Más Elegido</span>
            </div>

            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#0D7A53]">
                Mayor Rentabilidad
              </span>
              <h3 className="text-[22px] font-bold text-[#0A3D2C] mt-1 mb-4">
                Plan Trimestral
              </h3>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[44px] font-extrabold text-[#0A3D2C] tracking-tight">
                  15
                </span>
                <span className="text-[15px] font-medium text-[#5B6B63]">
                  USD / mes
                </span>
              </div>
              <span className="text-[12px] text-[#0D7A53] font-semibold block mb-6">
                Facturado 45 USD cada 3 meses (Ahorras 12 USD)
              </span>

              <ul className="space-y-3.5 text-[14.5px] text-[#5B6B63] pb-8 border-b border-[#E3E8E5]">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D7A53] mt-0.5 shrink-0" />
                  <span className="text-[#16201C] font-medium">Todo lo incluido en el Plan Mensual</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D7A53] mt-0.5 shrink-0" />
                  <span>Soporte prioritario 1-a-1 por WhatsApp directo</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D7A53] mt-0.5 shrink-0" />
                  <span>Configuración express de inventario en menos de 24 horas</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D7A53] mt-0.5 shrink-0" />
                  <span>Material promocional QR para mostrador y empaques</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D7A53] mt-0.5 shrink-0" />
                  <span>Garantía incondicional de 14 días sin riesgo</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#0D7A53] mt-0.5 shrink-0" />
                  <span>0% comisiones por venta para siempre</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/onboarding"
                className="perk-cta w-full"
              >
                <span>Activar con 14 días sin costo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
