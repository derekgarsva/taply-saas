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

/* ══ 5 Apple-style feature cards with rich visual previews ══ */
const CAROUSEL_CARDS = [
  {
    id: 'checkout',
    tag: 'FILOSOFÍA DE 3 TOQUES',
    badge: 'Velocidad Absoluta',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: Zap,
    iconColor: 'text-[#00594C]',
    title: 'De ver el producto a pedir en WhatsApp en menos de 5 segundos',
    description:
      'Olvídate de formularios infinitos, contraseñas que se olvidan y carritos lentos donde se pierden el 70% de tus ventas. Tus clientes tocan lo que desean y confirman con un solo deslizamiento fluido.',
    bullets: [
      '1 toque por producto con micro-feedback',
      'Slider de confirmación directa a WhatsApp',
      'Sin registros ni contraseñas para tus clientes',
    ],
    previewType: 'checkout',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'multilink',
    tag: 'TODO EN UN ENLACE',
    badge: 'Bio de Redes Sociales',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: Smartphone,
    iconColor: 'text-blue-600',
    title: 'Tu catálogo, tus redes y tu ubicación en un solo enlace inteligente',
    description:
      'Reemplaza tu linktree aburrido por una experiencia viva. Tus clientes acceden a tu Instagram, TikTok, llamadas de atención rápida y mapa en Google Maps sin salir nunca de tu menú interactivo.',
    bullets: [
      'Accesos directos a Instagram y TikTok',
      'Ubicación exacta con Google Maps',
      'Llamada telefónica inmediata con 1 toque',
    ],
    previewType: 'multilink',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'qr',
    tag: 'CÓDIGOS QR INSTANTÁNEOS',
    badge: 'Para tu Local Físico',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    icon: QrCode,
    iconColor: 'text-purple-600',
    title: 'De la mesa de tu restaurante al WhatsApp de tu cocina',
    description:
      'Genera códigos QR de alta resolución con 1 clic para colocar en acrílicos de mesa, barras, empaques para llevar y vitrinas. Tus comensales escanean con la cámara y piden al instante.',
    bullets: [
      'Descarga vectorial lista para impresión',
      'Perfecto para cartas físicas y acrílicos',
      'Actualización instantánea sin reimprimir',
    ],
    previewType: 'qr',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'payment',
    tag: 'DATOS DE PAGO AUTOMÁTICOS',
    badge: 'Cero Comisiones',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
    icon: DollarSign,
    iconColor: 'text-amber-600',
    title: 'Tus datos bancarios incluidos automáticamente en cada pedido',
    description:
      'Cuando el cliente confirma su orden, el pedido llega formateado con el desglose exacto y tus coordenadas de Pago Móvil, Zelle o transferencias bancarias para que pague sin esperar que le respondas.',
    bullets: [
      'Pago Móvil, Zelle y transferencias en divisas',
      'Mensaje estructurado con montos exactos',
      'El 100% del dinero entra directo a tus cuentas',
    ],
    previewType: 'payment',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'analytics',
    tag: 'INTELIGENCIA COMERCIAL',
    badge: 'En Vivo con Supabase',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    icon: TrendingUp,
    iconColor: 'text-teal-600',
    title: 'Métricas reales de ventas, conversión y productos estrella',
    description:
      'Conoce cuántas personas abren tu catálogo, cuántos pedidos generas por WhatsApp y qué productos son los más buscados de tu negocio con filtros analíticos de 7, 14 y 30 días.',
    bullets: [
      'Visitas únicas e impresiones de productos',
      'Tasa de conversión en pedidos confirmados',
      'Gráficos interactivos con cubic-spline de Arc UI',
    ],
    previewType: 'analytics',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function AppleFeatureCarousel() {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  const currentCard = CAROUSEL_CARDS[activeStep] || CAROUSEL_CARDS[0];

  const handlePrev = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : CAROUSEL_CARDS.length - 1));
  };

  const handleNext = () => {
    setActiveStep((prev) => (prev < CAROUSEL_CARDS.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 font-sans select-none">
      {/* ══ CAROUSEL HERO CARD ══ */}
      <div className="relative rounded-[32px] sm:rounded-[40px] bg-white border border-gray-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Soft atmospheric gradient glow behind active card */}
        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-gradient-to-bl from-emerald-100/35 via-teal-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 min-h-[460px] sm:min-h-[500px] flex flex-col lg:flex-row items-stretch">
          {/* ── LEFT: Content Story & Features ── */}
          <div className="flex-1 p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
            <div>
              {/* Badge row */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#00594C]">
                  {currentCard.tag}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${currentCard.badgeColor}`}
                >
                  {currentCard.badge}
                </span>
              </div>

              {/* Title & Description with smooth slide fade */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: EASE_APPLE }}
                >
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight leading-tight mb-4">
                    {currentCard.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal max-w-xl">
                    {currentCard.description}
                  </p>

                  {/* Bullet perks */}
                  <div className="mt-6 space-y-2.5">
                    {currentCard.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-gray-800">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-[#00594C] border border-emerald-200 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Actions Row */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <a
                href="#demos"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#00594C] hover:text-[#004238] transition-colors group"
              >
                <span>Probar demo interactiva</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Step indicator counter */}
              <span className="text-xs font-bold text-gray-400">
                0{activeStep + 1} <span className="text-gray-300">/ 0{CAROUSEL_CARDS.length}</span>
              </span>
            </div>
          </div>

          {/* ── RIGHT: High-End Visual Mockup Display ── */}
          <div className="lg:w-[48%] relative bg-gradient-to-b from-gray-50 to-gray-100/60 p-6 sm:p-10 flex items-center justify-center overflow-hidden border-t lg:border-t-0 lg:border-l border-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease: EASE_APPLE }}
                className="w-full max-w-md relative"
              >
                {/* Visual Graphic Representation for each card */}
                {currentCard.previewType === 'checkout' && (
                  <div className="p-4 sm:p-6 bg-white rounded-3xl border border-gray-200 shadow-xl space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-extrabold text-gray-900">Checkout en 3 Toques</span>
                      </div>
                      <span className="text-[10px] font-black text-[#00594C] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        WhatsApp
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2.5 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
                            🥐
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900">Pan de Jamón Tradicional</div>
                            <div className="text-[10px] text-gray-500">$30.00 x 1</div>
                          </div>
                        </div>
                        <span className="text-xs font-black text-gray-900">$30.00</span>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-black text-sm">
                            🧀
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900">Golfeado con Queso</div>
                            <div className="text-[10px] text-gray-500">$3.50 x 2</div>
                          </div>
                        </div>
                        <span className="text-xs font-black text-gray-900">$7.00</span>
                      </div>
                    </div>

                    {/* Green Slider Simulation */}
                    <div className="p-2 rounded-2xl bg-[#00594C] text-white flex items-center justify-between shadow-md">
                      <div className="w-9 h-9 rounded-xl bg-white text-[#00594C] flex items-center justify-center font-black text-xs shadow-xs">
                        →
                      </div>
                      <span className="text-xs font-extrabold pr-3">Desliza para pedir por WhatsApp</span>
                    </div>
                  </div>
                )}

                {currentCard.previewType === 'multilink' && (
                  <div className="p-5 sm:p-7 bg-white rounded-3xl border border-gray-200 shadow-xl space-y-3">
                    <div className="text-center pb-2">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00594C] to-emerald-400 text-white font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                        ⭐
                      </div>
                      <h4 className="font-extrabold text-sm text-gray-950">Panadería La Estrella</h4>
                      <p className="text-[11px] text-gray-500">Masa madre y repostería artesanal</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200/80 text-pink-700 text-center flex flex-col items-center gap-1">
                        <Instagram className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Instagram</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 text-center flex flex-col items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Ubicación</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[#00594C] text-center flex flex-col items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span className="text-[10px] font-bold">Llamar</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentCard.previewType === 'qr' && (
                  <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-xl flex flex-col items-center text-center space-y-3">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                      <QrCode className="w-32 h-32 text-gray-900 mx-auto" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-gray-950">Escanea y pide desde tu mesa</div>
                      <div className="text-[10px] text-gray-500">taply.app/panaderia-la-estrella</div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      Alta Resolución Vectorial
                    </span>
                  </div>
                )}

                {currentCard.previewType === 'payment' && (
                  <div className="p-5 sm:p-6 bg-[#00594C] text-white rounded-3xl shadow-xl space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/20">
                      <span className="text-xs font-extrabold text-emerald-200">DATOS DE PAGO</span>
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                        Automático
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-emerald-100">Banco:</span>
                        <span className="font-bold">Banesco (0134)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100">Pago Móvil:</span>
                        <span className="font-bold font-mono">0412-1234567</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100">C.I / RIF:</span>
                        <span className="font-bold font-mono">V-24.582.119</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-100">Zelle:</span>
                        <span className="font-bold">pagos@laestrella.com</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 text-center text-[11px] font-semibold text-emerald-100">
                      ✓ El cliente recibe estos datos listos para pagar en WhatsApp
                    </div>
                  </div>
                )}

                {currentCard.previewType === 'analytics' && (
                  <div className="p-5 sm:p-6 bg-white rounded-3xl border border-gray-200 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-gray-900">Inteligencia Comercial</span>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        7 Días
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-[10px] text-gray-500 font-bold">Ventas (7d)</div>
                        <div className="text-base font-black text-gray-950">$60.00</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-[10px] text-gray-500 font-bold">Conversión</div>
                        <div className="text-base font-black text-emerald-700">2.1%</div>
                      </div>
                    </div>

                    {/* Mini spline sparkline */}
                    <div className="pt-2">
                      <svg className="w-full h-12 text-[#00594C]" viewBox="0 0 100 30" fill="none">
                        <path
                          d="M0 25 Q 25 20, 45 10 T 90 4 T 100 2"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ══ CONTROLS: STEP PLAYER (APPLE LABS CONTROL) & CHEVRONS ══ */}
      <div className="mt-8 flex items-center justify-center gap-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 border border-gray-200/90 shadow-2xs flex items-center justify-center text-gray-700 active:scale-95 transition-all"
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
          onStepChange={(step) => setActiveStep(step)}
          playing={playing}
          onPlayingChange={(p) => setPlaying(p)}
        />

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 border border-gray-200/90 shadow-2xs flex items-center justify-center text-gray-700 active:scale-95 transition-all"
          aria-label="Característica siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
