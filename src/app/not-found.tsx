'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Store,
  Home,
  MessageCircle,
  Coffee,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import CardNav from '@/components/navigation/CardNav';
import SiteFooter from '@/components/footer/SiteFooter';
import { MagneticButton, G2Button } from '@/components/motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-[#00594C] selection:text-white flex flex-col justify-between">
      {/* ══ STABLE FLOATING CARD NAVBAR ══ */}
      <CardNav />

      {/* ══ MAIN 404 EXPERIENCE ══ */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-20 max-w-4xl mx-auto w-full text-center">
        {/* Ambient background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-gradient-to-tr from-emerald-500/10 via-emerald-100/30 to-amber-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* ── Brand Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#00594C] text-xs font-bold mb-6 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Error 404 • Plato fuera de carta</span>
        </motion.div>

        {/* ── Main Headline ── */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-tight max-w-2xl mx-auto"
        >
          ¡Ups! Este pedido se fue por otra ruta
        </motion.h1>

        {/* ── Descriptive Copy ── */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed"
        >
          El catálogo, producto o página que buscas no existe o fue trasladado. Pero no te preocupes: en Taply siempre tenemos una mesa reservada para ti.
        </motion.p>

        {/* ── Taply Receipt Card Mockup (Brand Artifact) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 mb-8 w-full max-w-md mx-auto bg-white/90 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.02)] text-left relative overflow-hidden"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00594C] via-emerald-400 to-[#00594C]" />

          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00594C] flex items-center justify-center font-black text-xs border border-emerald-100">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-gray-900 block leading-tight">Ticket #404</span>
                <span className="text-[10px] text-gray-400 font-medium">Búsqueda no encontrada</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 font-bold text-[11px]">
              Extraviado 🔎
            </span>
          </div>

          <div className="py-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-gray-700">
              <span className="font-medium">1x Enlace no disponible</span>
              <span className="font-semibold text-gray-400 line-through">$12.00</span>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <span className="font-medium">1x Redirección segura a Taply</span>
              <span className="font-bold text-[#00594C]">Gratis</span>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <span className="font-medium flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-600" />
                <span>Café para pasar el rato</span>
              </span>
              <span className="font-bold text-[#00594C]">Cortesía</span>
            </div>
          </div>

          <div className="pt-3 border-t border-dashed border-gray-200 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total a Pagar</span>
            <span className="text-base font-black text-gray-950">$0.00 • Cero Estrés</span>
          </div>
        </motion.div>

        {/* ── Primary Action CTAs with G2 Continuous Squircles ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none mx-auto"
        >
          <MagneticButton as="div" strength={12} className="w-full sm:w-auto">
            <G2Button href="/" variant="primary">
              <Home className="w-4 h-4" />
              <span>Volver al Inicio</span>
              <ArrowRight className="w-4 h-4" />
            </G2Button>
          </MagneticButton>

          <MagneticButton as="div" strength={12} className="w-full sm:w-auto">
            <G2Button href="/panaderia-la-estrella" variant="secondary">
              <Store className="w-4 h-4 text-[#00594C]" />
              <span>Ver Tienda Demo</span>
            </G2Button>
          </MagneticButton>
        </motion.div>

        {/* ── Quick Exploratory Suggestions ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 }}
          className="mt-14 w-full max-w-2xl text-left"
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-4">
            O si prefieres, explora directamente:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/panaderia-la-estrella"
              className="group p-4 rounded-2xl bg-white border border-gray-200/70 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-950/5 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00594C] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                🥐
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#00594C] transition-colors">
                Panadería La Estrella
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                Demo en vivo con panes artesanales, dulces y café por WhatsApp.
              </p>
            </Link>

            <Link
              href="/burger-station"
              className="group p-4 rounded-2xl bg-white border border-gray-200/70 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-950/5 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00594C] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                🍔
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#00594C] transition-colors">
                Burger Station
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                Demo en vivo con combos, hamburguesas smash y extras.
              </p>
            </Link>

            <Link
              href="/onboarding"
              className="group p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 hover:border-[#00594C] hover:shadow-md hover:shadow-emerald-950/5 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-[#00594C] text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-950 group-hover:text-[#00594C] transition-colors">
                Crear Mi Catálogo
              </h3>
              <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                Crea tu menú digital multilink en 60 segundos sin comisiones.
              </p>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* ══ SITE FOOTER ══ */}
      <SiteFooter />
    </div>
  );
}
