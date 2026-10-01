'use client';

import React, { useState, useRef, useEffect } from 'react';
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
    timer.current = window.setTimeout(() => { setSweeping(true); }, WAKE);
    grab(e);
  };

  const drag = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!sweeping) return;
    const w = rail.current?.offsetWidth ?? 104;
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
      <div
        className="step-pill"
        data-sweep={sweeping}
        data-press={!sweeping && held ? (held < 0 ? 'l' : 'r') : undefined}
        ref={rail}
        style={{
          borderColor: sweeping ? accentColor : undefined,
        }}
      >
        <button
          type="button"
          className="step-side"
          onPointerDown={press(-1)}
          onPointerMove={drag}
          onPointerUp={lift}
          onPointerCancel={lift}
          aria-label={value === 1 ? 'Quitar del carrito' : 'Restar'}
        >
          {value === 1 ? (
            <Trash2 className="w-3.5 h-3.5 text-red-500 transition-colors" />
          ) : (
            <Minus size={15} strokeWidth={2.4} />
          )}
        </button>

        <span className="step-value">{value}</span>

        <button
          type="button"
          className="step-side"
          onPointerDown={press(1)}
          onPointerMove={drag}
          onPointerUp={lift}
          onPointerCancel={lift}
          aria-label="Sumar"
        >
          <Plus size={15} strokeWidth={2.4} />
        </button>

        <i
          className="step-fill"
          style={{
            transform: `scaleX(${clamp(value / 15, 0, 1)})`,
            backgroundColor: `${accentColor}20`
          }}
        />
      </div>
    </div>
  );
}
