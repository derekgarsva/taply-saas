'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Store,
  Flame,
  Lock,
  Layers,
  DollarSign
} from 'lucide-react';

export default function CardNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  // Track scroll position for subtle elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 max-w-6xl mx-auto font-sans">
      {/* ══ FLOATING TRANSLUCENT CARD CONTAINER (REACTBITS CARD-NAV) ══ */}
      <div
        ref={navRef}
        className={`relative w-full bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75 border border-gray-300/80 ring-1 ring-black/5 transition-all duration-300 ease-out overflow-hidden ${
          menuOpen
            ? 'rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.16)] border-gray-400/80 bg-white/95'
            : 'rounded-full'
        } ${
          scrolled
            ? 'shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.04)] bg-white/90'
            : 'shadow-[0_8px_28px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="relative h-14 lg:h-16 px-3.5 sm:px-6 flex items-center justify-between">
          {/* ── LEFT: Hamburger Menu Button ── */}
          <div className="flex items-center gap-2 z-20">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-full flex items-center gap-2 transition-all duration-200 active:scale-95 ${
                menuOpen
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-900/[0.06] hover:bg-gray-900/[0.12] text-gray-800'
              }`}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="text-xs font-extrabold hidden sm:inline">Menú</span>
            </button>
          </div>

          {/* ── CENTER: Brand "Taply" (Centered, no green "T", no "SaaS") ── */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10 pointer-events-auto">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="font-black text-2xl lg:text-3xl tracking-tight text-gray-950 hover:opacity-80 transition-opacity select-none"
            >
              Taply
            </Link>
          </div>

          {/* ── RIGHT: Actions & CTAs ── */}
          <div className="flex items-center gap-2 sm:gap-2.5 z-20 whitespace-nowrap">
            {/* Acceso Dueño (hidden on mobile, visible on desktop/laptop) */}
            <Link
              href="/login"
              className="hidden md:inline-flex text-xs xl:text-[13px] font-bold text-gray-700 hover:text-gray-950 px-3 py-2 rounded-full hover:bg-black/[0.05] transition-colors items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>Acceso Dueño</span>
            </Link>

            {/* Crear Catálogo CTA */}
            <Link
              href="/onboarding"
              className="group relative h-9 sm:h-10 px-3.5 sm:px-5 rounded-full bg-gradient-to-r from-[#00594C] via-[#006859] to-[#004D41] hover:from-[#006859] hover:to-[#00594C] text-white active:scale-95 text-xs xl:text-[13px] font-extrabold tracking-tight flex items-center gap-1.5 transition-all duration-200 shadow-[0_2px_10px_rgba(0,89,76,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_4px_16px_rgba(0,89,76,0.38),inset_0_1px_1px_rgba(255,255,255,0.5)]"
            >
              <span className="hidden sm:inline">Crear Catálogo</span>
              <span className="sm:hidden">Crear</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ══ HAMBURGER EXPANDABLE DRAWER (CONTAINS DEMOS, CARACTERÍSTICAS, PLANES, SOLICITAR ACCESO) ══ */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-gray-200/80 px-4 sm:px-6 pt-4 pb-5 space-y-4 transform-gpu will-change-transform"
            >
              {/* 1. Demos en Vivo Cards */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                    Demos en Vivo
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Listas para probar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Link
                    href="/panaderia-la-estrella"
                    onClick={() => setMenuOpen(false)}
                    className="p-3 rounded-2xl bg-white hover:bg-emerald-50/70 border border-gray-200 hover:border-emerald-300 text-left transition-all shadow-2xs group flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#00594C] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-gray-900 group-hover:text-[#00594C]">
                          Panadería La Estrella 🥐
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-[#00594C]">
                          Demo
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        Repostería artesanal con slider multi-imagen y pedidos directos a WhatsApp.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/burger-station"
                    onClick={() => setMenuOpen(false)}
                    className="p-3 rounded-2xl bg-white hover:bg-red-50/70 border border-gray-200 hover:border-red-300 text-left transition-all shadow-2xs group flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-gray-900 group-hover:text-red-700">
                          Burger Station 🍔
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-red-100 text-red-700">
                          Demo
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        Smash burgers con pago móvil, Zelle y delivery ordenado a WhatsApp.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* 2. Navigation Options: Características, Planes y Solicitar Acceso */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-200/60">
                <a
                  href="/#features"
                  onClick={() => setMenuOpen(false)}
                  className="p-3 rounded-2xl bg-gray-50/80 hover:bg-gray-100 border border-gray-200/60 text-xs font-bold text-gray-800 flex items-center gap-2.5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900 text-xs">Características</span>
                    <span className="block text-[10px] text-gray-500 font-normal">3 toques, QR y multilink</span>
                  </div>
                </a>

                <a
                  href="/#pricing"
                  onClick={() => setMenuOpen(false)}
                  className="p-3 rounded-2xl bg-gray-50/80 hover:bg-gray-100 border border-gray-200/60 text-xs font-bold text-gray-800 flex items-center gap-2.5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900 text-xs">Planes & Precios</span>
                    <span className="block text-[10px] text-gray-500 font-normal">$12 Inicial y $34 Big</span>
                  </div>
                </a>

                <Link
                  href="/solicitar-acceso"
                  onClick={() => setMenuOpen(false)}
                  className="p-3 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-[#00594C] flex items-center gap-2.5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-white border border-emerald-200 flex items-center justify-center text-[#00594C] flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block font-extrabold text-[#00594C] text-xs">Solicitar Acceso</span>
                    <span className="block text-[10px] text-emerald-800 font-normal">Demo con el Fundador</span>
                  </div>
                </Link>
              </div>

              {/* 3. Bottom Row: Acceso Dueño & Info */}
              <div className="pt-2 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full sm:w-auto h-9 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-gray-500" />
                  <span>Panel de Dueño (Iniciar sesión con PIN)</span>
                </Link>

                <p className="text-[11px] text-gray-400 text-center sm:text-right">
                  Taply • Catálogos multilink para vender por WhatsApp
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
