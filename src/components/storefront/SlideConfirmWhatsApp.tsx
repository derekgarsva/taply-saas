'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const H = 56;
const PAD = 4;
const GRIP = H - PAD * 2; // 48px
const HOLD = 1600;

interface SlideConfirmProps {
  total: number;
  currencySymbol?: string;
  onConfirm: () => void;
  disabled?: boolean;
  accentColor?: string;
}

export default function SlideConfirmWhatsApp({
  total,
  currencySymbol = '$',
  onConfirm,
  disabled,
  accentColor = '#00594C',
}: SlideConfirmProps) {
  const [done, setDone] = useState(false);
  const [held, setHeld] = useState(false);
  const [posX, setPosX] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const beat = useRef<number>(0);
  const dragRef = useRef({ id: null as number | null, startX: 0, startPos: 0, moved: false });
  const [trackWidth, setTrackWidth] = useState(360);

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (track.current) setTrackWidth(track.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const TRAVEL = Math.max(10, trackWidth - PAD * 2 - GRIP);
  const progress = clamp(posX / TRAVEL, 0, 1);
  const mark = TRAVEL * 0.8;

  const finish = () => {
    setDone(true);
    setPosX(TRAVEL);

    onConfirm();

    beat.current = window.setTimeout(() => {
      setDone(false);
      setPosX(0);
    }, HOLD);
  };

  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || done) return;
    e.stopPropagation();
    dragRef.current = {
      id: e.pointerId,
      startX: e.clientX,
      startPos: posX,
      moved: false,
    };
    setHeld(true);
    try {
      track.current?.setPointerCapture(e.pointerId);
    } catch {}
  };

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!held || d.id !== e.pointerId) return;
    const delta = e.clientX - d.startX;
    if (Math.abs(delta) > 5) d.moved = true;
    const nextX = clamp(d.startPos + delta, 0, TRAVEL);
    setPosX(nextX);
  };

  const up = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!held) return;
    const d = dragRef.current;
    setHeld(false);
    try {
      track.current?.releasePointerCapture?.(e.pointerId);
    } catch {}

    if (posX >= mark) {
      finish();
    } else if (!d.moved) {
      // Direct tap fallback with smooth slide
      setPosX(TRAVEL);
      setTimeout(() => {
        finish();
      }, 140);
    } else {
      setPosX(0);
    }
  };

  if (disabled) {
    return (
      <div className="w-full h-[56px] rounded-[28px] bg-gray-200 text-gray-400 font-semibold flex items-center justify-center gap-2 text-xs sm:text-sm shadow-2xs select-none">
        <WhatsAppIcon className="w-4 h-4 text-gray-400" />
        <span>Agrega productos para ordenar</span>
      </div>
    );
  }

  return (
    <div className="sld" style={{ width: '100%', height: H }}>
      <motion.div
        className="sld-track"
        ref={track}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        animate={{
          scale: done ? 0.98 : held ? 0.99 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          backgroundColor: accentColor,
          boxShadow: `0 8px 24px -4px ${accentColor}55`,
        }}
      >
        {/* Animated Wash overlay track */}
        <motion.div
          className="sld-wash"
          animate={{
            width: done ? '100%' : `${posX + GRIP}px`,
          }}
          transition={{
            type: held ? 'tween' : 'spring',
            duration: held ? 0 : 0.25,
            stiffness: 400,
            damping: 30,
          }}
        />

        {/* Text Label */}
        <motion.span
          className="sld-say"
          animate={{
            opacity: done ? 0 : clamp(1 - progress * 1.8, 0, 1),
          }}
          transition={{ duration: 0.12 }}
        >
          <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
          <span>
            Pedir por WhatsApp · {currencySymbol}
            {total.toFixed(2)}
          </span>
        </motion.span>

        {/* Sliding Grip Handle with Spring Physics */}
        <motion.button
          type="button"
          className="sld-grip"
          animate={{
            x: posX,
            width: done ? 'calc(100% - 8px)' : `${GRIP}px`,
          }}
          transition={{
            type: held ? 'tween' : 'spring',
            duration: held ? 0 : 0.25,
            stiffness: 420,
            damping: 32,
          }}
          style={{
            color: accentColor,
          }}
          aria-label={done ? '¡Abriendo WhatsApp!' : 'Desliza para pedir por WhatsApp'}
        >
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.span
                key="arrow"
                initial={{ opacity: 0 }}
                animate={{ opacity: clamp(1 - progress * 1.5, 0, 1) }}
                exit={{ opacity: 0 }}
                className="sld-arrow"
              >
                <ArrowRight size={20} strokeWidth={2.4} />
              </motion.span>
            ) : (
              <motion.span
                key="done"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="sld-done"
                style={{ color: accentColor }}
              >
                <Check size={19} strokeWidth={2.8} />
                <span>¡Abriendo WhatsApp!</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </div>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.031 2C6.495 2 2 6.495 2 12.031a10.02 10.02 0 0 0 1.543 5.336L2 22l4.79-1.517A9.99 9.99 0 0 0 12.031 22c5.536 0 10.031-4.495 10.031-10.031C22.062 6.495 17.567 2 12.031 2Zm5.845 14.183c-.244.686-1.42 1.309-1.954 1.353-.534.043-1.018.196-3.447-.768-2.923-1.16-4.787-4.14-4.933-4.333-.146-.196-1.176-1.564-1.176-2.984 0-1.42.744-2.118 1.008-2.41.264-.292.576-.365.768-.365.192 0 .384.004.551.012.178.009.416-.068.65.494.244.584.832 2.033.905 2.18.073.146.122.316.024.51-.097.195-.146.316-.292.487-.146.17-.308.38-.44.51-.146.146-.298.305-.128.598.17.292.756 1.246 1.621 2.016 1.112.99 2.05 1.298 2.342 1.444.292.146.463.122.634-.073.17-.195.731-.852.926-1.144.195-.292.39-.244.658-.146.268.098 1.706.804 2.0 1.002.292.195.487.292.56.414.073.122.073.706-.17 1.392Z" />
    </svg>
  );
}
