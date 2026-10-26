'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export default function PerkFluidPricing() {
  const [period, setPeriod] = useState<'monthly' | 'quarterly'>('quarterly');

  return (
    <section id="planes" className="py-20 sm:py-28 bg-[#f6f5f0]">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-[640px] mx-auto mb-12">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#6e6e64] block mb-2">
            Inversión Transparente
          </span>
          <h2 className="text-[32px] sm:text-[44px] font-black text-[#14140f] tracking-tight mb-3">
            Precios directos, cero comisiones
          </h2>
          <p className="text-[16.5px] text-[#6e6e64] leading-relaxed">
            Sin letras pequeñas ni cobros ocultos por venta. Prueba Taply gratis por 14 días completos sin tarjeta de crédito.
          </p>

          {/* Toggle Period */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              type="button"
              onClick={() => setPeriod('monthly')}
              className={`px-5 py-2.5 rounded-full text-[13.5px] font-bold transition-all ${
                period === 'monthly'
                  ? 'bg-[#14140f] text-[#beff50] shadow-sm'
                  : 'bg-white border border-[#d2d2c8] text-[#6e6e64] hover:text-[#14140f]'
              }`}
            >
              Mensual
            </button>

            <button
              type="button"
              onClick={() => setPeriod('quarterly')}
              className={`px-5 py-2.5 rounded-full text-[13.5px] font-bold transition-all flex items-center gap-2 ${
                period === 'quarterly'
                  ? 'bg-[#14140f] text-[#beff50] shadow-sm'
                  : 'bg-white border border-[#d2d2c8] text-[#6e6e64] hover:text-[#14140f]'
              }`}
            >
              <span>Trimestral</span>
              <span className="bg-[#beff50] text-[#14140f] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Ahorra 21%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Plan Mensual */}
          <div className="p-8 rounded-[28px] bg-white border border-[#d2d2c8] flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#6e6e64]">
                Plan Mensual
              </span>
              <h3 className="text-[24px] font-black text-[#14140f] mt-1 mb-4">
                Flexibilidad Mes a Mes
              </h3>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[48px] font-black text-[#14140f] tracking-tight">
                  19
                </span>
                <span className="text-[15px] font-bold text-[#6e6e64]">
                  USD / mes
                </span>
              </div>

              <ul className="space-y-3.5 text-[14.5px] text-[#6e6e64] pb-8 border-b border-[#d2d2c8]/60">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14140f] mt-0.5 shrink-0" />
                  <span>Catálogo visual en 3 toques ilimitado</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14140f] mt-0.5 shrink-0" />
                  <span>Cálculo automático a tasa BCV del día</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14140f] mt-0.5 shrink-0" />
                  <span>Panel de dueño con gestos táctiles (Swipe)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14140f] mt-0.5 shrink-0" />
                  <span>Subpanel de despacho para motorizados</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14140f] mt-0.5 shrink-0" />
                  <span>Carga asistida de tus primeros 30 productos</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14140f] mt-0.5 shrink-0" />
                  <span>0% comisiones por venta</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/onboarding"
                className="w-full py-4 px-6 rounded-full bg-[#f5f5eb] hover:bg-[#d2d2c8]/40 border border-[#d2d2c8] text-[#14140f] font-bold text-[14px] flex items-center justify-center gap-2 transition-colors"
              >
                <span>Probar 14 días gratis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Plan Trimestral */}
          <div className="p-8 rounded-[28px] bg-white border-2 border-[#14140f] flex flex-col justify-between relative shadow-xl">
            <div className="absolute top-[-13px] right-8 bg-[#beff50] border border-[#14140f] text-[#14140f] text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#14140f]" />
              <span>Más Rentable</span>
            </div>

            <div>
              <span className="text-[12px] font-black uppercase tracking-wider text-[#14140f]">
                Plan Trimestral
              </span>
              <h3 className="text-[24px] font-black text-[#14140f] mt-1 mb-4">
                El Preferido de los Comercios
              </h3>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[48px] font-black text-[#14140f] tracking-tight">
                  15
                </span>
                <span className="text-[15px] font-bold text-[#6e6e64]">
                  USD / mes
                </span>
              </div>
              <span className="text-[12px] font-bold text-[#14140f] block mb-6">
                Facturado 45 USD cada 3 meses (Ahorras 12 USD)
              </span>

              <ul className="space-y-3.5 text-[14.5px] text-[#6e6e64] pb-8 border-b border-[#d2d2c8]/60">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14140f] mt-0.5 shrink-0" />
                  <span className="text-[#14140f] font-bold">Todo lo incluido en el Plan Mensual</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14140f] mt-0.5 shrink-0" />
                  <span>Soporte prioritario 1-a-1 por WhatsApp</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14140f] mt-0.5 shrink-0" />
                  <span>Configuración express de inventario en menos de 24 horas</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14140f] mt-0.5 shrink-0" />
                  <span>Material promocional QR para mostrador y bolsas</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14140f] mt-0.5 shrink-0" />
                  <span>Garantía de devolución incondicional de 14 días</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#14140f] mt-0.5 shrink-0" />
                  <span>0% comisiones por venta garantizado</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/onboarding"
                className="w-full py-4 px-6 rounded-full bg-[#beff50] hover:bg-[#aef038] text-[#14140f] font-black text-[14.5px] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(190,255,80,0.35)] transition-all active:scale-95"
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
