'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const grab = (e: React.PointerEvent<HTMLElement>) => {
  try {
    e.currentTarget.setPointerCapture(e.pointerId);
  } catch {
    /* fallback */
  }
};

const WAKE = 240; // Hold delay to trigger sliding sweep

interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  accentColor?: string;
}

export default function Stepper({ value, onChange, accentColor = '#00594C' }: StepperProps) {
  const [sweeping, setSweeping] = useState(false);
  const [held, setHeld] = useState(0); // -1 | 0 | 1
  const rail = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const from = useRef({ x: 0, v: value, dir: 1, stepped: false });

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const press = (dir: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    from.current = { x: e.clientX, v: value, dir, stepped: false };
    setHeld(dir);
    timer.current = window.setTimeout(() => {
      setSweeping(true);
    }, WAKE);
    grab(e);
  };

  const drag = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!sweeping) return;
    const w = rail.current?.offsetWidth ?? 82;
    const next = clamp(Math.round(from.current.v + ((e.clientX - from.current.x) / w) * 15), 0, 99);
    onChange(next);
  };

  const lift = (e?: React.PointerEvent<HTMLButtonElement>) => {
    if (e && e.cancelable) e.preventDefault();
    window.clearTimeout(timer.current);
    setHeld(0);
    if (!sweeping && !from.current.stepped) {
      from.current.stepped = true;
      onChange(clamp(value + from.current.dir, 0, 99));
    }
    setSweeping(false);
  };

  return (
    <div className="step-well">
      <motion.div
        animate={{
          scale: sweeping ? 1.04 : 1,
          boxShadow: sweeping
            ? `0 0 0 2px ${accentColor}25, 0 4px 10px -2px rgba(0,0,0,0.1)`
            : '0 1px 2px rgba(0,0,0,0.04)',
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        className="step-pill"
        data-sweep={sweeping}
        ref={rail}
        style={{
          borderColor: sweeping ? accentColor : undefined,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.82 }}
          type="button"
          className="step-side"
          onPointerDown={press(-1)}
          onPointerMove={drag}
          onPointerUp={lift}
          onPointerCancel={lift}
          aria-label={value === 1 ? 'Quitar del carrito' : 'Restar'}
        >
          {value === 1 ? (
            <Trash2 className="w-3 h-3 text-red-500 transition-colors" />
          ) : (
            <Minus size={12} strokeWidth={2.4} />
          )}
        </motion.button>

        <div className="relative min-w-[20px] h-[28px] flex items-center justify-center overflow-hidden z-10 select-none">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              initial={{ y: from.current.dir > 0 ? 10 : -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: from.current.dir > 0 ? -10 : 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              className="step-value block text-center"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.button
          whileTap={{ scale: 0.82 }}
          type="button"
          className="step-side"
          onPointerDown={press(1)}
          onPointerMove={drag}
          onPointerUp={lift}
          onPointerCancel={lift}
          aria-label="Sumar"
        >
          <Plus size={12} strokeWidth={2.4} />
        </motion.button>

        <motion.i
          className="step-fill"
          animate={{ scaleX: clamp(value / 15, 0, 1) }}
          transition={{ ease: 'easeOut', duration: 0.15 }}
          style={{
            backgroundColor: `${accentColor}20`,
          }}
        />
      </motion.div>
    </div>
  );
}
