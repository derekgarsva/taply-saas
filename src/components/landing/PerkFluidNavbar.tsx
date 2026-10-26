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
            ? 'w-[calc(100%-24px)] sm:w-[calc(100%-48px)] max-w-[1060px] h-[52px] sm:h-[54px] mt-2.5 sm:mt-3.5 px-3.5 sm:px-6 rounded-full border border-[#d2d2c8] bg-[#f5f5eb]/95 backdrop-blur-xl shadow-[0_16px_40px_rgba(20,20,15,0.08),0_2px_6px_rgba(20,20,15,0.04)]'
            : 'w-full max-w-[1380px] h-[72px] sm:h-[76px] mt-0 px-5 sm:px-8 rounded-none border-b border-[#d2d2c8]/60 bg-[#f5f5eb]/85 backdrop-blur-md'
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] rounded-lg bg-[#beff50] text-[#14140f] flex items-center justify-center font-black text-sm tracking-tighter shadow-xs group-hover:scale-105 transition-transform">
            T
          </div>
          <span className="font-extrabold text-[19px] sm:text-[21px] tracking-tight text-[#14140f]">
            Taply
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[13.5px] lg:text-[14px] font-semibold text-[#6e6e64]">
          <a
            href="#solucion"
            className="hover:text-[#14140f] transition-colors"
          >
            Plataforma
          </a>
          <a
            href="#caracteristicas"
            className="hover:text-[#14140f] transition-colors"
          >
            Cómo Funciona
          </a>
          <a
            href="#metricas"
            className="hover:text-[#14140f] transition-colors"
          >
            Impacto
          </a>
          <a
            href="#planes"
            className="hover:text-[#14140f] transition-colors"
          >
            Planes
          </a>
          <a
            href="#preguntas"
            className="hover:text-[#14140f] transition-colors"
          >
            Preguntas
          </a>
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[13px] font-semibold text-[#6e6e64] hover:text-[#14140f] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Acceso Dueño</span>
          </Link>

          <Link
            href="/onboarding"
            className="bg-[#beff50] hover:bg-[#aef038] text-[#14140f] text-[13px] font-bold px-4 py-2 rounded-full transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
          >
            <span>Probar 14 días</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#14140f]" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white/80 border border-[#d2d2c8] text-[#14140f] focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed top-[64px] inset-x-3 bg-[#f5f5eb] border border-[#d2d2c8] rounded-2xl p-5 shadow-2xl md:hidden z-50 flex flex-col gap-3 text-[#14140f]"
          >
            <a
              href="#solucion"
              onClick={() => setMobileOpen(false)}
              className="text-[15px] font-semibold py-1.5 border-b border-[#d2d2c8]/40"
            >
              Plataforma
            </a>
            <a
              href="#caracteristicas"
              onClick={() => setMobileOpen(false)}
              className="text-[15px] font-semibold py-1.5 border-b border-[#d2d2c8]/40"
            >
              Cómo Funciona
            </a>
            <a
              href="#metricas"
              onClick={() => setMobileOpen(false)}
              className="text-[15px] font-semibold py-1.5 border-b border-[#d2d2c8]/40"
            >
              Impacto
            </a>
            <a
              href="#planes"
              onClick={() => setMobileOpen(false)}
              className="text-[15px] font-semibold py-1.5 border-b border-[#d2d2c8]/40"
            >
              Planes
            </a>
            <a
              href="#preguntas"
              onClick={() => setMobileOpen(false)}
              className="text-[15px] font-semibold py-1.5"
            >
              Preguntas
            </a>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/onboarding"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center bg-[#beff50] text-[#14140f] py-3 rounded-xl font-bold text-[14px] shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Activar mi negocio en 24 horas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center bg-white border border-[#d2d2c8] text-[#14140f] py-2.5 rounded-xl font-semibold text-[13.5px]"
              >
                Acceso Dueño
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
