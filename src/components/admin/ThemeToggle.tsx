'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggle}
      type="button"
      className={`relative flex items-center justify-center p-2 rounded-2xl transition-all duration-300 border ${
        isDark
          ? 'bg-neutral-900/90 text-neutral-300 hover:text-white border-neutral-800 hover:border-neutral-700 shadow-inner'
          : 'bg-white text-neutral-700 hover:text-black border-neutral-200 hover:border-neutral-300 shadow-sm'
      }`}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro (negro OLED)'}
    >
      <motion.div
        key={theme}
        initial={{ y: -6, opacity: 0, rotate: -30 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 6, opacity: 0, rotate: 30 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="flex items-center gap-1.5"
      >
        {isDark ? (
          <>
            <Moon className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-medium hidden sm:inline text-neutral-400">Oscuro</span>
          </>
        ) : (
          <>
            <Sun className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] font-medium hidden sm:inline text-neutral-600">Claro</span>
          </>
        )}
      </motion.div>
    </button>
  );
}
