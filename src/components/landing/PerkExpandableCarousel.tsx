'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronRight, CheckCircle2, ShieldCheck, Zap, AlertTriangle, Truck, Sparkles } from 'lucide-react';

interface Slide {
  id: string;
  tag: string;
  title: string;
  desc: string;
  previewHeading: string;
  previewSub: string;
  badge: string;
}

const slides: Slide[] = [
  {
    id: 's1',
    tag: 'Control de Tasas',
    title: 'Control sin el caos del recálculo a mano',
    desc: 'Un solo switch para fijar la tasa activa del día. El catálogo entero recalcula automáticamente los precios en Bolívares y Dólares con precisión matemática, eliminando discusiones en chat.',
    previewHeading: 'Tasa BCV: 124.50 Bs / USD',
    previewSub: 'Catálogo sincronizado al 100%',
    badge: '1 Clic',
  },
  {
    id: 's2',
    tag: 'Gestión por Gestos',
    title: 'Maneja tus pedidos como revisas tu bandeja',
    desc: 'Swipe a la derecha (verde) para confirmar el pago, marcar status = "pagado" y descontar atómicamente el stock en Supabase. Swipe a la izquierda para descartar sin tocar el inventario.',
    previewHeading: 'Swipe Actions Táctiles',
    previewSub: 'Confirmación instantánea en 0.2s',
    badge: 'Framer Motion',
  },
  {
    id: 's3',
    tag: 'Subpanel de Despacho',
    title: 'Despacho blindado sin fugas de información',
    desc: 'Vista aislada para motorizados y personal de empaque. No expone precios, márgenes ni configuraciones del negocio, e incluye candado de asignación para que dos repartidores nunca tomen la misma orden.',
    previewHeading: 'Retiro en Local vs Delivery',
    previewSub: 'Candado anti-colisiones para repartidores',
    badge: 'Roles Aislados',
  },
  {
    id: 's4',
    tag: 'El Dolor Resuelto',
    title: 'La regla de los 5 minutos en WhatsApp',
    desc: 'El 80% de las ventas en chat se pierden si no respondes en los primeros 5 minutos. Con Taply, el cliente agrega, cotiza y envía el pedido completo en 30 segundos mientras tú duermes.',
    previewHeading: '-80% ventas perdidas',
    previewSub: 'Ventas cerradas en autoservicio',
    badge: 'Cero Esperas',
  },
  {
    id: 's5',
    tag: 'Control de Stock',
    title: 'Cierre atómico de inventario en tiempo real',
    desc: 'Cada producto tiene conteo unitario en vivo. Si se agota, el catálogo muestra "Agotado" inmediatamente, impidiendo sobreventas y cancelaciones incómodas.',
    previewHeading: 'Stock en Tiempo Real',
    previewSub: 'Sincronizado vía Supabase Realtime',
    badge: 'Inventario Vivo',
  },
];

export default function PerkExpandableCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleStepClick = (index: number) => {
    setActiveIndex(index);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section id="carrusel" className="py-20 sm:py-28 bg-neutral-950 border-t border-neutral-800/80 overflow-hidden text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flujo Operativo Interactivo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
            Potente para el dueño, sin esfuerzo para el cliente
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
            Diseñamos cada pantalla para eliminar el trabajo repetitivo, proteger tus márgenes en bolívares y convertir chats en ventas confirmadas.
          </p>
        </div>

        {/* ── EXPANDABLE CAROUSEL CONTAINER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Cards List / Stepper */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-2.5">
            {slides.map((s, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStepClick(index)}
                  className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative ${
                    isActive
                      ? 'bg-neutral-900 border-emerald-500/60 shadow-xl shadow-emerald-950/20'
                      : 'bg-neutral-950 border-neutral-800/80 hover:bg-neutral-900/60'
                  }`}
                >
                  {/* Active highlight line */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSlideIndicatorDark"
                      className="absolute left-0 top-3 bottom-3 w-1.5 bg-emerald-500 rounded-r-full"
                    />
                  )}

                  <div className="flex items-center justify-between mb-1 pl-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400">
                      {s.tag}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {s.badge}
                    </span>
                  </div>

                  <h3
                    className={`text-[15px] sm:text-[16px] font-bold pl-1 transition-colors ${
                      isActive ? 'text-white' : 'text-neutral-400'
                    }`}
                  >
                    {s.title}
                  </h3>
                </button>
              );
            })}
          </div>

          {/* Right Showcase Display */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl p-7 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={slides[activeIndex].id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="relative z-10 space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <span>{slides[activeIndex].tag}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
                  {slides[activeIndex].title}
                </h3>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl font-normal">
                  {slides[activeIndex].desc}
                </p>

                {/* Visual card simulator */}
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[16px] font-black text-white">
                        {slides[activeIndex].previewHeading}
                      </div>
                      <div className="text-xs text-emerald-400 font-semibold mt-0.5">
                        {slides[activeIndex].previewSub}
                      </div>
                    </div>
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Step Player Controller */}
            <div className="mt-8 pt-6 border-t border-neutral-800 relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleStepClick(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? 'w-8 bg-emerald-500'
                        : 'w-2 bg-neutral-700 hover:bg-neutral-600'
                    }`}
                    aria-label={`Ir al paso ${i + 1}`}
                  />
                ))}
              </div>

              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label={isPlaying ? 'Pausar carrusel' : 'Reproducir carrusel'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
