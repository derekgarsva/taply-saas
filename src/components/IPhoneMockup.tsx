'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Instagram, MapPin, Phone, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { IPHONE_4K_FRAME } from './iphoneFrameData';

interface IPhoneMockupProps {
  businessName?: string;
  slug?: string;
  themeColor?: string;
  interactive?: boolean;
}

export default function IPhoneMockup({
  businessName = 'Panadería La Estrella',
  slug = 'panaderia-la-estrella',
  themeColor = '#00594C',
  interactive = true,
}: IPhoneMockupProps) {
  const [cartCount, setCartCount] = useState<Record<string, number>>({
    'pan-jamon': 1,
    'golfeado': 2,
    'cachito': 0,
  });

  const [orderSent, setOrderSent] = useState(false);

  const products = [
    {
      id: 'pan-jamon',
      name: 'Pan de Jamón Tradicional',
      price: 30.0,
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=300&q=80',
      badge: 'TOP',
    },
    {
      id: 'golfeado',
      name: 'Golfeado con Queso de Mano',
      price: 3.5,
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=300&q=80',
      badge: null,
    },
    {
      id: 'cachito',
      name: 'Cachito de Jamón Ahumado',
      price: 2.5,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
      badge: null,
    },
  ];

  const total = Object.entries(cartCount).reduce((acc, [id, qty]) => {
    const prod = products.find((p) => p.id === id);
    return acc + (prod ? prod.price * qty : 0);
  }, 0);

  const totalItems = Object.values(cartCount).reduce((a, b) => a + b, 0);

  const updateQty = (id: string, delta: number) => {
    setCartCount((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const handleSimulateOrder = () => {
    setOrderSent(true);
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
    setTimeout(() => {
      setOrderSent(false);
    }, 3500);
  };

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[365px] mx-auto select-none">
      {/* Soft Ambient Ground Shadow (same as Agendod) */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-12 bg-black/20 rounded-[100%] blur-2xl pointer-events-none z-0"
        style={{ transform: 'translateX(-50%) scaleY(0.4)' }}
      />

      {/* Frame Aspect Ratio Box matching exact 1140x2320 dimensions */}
      <div className="relative w-full aspect-[1140/2320] z-10 transition-transform duration-300 hover:scale-[1.01]">
        {/* ══ 1. LIVE TAPLY UI INTERIOR (Fitted precisely inside the 1014x2203 screen area: 88.95% x 94.96%) ══ */}
        <div
          className="absolute overflow-hidden bg-[#FFFFFF] flex flex-col justify-between text-left z-10 font-sans"
          style={{
            left: '5.18%',
            top: '2.37%',
            width: '88.95%',
            height: '94.96%',
            borderRadius: '42px',
          }}
        >
          {/* iOS Status Bar with Dynamic Island spacing */}
          <div className="relative z-30 pt-3 px-6 flex items-center justify-between text-[#1d1d1f] text-[11px] font-semibold">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <div className="flex items-end gap-[1px] h-2">
                <span className="w-[1.5px] h-[2.5px] bg-[#1d1d1f] rounded-xs" />
                <span className="w-[1.5px] h-[4px] bg-[#1d1d1f] rounded-xs" />
                <span className="w-[1.5px] h-[6px] bg-[#1d1d1f] rounded-xs" />
                <span className="w-[1.5px] h-[7.5px] bg-[#1d1d1f] rounded-xs" />
              </div>
              <span className="font-bold tracking-tighter text-[9.5px]">5G</span>
              <div className="w-4 h-2 rounded-[2px] border border-[#1d1d1f] p-[0.5px] flex items-center">
                <div className="w-full h-full bg-[#1d1d1f] rounded-[0.5px]" />
              </div>
            </div>
          </div>

          {/* Main Content Area (Scrollable if needed, padded below Dynamic Island) */}
          <div className="pt-2 px-3.5 pb-2 flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar">
            {/* Top Store URL Pill / Push Notification */}
            <div className="mb-2 bg-[#F3F4F6] border border-gray-200/80 rounded-xl p-2 flex items-center justify-between text-[10.5px] tracking-tight shadow-2xs">
              <div className="flex items-center gap-1.5 truncate">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="font-bold text-gray-900 truncate">taply.app/{slug}</span>
              </div>
              <span className="text-[9.5px] font-extrabold text-[#00594C] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex-shrink-0">
                En vivo
              </span>
            </div>

            {/* Store Cover & Identity Card */}
            <div className="relative rounded-2xl overflow-hidden mb-2.5 border border-gray-100 shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80"
                alt={businessName}
                className="w-full h-20 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-2.5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[8.5px] font-extrabold text-emerald-300 uppercase tracking-wider">
                      PANADERÍA ARTESANAL
                    </span>
                    <h3 className="font-extrabold text-[13.5px] leading-tight flex items-center gap-1 text-white">
                      <span>{businessName}</span>
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 text-black flex items-center justify-center text-[8px] font-bold">
                        ✓
                      </span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-amber-300 font-bold block">★★★★★</span>
                    <span className="text-[8px] text-gray-200">Maracay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MultiLink Social Bar */}
            <div className="flex items-center justify-between gap-1.5 mb-2.5">
              <div className="flex-1 py-1 px-1.5 rounded-lg bg-gray-100/90 text-gray-700 text-[9.5px] font-bold flex items-center justify-center gap-1">
                <Instagram className="w-2.5 h-2.5 text-pink-600" />
                <span className="truncate">Instagram</span>
              </div>
              <div className="flex-1 py-1 px-1.5 rounded-lg bg-gray-100/90 text-gray-700 text-[9.5px] font-bold flex items-center justify-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                <span className="truncate">Ubicación</span>
              </div>
              <div className="flex-1 py-1 px-1.5 rounded-lg bg-gray-100/90 text-gray-700 text-[9.5px] font-bold flex items-center justify-center gap-1">
                <Phone className="w-2.5 h-2.5 text-blue-600" />
                <span className="truncate">Llamar</span>
              </div>
            </div>

            {/* Products List (Interactive) */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between text-[9.5px] font-extrabold uppercase tracking-wider text-gray-400 px-0.5">
                <span>Catálogo de Hoy</span>
                <span className="text-[#00594C]">3 toques</span>
              </div>

              {products.map((p) => {
                const qty = cartCount[p.id] || 0;
                return (
                  <div
                    key={p.id}
                    className="p-2 bg-white rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between gap-2 transition-all hover:border-gray-200"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-[11px] text-gray-900 truncate leading-tight">
                            {p.name}
                          </p>
                          {p.badge && (
                            <span className="text-[7.5px] font-extrabold bg-amber-100 text-amber-800 px-1 rounded">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-extrabold text-[#00594C] mt-0.5">
                          ${p.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Stepper / Add button */}
                    {interactive ? (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {qty > 0 ? (
                          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              type="button"
                              onClick={() => updateQty(p.id, -1)}
                              className="w-5 h-5 rounded-md bg-white text-gray-700 font-bold text-[10px] flex items-center justify-center shadow-2xs"
                            >
                              -
                            </motion.button>
                            <span className="w-5 text-center font-extrabold text-[10.5px] text-gray-900">
                              {qty}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              type="button"
                              onClick={() => updateQty(p.id, 1)}
                              className="w-5 h-5 rounded-md bg-[#00594C] text-white font-bold text-[10px] flex items-center justify-center shadow-2xs"
                            >
                              +
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            type="button"
                            onClick={() => updateQty(p.id, 1)}
                            className="h-6 px-2 bg-gray-100 hover:bg-[#00594C] hover:text-white text-gray-800 rounded-lg text-[9.5px] font-bold transition-colors"
                          >
                            + Añadir
                          </motion.button>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-[#00594C] bg-emerald-50 px-2 py-0.5 rounded-full">
                        {qty} añadido
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pinned Bottom Checkout Bar (Always fixed at bottom of screen, never scrolls away) */}
          <div className="px-3.5 pt-2 pb-2.5 border-t border-gray-100/90 bg-white/95 backdrop-blur-md flex-shrink-0 z-20">
            <AnimatePresence mode="wait">
              {orderSent ? (
                <motion.div
                  key="sent"
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.94, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="w-full py-2 px-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center"
                >
                  <div className="flex items-center justify-center gap-1.5 text-[#00594C] font-extrabold text-[11px]">
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Abriendo WhatsApp con tu pedido!</span>
                  </div>
                  <p className="text-[8.5px] text-gray-500 mt-0.5">
                    Total: ${total.toFixed(2)} · Datos de pago adjuntos
                  </p>
                </motion.div>
              ) : (
                <motion.button
                  key="btn"
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleSimulateOrder}
                  className="w-full py-2.5 px-3 rounded-2xl bg-[#00594C] hover:bg-[#00463C] text-white flex items-center justify-between font-extrabold text-[11px] shadow-sm transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Pedir por WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
                      ${total.toFixed(2)}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.button>
              )}
            </AnimatePresence>

            <p className="text-center text-[8.5px] text-gray-400 mt-1">
              Desliza o toca para confirmar · Sin registro
            </p>

            {/* iOS Home Indicator Bar */}
            <div className="w-24 h-[3.5px] bg-[#111827] rounded-full mx-auto mt-2 opacity-80" />
          </div>
        </div>

        {/* ══ 2. AUTHENTIC 4K IPHONE STUDIO FRAME (Extracted from 4500x3000px master) ══ */}
        <img
          src="/iphone-4k-frame.png"
          onError={(e) => {
            e.currentTarget.src = IPHONE_4K_FRAME;
          }}
          alt="iPhone 17 Pro Studio Mockup"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
          style={{
            filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.18))',
          }}
        />
      </div>
    </div>
  );
}
