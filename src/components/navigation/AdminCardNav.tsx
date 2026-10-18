'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Layers,
  Store,
  CreditCard,
  Activity,
  Plus,
  RefreshCw,
  Power,
  Sun,
  Moon,
  Home,
  ExternalLink,
} from 'lucide-react';
import ThemeToggle from '@/components/admin/ThemeToggle';

export interface AdminCardNavProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeSection: 'all' | 'stores' | 'payments' | 'timeline';
  setActiveSection: (section: 'all' | 'stores' | 'payments' | 'timeline') => void;
  storesCount: number;
  paymentsCount: number;
  onRefresh: () => void;
  loadingData: boolean;
  onOpenNewPayment: () => void;
  onLogout: () => void;
}

export default function AdminCardNav({
  theme,
  onToggleTheme,
  activeSection,
  setActiveSection,
  storesCount,
  paymentsCount,
  onRefresh,
  loadingData,
  onOpenNewPayment,
  onLogout,
}: AdminCardNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

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

  // Track scroll position for elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const adminModules = [
    { id: 'all' as const, label: 'Consola General', desc: 'MRR, GMV y analíticas SaaS', icon: Layers, count: null },
    { id: 'stores' as const, label: 'Comercios', desc: 'Activar, pausar o auditar comercios', icon: Store, count: storesCount },
    { id: 'payments' as const, label: 'Suscripciones', desc: 'Conciliación de pagos y planes', icon: CreditCard, count: paymentsCount },
    { id: 'timeline' as const, label: 'Auditoría', desc: 'Auditoría de eventos en vivo', icon: Activity, count: null },
  ];

  const handleSelectSection = (secId: typeof activeSection) => {
    setActiveSection(secId);
    setMenuOpen(false);
  };

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
      {/* ══ ATMOSPHERIC BACKDROP OVERLAY ══ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="admin-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-40"
          />
        )}
      </AnimatePresence>

      <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 max-w-7xl mx-auto font-sans">
        <div ref={navRef} className="relative w-full">
          {/* ══ STABLE FLOATING PILL NAVBAR (ALWAYS CONSTANT HEIGHT 56px-64px) ══ */}
          <div
            className={`relative w-full h-14 sm:h-16 px-3 sm:px-5 rounded-full flex items-center justify-between transition-all duration-300 ease-out select-none border ring-1 ring-black/5 ${
              isDark
                ? menuOpen
                  ? 'bg-neutral-900/95 border-neutral-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white'
                  : scrolled
                  ? 'bg-neutral-900/95 backdrop-blur-2xl border-neutral-800/90 shadow-[0_12px_36px_rgba(0,0,0,0.4)] text-white'
                  : 'bg-neutral-900/90 backdrop-blur-xl border-neutral-800/80 shadow-[0_8px_28px_rgba(0,0,0,0.25)] text-white'
                : menuOpen
                ? 'bg-white/95 border-gray-400/90 shadow-[0_16px_40px_rgba(0,0,0,0.12)] text-neutral-900'
                : scrolled
                ? 'bg-white/92 backdrop-blur-xl border-gray-300/80 shadow-[0_12px_36px_rgba(0,0,0,0.12)] text-neutral-900'
                : 'bg-white/90 backdrop-blur-xl border-gray-300/80 shadow-[0_8px_28px_rgba(0,0,0,0.06)] text-neutral-900'
            }`}
          >
            {/* ── LEFT: Hamburger Menu Button & Master Badge ── */}
            <div className="flex items-center gap-2 sm:gap-2.5 z-20 min-w-0">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-full flex items-center gap-2 transition-all duration-200 active:scale-95 flex-shrink-0 ${
                  menuOpen
                    ? isDark
                      ? 'bg-white text-black shadow-xs'
                      : 'bg-gray-950 text-white shadow-xs'
                    : isDark
                    ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                    : 'bg-gray-900/[0.06] hover:bg-gray-900/[0.12] text-gray-800'
                }`}
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú SuperAdmin'}
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

              {/* Master operations badge (visible on sm upwards to avoid brand collisions on mobile) */}
              <div
                className={`hidden sm:flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full border ${
                  isDark
                    ? 'bg-neutral-800/80 border-neutral-700/80'
                    : 'bg-gray-100/80 border-gray-200/80'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="font-extrabold text-xs tracking-tight">SuperAdmin</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Master
                </span>
              </div>
            </div>

            {/* ── CENTER: Brand "Taply" + "Central" (Optical Center) ── */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-auto">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="font-black text-xl sm:text-2xl lg:text-3xl tracking-tight hover:opacity-85 transition-opacity select-none"
              >
                Taply
              </Link>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider hidden md:inline-block ${
                  isDark
                    ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400'
                    : 'bg-emerald-50 border-emerald-200 text-[#00594C]'
                }`}
              >
                Central
              </span>
            </div>

            {/* ── RIGHT: Theme Switch, Refresh, + Registrar Pago, Logout ── */}
            <div className="flex items-center gap-1.5 sm:gap-2 z-20 whitespace-nowrap">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />

              <button
                type="button"
                onClick={onRefresh}
                disabled={loadingData}
                className={`hidden sm:flex p-2 rounded-full border transition-all text-xs items-center gap-1.5 disabled:opacity-40 active:scale-95 ${
                  isDark
                    ? 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600'
                    : 'bg-gray-100 border-gray-200 text-neutral-700 hover:text-black hover:border-gray-300 shadow-2xs'
                }`}
                title="Refrescar métricas en tiempo real"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                <span className="hidden xl:inline font-bold">Actualizar</span>
              </button>

              {/* + Registrar Pago CTA */}
              <button
                type="button"
                onClick={onOpenNewPayment}
                className="h-8.5 sm:h-9.5 px-3 sm:px-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black active:scale-95 text-xs font-black tracking-tight flex items-center gap-1.5 transition-all shadow-[0_2px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_18px_rgba(16,185,129,0.4)]"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Registrar Pago</span>
                <span className="sm:hidden">Pago</span>
              </button>

              {/* Bloquear / Salir */}
              <button
                type="button"
                onClick={onLogout}
                className={`hidden sm:flex p-2 rounded-full border transition-all active:scale-95 ${
                  isDark
                    ? 'bg-neutral-800/80 border-neutral-700 text-red-400 hover:bg-red-950/40 hover:border-red-800'
                    : 'bg-gray-100 border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200'
                }`}
                title="Bloquear consola SuperAdmin"
              >
                <Power className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ══ WORLD-CLASS FLOATING GLASS DROPDOWN (ZERO LAYOUT SHIFT, PURE GPU SPRING) ══ */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="admin-floating-dropdown"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ transformOrigin: 'top center' }}
                className={`absolute top-full mt-2.5 left-0 right-0 z-50 rounded-3xl backdrop-blur-2xl border shadow-[0_24px_64px_rgba(0,0,0,0.3),0_4px_16px_rgba(0,0,0,0.1)] overflow-hidden p-4 sm:p-6 space-y-4 ${
                  isDark
                    ? 'bg-neutral-900/95 border-neutral-800 text-white'
                    : 'bg-white/95 border-gray-200/90 text-neutral-900'
                }`}
              >
                {/* 1. MÓDULOS DE CONTROL MAESTRO */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <span
                      className={`text-[10px] font-extrabold tracking-wider uppercase ${
                        isDark ? 'text-neutral-500' : 'text-gray-400'
                      }`}
                    >
                      Módulos de Control Maestro
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/80">
                      Master Console
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    {adminModules.map((mod) => {
                      const Icon = mod.icon;
                      const isActive = activeSection === mod.id;
                      return (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => handleSelectSection(mod.id)}
                          className={`p-3 rounded-2xl text-left transition-all flex items-start gap-3 border active:scale-[0.99] ${
                            isActive
                              ? isDark
                                ? 'bg-neutral-800 border-emerald-500/50 ring-1 ring-emerald-500/20 text-white'
                                : 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-500/20 text-[#00594C]'
                              : isDark
                              ? 'bg-neutral-950/60 hover:bg-neutral-800 border-neutral-800/80 text-neutral-300'
                              : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isActive
                                ? 'bg-emerald-500 text-black shadow-xs'
                                : isDark
                                ? 'bg-neutral-800 text-neutral-400'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold truncate">
                                {mod.label}
                              </span>
                              {mod.count !== null && (
                                <span
                                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                                    isActive
                                      ? 'bg-emerald-400 text-black'
                                      : isDark
                                      ? 'bg-neutral-800 text-neutral-400'
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  {mod.count}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-[11px] line-clamp-1 mt-0.5 font-normal ${
                                isDark ? 'text-neutral-500' : 'text-gray-500'
                              }`}
                            >
                              {mod.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* 2. OPERACIONES INMEDIATAS */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span
                      className={`text-[10px] font-extrabold tracking-wider uppercase ${
                        isDark ? 'text-neutral-500' : 'text-gray-400'
                      }`}
                    >
                      Operaciones Inmediatas
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Registrar Pago */}
                    <button
                      type="button"
                      onClick={() => {
                        onOpenNewPayment();
                        setMenuOpen(false);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all group active:scale-[0.98] ${
                        isDark
                          ? 'bg-neutral-950/60 hover:bg-neutral-800/80 border-neutral-800 text-neutral-300'
                          : 'bg-gray-50/80 hover:bg-gray-100/80 border-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Plus className="w-4 h-4 text-emerald-400 stroke-[3]" />
                        <span className="text-xs font-bold">Registrar Pago</span>
                      </div>
                      <p className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>
                        Asentar cobro
                      </p>
                    </button>

                    {/* Refrescar Datos */}
                    <button
                      type="button"
                      onClick={() => {
                        onRefresh();
                        setMenuOpen(false);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all group active:scale-[0.98] ${
                        isDark
                          ? 'bg-neutral-950/60 hover:bg-neutral-800/80 border-neutral-800 text-neutral-300'
                          : 'bg-gray-50/80 hover:bg-gray-100/80 border-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <RefreshCw className={`w-4 h-4 text-blue-400 ${loadingData ? 'animate-spin' : ''}`} />
                        <span className="text-xs font-bold">Refrescar</span>
                      </div>
                      <p className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>
                        Base de datos
                      </p>
                    </button>

                    {/* Alternar Tema */}
                    <button
                      type="button"
                      onClick={onToggleTheme}
                      className={`p-3 rounded-2xl border text-left transition-all group active:scale-[0.98] ${
                        isDark
                          ? 'bg-neutral-950/60 hover:bg-neutral-800/80 border-neutral-800 text-neutral-300'
                          : 'bg-gray-50/80 hover:bg-gray-100/80 border-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {isDark ? (
                          <Sun className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Moon className="w-4 h-4 text-purple-600" />
                        )}
                        <span className="text-xs font-bold">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
                      </div>
                      <p className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-gray-500'}`}>
                        Cambiar paleta
                      </p>
                    </button>

                    {/* Bloquear Consola */}
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setMenuOpen(false);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all group active:scale-[0.98] ${
                        isDark
                          ? 'bg-red-950/20 hover:bg-red-950/40 border-red-900/40 text-red-300'
                          : 'bg-red-50/60 hover:bg-red-100/60 border-red-200 text-red-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Power className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-bold text-red-400">Bloquear</span>
                      </div>
                      <p className={`text-[10px] ${isDark ? 'text-red-400/80' : 'text-red-600'}`}>
                        Cerrar sesión
                      </p>
                    </button>
                  </div>
                </motion.div>

                {/* 3. ENLACES INFERIORES */}
                <motion.div
                  variants={itemVariants}
                  className={`pt-2 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
                    isDark ? 'border-neutral-800/80 text-neutral-500' : 'border-gray-100 text-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Link
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className={`hover:opacity-100 flex items-center gap-1.5 font-semibold transition-opacity ${
                        isDark ? 'text-neutral-400' : 'text-gray-700'
                      }`}
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Inicio Taply</span>
                    </Link>

                    <Link
                      href="/dashboard?store=panaderia-la-estrella"
                      onClick={() => setMenuOpen(false)}
                      className={`hover:opacity-100 flex items-center gap-1.5 font-semibold transition-opacity ${
                        isDark ? 'text-neutral-400' : 'text-gray-700'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Panel Dueño</span>
                    </Link>

                    <Link
                      href="/panaderia-la-estrella"
                      target="_blank"
                      onClick={() => setMenuOpen(false)}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-bold transition-colors"
                    >
                      <span>Demo Panadería</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="text-[11px] opacity-60">
                    Taply Master Operations v1.0
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
