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
  Store,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Home,
  LogOut,
  ShieldCheck,
  Check
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
    { id: 'overview' as const, label: 'Resumen', icon: LayoutDashboard, count: null },
    { id: 'products' as const, label: 'Productos', icon: Package, count: productsCount },
    { id: 'categories' as const, label: 'Categorías', icon: FolderTree, count: categoriesCount },
    { id: 'orders' as const, label: 'Pedidos WhatsApp', icon: ShoppingBag, count: ordersCount },
    { id: 'branding' as const, label: 'Marca y Cobros', icon: Sliders, count: null },
  ];

  const handleSelectTab = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 max-w-6xl mx-auto font-sans">
      {/* ══ FLOATING TRANSLUCENT CARD CONTAINER (REACTBITS CARD-NAV ADAPTED FOR DASHBOARD) ══ */}
      <div
        ref={navRef}
        className={`relative w-full bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 border border-gray-300/80 ring-1 ring-black/5 transition-all duration-300 ease-out overflow-hidden ${
          menuOpen
            ? 'rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.16)] border-gray-400/80 bg-white/95'
            : 'rounded-2xl sm:rounded-full'
        } ${
          scrolled
            ? 'shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.04)] bg-white/92'
            : 'shadow-[0_8px_28px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)]'
        }`}
      >
        {/* ── TOP BAR: HAMBURGER, STORE IDENTITY, CENTER BRAND, QUICK ACTIONS ── */}
        <div className="relative h-14 sm:h-16 px-3 sm:px-5 flex items-center justify-between gap-2">
          {/* ── LEFT: Hamburger Menu Button & Store Identity ── */}
          <div className="flex items-center gap-2 sm:gap-3 z-20">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-full flex items-center gap-2 transition-all duration-200 active:scale-95 ${
                menuOpen
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-900/[0.06] hover:bg-gray-900/[0.12] text-gray-800'
              }`}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú de tienda'}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="text-xs font-extrabold hidden sm:inline">Menú</span>
            </button>

            {/* Store title badge with live pulse */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100/80 border border-gray-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="font-extrabold text-xs text-gray-900 truncate max-w-[140px] xl:max-w-[180px]">
                {business.name}
              </span>
              <span className="text-[10px] font-bold text-gray-500">
                /{business.slug}
              </span>
            </div>
          </div>

          {/* ── CENTER: Brand "Taply" + "Panel Dueño" ── */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 pointer-events-auto">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="font-black text-xl sm:text-2xl lg:text-3xl tracking-tight text-gray-950 hover:opacity-85 transition-opacity select-none"
            >
              Taply
            </Link>
            <span className="text-[10px] font-extrabold text-[#00594C] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 uppercase tracking-wider hidden sm:inline-block">
              Dueño
            </span>
          </div>

          {/* ── RIGHT: Quick Actions (Copy, QR, Plan, Live Store) ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 z-20 whitespace-nowrap">
            <button
              type="button"
              onClick={onCopyLink}
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-gray-100/90 text-gray-700 hover:bg-gray-200 active:scale-95 text-xs font-bold hidden sm:inline-flex items-center gap-1.5 transition-all"
              title="Copiar link de la tienda"
            >
              <Copy className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden lg:inline">Copiar Link</span>
            </button>

            <button
              type="button"
              onClick={onOpenQR}
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-gray-100/90 text-gray-700 hover:bg-gray-200 active:scale-95 text-xs font-bold hidden sm:inline-flex items-center gap-1.5 transition-all"
              title="Ver código QR para mesas"
            >
              <QrCode className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden lg:inline">Código QR</span>
            </button>

            <button
              type="button"
              onClick={onOpenPlan}
              className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-amber-50/80 text-amber-900 border border-amber-200/80 hover:bg-amber-100/80 active:scale-95 text-xs font-bold hidden md:inline-flex items-center gap-1.5 transition-all"
              title="Ver estado del plan de suscripción"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden xl:inline">{currentPlanLabel}</span>
              <span className="xl:hidden">Plan</span>
            </button>

            {/* Ver Catálogo (Primary CTA) */}
            <a
              href={liveStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-8.5 sm:h-9.5 px-3 sm:px-4 rounded-full bg-gradient-to-r from-[#00594C] via-[#006859] to-[#004D41] hover:from-[#006859] hover:to-[#00594C] text-white active:scale-95 text-xs font-extrabold tracking-tight flex items-center gap-1.5 transition-all duration-200 shadow-[0_2px_10px_rgba(0,89,76,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_4px_16px_rgba(0,89,76,0.38)]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Catálogo</span>
              <span className="sm:hidden">Tienda</span>
              <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* ── DESKTOP & TABLET SUB-ROW: TABS INTEGRATED IN CARDNAV ── */}
        <div className="hidden md:flex items-center justify-between border-t border-gray-200/70 px-4 py-1.5 bg-gray-50/40">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100/80'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-dashboard-cardnav-pill"
                      className="absolute inset-0 bg-gray-950 rounded-xl shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-gray-200/70 text-gray-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Actualizado en tiempo real</span>
          </div>
        </div>

        {/* ══ EXPANDABLE DRAWER WHEN HAMBURGER OPEN ══ */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-gray-200/80 px-4 sm:px-6 pt-4 pb-5 space-y-4 transform-gpu will-change-transform"
            >
              {/* 1. SECCIONES DEL PANEL (TABS) */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
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
                        className={`p-3 rounded-2xl text-left transition-all flex items-start gap-3 border ${
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
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-extrabold text-xs truncate">
                              {tab.label}
                            </span>
                            {tab.count !== null && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">
                                {tab.count}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-tight truncate">
                            {tab.id === 'overview' && 'Ventas, visitas y analíticas 7d/14d/30d'}
                            {tab.id === 'products' && 'Editar fotos, precios y disponibilidad'}
                            {tab.id === 'categories' && 'Organizar el catálogo en secciones'}
                            {tab.id === 'orders' && 'Historial de compras enviadas a WhatsApp'}
                            {tab.id === 'branding' && 'Logo, datos bancarios y número WhatsApp'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. ACCIONES RÁPIDAS DEL COMERCIO */}
              <div className="pt-2 border-t border-gray-100">
                <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase block mb-2 px-1">
                  Herramientas del Comercio
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href={liveStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/80 border border-gray-200 hover:border-emerald-200 text-left transition-colors flex items-center gap-2 group"
                  >
                    <Eye className="w-4 h-4 text-[#00594C]" />
                    <div className="min-w-0 flex-1">
                      <span className="block font-bold text-xs text-gray-900 group-hover:text-[#00594C]">
                        Ver Catálogo
                      </span>
                      <span className="text-[10px] text-gray-500 truncate block">Abre en vivo</span>
                    </div>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      onCopyLink();
                      setMenuOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                    <div className="min-w-0 flex-1">
                      <span className="block font-bold text-xs text-gray-900">Copiar Link</span>
                      <span className="text-[10px] text-gray-500 truncate block">Para tu perfil</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenQR();
                      setMenuOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors flex items-center gap-2"
                  >
                    <QrCode className="w-4 h-4 text-gray-600" />
                    <div className="min-w-0 flex-1">
                      <span className="block font-bold text-xs text-gray-900">Código QR</span>
                      <span className="text-[10px] text-gray-500 truncate block">Para imprimir</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenPlan();
                      setMenuOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200/80 text-left transition-colors flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4 text-amber-600" />
                    <div className="min-w-0 flex-1">
                      <span className="block font-bold text-xs text-amber-950">Plan Activo</span>
                      <span className="text-[10px] text-amber-700 truncate block">{currentPlanLabel}</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. ENLACES GLOBALES DE TAPLY */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="font-bold text-gray-600 hover:text-gray-950 flex items-center gap-1.5 transition-colors"
                  >
                    <Home className="w-3.5 h-3.5 text-gray-400" />
                    <span>Inicio Taply</span>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="font-bold text-gray-600 hover:text-gray-950 flex items-center gap-1.5 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                    <span>SuperAdmin</span>
                  </Link>
                </div>

                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir del Panel</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
