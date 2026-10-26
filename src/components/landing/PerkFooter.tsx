'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check } from 'lucide-react';

export default function PerkFooter() {
  const [copied, setCopied] = useState(false);
  const supportEmail = 'soporte@taply.app';

  const handleCopyEmail = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(supportEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="border-t border-[#E3E8E5] bg-[#F8FAF9] py-8 pb-12">
      <div className="perk-wrap flex flex-wrap items-center justify-between gap-4 text-[14px] text-[#5B6B63]">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-[26px] h-[26px] rounded-md bg-[#0D7A53] text-white flex items-center justify-center font-bold text-xs">
            T
          </div>
          <span className="text-[#0A3D2C] text-[16px] font-semibold tracking-tight">
            Taply
          </span>
          <span className="text-[13px] text-[#5B6B63] ml-2">
            © {new Date().getFullYear()} Taply. Hecho para comercios en Venezuela.
          </span>
        </div>

        {/* Links Navigation */}
        <nav className="flex flex-wrap items-center gap-5 sm:gap-6 text-[14px]">
          <Link
            href="/panaderia-la-estrella"
            className="text-[#5B6B63] hover:text-[#0D7A53] transition-colors"
          >
            Catálogo Demo
          </Link>
          <Link
            href="/login"
            className="text-[#5B6B63] hover:text-[#0D7A53] transition-colors"
          >
            Acceso Dueño
          </Link>
          <Link
            href="/terminos"
            className="text-[#5B6B63] hover:text-[#0D7A53] transition-colors"
          >
            Términos
          </Link>

          {/* Copyable Email button */}
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 text-[#0D7A53] hover:text-[#16A06E] font-medium transition-colors cursor-pointer"
            title="Copiar email de soporte"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{supportEmail}</span>
              </>
            )}
          </button>
        </nav>
      </div>
    </footer>
  );
}
