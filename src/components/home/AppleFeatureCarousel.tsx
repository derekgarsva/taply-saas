'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Smartphone,
  QrCode,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Instagram,
  MapPin,
  Phone,
} from 'lucide-react';

/* ══ Step player ══════════════════════════════════════════
   A row of dots and a play button. The dot for the current
   step is stretched into a bar that fills while the step runs;
   when it is full the bar eases over to the next dot, and a
   small wave runs through the dots it crossed.
   (Inlined from user's Apple Lab interactive component)
══════════════════════════════════════════════════════════ */

const stillness = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const QUART = (t: number) => 1 - (1 - t) ** 4;
const SWING = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

function useTween(to: number, ms: number, instant = false, ease = QUART) {
  const [at, setAt] = useState(to);
  const cur = useRef(to);
  const raf = useRef(0);

  useEffect(() => {
    if (instant) {
      cur.current = to;
      setAt(to);
      return;
    }
    const from = cur.current;
    if (from === to) return;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      cur.current = from + (to - from) * ease(t);
      setAt(cur.current);
      raf.current = t < 1 ? requestAnimationFrame(step) : 0;
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [to, ms, instant, ease]);

  return at;
}

const PAUSE_L = [6, 4, 10, 4, 10, 20, 6, 20] as const;
const PLAY_L = [6.5, 4, 13.25, 8, 13.25, 16, 6.5, 20] as const;
const PAUSE_R = [14, 4, 18, 4, 18, 20, 14, 20] as const;
const PLAY_R = [13.25, 8, 20, 12, 20, 12, 13.25, 16] as const;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (u: number) => 1 - Math.pow(1 - u, 3);

const quad = (a: readonly number[], b: readonly number[], t: number) => {
  let d = '';
  for (let i = 0; i < 8; i += 2)
    d += `${i ? 'L' : 'M'}${mix(a[i], b[i], t).toFixed(2)} ${mix(
      a[i + 1],
      b[i + 1],
      t
    ).toFixed(2)}`;
  return `${d}Z`;
};

function Mark({
  playing,
  size,
  still,
}: {
  playing: boolean;
  size: number;
  still: boolean;
}) {
  const t = useTween(playing ? 0 : 1, 300, still, SWING);
  const goo = Math.sin(clamp(t, 0, 1) * Math.PI);
  const pull = 1.6 * goo;
  const tip = (playing ? -9 : 9) * goo;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
      style={{
        transformOrigin: '50% 50%',
        transform: `rotate(${tip}deg) scale(${1 - 0.13 * goo}, ${1 + 0.11 * goo})`,
      }}
    >
      <path d={quad(PAUSE_L, PLAY_L, t)} transform={`translate(${pull} 0)`} />
      <path d={quad(PAUSE_R, PLAY_R, t)} transform={`translate(${-pull} 0)`} />
    </svg>
  );
}

const DOT = 8;
const BAR = 36;
const GAP = 8;
const PAD = 14;
const H = DOT + PAD * 2;
const MOVE = 520;
const LEAD = 60;
const RISE = 300;

const layout = (n: number, at: number) => {
  const out: [number, number][] = [];
  let x = 0;
  for (let i = 0; i < n; i++) {
    const w = i === at ? BAR : DOT;
    out.push([x, x + w]);
    x += w + GAP;
  }
  return out;
};

const wakeOf = (w: number) => ({
  amp: mix(0.26, 0.34, w),
  reach: 1 + Math.round(w * 7),
  self: mix(-0.7, 0.3, w),
  stagger: mix(70, 55, w),
});

const tune = (k: number, zeta: number) => ({ k, d: 1 - 2 * zeta * Math.sqrt(k) });
const SETTLE = tune(0.16, 1);

type Tween = { from: number; to: number; t0: number };
type Edge = { x: number; v: number; tw?: Tween };
type Dot = { l: Edge; r: Edge; ink: number };

