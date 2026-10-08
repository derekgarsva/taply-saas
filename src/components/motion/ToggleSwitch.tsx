'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'xs' | 'sm' | 'md';
  accentColor?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  size = 'sm',
  accentColor = '#00594C',
  disabled = false,
  ariaLabel = 'Alternar',
}: ToggleSwitchProps) {
  // Proporciones esenciales inspiradas en el diseño minimalista de Apple (Steve Jobs):
  // xs: 28px ancho, 16px alto, perilla de 12px (para listas densas)
  // sm: 34px ancho, 20px alto, perilla de 16px (tamaño estándar svelte)
  // md: 40px ancho, 24px alto, perilla de 20px
  const dims = {
    xs: { width: 28, height: 16, knobSize: 12, travel: 12 },
    sm: { width: 34, height: 20, knobSize: 16, travel: 14 },
    md: { width: 40, height: 24, knobSize: 20, travel: 16 },
  }[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
      className={`relative inline-flex items-center rounded-full transition-colors duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'
      }`}
      style={{
        width: `${dims.width}px`,
        height: `${dims.height}px`,
        padding: '2px',
        backgroundColor: checked ? accentColor : '#E5E7EB',
      }}
    >
      <motion.span
        animate={{
          x: checked ? dims.travel : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 550,
          damping: 32,
        }}
        className="bg-white rounded-full shadow-xs block pointer-events-none"
        style={{
          width: `${dims.knobSize}px`,
          height: `${dims.knobSize}px`,
        }}
      />
    </button>
  );
}

export default ToggleSwitch;
