'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Store,
  Flame,
  Layers,
  DollarSign,
  Sparkles,
  Lock,
  ArrowRight,
  ExternalLink,
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

  // Track scroll position for elevated appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ultra-fluid, soft Apple-grade animation variants
  const EASE_APPLE: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -8,
      scale: 0.985,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.38,
        ease: EASE_APPLE,
        staggerChildren: 0.035,
        delayChildren: 0.02,
      },
    },
    exit: {
      opacity: 0,
      y: -6,
      scale: 0.99,
      transition: {
        duration: 0.22,
        ease: EASE_APPLE,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: EASE_APPLE,
      },
    },
  };

  return (
    <>
      {/* ══ ATMOSPHERIC BACKDROP OVERLAY (SOFT DIM & BLUR, ZERO CONTENT JUMP) ══ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="cardnav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/25 backdrop-blur-[6px] z-40"
          />
        )}
      </AnimatePresence>

      <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 max-w-6xl mx-auto font-sans">
        <div ref={navRef} className="relative w-full">
          {/* ══ STABLE FLOATING PILL NAVBAR (ALWAYS CONSTANT HEIGHT 56px-64px) ══ */}
          <div
            className={`relative w-full h-14 sm:h-16 px-3.5 sm:px-6 rounded-full flex items-center justify-between transition-all duration-300 ease-out select-none border ring-1 ring-black/5 ${
              menuOpen
                ? 'bg-white/95 border-gray-400/90 shadow-[0_16px_40px_rgba(0,0,0,0.12)]'
                : scrolled
                ? 'bg-white/92 backdrop-blur-xl supports-[backdrop-filter]:bg-white/85 border-gray-300/80 shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.04)]'
                : 'bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 border-gray-300/80 shadow-[0_8px_28px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)]'
            }`}
          >
            {/* ── LEFT: Hamburger Menu Button with Fluid Icon Morph ── */}
            <div className="flex items-center gap-2 z-20">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-full flex items-center gap-2 transition-all duration-200 active:scale-95 ${
                  menuOpen
                    ? 'bg-gray-950 text-white shadow-xs'
                    : 'bg-gray-900/[0.06] hover:bg-gray-900/[0.12] text-gray-800'
                }`}
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: menuOpen ? 90 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  className="flex items-center justify-center"
                >
                  {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.div>
                <span className="text-xs font-extrabold hidden sm:inline">Menú</span>
              </button>
            </div>

            {/* ── CENTER: Brand "Taply" (Centered Optical Baseline) ── */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10 pointer-events-auto">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="font-black text-2xl lg:text-3xl tracking-tight text-gray-950 hover:opacity-80 transition-opacity select-none"
              >
                Taply
              </Link>
            </div>

            {/* ── RIGHT: Actions & Primary CTA ── */}
            <div className="flex items-center gap-2 sm:gap-2.5 z-20 whitespace-nowrap">
              {/* Acceso Dueño (hidden on mobile, visible on tablet/desktop) */}
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

          {/* ══ WORLD-CLASS FLOATING GLASS DROPDOWN (ZERO LAYOUT SHIFT, PURE GPU SPRING) ══ */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="landing-floating-dropdown"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ transformOrigin: 'top center' }}
                className="absolute top-full mt-2.5 left-0 right-0 z-50 rounded-3xl bg-white/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/92 border border-gray-200/90 shadow-[0_24px_64px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden p-4 sm:p-6 space-y-4"
              >
                {/* 1. Demos en Vivo Cards */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                      Demos en Vivo
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Listas para probar
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Link
                      href="/panaderia-la-estrella"
                      onClick={() => setMenuOpen(false)}
                      className="p-3.5 rounded-2xl bg-gray-50/80 hover:bg-emerald-50/70 border border-gray-200/80 hover:border-emerald-300 text-left transition-all shadow-2xs group flex items-start gap-3 active:scale-[0.99]"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-[#00594C] flex items-center justify-center flex-shrink-0 group-hover:bg-[#00594C] group-hover:text-white transition-colors">
                        <Store className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-gray-900 group-hover:text-[#00594C] transition-colors truncate">
                            Panadería La Estrella 🥐
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-100/90 text-emerald-800">
                            Demo
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                          Repostería artesanal con slider multi-imagen y pedidos directos a WhatsApp.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/burger-station"
                      onClick={() => setMenuOpen(false)}
                      className="p-3.5 rounded-2xl bg-gray-50/80 hover:bg-rose-50/70 border border-gray-200/80 hover:border-rose-300 text-left transition-all shadow-2xs group flex items-start gap-3 active:scale-[0.99]"
                    >
                      <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-gray-900 group-hover:text-rose-700 transition-colors truncate">
                            Burger Station 🍔
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-rose-100/90 text-rose-800">
                            Demo
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                          Smash burgers con pago móvil, Zelle y delivery ordenado a WhatsApp.
                        </p>
                      </div>
                    </Link>
                  </div>
                </motion.div>

                {/* 2. Navegación Principal de la Landing */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <a
                    href="#caracteristicas"
                    onClick={() => setMenuOpen(false)}
                    className="p-3 rounded-2xl bg-white hover:bg-gray-100 border border-gray-200 text-left transition-all flex items-center gap-2.5 group active:scale-[0.99]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-700">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">Características</div>
                      <div className="text-[10px] text-gray-500">3 toques, QR y multilink</div>
                    </div>
                  </a>

                  <a
                    href="#planes"
                    onClick={() => setMenuOpen(false)}
                    className="p-3 rounded-2xl bg-white hover:bg-gray-100 border border-gray-200 text-left transition-all flex items-center gap-2.5 group active:scale-[0.99]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-700">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">Planes & Precios</div>
                      <div className="text-[10px] text-gray-500">$12 Inicial y $34 Big</div>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/584120000000?text=Hola,%20quiero%20solicitar%20acceso%20a%20Taply"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 text-left transition-all flex items-center gap-2.5 group active:scale-[0.99]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00594C] text-white flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#00594C]">Solicitar Acceso</div>
                      <div className="text-[10px] text-emerald-800">Demo con el Fundador</div>
                    </div>
                  </a>
                </motion.div>

                {/* 3. Panel de Dueño & Footer Bar */}
                <motion.div
                  variants={itemVariants}
                  className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500"
                >
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Lock className="w-3.5 h-3.5 text-gray-600" />
                    <span>Panel de Dueño (Iniciar sesión con PIN)</span>
                  </Link>

                  <div className="text-[11px] text-gray-400 text-center sm:text-right">
                    Taply • Catálogos multilink para vender por WhatsApp
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
