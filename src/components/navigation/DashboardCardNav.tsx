'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Sliders,
  Copy,
  QrCode,
  Crown,
  Eye,
  ExternalLink,
  Home,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { Business } from '@/types';

export interface DashboardCardNavProps {
  business: Business;
  activeTab: 'overview' | 'products' | 'categories' | 'orders' | 'branding';
  setActiveTab: (tab: 'overview' | 'products' | 'categories' | 'orders' | 'branding') => void;
  productsCount: number;
  categoriesCount: number;
  ordersCount: number;
  currentPlanLabel: string;
  onCopyLink: () => void;
  onOpenQR: () => void;
  onOpenPlan: () => void;
  liveStoreUrl: string;
}

export default function DashboardCardNav({
  business,
  activeTab,
  setActiveTab,
  productsCount,
  categoriesCount,
  ordersCount,
  currentPlanLabel,
  onCopyLink,
  onOpenQR,
  onOpenPlan,
  liveStoreUrl,
}: DashboardCardNavProps) {
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

  const navTabs = [
    { id: 'overview' as const, label: 'Resumen', desc: 'Ventas, visitas y analíticas 7d/14d/30d', icon: LayoutDashboard, count: null },
    { id: 'products' as const, label: 'Productos', desc: 'Editar fotos, precios y disponibilidad', icon: Package, count: productsCount },
    { id: 'categories' as const, label: 'Categorías', desc: 'Organizar el catálogo en secciones', icon: FolderTree, count: categoriesCount },
    { id: 'orders' as const, label: 'Pedidos WhatsApp', desc: 'Historial de compras por WhatsApp', icon: ShoppingBag, count: ordersCount },
    { id: 'branding' as const, label: 'Marca y Cobros', desc: 'Logo, datos bancarios y WhatsApp', icon: Sliders, count: null },
  ];

  const handleSelectTab = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setMenuOpen(false);
  };

  // GPU Spring Physics Variants for Dropdown
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -12,
      scale: 0.97,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 420,
        damping: 30,
        mass: 0.8,
        staggerChildren: 0.04,
        delayChildren: 0.02,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      filter: 'blur(4px)',
      transition: {
        duration: 0.18,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 450,
        damping: 32,
      },
    },
  };

  return (
    <>
      {/* ══ ATMOSPHERIC BACKDROP OVERLAY (SOFT DIM & BLUR, ZERO CONTENT JUMP) ══ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="dashboard-nav-backdrop"
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
            className={`relative w-full h-14 sm:h-16 px-3 sm:px-5 rounded-full flex items-center justify-between transition-all duration-300 ease-out select-none border ring-1 ring-black/5 ${
              menuOpen
                ? 'bg-white/95 border-gray-400/90 shadow-[0_16px_40px_rgba(0,0,0,0.12)]'
                : scrolled
                ? 'bg-white/92 backdrop-blur-xl supports-[backdrop-filter]:bg-white/85 border-gray-300/80 shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.04)]'
                : 'bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 border-gray-300/80 shadow-[0_8px_28px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)]'
            }`}
          >
            {/* ── LEFT: Hamburger Menu Button + Store Identity Badge ── */}
            <div className="flex items-center gap-2 sm:gap-2.5 z-20 min-w-0">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-full flex items-center gap-2 transition-all duration-200 active:scale-95 flex-shrink-0 ${
                  menuOpen
                    ? 'bg-gray-950 text-white shadow-xs'
                    : 'bg-gray-900/[0.06] hover:bg-gray-900/[0.12] text-gray-800'
                }`}
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú de tienda'}
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

              {/* Store title badge with live pulse (visible on sm upwards to avoid mobile title collisions) */}
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100/80 border border-gray-200/70 max-w-[180px] md:max-w-[240px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="font-extrabold text-xs text-gray-900 truncate">
                  {business.name}
                </span>
              </div>
            </div>

            {/* ── CENTER: Brand "Taply" + "Dueño" (Optical Center) ── */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-auto">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="font-black text-xl sm:text-2xl lg:text-3xl tracking-tight text-gray-950 hover:opacity-80 transition-opacity select-none"
              >
                Taply
              </Link>
              <span className="text-[10px] font-extrabold text-[#00594C] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 uppercase tracking-wider hidden md:inline-block">
                Dueño
              </span>
            </div>

            {/* ── RIGHT: Plan status & Primary "Ver Catálogo" CTA ── */}
            <div className="flex items-center gap-1.5 sm:gap-2 z-20 whitespace-nowrap">
              {/* Plan Badge (desktop) */}
              <button
                type="button"
                onClick={onOpenPlan}
                className="h-8.5 sm:h-9.5 px-3 rounded-full bg-amber-50/80 text-amber-900 border border-amber-200/80 hover:bg-amber-100/80 active:scale-95 text-xs font-bold hidden lg:inline-flex items-center gap-1.5 transition-all"
                title="Ver estado de tu suscripción"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentPlanLabel}</span>
              </button>

              {/* Primary CTA: Ver Catálogo */}
              <a
                href={liveStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group h-8.5 sm:h-9.5 px-3.5 sm:px-4 rounded-full bg-gradient-to-r from-[#00594C] via-[#006859] to-[#004D41] hover:from-[#006859] hover:to-[#00594C] text-white active:scale-95 text-xs font-extrabold tracking-tight flex items-center gap-1.5 transition-all duration-200 shadow-[0_2px_10px_rgba(0,89,76,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_4px_16px_rgba(0,89,76,0.38)]"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver Catálogo</span>
                <span className="sm:hidden">Tienda</span>
                <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* ══ WORLD-CLASS FLOATING GLASS DROPDOWN (ZERO LAYOUT SHIFT, PURE GPU SPRING) ══ */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="dashboard-floating-dropdown"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ transformOrigin: 'top center' }}
                className="absolute top-full mt-2.5 left-0 right-0 z-50 rounded-3xl bg-white/95 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/92 border border-gray-200/90 shadow-[0_24px_64px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden p-4 sm:p-6 space-y-4"
              >
                {/* 1. SECCIONES DEL PANEL (TABS) */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                      Módulos del Panel
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {business.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {navTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => handleSelectTab(tab.id)}
                          className={`p-3 rounded-2xl text-left transition-all flex items-start gap-3 border active:scale-[0.99] ${
                            isActive
                              ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-500/20 text-[#00594C]'
                              : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isActive
                                ? 'bg-[#00594C] text-white shadow-xs'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold truncate">
                                {tab.label}
                              </span>
                              {tab.count !== null && (
                                <span
                                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                                    isActive
                                      ? 'bg-emerald-200/70 text-emerald-950'
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  {tab.count}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5 font-normal">
                              {tab.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* 2. ACCIONES RÁPIDAS DE TIENDA */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
                      Herramientas de tu Tienda
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Ver en vivo */}
                    <a
                      href={liveStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="p-3 rounded-2xl bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200 text-left transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-[#00594C]" />
                        <span className="text-xs font-bold text-gray-900">Ver Catálogo</span>
                      </div>
                      <p className="text-[10px] text-gray-500">Abre en vivo</p>
                    </a>

                    {/* Copiar enlace */}
                    <button
                      type="button"
                      onClick={() => {
                        onCopyLink();
                        setMenuOpen(false);
                      }}
                      className="p-3 rounded-2xl bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200 text-left transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Copy className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-gray-900">Copiar Link</span>
                      </div>
                      <p className="text-[10px] text-gray-500">Para tu perfil</p>
                    </button>

                    {/* Descargar QR */}
                    <button
                      type="button"
                      onClick={() => {
                        onOpenQR();
                        setMenuOpen(false);
                      }}
                      className="p-3 rounded-2xl bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200 text-left transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <QrCode className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-gray-900">Código QR</span>
                      </div>
                      <p className="text-[10px] text-gray-500">Para mesas</p>
                    </button>

                    {/* Plan Activo */}
                    <button
                      type="button"
                      onClick={() => {
                        onOpenPlan();
                        setMenuOpen(false);
                      }}
                      className="p-3 rounded-2xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/80 text-left transition-all group active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-amber-950">Plan Activo</span>
                      </div>
                      <p className="text-[10px] text-amber-800 font-semibold truncate">
                        {currentPlanLabel}
                      </p>
                    </button>
                  </div>
                </motion.div>

                {/* 3. ENLACES INFERIORES & SALIR */}
                <motion.div
                  variants={itemVariants}
                  className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500"
                >
                  <div className="flex items-center gap-4">
                    <Link
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-gray-900 flex items-center gap-1.5 font-semibold transition-colors"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Inicio Taply</span>
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-gray-900 flex items-center gap-1.5 font-semibold transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SuperAdmin</span>
                    </Link>
                  </div>

                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
