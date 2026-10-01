'use client';

import React, { useState, useRef } from 'react';
import { Bell, Check } from 'lucide-react';

interface NotifySoldOutProps {
  accentColor?: string;
  productName?: string;
}

export default function NotifySoldOut({ accentColor = '#00594C', productName }: NotifySoldOutProps) {
  const [on, setOn] = useState(false);
  const bell = useRef<HTMLSpanElement>(null);

  const ring = () => {
    const b = bell.current;
    if (!b) return;
    b.getAnimations().forEach((a) => a.cancel());
    b.animate(
      [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(-17deg)', offset: 0.11 },
        { transform: 'rotate(14deg)', offset: 0.27 },
        { transform: 'rotate(-9deg)', offset: 0.44 },
        { transform: 'rotate(6deg)', offset: 0.61 },
        { transform: 'rotate(-3deg)', offset: 0.78 },
        { transform: 'rotate(0deg)' },
      ],
      { duration: 820, easing: 'ease-out' }
    );
  };

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!on) ring();
    setOn(prev => !prev);
  };

  return (
    <button
      type="button"
      className="bell-btn"
      data-on={on}
      onClick={toggle}
      aria-pressed={on}
      style={{
        backgroundColor: on ? accentColor : undefined,
        borderColor: on ? accentColor : undefined,
        color: on ? '#FFFFFF' : undefined,
      }}
    >
      <span ref={bell} className="bell-glyph">
        {on ? <Check size={14} strokeWidth={2.6} /> : <Bell size={14} strokeWidth={2} />}
      </span>
      <span>{on ? '¡Anotado!' : 'Avisarme al haber'}</span>
    </button>
  );
}
