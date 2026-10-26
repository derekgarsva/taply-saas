'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Clock,
  TrendingDown,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Lock,
  MessageCircle,
  Zap,
  ShoppingBag,
} from 'lucide-react';
import PerkFluidNavbar from '@/components/landing/PerkFluidNavbar';
import PerkExpandableCarousel from '@/components/landing/PerkExpandableCarousel';
import PricingAndBento from '@/components/landing/PricingAndBento';
import FaqAndFooter from '@/components/landing/FaqAndFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500 selection:text-neutral-950">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. TOP FLUID NAVBAR (MORPHING A PÍLDORA EN SCROLL - PERK ARCHITECTURE)
      ══════════════════════════════════════════════════════════════════════════ */}
      <PerkFluidNavbar />

      <main>
        {/* ══════════════════════════════════════════════════════════════════════════
            2. SECCIÓN HERO (ALTO CONTRASTE, HORMOZI COPYWRITING & FRICCIÓN CERO)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 max-w-5xl mx-auto text-center relative overflow-hidden">
          {/* Ambient Top Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-600/10 rounded-full blur-[110px] pointer-events-none" />

          <div className="relative z-10">
            {/* Badge Superior */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Para comercios que venden por Instagram y WhatsApp</span>
            </motion.div>

            {/* H1 Principal */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.14] max-w-4xl mx-auto"
            >
              Convierte tu WhatsApp en una caja registradora automática y maneja todo tu negocio desde un solo panel.
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="mt-6 text-sm sm:text-base lg:text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed font-normal"
            >
              Tus clientes compran en 3 toques con cálculo a tasa del día y pago verificado. Tú recibes el pedido listo en chat y controlas inventario, tasas y despacho desde tu panel privado sin tocar una hoja de Excel.
            </motion.p>

            {/* CTAs Principales */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto"
            >
              <Link
                href="/onboarding"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-tight flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/60 transition-all active:scale-95"
              >
                <span>Activar mi negocio en 24 horas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/panaderia-la-estrella"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Ver Demo en Vivo</span>
              </Link>
            </motion.div>

            {/* Micro-copy */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="mt-5 text-[11px] sm:text-xs font-semibold text-neutral-400"
            >
              Sin tarjeta de crédito • Te montamos tus primeros 30 productos gratis • Cero comisiones por venta
            </motion.p>

            {/* ── PREVIEW DESACOPLADO REALISTA DE TELÉFONO MÓVIL (CATÁLOGO EN 3 TOQUES) ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-14 max-w-sm sm:max-w-md mx-auto"
            >
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-left relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black text-white">Catálogo en 3 Toques</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Tasa 124.50
                  </span>
                </div>

                {/* Items reales limpios */}
                <div className="mt-4 space-y-2.5">
                  <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-900 text-amber-400 flex items-center justify-center text-base">
                        🥖
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Pan de Jamón Tradicional</div>
                        <div className="text-[10px] text-neutral-400">1 unidad • Bs. 3.735,00</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-white">30.00</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-900 text-amber-500 flex items-center justify-center text-base">
                        🥐
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Cachito Artesanal de Jamón</div>
                        <div className="text-[10px] text-neutral-400">2 unidades • Bs. 622,50 c/u</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-white">10.00</span>
                  </div>
                </div>

                {/* Toggle visual de entrega */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-bold text-center">
                  <div className="py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                    Retiro en local
                  </div>
                  <div className="py-1.5 rounded-lg text-neutral-500">
                    Delivery
                  </div>
                </div>

                {/* Total limpio */}
                <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div className="text-[11px] text-neutral-400">
                    Total a Pagar (Tasa BCV)
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-white">40.00</span>
                    <span className="text-[10px] text-emerald-400 font-bold ml-1.5">
                      Bs. 4.980,00
                    </span>
                  </div>
                </div>

                <div className="mt-3 w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black text-center flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Deslizar para pedir por WhatsApp</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            3. SECCIÓN EL DOLOR: LA MATEMÁTICA DE LAS VENTAS PERDIDAS
        ══════════════════════════════════════════════════════════════════════════ */}
        <section id="dolor" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-800/80">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>La fuga silenciosa de dinero</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              La matemática de las ventas perdidas en WhatsApp
            </h2>
            <p className="mt-3 text-xs sm:text-base text-neutral-400">
              Vender por mensaje directo parece gratis, pero te está costando miles de dólares al mes en ventas que se enfrían.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tarjeta 1: La regla de los 5 minutos */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-7 flex flex-col justify-between hover:border-neutral-700 transition-all">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 inline-block mb-4">
                  -80% de probabilidad de cierre
                </span>
                <h3 className="text-xl font-black text-white tracking-tight">
                  La regla mortal de los 5 minutos
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                  Si un cliente te escribe pidiendo opciones y tardas más de 5 minutos en responder con fotos y montos, la probabilidad de cerrar la venta cae un 80%.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block font-semibold uppercase">Impacto mensual:</span>
                <span className="text-lg font-black text-red-400 mt-0.5 block">
                  Perder 2 ventas de 15 al día = 900 al mes
                </span>
              </div>
            </div>

            {/* Tarjeta 2: Fuga de margen por tasa manual */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-7 flex flex-col justify-between hover:border-neutral-700 transition-all">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block mb-4">
                  Fuga silenciosa de margen
                </span>
                <h3 className="text-xl font-black text-white tracking-tight">
                  El caos de la tasa manual
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                  Recalcular la tasa a mano en cada mensaje, enviar capturas desactualizadas y discutir montos en bolívares destruye tu margen de ganancia antes de que el dinero entre a tu cuenta.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block font-semibold uppercase">Impacto en caja:</span>
                <span className="text-lg font-black text-amber-400 mt-0.5 block">
                  Pérdida continua por desajuste cambiario
                </span>
              </div>
            </div>

            {/* Tarjeta 3: Horas perdidas y desorden en mostrador */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-7 flex flex-col justify-between hover:border-neutral-700 transition-all">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 inline-block mb-4">
                  +4 horas diarias en chat
                </span>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Desorden en mostrador y notas de voz
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                  Escuchar audios de 2 minutos para anotar un pedido en una libreta de papel, llamar al repartidor y descifrar comprobantes borrosos te convierte en esclavo operativo de tu negocio.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block font-semibold uppercase">Tiempo desperdiciado:</span>
                <span className="text-lg font-black text-neutral-200 mt-0.5 block">
                  Más de 120 horas al mes en chat manual
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            4 & 5. BENTO GRID OPERATIVO, STACK DE VALOR Y PRICING CON TOGGLE
        ══════════════════════════════════════════════════════════════════════════ */}
        <PricingAndBento />

        {/* ══════════════════════════════════════════════════════════════════════════
            6. EXPANDABLE FEATURE CAROUSEL CON STEP PLAYER (PERK-WEB LUXURY ARCHITECTURE)
        ══════════════════════════════════════════════════════════════════════════ */}
        <PerkExpandableCarousel />

        {/* ══════════════════════════════════════════════════════════════════════════
            7. SECCIÓN FAQ Y FOOTER DE CONVERSIÓN CON TODOS LOS ENLACES
        ══════════════════════════════════════════════════════════════════════════ */}
        <FaqAndFooter />
      </main>
    </div>
  );
}