export interface StepPlayerProps {
  steps?: number;
  pace?: number;
  wake?: number;
  activeStep?: number;
  onStepChange?: (step: number) => void;
  playing?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

export function StepPlayer({
  steps = 5,
  pace = 4,
  wake = 100,
  activeStep,
  onStepChange,
  playing: controlledPlaying,
  onPlayingChange,
}: StepPlayerProps) {
  const n = clamp(Math.round(steps), 3, 8);
  const still = stillness();
  const wk = wakeOf(clamp(wake, 0, 100) / 100);

  const [internalAt, setInternalAt] = useState(activeStep ?? 0);
  const [internalPlaying, setInternalPlaying] = useState(controlledPlaying ?? true);
  const [, setTick] = useState(0);

  const at = activeStep !== undefined ? activeStep : internalAt;
  const playing = controlledPlaying !== undefined ? controlledPlaying : internalPlaying;

  const prog = useRef(0);
  const dots = useRef<Dot[]>([]);
  const raf = useRef(0);
  const live = useRef({ at, playing, n, pace, wk });
  live.current = { at, playing, n, pace, wk };
  const wave = useRef<{ t0: number; origin: number; from: number } | null>(null);

  if (dots.current.length !== n) {
    const slots = layout(n, Math.min(at, n - 1));
    dots.current = slots.map(([l, r], i) => ({
      l: { x: l, v: 0 },
      r: { x: r, v: 0 },
      ink: i < at ? 1 : 0,
    }));
  }

  const run = () => {
    if (raf.current) return;
    let prev = 0;
    const tick = (t: number) => {
      const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1;
      prev = t;
      const { at: cur, playing: on, n: count, pace: secs, wk: w } = live.current;
      const slots = layout(count, cur);
      let busy = false;

      if (on) {
        prog.current += (dt * 16.67) / (Math.max(0.5, secs) * 1000);
        busy = true;
        if (prog.current >= 1) {
          prog.current = 0;
          const next = cur < count - 1 ? cur + 1 : 0;
          go(next, false);
        }
      }

      dots.current.forEach((d, i) => {
        const [tl, tr] = slots[i] ?? [0, 0];
        for (const [e, target] of [[d.l, tl], [d.r, tr]] as const) {
          if (still) {
            e.x = target;
            e.v = 0;
            e.tw = undefined;
            continue;
          }
          if (e.tw) {
            const u = clamp((t - e.tw.t0) / MOVE, 0, 1);
            e.x = mix(e.tw.from, e.tw.to, easeOut(u));
            if (u >= 1) e.tw = undefined;
            busy = true;
            continue;
          }
          e.v += (target - e.x) * SETTLE.k * dt;
          e.v *= Math.pow(SETTLE.d, dt);
          e.x += e.v * dt;
          if (Math.abs(target - e.x) < 0.02 && Math.abs(e.v) < 0.02) {
            e.x = target;
            e.v = 0;
          } else {
            busy = true;
          }
        }
        const want = i < cur ? 1 : i === cur ? prog.current : 0;
        const next = still ? want : d.ink + (want - d.ink) * Math.min(1, 0.22 * dt);
        d.ink = Math.abs(want - next) < 0.002 ? want : next;
        if (d.ink !== want) busy = true;
      });

      if (
        wave.current &&
        t - wave.current.t0 < LEAD + (w.reach + 1) * w.stagger + RISE
      ) {
        busy = true;
      } else {
        wave.current = null;
      }

      setTick((k) => k + 1);
      raf.current = busy ? requestAnimationFrame(tick) : 0;
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
  }, []);

  useEffect(() => {
    run();
  }, [n, pace, at, playing]);

  // Sync external activeStep
  useEffect(() => {
    if (activeStep !== undefined && activeStep !== live.current.at) {
      go(activeStep, true);
    }
  }, [activeStep]);

  function go(to: number, fromHand: boolean) {
    const { at: cur, n: count } = live.current;
    if (to === cur) return;
    const will = layout(count, to);
    const now = performance.now();
    if (!still) {
      dots.current.forEach((d, i) => {
        d.l.tw = { from: d.l.x, to: will[i][0], t0: now };
        d.r.tw = { from: d.r.x, to: will[i][1], t0: now };
      });
      wave.current = { t0: now, origin: to, from: cur };
    }
    live.current.at = to;
    setInternalAt(to);
    onStepChange?.(to);
    if (fromHand) prog.current = 0;
    run();
  }

  const toggle = () => {
    const nextPlaying = !playing;
    setInternalPlaying(nextPlaying);
    onPlayingChange?.(nextPlaying);
  };

  const pick = (i: number) => {
    if (i === at) return;
    go(i, true);
  };

  const now = performance.now();
  const shape = (d: Dot, i: number) => {
    let sy = 1;
    const w = wave.current;
    if (w) {
      const span = Math.abs(w.origin - w.from);
      const skip = Math.max(0, span - wk.reach);
      const lo = Math.min(w.from, w.origin);
      const hi = Math.max(w.from, w.origin);
      let delay = -1;
      let share = 1;
      if (i === w.origin) {
        delay = Math.min(span, wk.reach) * wk.stagger;
        share = wk.self;
      } else if (i >= lo && i <= hi) {
        const k = Math.abs(i - w.from);
        if (span - k <= wk.reach) delay = (k - skip) * wk.stagger;
      }
      if (delay >= 0) {
        const u = (now - w.t0 - LEAD - delay) / RISE;
        if (u > 0 && u < 1) sy = 1 + Math.sin(Math.PI * u) * wk.amp * share;
      }
    }
    return `translateX(${d.l.x.toFixed(2)}px) scaleY(${sy.toFixed(3)})`;
  };

  const width = layout(n, 0).at(-1)![1];

  return (
    <div className="spl select-none" data-playing={playing} role="group" aria-label={`Paso ${at + 1} de ${n}`}>
      <div className="spl-row">
        <div className="spl-slab rounded-full shadow-2xs backdrop-blur-md" style={{ padding: PAD, borderRadius: H / 2 }}>
          <div className="spl-track" style={{ width, height: DOT }}>
            {dots.current.map((d, i) => {
              const w = Math.max(0, d.r.x - d.l.x);
              return (
                <button
                  key={i}
                  className="spl-dot"
                  aria-label={`Ver característica ${i + 1}`}
                  aria-current={i === at ? 'step' : undefined}
                  onClick={() => pick(i)}
                  style={{ transform: shape(d, i), width: w }}
                >
                  <i
                    className="spl-ink"
                    style={{
                      width: d.ink > 0.001 ? Math.max(Math.min(DOT, w), w * d.ink) : 0,
                      opacity: i === at ? Math.min(1, d.ink * 14) : 1,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="spl-slab spl-tool rounded-full shadow-2xs backdrop-blur-md" style={{ width: H, height: H, borderRadius: H / 2 }}>
          <button
            className="spl-go"
            onClick={toggle}
            aria-label={playing ? 'Pausar carrusel' : 'Reproducir carrusel'}
          >
            <Mark playing={playing} size={14} still={still} />
          </button>
        </div>
      </div>
    </div>
  );
}

const EASE_APPLE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ══ 5 Apple-style feature cards with uniform dimensions and rich previews ══ */
const CAROUSEL_CARDS = [
  {
    id: 'checkout',
    tag: 'FILOSOFÍA DE 3 TOQUES',
    badge: 'Velocidad Absoluta',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    icon: Zap,
    iconColor: 'text-[#00594C]',
    title: 'De ver el producto a pedir en WhatsApp en 5 segundos',
    description:
      'Tus clientes tocan lo que desean y confirman con un solo deslizamiento fluido. Cero formularios eternos ni carritos lentos.',
    bullets: [
      '1 toque por producto con micro-feedback',
      'Slider de confirmación directa a WhatsApp',
    ],
    previewType: 'checkout',
  },
  {
    id: 'multilink',
    tag: 'TODO EN UN ENLACE',
    badge: 'Bio de Redes',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200/80',
    icon: Smartphone,
    iconColor: 'text-blue-600',
    title: 'Catálogo, redes y mapa en un solo enlace inteligente',
    description:
      'Reemplaza tu linktree estático por un menú interactivo: Instagram, TikTok, llamadas rápidas y Google Maps sin salir nunca de la web.',
    bullets: [
      'Accesos directos a Instagram y TikTok',
      'Ubicación exacta con Google Maps',
    ],
    previewType: 'multilink',
  },
  {
    id: 'qr',
    tag: 'CÓDIGOS QR INSTANTÁNEOS',
    badge: 'Para tu Local',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200/80',
    icon: QrCode,
    iconColor: 'text-purple-600',
    title: 'De la mesa de tu local al WhatsApp de tu cocina',
    description:
      'Genera códigos QR de alta resolución listos para imprimir en acrílicos de mesa, barras y vitrinas. Tus clientes escanean y piden al instante.',
    bullets: [
      'Descarga vectorial lista para impresión',
      'Actualización inmediata sin reimprimir',
    ],
    previewType: 'qr',
  },
  {
    id: 'payment',
    tag: 'DATOS DE PAGO AUTOMÁTICOS',
    badge: 'Cero Comisiones',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-200/80',
    icon: DollarSign,
    iconColor: 'text-amber-600',
    title: 'Tus datos bancarios incluidos en cada pedido',
    description:
      'El cliente recibe el desglose exacto y tus coordenadas de Pago Móvil, Zelle o transferencias para pagar de inmediato sin esperar.',
    bullets: [
      'Pago Móvil, Zelle y transferencias en divisas',
      'El 100% entra directo a tus cuentas',
    ],
    previewType: 'payment',
  },
  {
    id: 'analytics',
    tag: 'INTELIGENCIA COMERCIAL',
    badge: 'En Vivo Supabase',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200/80',
    icon: TrendingUp,
    iconColor: 'text-teal-600',
    title: 'Métricas de ventas, conversión y productos estrella',
    description:
      'Conoce cuántas personas abren tu catálogo, cuántos pedidos cierras y cuáles productos son los más buscados de tu negocio.',
    bullets: [
      'Visitas únicas e impresiones en vivo',
      'Tasa de conversión en pedidos confirmados',
    ],
    previewType: 'analytics',
  },
];

export default function AppleFeatureCarousel() {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isProgrammaticScroll = useRef(false);

  // Smoothly center the target card in the horizontal track
  const scrollToCard = (index: number) => {
    const cardEl = cardRefs.current[index];
    const container = carouselRef.current;
    if (!cardEl || !container) return;

    isProgrammaticScroll.current = true;
    const containerWidth = container.offsetWidth;
    const cardLeft = cardEl.offsetLeft;
    const cardWidth = cardEl.offsetWidth;
    const targetScroll = cardLeft - (containerWidth - cardWidth) / 2;

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth',
    });

    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 450);
  };

  const handleStepChange = (newStep: number) => {
    setActiveStep(newStep);
    scrollToCard(newStep);
  };

  const handlePrev = () => {
    const prev = activeStep > 0 ? activeStep - 1 : CAROUSEL_CARDS.length - 1;
    handleStepChange(prev);
  };

  const handleNext = () => {
    const next = activeStep < CAROUSEL_CARDS.length - 1 ? activeStep + 1 : 0;
    handleStepChange(next);
  };

  // Sync horizontal touch swipe/scroll to StepPlayer dots
  const handleScroll = () => {
    if (isProgrammaticScroll.current) return;
    const container = carouselRef.current;
    if (!container) return;

    const scrollCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(scrollCenter - cardCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeStep) {
      setActiveStep(closestIndex);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 font-sans select-none">
      {/* ══ HORIZONTAL CAROUSEL TRACK (EXACT SAME SIZES ACROSS ALL CARDS) ══ */}
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-4 px-2 sm:px-4 -mx-2 sm:mx-0 select-none scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {CAROUSEL_CARDS.map((card, idx) => {
          const isActive = activeStep === idx;
          return (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              onClick={() => handleStepChange(idx)}
              className={`w-[85vw] max-w-[340px] sm:w-[350px] md:w-[360px] lg:w-[370px] h-[515px] sm:h-[530px] flex-shrink-0 snap-center rounded-[28px] sm:rounded-[36px] bg-white transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between overflow-hidden relative cursor-pointer ${
                isActive
                  ? 'border-2 border-[#00594C]/40 shadow-[0_16px_44px_rgba(0,89,76,0.1),0_2px_6px_rgba(0,0,0,0.03)] ring-1 ring-emerald-500/20 scale-[1.01]'
                  : 'border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] hover:border-black/[0.12] hover:shadow-[0_8px_28px_rgba(0,0,0,0.05)] opacity-95'
              }`}
            >
              {/* Soft atmospheric gradient glow behind active card */}
              {isActive && (
                <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-100/40 via-teal-50/20 to-transparent rounded-full blur-2xl pointer-events-none" />
              )}

              {/* ── CARD HEADER ── */}
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 h-6 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#00594C] truncate">
                    {card.tag}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-gray-950 tracking-tight leading-snug line-clamp-2 h-[50px] mb-1.5">
                  {card.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 h-[34px] font-normal">
                  {card.description}
                </p>
              </div>

              {/* ── VISUAL MOCKUP PREVIEW (EXACT UNIFORM HEIGHT 195px sm:205px) ── */}
              <div className="h-[195px] sm:h-[205px] w-full rounded-2xl bg-[#F5F5F7] border border-black/[0.05] p-3 flex items-center justify-center overflow-hidden relative shadow-inner my-2 z-10">
                {card.previewType === 'checkout' && (
                  <div className="w-full max-w-[280px] p-3 bg-white rounded-2xl border border-gray-200/80 shadow-md space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-extrabold text-gray-900">Checkout en 3 Toques</span>
                      </div>
                      <span className="text-[9px] font-black text-[#00594C] bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                        WhatsApp
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="p-1.5 rounded-xl bg-gray-50 border border-gray-200/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🥐</span>
                          <span className="text-[11px] font-bold text-gray-900">Pan de Jamón</span>
                        </div>
                        <span className="text-[11px] font-black text-gray-900">$30.00</span>
                      </div>
                      <div className="p-1.5 rounded-xl bg-gray-50 border border-gray-200/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">🧀</span>
                          <span className="text-[11px] font-bold text-gray-900">Golfeado Queso</span>
                        </div>
                        <span className="text-[11px] font-black text-gray-900">$7.00</span>
                      </div>
                    </div>

                    <div className="p-1.5 rounded-xl bg-[#00594C] text-white flex items-center justify-between shadow-xs">
                      <div className="w-6 h-6 rounded-lg bg-white text-[#00594C] flex items-center justify-center font-black text-[10px]">
                        →
                      </div>
                      <span className="text-[10px] font-extrabold pr-2">Desliza para pedir</span>
                    </div>
                  </div>
                )}

                {card.previewType === 'multilink' && (
                  <div className="w-full max-w-[280px] p-3.5 bg-white rounded-2xl border border-gray-200/80 shadow-md space-y-2.5">
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00594C] to-emerald-400 text-white font-black text-sm flex items-center justify-center mx-auto mb-1 shadow-xs">
                        ⭐
                      </div>
                      <div className="font-extrabold text-xs text-gray-950">Panadería La Estrella</div>
                      <div className="text-[10px] text-gray-500">Masa madre y repostería artesanal</div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="p-1.5 rounded-lg bg-pink-50 border border-pink-200/80 text-pink-700 text-center flex flex-col items-center gap-0.5">
                        <Instagram className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold">Instagram</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-700 text-center flex flex-col items-center gap-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold">Ubicación</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[#00594C] text-center flex flex-col items-center gap-0.5">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold">Llamar</span>
                      </div>
                    </div>
                  </div>
                )}

                {card.previewType === 'qr' && (
                  <div className="w-full max-w-[280px] p-3.5 bg-white rounded-2xl border border-gray-200/80 shadow-md flex flex-col items-center text-center space-y-2">
                    <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/80">
                      <QrCode className="w-20 h-20 text-gray-900 mx-auto" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-gray-950">Escanea y pide desde tu mesa</div>
                      <div className="text-[9px] text-gray-500 font-mono">taply.app/panaderia-la-estrella</div>
                    </div>
                    <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                      Alta Resolución Vectorial
                    </span>
                  </div>
                )}

                {card.previewType === 'payment' && (
                  <div className="w-full max-w-[280px] p-3.5 bg-[#00594C] text-white rounded-2xl shadow-md space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/20">
                      <span className="text-[10px] font-extrabold text-emerald-200">DATOS DE PAGO</span>
                      <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                        Automático
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-emerald-100 text-[10px]">Banco:</span>
                        <span className="font-bold">Banesco (0134)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100 text-[10px]">Pago Móvil:</span>
                        <span className="font-bold font-mono">0412-1234567</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100 text-[10px]">Zelle:</span>
                        <span className="font-bold">pagos@laestrella.com</span>
                      </div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/10 text-center text-[10px] font-semibold text-emerald-100">
                      ✓ Entregado listo en WhatsApp
                    </div>
                  </div>
                )}

                {card.previewType === 'analytics' && (
                  <div className="w-full max-w-[280px] p-3 bg-white rounded-2xl border border-gray-200/80 shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-gray-900">Inteligencia Comercial</span>
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                        7 Días
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[9px] text-gray-500 font-bold">Ventas (7d)</div>
                        <div className="text-sm font-black text-gray-950">$60.00</div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="text-[9px] text-gray-500 font-bold">Conversión</div>
                        <div className="text-sm font-black text-emerald-700">2.1%</div>
                      </div>
                    </div>

                    <div className="pt-1">
                      <svg className="w-full h-8 text-[#00594C]" viewBox="0 0 100 25" fill="none">
                        <path
                          d="M0 22 Q 25 18, 45 9 T 90 4 T 100 2"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* ── BULLETS ── */}
              <div className="space-y-1.5 my-1 relative z-10">
                {card.bullets.slice(0, 2).map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-gray-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-[#00594C] border border-emerald-200 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <span className="truncate">{bullet}</span>
                  </div>
                ))}
              </div>

              {/* ── BOTTOM ACTIONS ROW ── */}
              <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between relative z-10 h-8">
                <a
                  href="#demos"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00594C] hover:text-[#004238] transition-colors group"
                >
                  <span>Probar demo interactiva</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <span className="text-[11px] font-bold text-gray-400">
                  0{idx + 1} <span className="text-gray-300">/ 0{CAROUSEL_CARDS.length}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ══ CONTROLS: STEP PLAYER (APPLE LABS CONTROL) & CHEVRONS ══ */}
      <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-white hover:bg-zinc-50 border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-gray-700 active:scale-95 transition-all"
          aria-label="Característica anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* ══ STEP PLAYER WITH MORPHING PLAY/PAUSE AND WAKE WAVES ══ */}
        <StepPlayer
          steps={CAROUSEL_CARDS.length}
          pace={4}
          wake={100}
          activeStep={activeStep}
          onStepChange={handleStepChange}
          playing={playing}
          onPlayingChange={(p) => setPlaying(p)}
        />

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-white hover:bg-zinc-50 border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-gray-700 active:scale-95 transition-all"
          aria-label="Característica siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
