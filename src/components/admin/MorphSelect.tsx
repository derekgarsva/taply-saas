'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface MorphOption<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface MorphSelectProps<T extends string = string> {
  options: MorphOption<T>[];
  value: T;
  onChange: (id: T) => void;
  theme?: 'dark' | 'light';
  layoutId?: string;
  size?: 'sm' | 'md';
}

export default function MorphSelect<T extends string = string>({
  options,
  value,
  onChange,
  theme = 'dark',
  layoutId = 'morph-pill',
  size = 'md',
}: MorphSelectProps<T>) {
  const isDark = theme === 'dark';

  return (
    <div
      role="radiogroup"
      className={`inline-flex items-center p-1 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-neutral-950 border-neutral-800/80 text-neutral-300'
          : 'bg-neutral-100 border-neutral-200 text-neutral-600'
      }`}
    >
      {options.map((opt) => {
        const isSelected = opt.id === value;

        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.id)}
            className={`relative flex items-center justify-center gap-1.5 rounded-xl font-medium transition-colors z-10 focus:outline-none ${
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs'
            } ${
              isSelected
                ? isDark
                  ? 'text-white'
                  : 'text-neutral-900'
                : isDark
                ? 'text-neutral-400 hover:text-neutral-200'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className={`absolute inset-0 rounded-xl -z-10 shadow-sm ${
                  isDark
                    ? 'bg-neutral-800 border border-neutral-700/60 shadow-neutral-950/40'
                    : 'bg-white border border-neutral-200/90 shadow-neutral-300/40'
                }`}
              />
            )}

            {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.badge !== undefined && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-emerald-100 text-emerald-700'
                    : isDark
                    ? 'bg-neutral-800 text-neutral-400'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
