'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SeekTopProps {
  value: string;
  onChange: (val: string) => void;
  accentColor?: string;
}

export default function SeekTop({ value, onChange, accentColor = '#00594C' }: SeekTopProps) {
  const frame = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const SHUT = 38;
  const WIDE = 210;

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (frame.current && !frame.current.contains(e.target as Node)) {
        if (!value || !value.trim()) {
          setOpen(false);
          field.current?.blur();
        }
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [open, value]);

  const start = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (open) return;
    setOpen(true);
    setTimeout(() => field.current?.focus(), 60);
  };

  const away = () => {
    if (value && value.trim()) return;
    setOpen(false);
  };

  const clear = (e: React.PointerEvent) => {
    e.stopPropagation();
    onChange('');
    setOpen(false);
    field.current?.blur();
  };

  return (
    <div className="sek" ref={frame} data-open={open}>
      <motion.div
        animate={{
          width: open ? WIDE : SHUT,
          boxShadow: open
            ? `0 4px 16px -2px rgba(0,0,0,0.12), 0 0 0 1.5px ${accentColor}40`
            : '0 2px 10px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="sek-skin"
      >
        <motion.div
          animate={{
            scale: open ? 1.05 : 1,
            color: open ? accentColor : '#374151',
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-2.5 flex items-center pointer-events-none z-10"
        >
          <Search className="w-[18px] h-[18px]" strokeWidth={2.4} />
        </motion.div>

        <input
          ref={field}
          className="sek-field"
          type="text"
          value={value}
          placeholder="Buscar productos..."
          style={{
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
          }}
          onChange={(e) => onChange(e.target.value)}
          onBlur={away}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onChange('');
              setOpen(false);
              field.current?.blur();
            }
          }}
        />

        <AnimatePresence>
          {open && value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              whileTap={{ scale: 0.85 }}
              type="button"
              className="sek-clear"
              onPointerDown={clear}
              aria-label="Borrar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        {!open && (
          <button
            type="button"
            className="sek-hit"
            aria-label="Abrir buscador"
            onClick={start}
          />
        )}
      </motion.div>
    </div>
  );
}
