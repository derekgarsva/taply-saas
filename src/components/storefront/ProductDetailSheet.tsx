'use client';

import React from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Plus, Minus, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '@/types';
import NotifySoldOut from './NotifySoldOut';

interface ProductDetailSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  currency: string;
  themeColor?: string;
  quantity: number;
  onUpdateQty: (delta: number) => void;
  onSetQty: (count: number) => void;
}

export default function ProductDetailSheet({
  product,
  isOpen,
  onClose,
  currencySymbol,
  currency,
  themeColor = '#00594C',
  quantity,
  onUpdateQty,
  onSetQty,
}: ProductDetailSheetProps) {
  const dragControls = useDragControls();

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs z-40"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 32,
              stiffness: 340,
              mass: 0.9,
            }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.65 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 280) {
                onClose();
              }
            }}
            className="relative z-50 w-full max-w-md bg-white rounded-t-[32px] shadow-[0_-16px_48px_rgba(0,0,0,0.18)] flex flex-col max-h-[90vh] overflow-hidden border-t border-gray-100"
          >
            {/* Draggable Handle Bar */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing touch-none select-none bg-white"
            >
              <div className="w-11 h-1.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors" />
            </div>

            {/* Top Close Button (floating right) */}
            <div className="px-5 pt-1 pb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {product.category}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 flex items-center justify-center transition-colors active:scale-95"
                aria-label="Cerrar detalle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-6 overscroll-contain space-y-4">
              {/* Product Hero Image */}
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-2xs">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Sparkles className="w-12 h-12 text-gray-300" />
                  </div>
                )}

                {product.featured && (
                  <div className="absolute top-2.5 left-2.5 bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                    POPULAR
                  </div>
                )}

                {!product.available && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      Agotado Temporalmente
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-extrabold text-gray-900 text-xl leading-tight">
                    {product.name}
                  </h2>
                  <div className="text-right flex-shrink-0">
                    <span className="font-extrabold text-gray-900 text-lg">
                      {currencySymbol}{product.price.toFixed(2)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="block text-xs text-gray-400 line-through">
                        {currencySymbol}{product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      product.available ? 'text-emerald-600' : 'text-gray-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        product.available ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                    />
                    {product.available ? 'Disponible para ordenar' : 'No disponible'}
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Descripción
                </h3>
                {product.description ? (
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line font-normal">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    Sin descripción adicional.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 pt-3 border-t border-gray-100 bg-white">
              {product.available ? (
                quantity === 0 ? (
                  <button
                    type="button"
                    onClick={() => onUpdateQty(1)}
                    className="w-full h-12 rounded-2xl text-white font-bold text-sm shadow-md flex items-center justify-between px-5 active:scale-98 transition-transform"
                    style={{ backgroundColor: themeColor }}
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Añadir al pedido</span>
                    </span>
                    <span className="tabular-nums">
                      {currencySymbol}{product.price.toFixed(2)}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    <div className="flex items-center bg-white rounded-xl p-1 border border-gray-200/80 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(-1)}
                        className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center transition-colors active:scale-90"
                        aria-label="Reducir cantidad"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-10 text-center text-sm font-extrabold text-gray-900 tabular-nums">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => onUpdateQty(1)}
                        className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center transition-colors active:scale-90"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right pr-2">
                      <span className="text-[10px] text-gray-400 block font-semibold">Subtotal</span>
                      <span className="text-sm font-extrabold text-gray-900 tabular-nums">
                        {currencySymbol}{(product.price * quantity).toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors active:scale-95"
                    >
                      Listo
                    </button>
                  </div>
                )
              ) : (
                <NotifySoldOut accentColor={themeColor} productName={product.name} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
