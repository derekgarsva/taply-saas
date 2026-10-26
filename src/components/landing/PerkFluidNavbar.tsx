'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Menu, X, Sparkles } from 'lucide-react';

export default function PerkFluidNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center pointer-events-none transition-all duration-300">
      <div
        className={`pointer-events-auto flex items-center justify-between transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? 'w-[calc(100%-24px)] sm:w-[calc(100%-48px)] max-w-[1060px] h-[52px] sm:h-[54px] mt-2.5 sm:mt-3.5 px-4 sm:px-6 rounded-full border border-neutral-800 bg-neutral-900/95 backdrop-blur-2xl shadow-2xl shadow-black/60'
            : 'w-full max-w-6xl h-16 sm:h-[72px] mt-0 px-4 sm:px-6 rounded-none border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-xl'
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-xl bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center font-black text-sm transition-colors shadow-sm shadow-emerald-950">
            T
          </span>
          <span className="font-black text-xl tracking-tight text-white">
            Taply
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs font-bold text-neutral-400">
          <a href="#dolor" className="hover:text-white transition-colors">
            El Problema
          </a>
          <a href="#operatividad" className="hover:text-white transition-colors">
            Operatividad
          </a>
          <a href="#carrusel" className="hover:text-white transition-colors">
            Flujo
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Planes
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            Preguntas
          </a>
        </nav>

        {/* Desktop Right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-bold text-neutral-400 hover:text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Acceso Dueño</span>
          </Link>

          <Link
            href="/onboarding"
            className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black tracking-tight transition-all active:scale-95 shadow-md shadow-emerald-950/60 flex items-center gap-1.5"
          >
            <span>Activar mi negocio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed top-[68px] inset-x-3 bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-2xl md:hidden z-50 flex flex-col gap-3 text-neutral-200"
          >
            <a
              href="#dolor"
              onClick={() => setMobileOpen(false)}
              className="text-xs font-bold text-neutral-300 py-1.5 border-b border-neutral-800"
            >
              El Problema
            </a>
            <a
              href="#operatividad"
              onClick={() => setMobileOpen(false)}
              className="text-xs font-bold text-neutral-300 py-1.5 border-b border-neutral-800"
            >
              Operatividad
            </a>
            <a
              href="#carrusel"
              onClick={() => setMobileOpen(false)}
              className="text-xs font-bold text-neutral-300 py-1.5 border-b border-neutral-800"
            >
              Flujo Interactivo
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="text-xs font-bold text-neutral-300 py-1.5 border-b border-neutral-800"
            >
              Planes
            </a>
            <a
              href="#faq"
              onClick={() => setMobileOpen(false)}
              className="text-xs font-bold text-neutral-300 py-1.5"
            >
              Preguntas
            </a>

            <div className="pt-2 border-t border-neutral-800 flex flex-col gap-2">
              <Link
                href="/onboarding"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white text-xs font-black text-center flex items-center justify-center gap-1.5"
              >
                <span>Activar mi negocio en 24 horas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-bold text-center"
              >
                Acceso Dueño
              </Link>
              <Link
                href="/panaderia-la-estrella"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2 rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-400 text-xs font-semibold text-center"
              >
                Ver Demo en Vivo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
