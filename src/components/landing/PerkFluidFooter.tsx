'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check } from 'lucide-react';

export default function PerkFluidFooter() {
  const [copied, setCopied] = useState(false);
  const email = 'soporte@taply.app';

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="border-t border-[#d2d2c8] bg-[#f5f5eb] py-10 sm:py-14 text-[#6e6e64] text-[13.5px]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#beff50] text-[#14140f] flex items-center justify-center font-black text-xs">
            T
          </div>
          <span className="font-extrabold text-[17px] text-[#14140f] tracking-tight">
            Taply
          </span>
          <span className="text-[12.5px] text-[#6e6e64] ml-2">
            © {new Date().getFullYear()} Taply. Creado para comercios que venden por WhatsApp en Venezuela.
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-7">
          <Link
            href="/panaderia-la-estrella"
            className="hover:text-[#14140f] transition-colors"
          >
            Catálogo Demo
          </Link>
          <Link
            href="/login"
            className="hover:text-[#14140f] transition-colors"
          >
            Acceso Dueño
          </Link>
          <Link
            href="/terminos"
            className="hover:text-[#14140f] transition-colors"
          >
            Términos y Privacidad
          </Link>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#d2d2c8] text-[#14140f] font-semibold text-[12.5px] hover:border-[#14140f] transition-colors"
            title="Copiar email de soporte"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#6e6e64]" />
                <span>{email}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
