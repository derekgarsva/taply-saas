'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Bike,
  Store,
  MapPin,
  MessageCircle,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Package,
  Layers,
  Clock,
  Radio,
} from 'lucide-react';

export default function BentoGridSection() {
  const [deliveryTab, setDeliveryTab] = useState<'delivery' | 'pickup'>('delivery');
  const [orderTaken, setOrderTaken] = useState<boolean>(false);
  const [orderDelivered, setOrderDelivered] = useState<boolean>(false);
  const [stockCount, setStockCount] = useState<number>(12);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [swipeTriggered, setSwipeTriggered] = useState<boolean>(false);

  const handleSimulateSwipe = () => {
    if (swipeTriggered) return;
    setSwipeTriggered(true);
    setStockCount((prev) => Math.max(0, prev - 1));
    setTimeout(() => {
      setSwipeTriggered(false);
    }, 2500);
  };

  return (
    <section id="bento" className="py-20 sm:py-28 bg-[#090D10] text-white px-4 relative overflow-hidden">
      {/* Subtle Atmospheric Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-sky-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider mb-3.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Control Total del Negocio</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight"
          >
            Maneja todo tu negocio desde un solo panel
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm sm:text-base text-zinc-400 mt-3.5 max-w-xl mx-auto font-normal leading-relaxed"
          >
            Sin hojas de cálculo, sin libretas perdidas y sin enredos con tus repartidores. Las 3 herramientas clave que necesitas para escalar:
          </motion.p>
        </div>

        {/* ══ BENTO GRID CARDS ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* ── CARD 1: CUADRE DE CAJA DIARIO (Span 7 cols en desktop) ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 rounded-3xl bg-zinc-950/90 border border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700/80 transition-all shadow-xl"
          >
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Cuadre Diario Automático</span>
                </span>
                <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>En vivo</span>
                </span>
              </div>

              <h3 className="text-2xl font-black text-white tracking-tight">
                Cierre de caja exacto, sin contar billete por billete
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-lg leading-relaxed">
                Cada pedido confirmado suma automáticamente a tu cuadre del día. Visualiza al segundo cuánto cobraste en bolívares por Pago Móvil, en Zelle y en efectivo en divisas.
              </p>
            </div>

            {/* Visual Dark Mockup: Total + Breakdown Bars */}
            <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-[#0F1418] border border-zinc-800/90">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-zinc-800/80">
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Ventas Netas Hoy
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-0.5">
                    $482.50 <span className="text-sm font-semibold text-zinc-400">USD</span>
                  </div>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-[10px] font-semibold text-zinc-500">Tasa Oficial BCV</span>
                  <p className="text-sm font-black text-emerald-400">Bs. 21.712,50</p>
                </div>
              </div>

              {/* Breakdown Bars by Payment Method */}
              <div className="mt-4 space-y-3">
                {/* Method 1: Pago Móvil */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Pago Móvil (Banesco & Mercantil)</span>
                    </span>
                    <span className="font-extrabold text-white">$299.15 (62%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800/80 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>

                {/* Method 2: Zelle */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>Zelle USD</span>
                    </span>
                    <span className="font-extrabold text-white">$115.80 (24%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800/80 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>

                {/* Method 3: Efectivo Divisas */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Efectivo en Divisas al entregar</span>
                    </span>
                    <span className="font-extrabold text-white">$67.55 (14%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800/80 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Sin comisiones por venta. El dinero va directo a tus cuentas.</span>
            </div>
          </motion.div>

          {/* ── CARD 2: CONTROL DE STOCK A 1 TOQUE (Span 5 cols en desktop) ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5 rounded-3xl bg-zinc-950/90 border border-zinc-800/80 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700/80 transition-all shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Control de Stock a 1 Toque</span>
                </span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Atómico</span>
              </div>

              <h3 className="text-2xl font-black text-white tracking-tight">
                Vende solo lo que tienes disponible
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                Al confirmar un pago con un swipe, el stock se descuenta atómicamente. Si se acaba, tu catálogo lo oculta o marca como agotado al instante.
              </p>
            </div>

            {/* Interactive Product & Swipe Preview */}
            <div className="mt-6 p-4 rounded-2xl bg-[#0F1418] border border-zinc-800/90 space-y-3.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-700/60">
                    <img
                      src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=150&q=80"
                      alt="Pan de Jamón"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Pan de Jamón Tradicional</h4>
                    <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                      {isAvailable ? `${stockCount} unidades disponibles` : 'Agotado'}
                    </p>
                  </div>
                </div>

                {/* Quick Toggle switch */}
                <button
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                    isAvailable ? 'bg-emerald-600 justify-end' : 'bg-zinc-700 justify-start'
                  }`}
                  title="Cambiar disponibilidad"
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* Simulated Swipe Action Bar */}
              <div className="pt-2 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={handleSimulateSwipe}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    swipeTriggered
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700/70'
                  }`}
                >
                  {swipeTriggered ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Stock descontado atómicamente!</span>
                    </>
                  ) : (
                    <>
                      <span>👉 Toca para simular swipe de confirmación</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-zinc-500">
              ✓ Previene sobreventas y cancelaciones incómodas con tus clientes.
            </p>
          </motion.div>

          {/* ── CARD 3: PIPELINE DE DESPACHO EN VIVO (Span 12 cols ancho completo) ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-12 rounded-3xl bg-zinc-950/90 border border-zinc-800/80 p-6 sm:p-8 relative overflow-hidden group hover:border-zinc-700/80 transition-all shadow-xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1.5">
                    <Bike className="w-3.5 h-3.5" />
                    <span>Pipeline de Despacho en Vivo</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    Anti-Colisiones
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Cocina y repartidores coordinados al segundo
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
                  Tus repartidores tienen su propio subpanel en vivo sin precios visibles, con enlace directo a WhatsApp y actualización condicional para que dos repartidores nunca tomen la misma orden.
                </p>
              </div>

              {/* Tabs Switcher: Delivery vs Retiro */}
              <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 self-start lg:self-auto">
                <button
                  onClick={() => setDeliveryTab('delivery')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    deliveryTab === 'delivery'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Para Delivery (3)</span>
                </button>
                <button
                  onClick={() => setDeliveryTab('pickup')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    deliveryTab === 'pickup'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Retiro en Local (2)</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Dispatch Card Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Order Card 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1418] border border-zinc-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-black text-white tracking-tight">#1042</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {orderDelivered
                        ? '✓ Entregado'
                        : orderTaken
                        ? '🛵 En camino (Carlos)'
                        : 'Listo para despacho'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-zinc-200">Cliente: Carlos Pérez</p>
                  <p className="text-[11px] text-zinc-400 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>Calle 72 con Bella Vista, Edif. Torre Mar, Apto 5B</span>
                  </p>
                  <div className="mt-3 text-[11px] text-zinc-300 bg-zinc-900/80 px-2.5 py-1.5 rounded-lg border border-zinc-800">
                    2x Pan de Jamón • 1x Golfeado Meloso
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <a
                    href="https://wa.me/584146001234"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-bold text-[#25D366] hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {!orderTaken ? (
                    <button
                      onClick={() => setOrderTaken(true)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[11px] font-black text-white active:scale-95 transition-all"
                    >
                      Tomar Despacho 🛵
                    </button>
                  ) : !orderDelivered ? (
                    <button
                      onClick={() => setOrderDelivered(true)}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-[11px] font-black text-white active:scale-95 transition-all"
                    >
                      Completar Entrega ✓
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-400">Entrega lista 🎉</span>
                  )}
                </div>
              </div>

              {/* Order Card 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1418] border border-zinc-800 flex flex-col justify-between opacity-85">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-black text-white tracking-tight">#1041</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                      🛵 En camino (Pedro)
                    </span>
                  </div>
                  <p className="text-xs font-bold text-zinc-200">Cliente: María Rodríguez</p>
                  <p className="text-[11px] text-zinc-400 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>Av. 5 de Julio, Frente al Banco Provincial</span>
                  </p>
                  <div className="mt-3 text-[11px] text-zinc-300 bg-zinc-900/80 px-2.5 py-1.5 rounded-lg border border-zinc-800">
                    1x Smash Doble Queso • 1x Papas Rústicas
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Hace 8 min</span>
                  </span>
                  <span className="text-[11px] font-semibold text-zinc-500">Asignada</span>
                </div>
              </div>

              {/* Order Card 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1418] border border-zinc-800 flex flex-col justify-between opacity-70 hidden md:flex">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-black text-white tracking-tight">#1040</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      🏪 Retiro en Mostrador
                    </span>
                  </div>
                  <p className="text-xs font-bold text-zinc-200">Cliente: Manuel Suárez</p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Retiro en local por el cliente
                  </p>
                  <div className="mt-3 text-[11px] text-zinc-300 bg-zinc-900/80 px-2.5 py-1.5 rounded-lg border border-zinc-800">
                    3x Golfeados con Queso de Mano
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Hace 14 min</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400">✓ Entregado</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
