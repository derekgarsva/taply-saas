'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [press, setPress] = useState(false);

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
    setPress(true);
    setTimeout(() => {
      setPress(false);
      setOpen(true);
      setTimeout(() => field.current?.focus(), 50);
    }, 40);
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
    <div className="sek" ref={frame} data-open={open} data-press={press}>
      <div
        className="sek-skin"
        style={{
          width: open ? `${WIDE}px` : `${SHUT}px`,
        }}
      >
        <Search
          className="sek-lens"
          style={{ stroke: open ? accentColor : '#374151' }}
        />
        <input
          ref={field}
          className="sek-field"
          type="text"
          value={value}
          placeholder="Buscar productos..."
          style={{
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none'
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
        {open && value && (
          <button
            type="button"
            className="sek-clear"
            onPointerDown={clear}
            aria-label="Borrar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {!open && (
          <button
            type="button"
            className="sek-hit"
            aria-label="Abrir buscador"
            onClick={start}
          />
        )}
      </div>
    </div>
  );
}
