'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Power, ExternalLink, DollarSign, Store, ChevronLeft } from 'lucide-react';

interface SwipeActionRowProps {
  children: React.ReactNode;
  isActive: boolean;
  onToggleActive: () => void;
  onViewStore: () => void;
  onRecordPayment: () => void;
  theme?: 'dark' | 'light';
  disabled?: boolean;
}

export default function SwipeActionRow({
  children,
  isActive,
  onToggleActive,
  onViewStore,
  onRecordPayment,
  theme = 'dark',
  disabled = false,
}: SwipeActionRowProps) {
  const isDark = theme === 'dark';
  const x = useMotionValue(0);
  const [isOpen, setIsOpen] = useState(false);

  // Background action buttons opacity and scale as user drags
  const actionsOpacity = useTransform(x, [-140, -40, 0], [1, 0.8, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (disabled) return;
    if (info.offset.x < -60) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl select-none group">
      {/* Revealed Action Buttons Layer */}
      <motion.div
        style={{ opacity: actionsOpacity }}
        className="absolute inset-y-0 right-0 flex items-center gap-1.5 px-2 z-0"
      >
        {/* Toggle Killswitch action */}
        <button
          type="button"
          onClick={() => {
            onToggleActive();
            setIsOpen(false);
          }}
          className={`h-11 px-3 rounded-xl flex items-center justify-center gap-1 text-xs font-semibold shadow-md active:scale-95 transition-transform ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-black'
              : 'bg-emerald-500 hover:bg-emerald-600 text-black'
          }`}
          title={isActive ? 'Pausar comercio' : 'Activar comercio'}
        >
          <Power className="w-3.5 h-3.5" />
          <span className="text-[11px]">{isActive ? 'Pausar' : 'Activar'}</span>
        </button>

        {/* View store link */}
        <button
          type="button"
          onClick={() => {
            onViewStore();
            setIsOpen(false);
          }}
          className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform ${
            isDark
              ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
              : 'bg-neutral-200 hover:bg-neutral-300 text-black'
          }`}
          title="Ver Catálogo"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Record payment */}
        <button
          type="button"
          onClick={() => {
            onRecordPayment();
            setIsOpen(false);
          }}
          className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-transform"
          title="Cobrar suscripción"
        >
          <DollarSign className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Draggable Top Content Layer */}
      <motion.div
        style={{ x }}
        drag={disabled ? false : 'x'}
        dragConstraints={{ left: -160, right: 0 }}
        dragElastic={0.08}
        onDragEnd={handleDragEnd}
        animate={{ x: isOpen ? -160 : 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
        className={`relative z-10 transition-colors ${
          isDark
            ? 'bg-[#0A0A0A] border border-neutral-800/80 hover:border-neutral-700'
            : 'bg-white border border-neutral-200 hover:border-neutral-300'
        }`}
      >
        {children}

        {/* Swipe hint chevron indicator visible on touch/mobile */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-30 md:hidden pointer-events-none">
          <ChevronLeft className="w-4 h-4" />
        </div>
      </motion.div>
    </div>
  );
}
