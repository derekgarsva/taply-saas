'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  DollarSign,
  Truck,
  Store,
  MapPin,
  CheckCircle2,
  RefreshCw,
  MessageCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function PerkFluidHero() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'pulse' | 'dispatch'>('catalog');

  // Tab 1 state: Catálogo 3 Toques
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery');
  const [qty, setQty] = useState(1);
  const [hasOrdered, setHasOrdered] = useState(false);
  const priceUSD = 30.0;
  const bcvRate = 124.5;
  const totalUSD = (priceUSD * qty).toFixed(2);
  const totalBs = (priceUSD * qty * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2 });

  // Tab 2 state: Pulso de Caja
  const [activeRate, setActiveRate] = useState('124.50');
  const [rateUpdated, setRateUpdated] = useState(false);

  // Tab 3 state: Subpanel Despacho
  const [orderTaken, setOrderTaken] = useState(false);

  const handleSimulateOrder = () => {
    setHasOrdered(true);
    setTimeout(() => setHasOrdered(false), 3500);
  };

  const handleRateUpdate = () => {
    setRateUpdated(true);
    setTimeout(() => setRateUpdated(false), 2000);
  };

  return (
    <section id="solucion" className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 relative overflow-hidden text-center bg-[#f6f5f0]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[320px] bg-[#beff50]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-[1100px] mx-auto">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#d2d2c8] text-[#14140f] text-[12.5px] font-bold uppercase tracking-wider mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#14140f]" />
          <span>Para comercios que venden por Instagram y WhatsApp</span>
        </div>

        {/* Display Title in OTSono/Display aesthetic */}
        <h1 className="text-[36px] sm:text-[54px] md:text-[64px] font-black text-[#14140f] tracking-[-0.03em] leading-[1.08] max-w-[940px] mx-auto">
          Automatiza tus pedidos, inventario y despacho en una sola plataforma
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-[17px] sm:text-[20px] text-[#6e6e64] max-w-[760px] mx-auto leading-relaxed font-normal">
          Tus clientes compran en 3 toques con cálculo a tasa del día y pago verificado. Tú recibes el pedido listo en chat y controlas inventario, tasas y despacho desde tu panel privado sin tocar una hoja de Excel.
        </p>

        {/* CTA Buttons in Electric Lime and Canvas */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#beff50] hover:bg-[#aef038] text-[#14140f] font-black text-[15px] tracking-tight flex items-center justify-center gap-2.5 shadow-[0_4px_16px_rgba(190,255,80,0.35)] transition-all active:scale-95"
          >
            <span>Activar mi negocio en 24 horas</span>
            <ArrowRight className="w-4 h-4 text-[#14140f]" />
          </Link>

          <Link
            href="/panaderia-la-estrella"
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-white hover:bg-[#f5f5eb] border border-[#d2d2c8] text-[#14140f] font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs"
          >
            <span>Ver Catálogo Demo</span>
          </Link>
        </div>

        {/* Micro-copy */}
        <p className="mt-4 text-[12.5px] font-semibold text-[#6e6e64]">
          Sin tarjeta de crédito • Te montamos tus primeros 30 productos gratis • Cero comisiones
        </p>

        {/* ══════════════════════════════════════════════════════════════════════════
            PERK-WEB INTERACTIVE 3-TAB SHOWCASE CONTAINER
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="mt-14 max-w-[980px] mx-auto">
          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#f5f5eb] border border-[#d2d2c8] rounded-full max-w-fit mx-auto mb-6 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-5 py-2.5 rounded-full text-[13.5px] font-bold transition-all flex items-center gap-2 ${
                activeTab === 'catalog'
                  ? 'bg-[#14140f] text-[#beff50] shadow-sm'
                  : 'text-[#6e6e64] hover:text-[#14140f]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Catálogo en 3 Toques</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pulse')}
              className={`px-5 py-2.5 rounded-full text-[13.5px] font-bold transition-all flex items-center gap-2 ${
                activeTab === 'pulse'
                  ? 'bg-[#14140f] text-[#beff50] shadow-sm'
                  : 'text-[#6e6e64] hover:text-[#14140f]'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Pulso de Caja Diario</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dispatch')}
              className={`px-5 py-2.5 rounded-full text-[13.5px] font-bold transition-all flex items-center gap-2 ${
                activeTab === 'dispatch'
                  ? 'bg-[#14140f] text-[#beff50] shadow-sm'
                  : 'text-[#6e6e64] hover:text-[#14140f]'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Subpanel de Despacho</span>
            </button>
          </div>

          {/* Tab Panels */}
          <div className="bg-white border border-[#d2d2c8] rounded-[24px] sm:rounded-[32px] p-6 sm:p-9 text-left shadow-[0_20px_50px_rgba(20,20,15,0.06)] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {/* ── TAB 1: CATÁLOGO EN 3 TOQUES ── */}
              {activeTab === 'catalog' && (
                <motion.div
                  key="catalog"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#d2d2c8]/60 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#14140f] text-[#beff50] flex items-center justify-center font-black text-sm">
                        ⭐
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[17px] font-extrabold text-[#14140f]">
                            Panadería La Estrella
                          </h3>
                          <span className="text-[11px] font-bold bg-[#beff50]/30 text-[#14140f] px-2 py-0.5 rounded-full">
                            Abierto
                          </span>
                        </div>
                        <p className="text-[12.5px] text-[#6e6e64]">
                          Catálogo interactivo en 3 toques
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-[#f5f5eb] border border-[#d2d2c8] px-3 py-1.5 rounded-xl self-start sm:self-auto">
                      <span className="w-2 h-2 rounded-full bg-[#beff50] animate-pulse" />
                      <span className="text-[12px] font-bold text-[#14140f]">
                        Tasa BCV del Día: 124.50 Bs / USD
                      </span>
                    </div>
                  </div>

                  {/* Product Item */}
                  <div className="p-4 rounded-2xl bg-[#f5f5eb] border border-[#d2d2c8]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-xl bg-white border border-[#d2d2c8] flex items-center justify-center text-2xl shadow-xs">
                        🥖
                      </div>
                      <div>
                        <h4 className="text-[15.5px] font-bold text-[#14140f]">
                          Pan de Jamón Tradicional
                        </h4>
                        <p className="text-[12.5px] text-[#6e6e64]">
                          Masa sobada brioche, tocineta ahumada y pasas rubias
                        </p>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-[17px] font-extrabold text-[#14140f]">
                            ${priceUSD.toFixed(2)} USD
                          </span>
                          <span className="text-[13px] font-semibold text-[#6e6e64]">
                            ≈ Bs. {(priceUSD * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-white border border-[#d2d2c8] rounded-xl p-1 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6e6e64] hover:text-[#14140f] hover:bg-[#f5f5eb] text-base font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-[14px] font-black text-[#14140f]">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(qty + 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6e6e64] hover:text-[#14140f] hover:bg-[#f5f5eb] text-base font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* 2-Way Delivery Toggle */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`py-3 px-4 rounded-xl border text-center transition-all flex items-center justify-center gap-2 text-[13.5px] font-bold ${
                        deliveryType === 'pickup'
                          ? 'bg-[#14140f] border-[#14140f] text-[#beff50] shadow-sm'
                          : 'bg-[#f5f5eb] border-[#d2d2c8] text-[#6e6e64] hover:text-[#14140f]'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <span>Retiro en Local</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`py-3 px-4 rounded-xl border text-center transition-all flex items-center justify-center gap-2 text-[13.5px] font-bold ${
                        deliveryType === 'delivery'
                          ? 'bg-[#14140f] border-[#14140f] text-[#beff50] shadow-sm'
                          : 'bg-[#f5f5eb] border-[#d2d2c8] text-[#6e6e64] hover:text-[#14140f]'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Para Delivery</span>
                    </button>
                  </div>

                  {/* Checkout Action bar */}
                  <div className="pt-4 border-t border-[#d2d2c8]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[12px] font-semibold text-[#6e6e64] block">
                        Total a Pagar
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[24px] font-black text-[#14140f]">
                          ${totalUSD} USD
                        </span>
                        <span className="text-[14px] font-bold text-[#6e6e64]">
                          Bs. {totalBs}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSimulateOrder}
                      className="px-6 py-3.5 rounded-full bg-[#beff50] hover:bg-[#aef038] text-[#14140f] font-black text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                    >
                      {hasOrdered ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>¡Orden #1042 enviada a WhatsApp!</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4" />
                          <span>Pedir por WhatsApp (1 toque)</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── TAB 2: PULSO DE CAJA DIARIO ── */}
              {activeTab === 'pulse' && (
                <motion.div
                  key="pulse"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#d2d2c8]/60 gap-4">
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-wider text-[#6e6e64]">
                        Panel de Dueño en Vivo
                      </span>
                      <h3 className="text-[20px] font-extrabold text-[#14140f]">
                        Cierre de Caja y Desglose por Método
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 bg-[#f5f5eb] border border-[#d2d2c8] p-2 rounded-2xl">
                      <span className="text-[12px] font-bold text-[#6e6e64] pl-1">
                        Tasa Activa:
                      </span>
                      <div className="flex items-center gap-1 bg-white border border-[#d2d2c8] px-2.5 py-1 rounded-xl">
                        <span className="text-[13px] font-bold text-[#14140f]">
                          Bs.
                        </span>
                        <input
                          type="text"
                          value={activeRate}
                          onChange={(e) => setActiveRate(e.target.value)}
                          className="w-16 text-[13px] font-black text-[#14140f] focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRateUpdate}
                        className="bg-[#14140f] hover:bg-[#30302a] text-[#beff50] px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{rateUpdated ? '¡Actualizada!' : 'Actualizar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 5 Blocks metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div className="bg-[#14140f] text-white p-5 rounded-2xl flex flex-col justify-between">
                      <span className="text-[12px] font-semibold text-[#beff50]">
                        Recaudado Hoy
                      </span>
                      <div className="my-2">
                        <span className="text-[32px] font-black tracking-tight text-white">
                          340.00
                        </span>
                        <span className="text-[13px] font-bold text-[#beff50] ml-1">
                          USD
                        </span>
                      </div>
                      <span className="text-[11px] text-[#d2d2c8]">
                        12 pedidos confirmados
                      </span>
                    </div>

                    <div className="bg-[#f5f5eb] border border-[#d2d2c8] p-4 rounded-2xl">
                      <span className="text-[12px] font-bold text-[#6e6e64] block mb-1">
                        Pago Móvil
                      </span>
                      <span className="text-[18px] font-black text-[#14140f] block">
                        Bs. 14.280,00
                      </span>
                      <span className="text-[11px] text-[#6e6e64]">
                        ≈ 114.70 USD
                      </span>
                    </div>

                    <div className="bg-[#f5f5eb] border border-[#d2d2c8] p-4 rounded-2xl">
                      <span className="text-[12px] font-bold text-[#6e6e64] block mb-1">
                        Zelle
                      </span>
                      <span className="text-[18px] font-black text-[#14140f] block">
                        120.00
                      </span>
                      <span className="text-[11px] text-[#6e6e64]">
                        3 transacciones
                      </span>
                    </div>

                    <div className="bg-[#f5f5eb] border border-[#d2d2c8] p-4 rounded-2xl">
                      <span className="text-[12px] font-bold text-[#6e6e64] block mb-1">
                        Binance Pay
                      </span>
                      <span className="text-[18px] font-black text-[#14140f] block">
                        45.00
                      </span>
                      <span className="text-[11px] text-[#6e6e64]">
                        USDT verificado
                      </span>
                    </div>

                    <div className="bg-[#f5f5eb] border border-[#d2d2c8] p-4 rounded-2xl">
                      <span className="text-[12px] font-bold text-[#6e6e64] block mb-1">
                        Efectivo Divisas
                      </span>
                      <span className="text-[18px] font-black text-[#14140f] block">
                        35.00
                      </span>
                      <span className="text-[11px] text-[#6e6e64]">
                        En caja al retirar
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── TAB 3: SUBPANEL DE DESPACHO ── */}
              {activeTab === 'dispatch' && (
                <motion.div
                  key="dispatch"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#d2d2c8]/60 gap-3">
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-wider text-[#6e6e64]">
                        Vista Aislada de Repartidores
                      </span>
                      <h3 className="text-[20px] font-extrabold text-[#14140f]">
                        Despacho sin Fugas ni Conflictos
                      </h3>
                    </div>

                    <span className="text-[12px] font-bold bg-[#beff50]/30 text-[#14140f] px-3 py-1 rounded-full self-start sm:self-auto">
                      Cero Precios ni Márgenes Visibles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Order Card 1 */}
                    <div className="p-4 rounded-2xl bg-[#f5f5eb] border border-[#d2d2c8] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-black text-[#14140f]">
                          #1041 · Ana Morales
                        </span>
                        <span className="text-[11.5px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          En espera de motorizado
                        </span>
                      </div>
                      <p className="text-[12.5px] text-[#6e6e64]">
                        📍 Urb. Las Mercedes, Calle París, Torre B, Piso 5
                      </p>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#d2d2c8]/60">
                        <button
                          type="button"
                          onClick={() => setOrderTaken(!orderTaken)}
                          className={`flex-1 py-2 px-3 rounded-xl text-[12.5px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                            orderTaken
                              ? 'bg-[#14140f] text-[#beff50]'
                              : 'bg-[#beff50] hover:bg-[#aef038] text-[#14140f]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{orderTaken ? 'Asignado a ti (Bloqueado)' : 'Tomar Despacho'}</span>
                        </button>

                        <a
                          href="https://wa.me/584141234567"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white border border-[#d2d2c8] text-[#14140f] hover:bg-[#f5f5eb]"
                          title="Abrir WhatsApp del cliente"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {/* Order Card 2 */}
                    <div className="p-4 rounded-2xl bg-[#f5f5eb] border border-[#d2d2c8] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-black text-[#14140f]">
                          #1042 · Pedro Pérez
                        </span>
                        <span className="text-[11.5px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          Retiro en Mostrador
                        </span>
                      </div>
                      <p className="text-[12.5px] text-[#6e6e64]">
                        🏢 Retiro directo en caja con efectivo
                      </p>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#d2d2c8]/60">
                        <button
                          type="button"
                          className="w-full py-2 px-3 rounded-xl text-[12.5px] font-bold bg-[#14140f] text-white hover:bg-[#30302a] flex items-center justify-center gap-1.5"
                        >
                          <Store className="w-3.5 h-3.5 text-[#beff50]" />
                          <span>Marcar como Entregado en Local</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
