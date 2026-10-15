'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Store,
  Flame,
  ShieldCheck,
  Lock,
  ChevronDown,
  Layers,
  DollarSign,
  Smartphone
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from './navigation-menu';

export default function CardNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full px-3 sm:px-6 max-w-6xl mx-auto font-sans transition-all">
      {/* ══ FLOATING CARD CONTAINER (REACTBITS CARD-NAV ARCHITECTURE) ══ */}
      <div
        className={`relative w-full rounded-2xl sm:rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 transition-all duration-300 ${
          scrolled ? 'shadow-md shadow-black/5 border-gray-300/80' : 'shadow-xs'
        }`}
      >
        <div className="h-14 sm:h-16 px-3.5 sm:px-6 flex items-center justify-between gap-2">
          {/* ── Brand Logo ── */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            <span className="w-9 h-9 rounded-xl sm:rounded-2xl bg-[#00594C] text-white flex items-center justify-center font-extrabold text-base shadow-sm group-hover:scale-105 transition-transform">
              T
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-gray-950 leading-none">
                Taply
              </span>
              <span className="text-[9px] font-bold tracking-wider text-[#00594C] uppercase leading-none mt-0.5">
                SaaS
              </span>
            </div>
          </Link>

          {/* ── Desktop Navigation Menu with Sliding Pill & Popover (Kobra / Base UI) ── */}
          <nav className="hidden md:flex items-center justify-center flex-1 mx-4">
            <NavigationMenu align="center">
              <NavigationMenuList>
                {/* 1. Demos Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Demos en Vivo</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-2 p-2 w-[340px]">
                      <NavigationMenuLink
                        href="/panaderia-la-estrella"
                        className="flex flex-col p-3 rounded-xl hover:bg-emerald-50/70 transition-colors group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="p-1.5 rounded-lg bg-emerald-100 text-[#00594C]">
                            <Store className="w-4 h-4" />
                          </span>
                          <span className="font-bold text-xs text-gray-900 group-hover:text-[#00594C]">
                            Panadería La Estrella
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2">
                          Catálogo de repostería con pedidos rápidos por WhatsApp.
                        </p>
                      </NavigationMenuLink>

                      <NavigationMenuLink
                        href="/burger-station"
                        className="flex flex-col p-3 rounded-xl hover:bg-red-50/70 transition-colors group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="p-1.5 rounded-lg bg-red-100 text-red-600">
                            <Flame className="w-4 h-4" />
                          </span>
                          <span className="font-bold text-xs text-gray-900 group-hover:text-red-700">
                            Burger Station 🍔
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2">
                          Smash burgers con pago móvil, Zelle y delivery directo.
                        </p>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 2. Características */}
                <NavigationMenuItem>
                  <NavigationMenuLink href="#features">
                    Características
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* 3. Precios */}
                <NavigationMenuItem>
                  <NavigationMenuLink href="#pricing">
                    Planes & Precios
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* 4. Solicitar Acceso */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/solicitar-acceso"
                    className="text-[#00594C] font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#00594C]" />
                    <span>Solicitar Acceso</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* ── Desktop CTAs ── */}
          <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
            <Link
              href="/login"
              className="text-xs font-bold text-gray-700 hover:text-gray-950 px-3.5 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              <span>Acceso Dueño</span>
            </Link>

            <Link
              href="/onboarding"
              className="h-10 px-4.5 rounded-full bg-[#00594C] hover:bg-[#00463C] text-white active:scale-95 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>Crear Catálogo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ── Mobile Right Actions (Compact & Never Overflowing) ── */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/onboarding"
              className="h-9 px-3.5 rounded-full bg-[#00594C] text-white active:scale-95 text-[11px] font-extrabold flex items-center gap-1 shadow-xs"
            >
              <span>Crear</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú de navegación"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 flex items-center justify-center transition-colors"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ══ MOBILE EXPANDABLE CARD MENU (CLEAN, FLUID, RESPONSIVE) ══ */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: 'easeInOut' }}
              className="overflow-hidden md:hidden border-t border-gray-100 px-4 pt-3 pb-5 space-y-3"
            >
              {/* Demos Quick Cards */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase block pl-1">
                  Demos en Vivo
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/panaderia-la-estrella"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/60 border border-gray-100 text-left transition-colors"
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Store className="w-3.5 h-3.5 text-[#00594C]" />
                      <span className="font-bold text-[11px] text-gray-900 truncate">Panadería</span>
                    </div>
                    <span className="text-[10px] text-gray-500 block">La Estrella</span>
                  </Link>

                  <Link
                    href="/burger-station"
                    onClick={() => setMobileOpen(false)}
                    className="p-2.5 rounded-xl bg-gray-50 hover:bg-red-50/60 border border-gray-100 text-left transition-colors"
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Flame className="w-3.5 h-3.5 text-red-600" />
                      <span className="font-bold text-[11px] text-gray-900 truncate">Burger Station</span>
                    </div>
                    <span className="text-[10px] text-gray-500 block">Hamburguesas</span>
                  </Link>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
                <a
                  href="#features"
                  onClick={() => setMobileOpen(false)}
                  className="p-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5 text-gray-400" />
                  <span>Características</span>
                </a>

                <a
                  href="#pricing"
                  onClick={() => setMobileOpen(false)}
                  className="p-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                  <span>Planes</span>
                </a>
              </div>

              {/* Prominent Action Links */}
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
                  className="w-full h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-gray-500" />
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
