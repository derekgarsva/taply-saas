'use client';

// ============================================================================
// PANTALLA DE IPHONE MINIMALISTA (100% LIMPIA Y AUTOCONTENIDA — SIN MARCOS)
// ============================================================================
//  1. Pantalla de iPhone sin marcos exteriores (curva continua limpia de 48px)
//  2. Barra de estado iOS alineada al píxel (9:41 + Luna + Señal + Wi-Fi + Batería)
//  3. Dynamic Island negra completamente limpia (sin elementos duplicados)
//  4. Catálogo digital real e interactivo de Taply (sin imagen de iPhone dentro)
//  5. Home Indicator inferior estilo Apple
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export interface IphoneMinimalPlayerProps {
  businessName?: string;
  slug?: string;
  themeColor?: string;
  interactive?: boolean;
  defaultVideoSrc?: string;
}

export default function IphoneMinimalPlayer({
  businessName = 'Panadería La Estrella',
  slug = 'panaderia-la-estrella',
  themeColor = '#00594C',
  interactive = true,
}: IphoneMinimalPlayerProps) {
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
    if (!interactive) return;
    setCartCount((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const handleSimulateOrder = () => {
    if (!interactive) return;
    setOrderSent(true);
    if (typeof window !== 'undefined') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.75 },
          colors: [themeColor, '#10B981', '#F59E0B'],
        });
      } catch {}
    }
    setTimeout(() => {
      setOrderSent(false);
    }, 3500);
  };

  return (
    <div className="flex items-center justify-center select-none">
      {/* PANTALLA DE IPHONE MINIMALISTA SIN MARCOS EXTERIORES (Curva continua de 48px) */}
      <div
        className="relative w-[320px] sm:w-[336px] h-[670px] sm:h-[712px] rounded-[48px] overflow-hidden bg-[#FFFFFF]
                   shadow-[0_25px_60px_-12px_rgba(0,0,0,0.38),0_10px_24px_-8px_rgba(0,0,0,0.22)] flex flex-col justify-between"
      >
        {/* ══ 1. Barra de Estado iOS + Dynamic Island al píxel ══ */}
        <div className="absolute top-0 inset-x-0 h-[48px] px-6 flex items-center justify-between z-30 text-[#111827] pointer-events-none">
          {/* Izquierda: Hora 9:41 + Luna de concentración a la misma altura */}
          <div
            className="flex items-center gap-[4px] w-[72px] h-[12px]"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}
          >
            <span className="text-[14px] font-semibold leading-none tracking-[-0.025em] inline-block translate-y-[0.5px]">
              9:41
            </span>
            <svg className="w-[11.5px] h-[11.5px] text-[#111827] shrink-0" fill="currentColor" viewBox="0 0 12 12">
              <path d="M9.65 7.92A4.65 4.65 0 0 1 4.08 2.35c0-.52.09-1.02.25-1.48A5.05 5.05 0 1 0 11.13 7.67c-.46.16-.96.25-1.48.25Z" />
            </svg>
          </div>

          {/* Centro: Dynamic Island negra limpia (sin elementos internos) */}
          <div className="w-[96px] h-[26px] bg-black rounded-full shadow-sm" />

          {/* Derecha: Señal + Wi-Fi + Batería alineados */}
          <div className="flex items-center justify-end gap-[5px] w-[72px] h-[12px]">
            <svg className="w-[16px] h-[11px] shrink-0" fill="currentColor" viewBox="0 0 17 12">
              <rect x="0.5" y="7.6" width="2.55" height="3.4" rx="1" />
              <rect x="4.8" y="5.5" width="2.55" height="5.5" rx="1" />
              <rect x="9.1" y="3.3" width="2.55" height="7.7" rx="1" />
              <rect x="13.4" y="1.0" width="2.55" height="10.0" rx="1" />
            </svg>
            <svg className="w-[15px] h-[11px] shrink-0" fill="currentColor" viewBox="0 0 16 12">
              <path d="M8 11.0a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9Z" />
              <path d="M4.55 7.25a4.9 4.9 0 0 1 6.9 0 .85.85 0 0 0 1.2-1.2 6.6 6.6 0 0 0-9.3 0 .85.85 0 0 0 1.2 1.2Z" />
              <path d="M1.65 4.35a9.0 9.0 0 0 1 12.7 0 .85.85 0 0 0 1.2-1.2 10.7 10.7 0 0 0-15.1 0 .85.85 0 0 0 1.2 1.2Z" />
            </svg>
            <svg className="w-[23px] h-[11px] shrink-0" viewBox="0 0 25 12" fill="none">
              <rect x="0.75" y="1.0" width="20.5" height="10.0" rx="3.1" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
              <rect x="2.35" y="2.6" width="17.3" height="6.8" rx="1.7" fill="currentColor" />
              <path d="M22.6 4.25v3.5a1.75 1.75 0 0 0 0-3.5Z" fill="currentColor" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* ══ 2. INTERIOR: CATÁLOGO DIGITAL REAL DE TAPLY (SIN IMAGEN DE IPHONE DENTRO) ══ */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pt-[48px]">
          {/* Header del Comercio */}
          <div className="relative h-28 bg-[#00594C] flex-shrink-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            </div>

            {/* Avatar del Comercio */}
            <div className="absolute -bottom-5 left-4 flex items-end gap-2.5 z-10">
              <div className="w-12 h-12 rounded-2xl bg-white p-0.5 shadow-md flex-shrink-0 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=120&q=80"
                  alt="Logo"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <div className="mb-0.5">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-xs text-white drop-shadow-sm truncate max-w-[170px]">
                    {businessName}
                  </span>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </div>
                </div>
                <span className="text-[10px] text-white/90 drop-shadow-sm block font-medium">
                  Maracaibo, Zulia · Abierto ahora
                </span>
              </div>
            </div>
          </div>

          {/* Social Proof + Tags */}
          <div className="pt-7 px-4 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
              <span className="text-amber-500 font-bold">★ 4.9</span>
              <span>· 128 pedidos hoy</span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#00594C] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Menú Digital
            </span>
          </div>

          {/* Lista de Productos con Steppers Interactivos */}
          <div className="px-3 space-y-2 flex-1 pb-4">
            {products.map((prod) => {
              const count = cartCount[prod.id] || 0;
              return (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-2 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[11px] text-gray-900 truncate block">
                          {prod.name}
                        </span>
                        {prod.badge && (
                          <span className="text-[8px] font-black bg-amber-400 text-amber-950 px-1 py-0.2 rounded-md">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-extrabold text-[#00594C] block mt-0.5">
                        ${prod.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Stepper +/- */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    {count > 0 ? (
                      <>
                        <button
                          type="button"
                          onClick={() => updateQty(prod.id, -1)}
                          className="w-5 h-5 rounded-lg bg-white shadow-xs border border-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs hover:bg-gray-100 active:scale-90 transition-all"
                        >
                          -
                        </button>
                        <span className="font-bold text-[11px] text-gray-900 w-3.5 text-center">
                          {count}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(prod.id, 1)}
                          className="w-5 h-5 rounded-lg bg-[#00594C] text-white flex items-center justify-center font-bold text-xs hover:bg-[#00463C] active:scale-90 transition-all"
                        >
                          +
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => updateQty(prod.id, 1)}
                        className="px-2 py-0.5 rounded-lg bg-[#00594C] text-white text-[10px] font-bold hover:bg-[#00463C] active:scale-95 transition-all"
                      >
                        + Añadir
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ 3. BARRA INFERIOR FIJA: CHECKOUT DIRECTO POR WHATSAPP ══ */}
        <div className="px-4 pt-2 pb-2 bg-white/95 border-t border-gray-100 flex-shrink-0 z-20 backdrop-blur-md">
          <AnimatePresence mode="wait">
            {orderSent ? (
              <motion.div
                key="sent"
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="w-full py-2.5 px-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center"
              >
                <div className="flex items-center justify-center gap-1.5 text-[#00594C] font-extrabold text-[11px]">
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Abriendo WhatsApp con tu pedido!</span>
                </div>
                <p className="text-[9px] text-gray-500 mt-0.5">
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
            Desliza o toca para confirmar · Sin comisiones
          </p>

          {/* iOS Home Indicator Bar */}
          <div className="w-24 h-1 bg-[#111827] rounded-full mx-auto mt-2 opacity-80" />
        </div>
      </div>
    </div>
  );
}

// Alias export to maintain backward compatibility
export { IphoneMinimalPlayer as IPhoneMockup };
