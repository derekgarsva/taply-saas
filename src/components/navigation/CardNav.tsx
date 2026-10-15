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
  ChevronDown,
  Layers,
  DollarSign,
  CheckCircle2
} from 'lucide-react';

export default function CardNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [demosOpen, setDemosOpen] = useState(false);
  const demosTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track scroll position for subtle elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu automatically if viewport expands to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDemosEnter = () => {
    if (demosTimeoutRef.current) clearTimeout(demosTimeoutRef.current);
    setDemosOpen(true);
  };

  const handleDemosLeave = () => {
    demosTimeoutRef.current = setTimeout(() => {
      setDemosOpen(false);
    }, 150);
  };

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 max-w-6xl mx-auto font-sans">
      {/* ══ FLOATING TRANSLUCENT CARD CONTAINER (REACTBITS CARD-NAV) ══ */}
      <div
        className={`relative w-full rounded-2xl lg:rounded-full bg-white/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/65 border border-gray-300/80 ring-1 ring-black/5 transition-all duration-200 ${
          scrolled
            ? 'shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.04)] border-gray-400/80 bg-white/85'
            : 'shadow-[0_8px_28px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="h-14 lg:h-16 px-3.5 sm:px-6 flex items-center justify-between gap-3">
          {/* ── Brand Logo (High Contrast) ── */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <span className="w-9 h-9 rounded-xl lg:rounded-2xl bg-[#00594C] text-white flex items-center justify-center font-extrabold text-base shadow-sm group-hover:scale-105 transition-transform">
              T
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg lg:text-xl tracking-tight text-gray-950 leading-none">
                Taply
              </span>
              <span className="text-[9px] font-black tracking-widest text-[#00594C] uppercase leading-none mt-0.5">
                SaaS
              </span>
            </div>
          </Link>

          {/* ── Desktop & Laptop Navigation Menu (Optimized for 1024px - 1440px) ── */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-2 xl:mx-6">
            <ul className="flex items-center gap-1 xl:gap-2 list-none p-0 m-0">
              {/* 1. Demos Dropdown with Stable Relative Positioning */}
              <li
                className="relative"
                onMouseEnter={handleDemosEnter}
                onMouseLeave={handleDemosLeave}
              >
                <button
                  type="button"
                  onClick={() => setDemosOpen(!demosOpen)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs xl:text-sm font-bold transition-all ${
                    demosOpen
                      ? 'bg-gray-900/10 text-gray-950 shadow-2xs'
                      : 'text-gray-700 hover:text-gray-950 hover:bg-gray-900/[0.05]'
                  }`}
                >
                  <span>Demos en Vivo</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                      demosOpen ? 'rotate-180 text-gray-900' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu Popover */}
                <AnimatePresence>
                  {demosOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.96 }}
                      transition={{ duration: 0.16, ease: 'easeOut' }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 p-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 ring-1 ring-black/5 z-50 transform-gpu will-change-transform"
                    >
                      <div className="space-y-1">
                        <Link
                          href="/panaderia-la-estrella"
                          onClick={() => setDemosOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#00594C] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Store className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-gray-900 group-hover:text-[#00594C]">
                                Panadería La Estrella
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-[#00594C]">
                                Demo
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                              Repostería con slider de pedidos y métodos de pago directo.
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/burger-station"
                          onClick={() => setDemosOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-red-50/80 transition-colors group text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
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
                            <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                              Smash burgers con pago móvil, Zelle y delivery por WhatsApp.
                            </p>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* 2. Características */}
              <li>
                <a
                  href="/#features"
                  className="px-3 py-1.5 rounded-full text-xs xl:text-sm font-bold text-gray-700 hover:text-gray-950 hover:bg-gray-900/[0.05] transition-colors"
                >
                  Características
                </a>
              </li>

              {/* 3. Precios */}
              <li>
                <a
                  href="/#pricing"
                  className="px-3 py-1.5 rounded-full text-xs xl:text-sm font-bold text-gray-700 hover:text-gray-950 hover:bg-gray-900/[0.05] transition-colors"
                >
                  Planes & Precios
                </a>
              </li>

              {/* 4. Solicitar Acceso */}
              <li>
                <Link
                  href="/solicitar-acceso"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs xl:text-sm font-bold text-[#00594C] hover:bg-emerald-50 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00594C]" />
                  <span>Solicitar Acceso</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* ── Desktop & Laptop CTAs (Luxurious, High-Contrast & Perfectly Sized) ── */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0 whitespace-nowrap">
            <Link
              href="/login"
              className="text-xs xl:text-[13px] font-bold text-gray-700 hover:text-gray-950 px-3 py-2 rounded-full hover:bg-black/[0.05] transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>Acceso Dueño</span>
            </Link>

            <Link
              href="/onboarding"
              className="group relative h-10 px-5 rounded-full bg-gradient-to-r from-[#00594C] via-[#006859] to-[#004D41] hover:from-[#006859] hover:to-[#00594C] text-white active:scale-95 text-xs xl:text-[13px] font-extrabold tracking-tight flex items-center gap-2 transition-all duration-200 shadow-[0_2px_10px_rgba(0,89,76,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_4px_16px_rgba(0,89,76,0.38),inset_0_1px_1px_rgba(255,255,255,0.5)]"
            >
              <span>Crear Catálogo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
            </Link>
          </div>

          {/* ── Mobile & Tablet Right Controls ── */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/onboarding"
              className="h-9 px-3 rounded-full bg-[#00594C] text-white active:scale-95 text-[11px] font-extrabold flex items-center gap-1 shadow-xs"
            >
              <span>Crear</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
              className="w-9 h-9 rounded-full bg-gray-900/[0.06] hover:bg-gray-900/[0.1] active:scale-95 text-gray-900 flex items-center justify-center transition-transform"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ══ MOBILE EXPANDABLE MENU (INSTANT 60FPS OPENING, ZERO LAG) ══ */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="lg:hidden border-t border-gray-200/80 px-4 pt-3 pb-5 space-y-3 transform-gpu will-change-transform"
            >
              {/* Demos Quick Cards */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase block pl-1">
                  Demos en Vivo
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/panaderia-la-estrella"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-white/90 hover:bg-emerald-50/80 border border-gray-200 text-left transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Store className="w-3.5 h-3.5 text-[#00594C]" />
                      <span className="font-bold text-[11px] text-gray-900 truncate">Panadería</span>
                    </div>
                    <span className="text-[10px] text-gray-500 block truncate">La Estrella</span>
                  </Link>

                  <Link
                    href="/burger-station"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-white/90 hover:bg-red-50/80 border border-gray-200 text-left transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Flame className="w-3.5 h-3.5 text-red-600" />
                      <span className="font-bold text-[11px] text-gray-900 truncate">Burger Station</span>
                    </div>
                    <span className="text-[10px] text-gray-500 block truncate">Hamburguesas</span>
                  </Link>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200/60">
                <a
                  href="/#features"
                  onClick={() => setMobileOpen(false)}
                  className="p-2.5 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5 text-gray-500" />
                  <span>Características</span>
                </a>

                <a
                  href="/#pricing"
                  onClick={() => setMobileOpen(false)}
                  className="p-2.5 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-100 flex items-center gap-2"
                >
                  <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                  <span>Planes</span>
                </a>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/solicitar-acceso"
                  onClick={() => setMobileOpen(false)}
                  className="w-full h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#00594C] font-extrabold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Solicitar Acceso Demo con el Fundador</span>
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-gray-600" />
                  <span>Panel de Dueño (Iniciar Sesión)</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
