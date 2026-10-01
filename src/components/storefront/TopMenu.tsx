'use client';

import React, { useState } from 'react';
import { MoreHorizontal, Sparkles, Info, Link as LinkIcon, Lock, QrCode } from 'lucide-react';

interface TopMenuProps {
  onSelect: (action: 'taply' | 'about' | 'copy' | 'admin' | 'qr') => void;
  accentColor?: string;
}

export default function TopMenu({ onSelect, accentColor = '#00594C' }: TopMenuProps) {
  const [open, setOpen] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(prev => !prev);
  };

  const handleItem = (e: React.MouseEvent, action: 'taply' | 'about' | 'copy' | 'admin' | 'qr') => {
    e.stopPropagation();
    setOpen(false);
    onSelect(action);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="w-[38px] h-[38px] rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-black/5 flex items-center justify-center text-gray-800 active:scale-95 transition-transform"
      >
        <MoreHorizontal className="w-5 h-5 text-gray-800" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <div className="popover-card" role="menu">
          <button
            type="button"
            className="popover-item"
            onClick={(e) => handleItem(e, 'qr')}
          >
            <QrCode className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
            <span>Código QR del local</span>
          </button>

          <button
            type="button"
            className="popover-item"
            onClick={(e) => handleItem(e, 'copy')}
          >
            <LinkIcon className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
            <span>Copiar enlace</span>
          </button>

          <button
            type="button"
            className="popover-item"
            onClick={(e) => handleItem(e, 'taply')}
          >
            <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
            <span>Hecho con Taply</span>
          </button>

          <button
            type="button"
            className="popover-item"
            onClick={(e) => handleItem(e, 'about')}
          >
            <Info className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
            <span>¿Cómo funciona?</span>
          </button>

          <div className="h-px bg-gray-100 my-1" />

          <button
            type="button"
            className="popover-item text-emerald-900 bg-emerald-50/50 hover:bg-emerald-50"
            onClick={(e) => handleItem(e, 'admin')}
          >
            <Lock className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
            <span>Panel Dueño</span>
          </button>
        </div>
      )}
    </div>
  );
}
