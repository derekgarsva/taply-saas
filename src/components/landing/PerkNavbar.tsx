'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';

export default function PerkNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full relative z-50 bg-[#F8FAF9]/90 backdrop-blur-md border-b border-[#E3E8E5]/80">
      <div className="perk-wrap flex items-center justify-between py-[18px]">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-[34px] height-[34px] h-[34px] rounded-lg bg-[#0D7A53] group-hover:bg-[#16A06E] transition-colors flex items-center justify-center text-white font-bold text-base shadow-sm">
            T
          </div>
          <span className="text-[#0A3D2C] text-[22px] font-semibold tracking-[-0.02em]">
            Taply
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-[#16201C]">
          <a
            href="#caracteristicas"
            className="text-[#5B6B63] hover:text-[#0D7A53] transition-colors"
          >
            Características
          </a>
          <a
            href="#como-funciona"
            className="text-[#5B6B63] hover:text-[#0D7A53] transition-colors"
          >
            Cómo Funciona
          </a>
          <a
            href="#planes"
            className="text-[#5B6B63] hover:text-[#0D7A53] transition-colors"
          >
            Planes
          </a>
          <a
            href="#preguntas"
            className="text-[#5B6B63] hover:text-[#0D7A53] transition-colors"
          >
            Preguntas
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[14.5px] font-medium text-[#5B6B63] hover:text-[#0A3D2C] px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Acceso Dueño</span>
          </Link>

          <Link
            href="/onboarding"
            className="bg-[#0D7A53] hover:bg-[#16A06E] text-white text-[14.5px] font-medium px-4 py-2.5 rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
          >
            <span>Probar 14 días gratis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Burger Toggle (exact Perk animation) */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 p-2 rounded-lg text-[#0A3D2C] hover:bg-[#E4F4EC] transition-colors focus:outline-none"
          aria-label="Abrir menú"
        >
          <span
            className={`w-5 h-[2px] bg-[#0A3D2C] rounded-full transition-transform duration-200 ${
              mobileOpen ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-[#0A3D2C] rounded-full transition-opacity duration-200 ${
              mobileOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-[#0A3D2C] rounded-full transition-transform duration-200 ${
              mobileOpen ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-[#E3E8E5] bg-[#F8FAF9] px-6 py-4 space-y-3"
          >
            <a
              href="#caracteristicas"
              onClick={() => setMobileOpen(false)}
              className="block text-[15px] font-medium text-[#16201C] py-1.5 hover:text-[#0D7A53]"
            >
              Características
            </a>
            <a
              href="#como-funciona"
              onClick={() => setMobileOpen(false)}
              className="block text-[15px] font-medium text-[#16201C] py-1.5 hover:text-[#0D7A53]"
            >
              Cómo Funciona
            </a>
            <a
              href="#planes"
              onClick={() => setMobileOpen(false)}
              className="block text-[15px] font-medium text-[#16201C] py-1.5 hover:text-[#0D7A53]"
            >
              Planes
            </a>
            <a
              href="#preguntas"
              onClick={() => setMobileOpen(false)}
              className="block text-[15px] font-medium text-[#16201C] py-1.5 hover:text-[#0D7A53]"
            >
              Preguntas
            </a>

            <div className="pt-3 border-t border-[#E3E8E5] flex flex-col gap-2.5">
              <Link
                href="/onboarding"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center bg-[#0D7A53] text-white py-3 rounded-lg font-medium text-[15px] shadow-sm"
              >
                Probar 14 días gratis
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center bg-white border border-[#E3E8E5] text-[#0A3D2C] py-2.5 rounded-lg font-medium text-[14px]"
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
