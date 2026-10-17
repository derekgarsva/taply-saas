'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LayoutDashboard,
  Store,
  CreditCard,
  Clock,
  Plus,
  RefreshCw,
  Power,
  Sun,
  Moon,
  ExternalLink,
  Home,
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

  // Track scroll position for subtle elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const adminSections = [
    { id: 'all' as const, label: 'Consola General', icon: LayoutDashboard, count: null },
    { id: 'stores' as const, label: 'Comercios', icon: Store, count: storesCount },
    { id: 'payments' as const, label: 'Suscripciones', icon: CreditCard, count: paymentsCount },
    { id: 'timeline' as const, label: 'Auditoría', icon: Clock, count: null },
  ];

  const handleSelectSection = (sectionId: typeof activeSection) => {
    setActiveSection(sectionId);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 max-w-7xl mx-auto font-sans">
      {/* ══ BESPOKE FLOATING CARD CONTAINER (SLIM SINGLE PILL) ══ */}
      <div
        ref={navRef}
        className={`relative w-full border ring-1 ring-black/5 transition-[border-radius,box-shadow,border-color] duration-250 ease-out overflow-hidden backdrop-blur-2xl ${
          isDark
            ? 'bg-neutral-900/90 border-neutral-800/90 text-white'
            : 'bg-white/90 border-gray-300/80 text-neutral-900'
        } ${
          menuOpen
            ? 'rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)]'
            : 'rounded-full'
        } ${
          scrolled
            ? isDark
              ? 'shadow-[0_12px_36px_rgba(0,0,0,0.4)] bg-neutral-900/95'
              : 'shadow-[0_12px_36px_rgba(0,0,0,0.12)] bg-white/95'
            : 'shadow-[0_8px_28px_rgba(0,0,0,0.08)]'
        }`}
      >
        {/* ── MAIN ROW: EXACT SINGLE-PILL HEIGHT (56px sm:64px) ── */}
        <div className="relative h-14 sm:h-16 px-3 sm:px-5 flex items-center justify-between gap-2">
          {/* ── LEFT: Hamburger Menu Button & Master Badge ── */}
          <div className="flex items-center gap-2 sm:gap-2.5 z-20 min-w-0">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-full flex items-center gap-2 transition-all duration-200 active:scale-95 flex-shrink-0 ${
                menuOpen
                  ? isDark
                    ? 'bg-white text-black shadow-xs'
                    : 'bg-gray-900 text-white shadow-xs'
                  : isDark
                  ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                  : 'bg-gray-900/[0.06] hover:bg-gray-900/[0.12] text-gray-800'
              }`}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú SuperAdmin'}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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

        {/* ══ FLUID 60FPS ACCORDION EXPANDABLE DRAWER ══ */}
        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              key="admin-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: {
                  height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.22, ease: 'easeOut' },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.15, ease: 'easeIn' },
                },
              }}
              className="overflow-hidden"
            >
              <div
                className={`border-t px-4 sm:px-6 pt-4 pb-5 space-y-4 ${
                  isDark ? 'border-neutral-800' : 'border-gray-200/80'
                }`}
              >
                {/* 1. SECCIONES DEL COMANDO SUPERADMIN */}
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span
                      className={`text-[10px] font-extrabold tracking-wider uppercase ${
                        isDark ? 'text-neutral-500' : 'text-gray-400'
                      }`}
                    >
                      Módulos de Control Maestro
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Master Console
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    {adminSections.map((sec) => {
                      const Icon = sec.icon;
                      const isActive = activeSection === sec.id;
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => handleSelectSection(sec.id)}
                          className={`p-3 rounded-2xl text-left transition-all flex items-start gap-3 border ${
                            isActive
                              ? isDark
                                ? 'bg-neutral-800/90 border-emerald-500/50 ring-1 ring-emerald-500/30 text-white'
                                : 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-500/20 text-[#00594C]'
                              : isDark
                              ? 'bg-neutral-900/60 hover:bg-neutral-800/80 border-neutral-800 text-neutral-300'
                              : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isActive
                                ? isDark
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-[#00594C] text-white shadow-xs'
                              : isDark
                              ? 'bg-neutral-800 text-neutral-400'
                              : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-extrabold text-xs truncate">
                                {sec.label}
                              </span>
                              {sec.count !== null && (
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                    isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {sec.count}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-[11px] mt-0.5 leading-tight truncate ${
                                isDark ? 'text-neutral-500' : 'text-gray-500'
                              }`}
                            >
                              {sec.id === 'all' && 'MRR, GMV y analíticas SaaS'}
                              {sec.id === 'stores' && 'Activar, pausar o auditar comercios'}
                              {sec.id === 'payments' && 'Conciliación de pagos y planes'}
                              {sec.id === 'timeline' && 'Auditoría de eventos en vivo'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. OPERACIONES INMEDIATAS */}
                <div
                  className={`pt-2 border-t ${
                    isDark ? 'border-neutral-800' : 'border-gray-100'
                  }`}
                >
                  <span
                    className={`text-[10px] font-extrabold tracking-wider uppercase block mb-2 px-1 ${
                      isDark ? 'text-neutral-500' : 'text-gray-400'
                    }`}
                  >
                    Operaciones Inmediatas
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenNewPayment();
                        setMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-colors flex items-center gap-2 ${
                        isDark
                          ? 'bg-neutral-800/60 hover:bg-neutral-800 border-neutral-700 text-white'
                          : 'bg-gray-50 hover:bg-emerald-50/80 border-gray-200 text-gray-900'
                      }`}
                    >
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <div className="min-w-0 flex-1">
                        <span className="block font-bold text-xs truncate">Registrar Pago</span>
                        <span className={`text-[10px] truncate block ${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>
                          Asentar cobro
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onRefresh();
                        setMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-colors flex items-center gap-2 ${
                        isDark
                          ? 'bg-neutral-800/60 hover:bg-neutral-800 border-neutral-700 text-white'
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
                      }`}
                    >
                      <RefreshCw className={`w-4 h-4 text-sky-400 ${loadingData ? 'animate-spin' : ''}`} />
                      <div className="min-w-0 flex-1">
                        <span className="block font-bold text-xs truncate">Refrescar</span>
                        <span className={`text-[10px] truncate block ${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>
                          Base de datos
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={onToggleTheme}
                      className={`p-2.5 rounded-xl border text-left transition-colors flex items-center gap-2 ${
                        isDark
                          ? 'bg-neutral-800/60 hover:bg-neutral-800 border-neutral-700 text-white'
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900'
                      }`}
                    >
                      {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                      <div className="min-w-0 flex-1">
                        <span className="block font-bold text-xs truncate">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
                        <span className={`text-[10px] truncate block ${isDark ? 'text-neutral-400' : 'text-gray-500'}`}>
                          Cambiar paleta
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-colors flex items-center gap-2 ${
                        isDark
                          ? 'bg-red-950/20 hover:bg-red-950/40 border-red-900/60 text-red-400'
                          : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      <div className="min-w-0 flex-1">
                        <span className="block font-bold text-xs truncate">Bloquear</span>
                        <span className={`text-[10px] truncate block ${isDark ? 'text-red-400/70' : 'text-red-500'}`}>
                          Cerrar sesión
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 3. ENLACES GLOBALES */}
                <div
                  className={`pt-2 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
                    isDark ? 'border-neutral-800' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Link
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className={`font-bold flex items-center gap-1.5 transition-colors ${
                        isDark ? 'text-neutral-400 hover:text-white' : 'text-gray-600 hover:text-gray-950'
                      }`}
                    >
                      <Home className="w-3.5 h-3.5 opacity-60" />
                      <span>Inicio Taply</span>
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className={`font-bold flex items-center gap-1.5 transition-colors ${
                        isDark ? 'text-neutral-400 hover:text-white' : 'text-gray-600 hover:text-gray-950'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5 opacity-60" />
                      <span>Panel Dueño</span>
                    </Link>

                    <Link
                      href="/panaderia-la-estrella"
                      target="_blank"
                      onClick={() => setMenuOpen(false)}
                      className={`font-bold flex items-center gap-1.5 transition-colors ${
                        isDark ? 'text-emerald-400 hover:underline' : 'text-[#00594C] hover:underline'
                      }`}
                    >
                      <span>Demo Panadería</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <span className={`text-[11px] ${isDark ? 'text-neutral-600' : 'text-gray-400'}`}>
                    Taply Master Operations v1.0
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
