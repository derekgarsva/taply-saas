'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Bike,
  Store,
  Sparkles,
} from 'lucide-react';
import SlideConfirmWhatsApp from './SlideConfirmWhatsApp';

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  category: string;
  description?: string;
  available: boolean;
  featured?: boolean;
}

interface Business {
  id: string;
  name: string;
  currency: string;
  currencySymbol: string;
  themeColor?: string;
  paymentNotes?: string;
  phone?: string;
}

interface CartBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business;
  cart: Record<string, number>;
  products: Product[];
  totalPrice: number;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderConfirm: (orderType?: 'delivery' | 'pickup', note?: string) => void;
}

export default function CartBottomSheet({
  isOpen,
  onClose,
  business,
  cart,
  products,
  totalPrice,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderConfirm,
}: CartBottomSheetProps) {
  const dragControls = useDragControls();
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerNote, setCustomerNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const cartEntries = Object.entries(cart).filter(([_, qty]) => qty > 0);
  const totalItemsCount = cartEntries.reduce((acc, [_, qty]) => acc + qty, 0);
  const uniqueCount = cartEntries.length;

  const handleConfirmOrder = () => {
    onOrderConfirm(orderType, customerNote);
    onClose();
  };

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

          {/* Bottom Sheet Modal (Arc UI Draggable Sheet) */}
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
            className="relative z-50 w-full max-w-md bg-white rounded-t-[32px] shadow-[0_-16px_48px_rgba(0,0,0,0.18)] flex flex-col max-h-[88vh] overflow-hidden border-t border-gray-100"
          >
            {/* Draggable Handle Bar */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="pt-3 pb-1.5 flex justify-center cursor-grab active:cursor-grabbing touch-none select-none bg-white"
            >
              <div className="w-11 h-1.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors" />
            </div>

            {/* Header: Title + Badges + Close */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="px-5 py-2.5 flex items-center justify-between border-b border-gray-100 cursor-grab active:cursor-grabbing select-none bg-white"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-2xs"
                  style={{ backgroundColor: business.themeColor || '#00594C' }}
                >
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-gray-900 text-base leading-tight">
                    Tu Carrito
                  </h2>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {totalItemsCount} {totalItemsCount === 1 ? 'artículo' : 'artículos'} • {uniqueCount} {uniqueCount === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
                {uniqueCount > 0 && (
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-[11px] font-semibold text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Vaciar
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 flex items-center justify-center transition-colors active:scale-95"
                  aria-label="Cerrar carrito"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Products List */}
            <div className="flex-1 overflow-y-auto px-5 divide-y divide-gray-100 overscroll-contain">
              {cartEntries.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600">Tu carrito está vacío</p>
                  <p className="text-xs text-gray-400 mt-1">Agrega productos del catálogo para continuar</p>
                </div>
              ) : (
                cartEntries.map(([id, qty]) => {
                  const item = products.find((p) => p.id === id);
                  if (!item) return null;
                  const itemTotal = item.price * qty;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.2 }}
                      key={id}
                      className="py-3.5 flex items-center gap-3.5"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {business.currencySymbol}{item.price.toFixed(2)} c/u
                        </p>
                        <span className="font-extrabold text-xs text-gray-900 sm:hidden">
                          {business.currencySymbol}{itemTotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Micro Stepper & Remove */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center bg-gray-100 rounded-full p-0.5 border border-gray-200/60 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(id, -1)}
                            className="w-7 h-7 rounded-full bg-white text-gray-700 hover:text-gray-900 flex items-center justify-center shadow-2xs hover:bg-gray-50 transition-all active:scale-90"
                            aria-label={qty === 1 ? 'Eliminar del carrito' : 'Reducir cantidad'}
                          >
                            {qty === 1 ? (
                              <Trash2 className="w-3 h-3 text-red-500" />
                            ) : (
                              <Minus className="w-3 h-3" />
                            )}
                          </button>

                          <span className="w-6 text-center text-xs font-extrabold text-gray-800 tabular-nums">
                            {qty}
                          </span>

                          <button
                            type="button"
                            onClick={() => onUpdateQty(id, 1)}
                            className="w-7 h-7 rounded-full bg-white text-gray-700 hover:text-gray-900 flex items-center justify-center shadow-2xs hover:bg-gray-50 transition-all active:scale-90"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="hidden sm:block text-right w-16">
                          <span className="font-extrabold text-xs sm:text-sm text-gray-900 tabular-nums">
                            {business.currencySymbol}{itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* Order Options Section: Delivery / Pickup Pill */}
              {cartEntries.length > 0 && (
                <div className="pt-4 pb-3 space-y-3">
                  <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-gray-600 pl-1">
                      Modalidad:
                    </span>
                    <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-200/80 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setOrderType('delivery')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          orderType === 'delivery'
                            ? 'bg-gray-900 text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Delivery</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('pickup')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          orderType === 'pickup'
                            ? 'bg-gray-900 text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Retiro</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer Note Toggle & Input */}
                  {!showNoteInput ? (
                    <button
                      type="button"
                      onClick={() => setShowNoteInput(true)}
                      className="text-[11px] font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1 pl-1"
                    >
                      <span>+ Agregar nota para el comercio</span>
                    </button>
                  ) : (
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={customerNote}
                        onChange={(e) => setCustomerNote(e.target.value)}
                        placeholder="Ej. Sin cebolla, llamar al llegar..."
                        className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-800 placeholder-gray-400"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer: Subtotal + WhatsApp Slider (Full Width Inside Drawer) */}
            <div className="p-4 pt-3 border-t border-gray-100 bg-white space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-medium text-gray-500">Total a Pagar</span>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-gray-900 tabular-nums">
                    {business.currencySymbol}{totalPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold ml-1">
                    {business.currency}
                  </span>
                </div>
              </div>

              {/* Full Width Slider Inside Bottom Sheet */}
              <div className="w-full">
                <SlideConfirmWhatsApp
                  total={totalPrice}
                  currencySymbol={business.currencySymbol}
                  onConfirm={handleConfirmOrder}
                  disabled={totalPrice === 0}
                  accentColor={business.themeColor}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
