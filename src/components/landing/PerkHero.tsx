'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles, MessageCircle, MapPin, Store, CheckCircle2 } from 'lucide-react';

export default function PerkHero() {
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery');
  const [qty, setQty] = useState(1);
  const [clientName, setClientName] = useState('Carlos Mendoza');
  const [clientAddress, setClientAddress] = useState('Av. Francisco de Miranda, Edif. Parque Cristal, Apto 4B');
  const [hasOrdered, setHasOrdered] = useState(false);

  const priceUSD = 30.0;
  const bcvRate = 124.5;
  const totalUSD = (priceUSD * qty).toFixed(2);
  const totalBs = (priceUSD * qty * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2 });

  const handleSimulateOrder = () => {
    setHasOrdered(true);
    setTimeout(() => {
      setHasOrdered(false);
    }, 4000);
  };

  return (
    <section className="relative pt-12 sm:pt-16 pb-0 overflow-hidden text-center">
      {/* Perk signature radial mint background glow */}
      <div
        className="absolute inset-x-[-40vw] top-[-120px] bottom-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse 60% 55% at 50% 0%, #E4F4EC 0%, rgba(228, 244, 236, 0) 70%)',
        }}
      />

      <div className="perk-wrap relative z-10">
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E4F4EC] border border-[#0D7A53]/15 text-[#0A3D2C] text-[13px] font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#0D7A53]" />
          <span>Para comercios que venden por Instagram y WhatsApp</span>
        </div>

        {/* H1 Heading with Perk em underline style */}
        <h1 className="text-[#0A3D2C] text-[34px] sm:text-[46px] md:text-[54px] font-semibold tracking-[-0.02em] max-w-[760px] mx-auto leading-[1.12] mb-5">
          Catálogo y pedidos por WhatsApp que tus clientes{' '}
          <em className="text-[#0D7A53] not-italic border-b-[4px] border-[#FF6A3D] inline-block pb-0.5">
            realmente usan
          </em>
        </h1>

        {/* Subtitle */}
        <p className="text-[#5B6B63] text-[18px] sm:text-[20px] max-w-[560px] mx-auto leading-relaxed mb-7 font-normal">
          Taply convierte tu catálogo en una experiencia de 3 toques con cálculo a tasa del día y pago verificado — y envía el pedido listo a tu WhatsApp sin fricción.
        </p>

        {/* Hero Points (Perk style check pills) */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-[620px] mx-auto mb-8">
          <span className="bg-[#E4F4EC] text-[#0A3D2C] rounded-full inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[14px] font-medium border border-[#0D7A53]/10">
            <svg
              className="w-4 h-4 stroke-[#0D7A53] fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Un toque para agregar al pedido
          </span>

          <span className="bg-[#E4F4EC] text-[#0A3D2C] rounded-full inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[14px] font-medium border border-[#0D7A53]/10">
            <svg
              className="w-4 h-4 stroke-[#0D7A53] fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Tasa BCV del día calculada en vivo
          </span>

          <span className="bg-[#E4F4EC] text-[#0A3D2C] rounded-full inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[14px] font-medium border border-[#0D7A53]/10">
            <svg
              className="w-4 h-4 stroke-[#0D7A53] fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Desliza y la orden entra en WhatsApp
          </span>
        </div>

        {/* CTA Button and Note */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/onboarding"
            className="perk-cta w-full sm:w-auto"
          >
            <span>Activar mi negocio en 24 horas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/panaderia-la-estrella"
            className="w-full sm:w-auto px-6 py-3.5 rounded-[10px] bg-white border border-[#E3E8E5] text-[#0A3D2C] hover:bg-[#E4F4EC] text-[15px] font-medium transition-colors shadow-sm"
          >
            Ver catálogo demo en vivo
          </Link>
        </div>

        <p className="text-[#5B6B63] text-[14px] mt-3.5 mb-12">
          Sin comisiones por venta · Te montamos tus primeros 30 productos gratis
        </p>

        {/* ══════════════════════════════════════════════════════════════════════════
            PERK HERO SHOWCASE MOCKUP (.hero-shot)
            Pixel-perfect interactive widget mockup with negative bottom margin
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="relative z-20 max-w-[760px] mx-auto mb-[-64px] sm:mb-[-78px]">
          <div
            className="bg-white border border-[#E3E8E5] rounded-[22px] p-5 sm:p-7 text-left transition-all"
            style={{
              boxShadow: '0 22px 42px rgba(10, 61, 44, 0.22)',
            }}
          >
            {/* Widget Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E3E8E5]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0D7A53] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  ⭐
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-semibold text-[#0A3D2C]">
                      Panadería La Estrella
                    </span>
                    <span className="text-[11px] font-medium bg-[#E4F4EC] text-[#0D7A53] px-2 py-0.5 rounded-full">
                      Abierto
                    </span>
                  </div>
                  <span className="text-[12px] text-[#5B6B63]">
                    Catálogo oficial en 3 toques
                  </span>
                </div>
              </div>

              {/* Live BCV badge */}
              <div className="flex items-center gap-1.5 bg-[#F8FAF9] border border-[#E3E8E5] px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-[#16A06E] animate-pulse" />
                <span className="text-[12px] font-semibold text-[#0A3D2C]">
                  Tasa BCV: 124.50 Bs / $
                </span>
              </div>
            </div>

            {/* Product Card Details */}
            <div className="mt-5 p-4 rounded-xl bg-[#F8FAF9] border border-[#E3E8E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-white border border-[#E3E8E5] flex items-center justify-center text-2xl shadow-xs">
                  🥖
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#0A3D2C]">
                    Pan de Jamón Tradicional
                  </div>
                  <div className="text-[13px] text-[#5B6B63]">
                    Masa sobada brioche, tocineta ahumada y pasas rubias
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[16px] font-bold text-[#0D7A53]">
                      ${priceUSD.toFixed(2)}
                    </span>
                    <span className="text-[12px] font-medium text-[#5B6B63]">
                      ≈ Bs. {(priceUSD * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-2 self-start sm:self-center bg-white border border-[#E3E8E5] rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-7 h-7 rounded flex items-center justify-center text-[#5B6B63] hover:text-[#0A3D2C] hover:bg-[#E4F4EC] text-base font-bold transition-colors"
                >
                  -
                </button>
                <span className="w-6 text-center text-[14px] font-bold text-[#0A3D2C]">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="w-7 h-7 rounded flex items-center justify-center text-[#5B6B63] hover:text-[#0A3D2C] hover:bg-[#E4F4EC] text-base font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* 3-Touch Delivery Selector */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all flex items-center justify-center gap-2 text-[13px] font-medium ${
                  deliveryType === 'pickup'
                    ? 'bg-[#E4F4EC] border-[#0D7A53] text-[#0A3D2C] shadow-xs'
                    : 'bg-white border-[#E3E8E5] text-[#5B6B63] hover:bg-[#F8FAF9]'
                }`}
              >
                <Store className="w-4 h-4 text-[#0D7A53]" />
                <span>Retiro en Local</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all flex items-center justify-center gap-2 text-[13px] font-medium ${
                  deliveryType === 'delivery'
                    ? 'bg-[#E4F4EC] border-[#0D7A53] text-[#0A3D2C] shadow-xs'
                    : 'bg-white border-[#E3E8E5] text-[#5B6B63] hover:bg-[#F8FAF9]'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#0D7A53]" />
                <span>Para Delivery</span>
              </button>
            </div>

            {/* Delivery Inputs with LocalStorage simulation */}
            <div className="mt-3.5 space-y-2">
              <div>
                <label className="text-[11px] font-semibold text-[#5B6B63] uppercase tracking-wider block mb-1">
                  Tu Nombre
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full text-[13px] px-3 py-2 rounded-lg bg-white border border-[#E3E8E5] text-[#16201C] focus:outline-none focus:border-[#0D7A53] transition-colors"
                  placeholder="Nombre y apellido"
                />
              </div>

              {deliveryType === 'delivery' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-[11px] font-semibold text-[#5B6B63] uppercase tracking-wider block mb-1">
                    Dirección y Punto de Referencia
                  </label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full text-[13px] px-3 py-2 rounded-lg bg-white border border-[#E3E8E5] text-[#16201C] focus:outline-none focus:border-[#0D7A53] transition-colors"
                    placeholder="Dirección exacta para el motorizado"
                  />
                </motion.div>
              )}
            </div>

            {/* Order Total Breakdown */}
            <div className="mt-4 pt-3.5 border-t border-[#E3E8E5] flex items-center justify-between">
              <div>
                <span className="text-[12px] text-[#5B6B63] block">Total a Pagar</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-[20px] font-bold text-[#0A3D2C]">
                    ${totalUSD} USD
                  </span>
                  <span className="text-[13px] font-semibold text-[#0D7A53]">
                    Bs. {totalBs}
                  </span>
                </div>
              </div>

              {/* Interactive Swipe Order Trigger */}
              <button
                type="button"
                onClick={handleSimulateOrder}
                className="perk-cta py-3 px-5 text-[14px] font-medium"
              >
                {hasOrdered ? (
                  <span className="flex items-center gap-1.5 text-white">
                    <CheckCircle2 className="w-4 h-4" />
                    ¡Orden #1042 enviada a WhatsApp!
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    Pedir por WhatsApp (1 clic)
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
