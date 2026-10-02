'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check } from 'lucide-react';

interface NotifySoldOutProps {
  accentColor?: string;
  productName?: string;
}

export default function NotifySoldOut({ accentColor = '#00594C' }: NotifySoldOutProps) {
  const [on, setOn] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOn((prev) => !prev);
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.03 }}
      className="inline-flex items-center gap-1.5 h-[38px] px-3.5 rounded-full text-xs font-semibold border transition-colors shadow-2xs select-none"
      style={{
        backgroundColor: on ? accentColor : '#F3F4F6',
        borderColor: on ? accentColor : '#E5E7EB',
        color: on ? '#FFFFFF' : '#4B5563',
      }}
      aria-pressed={on}
    >
      <motion.span
        animate={
          on
            ? {
                rotate: [0, -18, 16, -10, 8, -4, 0],
                transition: { duration: 0.65, ease: 'easeOut' },
              }
            : { rotate: 0 }
        }
        className="inline-flex origin-top"
      >
        {on ? <Check size={14} strokeWidth={2.6} /> : <Bell size={14} strokeWidth={2} />}
      </motion.span>
      <span>{on ? '¡Anotado!' : 'Avisarme al haber'}</span>
    </motion.button>
  );
}
