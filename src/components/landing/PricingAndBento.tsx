'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  RefreshCw,
  Check,
  X,
  Bike,
  Store,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';

export default function PricingAndBento() {
  // ── Pricing State ──
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'quarterly'>('quarterly');

  // ── Bento Interactive State ──
  // Bloque 2: Switch de Tasa
  const [activeRate, setActiveRate] = useState<number>(124.5);
  const [isUpdatingRate, setIsUpdatingRate] = useState<boolean>(false);
  const [rateUpdatedToast, setRateUpdatedToast] = useState<boolean>(false);

  // Bloque 3: Gestión por Gestos (Swipe Card)
  const [swipeStatus, setSwipeStatus] = useState<'idle' | 'confirmed' | 'discarded'>('idle');
  const dragX = useMotionValue(0);
  const swipeBackground = useTransform(
    dragX,
    [-140, 0, 140],
    ['rgba(239, 68, 68, 0.25)', 'rgba(23, 23, 23, 0.6)', 'rgba(16, 185, 129, 0.25)']
  );
  const swipeBorder = useTransform(
    dragX,
    [-140, 0, 140],
    ['rgba(239, 68, 68, 0.6)', 'rgba(38, 38, 38, 1)', 'rgba(16, 185, 129, 0.6)']
  );

  // Bloque 4: Subpanel Despacho
  const [dispatchTab, setDispatchTab] = useState<'pickup' | 'delivery'>('delivery');
  const [deliveryTaken, setDeliveryTaken] = useState<boolean>(false);

  // Función para simular cambio de tasa en 1 clic
  const handleUpdateRate = (newRate: number) => {
    setIsUpdatingRate(true);
    setTimeout(() => {
      setActiveRate(newRate);
      setIsUpdatingRate(false);
      setRateUpdatedToast(true);
      setTimeout(() => setRateUpdatedToast(false), 2500);
    }, 400);
  };

  const handleResetSwipe = () => {
    dragX.set(0);
    setSwipeStatus('idle');
  };

  return (
    <div className="w-full bg-neutral-950 text-neutral-100 font-sans">
      {/* ══════════════════════════════════════════════════════════════════════════
          4 BLOQUES OPERATIVOS (BENTO GRID DESACOPLADO)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section id="operatividad" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Control operativo en tiempo real</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Maneja todo tu negocio desde un solo panel
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Elimina el caos de libretas de mostrador, capturas de pantalla perdidas y recálculos manuales. Cuatro herramientas operativas desacopladas para controlar tus ventas al segundo:
          </p>
        </div>

        {/* ── BENTO GRID CONTAINER (4 BLOQUES) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* ════ BLOQUE 1: Pulso de Caja (Span 7 cols) ════ */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-neutral-700 transition-all">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Pulso de Caja Diario</span>
                </span>
                <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>En vivo</span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Cierre automático sin contar billete por billete
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                Cada pedido confirmado suma automáticamente a tu cuadre del día. Visualiza con exactitud cuánto ingresó por cada canal de pago sin descuadres.
              </p>
            </div>

            {/* Tarjeta de Datos Limpios */}
            <div className="mt-6 bg-neutral-950 border border-neutral-800/90 rounded-2xl p-5 sm:p-6">
              <div className="flex items-baseline justify-between pb-4 border-b border-neutral-800">
                <div>
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Recaudado hoy
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-0.5">
                    340.00 <span className="text-xs font-semibold text-neutral-400">USD</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    +18 órdenes
                  </span>
                </div>
              </div>

              {/* Desglose por método requerido */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
                <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800/80">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase">Pago Móvil</span>
                  <span className="text-xs font-extrabold text-neutral-200 mt-1 block">
                    Bs. 14.280
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800/80">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase">Zelle</span>
                  <span className="text-xs font-extrabold text-neutral-200 mt-1 block">
                    120.00
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800/80">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase">Binance</span>
                  <span className="text-xs font-extrabold text-neutral-200 mt-1 block">
                    45.00
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800/80">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase">Efectivo</span>
                  <span className="text-xs font-extrabold text-neutral-200 mt-1 block">
                    35.00
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ════ BLOQUE 2: Switch de Tasa en 1 Clic (Span 5 cols) ════ */}
          <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-neutral-700 transition-all">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tasa del Día</span>
                </span>
                <span className="text-[10px] font-bold text-neutral-400">1 Clic Actualiza Todo</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Switch de Tasa Automática
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                Ajusta la tasa activa en 1 segundo y todo tu catálogo recalcula los montos en bolívares al instante.
              </p>
            </div>

            {/* Input / Badge Interactivo */}
            <div className="mt-6 bg-neutral-950 border border-neutral-800/90 rounded-2xl p-5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Tasa Activa en Catálogo
              </span>

              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                    {activeRate.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-neutral-400">Bs / USD</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpdateRate(activeRate === 124.5 ? 125.8 : 124.5)}
                  disabled={isUpdatingRate}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingRate ? 'animate-spin' : ''}`} />
                  <span>{isUpdatingRate ? 'Sincronizando...' : 'Actualizar'}</span>
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Fuente: BCV Oficial / Monitoreo</span>
                {rateUpdatedToast ? (
                  <span className="text-emerald-400 font-bold animate-fade-in">✓ Catálogo sincronizado</span>
                ) : (
                  <span>Recalcula sin editar productos</span>
                )}
              </div>
            </div>
          </div>

          {/* ════ BLOQUE 3: Gestión por Gestos / Swipe Actions (Span 6 cols) ════ */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-neutral-700 transition-all">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Gestión por Gestos</span>
                </span>
                <span className="text-[10px] font-bold text-neutral-400">Framer Motion Drag</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Triage táctil de pedidos pendientes
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                Desliza a la derecha (verde) para confirmar pago y descontar stock automáticamente. Desliza a la izquierda (rojo) para descartar.
              </p>
            </div>

            {/* Interactive Swipe Preview Card */}
            <div className="mt-6">
              <motion.div
                style={{ backgroundColor: swipeBackground, borderColor: swipeBorder }}
                className="relative rounded-2xl border p-4 sm:p-5 select-none overflow-hidden transition-colors"
              >
                <AnimatePresence mode="wait">
                  {swipeStatus === 'idle' ? (
                    <motion.div
                      key="card-idle"
                      drag="x"
                      dragConstraints={{ left: -140, right: 140 }}
                      dragElastic={0.4}
                      style={{ x: dragX }}
                      onDragEnd={(_, info) => {
                        if (info.offset.x > 80) {
                          setSwipeStatus('confirmed');
                        } else if (info.offset.x < -80) {
                          setSwipeStatus('discarded');
                        }
                      }}
                      className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 cursor-grab active:cursor-grabbing shadow-lg"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          <span className="text-xs font-black text-white">Orden #1042</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                            Pendiente
                          </span>
                        </div>
                        <span className="text-xs font-black text-white">45.00</span>
                      </div>

                      <div className="mt-2.5 text-xs text-neutral-300 space-y-1">
                        <div className="flex justify-between">
                          <span>2x Pan de Jamón Tradicional</span>
                          <span className="text-neutral-400">Delivery</span>
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          Cliente: Carlos Mendoza • Pago Móvil
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-500 font-semibold">
                        <span className="text-red-400/80 flex items-center gap-1">← Descartar</span>
                        <span className="text-neutral-400 hidden sm:inline">Arrastra la tarjeta</span>
                        <span className="text-emerald-400 flex items-center gap-1">Confirmar →</span>
                      </div>
                    </motion.div>
                  ) : swipeStatus === 'confirmed' ? (
                    <motion.div
                      key="card-confirmed"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 text-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                        <Check className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-black text-emerald-300">
                        ¡Pedido #1042 Confirmado!
                      </div>
                      <p className="text-[11px] text-emerald-200/70 mt-1">
                        Pago registrado y stock descontado en la base de datos.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetSwipe}
                        className="mt-2 text-[10px] font-extrabold text-white underline hover:opacity-80"
                      >
                        Reiniciar prueba
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="card-discarded"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-950/60 border border-red-500/40 rounded-xl p-4 text-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-2">
                        <X className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-black text-red-300">
                        Pedido #1042 Descartado
                      </div>
                      <p className="text-[11px] text-red-200/70 mt-1">
                        Orden cancelada sin alterar el inventario de productos.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetSwipe}
                        className="mt-2 text-[10px] font-extrabold text-white underline hover:opacity-80"
                      >
                        Reiniciar prueba
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Botones de acción directa rápida */}
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSwipeStatus('discarded')}
                  className="flex-1 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-[11px] font-bold transition-all"
                >
                  Descartar (Swipe Izq)
                </button>
                <button
                  type="button"
                  onClick={() => setSwipeStatus('confirmed')}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold transition-all"
                >
                  Confirmar (Swipe Der)
                </button>
              </div>
            </div>
          </div>

          {/* ════ BLOQUE 4: Subpanel Despacho / Separación de Roles (Span 6 cols) ════ */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-neutral-700 transition-all">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <Bike className="w-3.5 h-3.5" />
                  <span>Subpanel de Despacho</span>
                </span>
                <span className="text-[10px] font-bold text-neutral-400">Cocina & Repartidores</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Separación de roles sin mostrar precios
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                Tus repartidores y personal de cocina ven exclusivamente los ítems a preparar, dirección y botón de WhatsApp, protegiendo tus ingresos.
              </p>
            </div>

            {/* Pestañas desacopladas */}
            <div className="mt-6 bg-neutral-950 border border-neutral-800/90 rounded-2xl p-4">
              <div className="flex items-center gap-2 p-1 bg-neutral-900 rounded-xl mb-3 border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setDispatchTab('delivery')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    dispatchTab === 'delivery'
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Para Delivery (1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDispatchTab('pickup')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    dispatchTab === 'pickup'
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Retiro en Local (2)</span>
                </button>
              </div>

              {/* Contenido según pestaña */}
              {dispatchTab === 'delivery' ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">#1039 • María Gómez</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      deliveryTaken
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {deliveryTaken ? 'En camino' : 'Listo para salida'}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-300 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>Av. Principal Las Mercedes, Edif. Parque, Apto 4-B (Frente a la plaza)</span>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href="https://wa.me/584141234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Cliente</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setDeliveryTaken(!deliveryTaken)}
                      className="flex-1 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-extrabold transition-all text-center"
                    >
                      {deliveryTaken ? '✓ Entrega Completada' : 'Tomar Despacho (En camino)'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">#1040 • Roberto Díaz</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Esperando en local
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-300">
                    Pedido: 1x Torta Selva Negra + 2x Cafés Americanos
                  </div>
                  <button
                    type="button"
                    className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold transition-all text-center"
                  >
                    Marcar como Entregado en Local
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. SECCIÓN DE PRICING CON TOGGLE (HORMOZI VALUE STACK & ZERO RISK)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 max-w-5xl mx-auto border-t border-neutral-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block mb-3">
            Inversión Transparente
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Sin comisiones sobre tus ventas
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            El 100% de lo que vendes entra directo a tus cuentas bancarias. Elige cómo deseas activar tu negocio:
          </p>

          {/* Toggle Interactivo: Mensual vs Trimestral */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800">
            <button
              type="button"
              onClick={() => setBillingPeriod('monthly')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod('quarterly')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                billingPeriod === 'quarterly'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Trimestral</span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-400/30">
                Ahorra 21%
              </span>
            </button>
          </div>
        </div>

        {/* ── CARDS DE PLANES (2 COLUMNAS) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Plan Mensual: 19 / mes */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-7 sm:p-9 flex flex-col justify-between hover:border-neutral-700 transition-all">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Plan Mensual
              </span>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  19
                </span>
                <span className="text-xs sm:text-sm text-neutral-400 font-semibold">/ mes</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mt-3 leading-relaxed">
                Ideal para comercios que prefieren facturación mensual sin compromisos a largo plazo.
              </p>

              <ul className="mt-8 space-y-3 text-xs sm:text-sm text-neutral-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Catálogo en 3 toques ilimitado</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Panel de dueño con gestos swipe</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Subpanel de despacho para cocina y delivery</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Carga asistida de tus primeros 30 productos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>0% comisiones por tus ventas</strong></span>
                </li>
              </ul>
            </div>

            <div className="mt-9">
              <Link
                href="/onboarding"
                className="w-full py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <span>Activar Plan Mensual</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Plan Negocio Pro (Trimestral - Destacado): 15 / mes (facturado 45 cada trimestre) */}
          <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-emerald-950/40 border-2 border-emerald-500/50 rounded-3xl p-7 sm:p-9 flex flex-col justify-between relative shadow-[0_16px_48px_rgba(16,185,129,0.12)]">
            <div className="absolute -top-3.5 right-6 bg-emerald-500 text-neutral-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Más Recomendado
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Plan Negocio Pro (Trimestral)
              </span>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  15
                </span>
                <span className="text-xs sm:text-sm text-neutral-400 font-semibold">/ mes</span>
                <span className="text-xs text-emerald-400 font-bold ml-2">
                  (facturado 45 cada trimestre)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 mt-3 leading-relaxed">
                Todo lo que necesitas para escalar tus pedidos por WhatsApp con máximo margen y automatización total.
              </p>

              <ul className="mt-8 space-y-3 text-xs sm:text-sm text-neutral-200">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Todo lo del Plan Mensual</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ajuste automático de tasa en 1 clic</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Soporte prioritario VIP por chat</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Plantillas de tráfico para historias y estados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>0% comisiones de por vida</strong></span>
                </li>
              </ul>
            </div>

            <div className="mt-9">
              <Link
                href="/onboarding"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-900/40"
              >
                <span>Activar Negocio Pro (14 Días Gratis)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ════ GARANTÍA CERO RIESGO (14 DÍAS INCONDICIONALES) ════ */}
        <div className="mt-14 bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Garantía de Riesgo Cero por 14 Días
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Prueba Taply con tu negocio real durante 14 días. Te cargamos tus primeros 30 productos sin costo. Si no notas un antes y un después en tu velocidad de cierre, cancelas con un mensaje sin ningún compromiso ni preguntas.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sin tarjeta requerida</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Listo en 24 horas</span>
            </span>
            <span className="text-neutral-600">•</span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cancela con 1 clic</span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
