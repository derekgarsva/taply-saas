'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Bike,
  Store,
  User,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import SlideConfirmWhatsApp from './SlideConfirmWhatsApp';
import { Product, Business } from '@/types';

export interface OrderCustomerDetails {
  orderType: 'delivery' | 'pickup';
  customerName: string;
  deliveryAddress?: string;
  customerNote?: string;
  paymentMethod?: string;
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
  onOrderConfirm: (details: OrderCustomerDetails) => void;
  onSelectProduct?: (product: Product) => void;
}

const PAYMENT_METHODS = [
  { id: 'Pago Móvil', label: 'Pago Móvil', icon: '📱' },
  { id: 'Zelle', label: 'Zelle', icon: '⚡' },
  { id: 'Efectivo Divisas', label: 'Efectivo ($)', icon: '💵' },
  { id: 'Binance USDT', label: 'Binance', icon: '🟡' },
];

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
  onSelectProduct,
}: CartBottomSheetProps) {
  const dragControls = useDragControls();

  // Checkout inputs state
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pago Móvil');
  const [customerNote, setCustomerNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Restore saved details from LocalStorage on mount/open (Rule of 3 Touches)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedType = localStorage.getItem('taply_delivery_type');
      if (savedType === 'delivery' || savedType === 'pickup') {
        setOrderType(savedType);
      }
      const savedName = localStorage.getItem('taply_customer_name');
      if (savedName) setCustomerName(savedName);

      const savedAddress = localStorage.getItem('taply_customer_address');
      if (savedAddress) setDeliveryAddress(savedAddress);

      const savedMethod = localStorage.getItem('taply_payment_method');
      if (savedMethod) setPaymentMethod(savedMethod);
    } catch {}
  }, [isOpen]);

  const cartEntries = Object.entries(cart).filter(([_, qty]) => qty > 0);
  const totalItemsCount = cartEntries.reduce((acc, [_, qty]) => acc + qty, 0);
  const uniqueCount = cartEntries.length;

  const handleTypeChange = (type: 'delivery' | 'pickup') => {
    setOrderType(type);
    setErrorMessage(null);
    try {
      localStorage.setItem('taply_delivery_type', type);
    } catch {}
  };

  const handleNameChange = (val: string) => {
    setCustomerName(val);
    if (errorMessage) setErrorMessage(null);
    try {
      localStorage.setItem('taply_customer_name', val);
    } catch {}
  };

  const handleAddressChange = (val: string) => {
    setDeliveryAddress(val);
    if (errorMessage) setErrorMessage(null);
    try {
      localStorage.setItem('taply_customer_address', val);
    } catch {}
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    try {
      localStorage.setItem('taply_payment_method', method);
    } catch {}
  };

  // Validation logic
  const isNameMissing = !customerName.trim();
  const isAddressMissing = orderType === 'delivery' && !deliveryAddress.trim();
  const isReadyToOrder = !isNameMissing && !isAddressMissing && totalPrice > 0;

  let slideLabel = 'Desliza para pedir por WhatsApp';
  if (totalPrice === 0) {
    slideLabel = 'Tu carrito está vacío';
  } else if (isNameMissing) {
    slideLabel = 'Escribe tu nombre para pedir';
  } else if (isAddressMissing) {
    slideLabel = 'Indica dirección para delivery';
  }

  const handleConfirmOrder = () => {
    if (isNameMissing) {
      setErrorMessage('Por favor escribe tu nombre para el pedido.');
      return;
    }
    if (isAddressMissing) {
      setErrorMessage('Por favor indica tu dirección y punto de referencia.');
      return;
    }

    onOrderConfirm({
      orderType,
      customerName: customerName.trim(),
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      customerNote: customerNote.trim() || undefined,
      paymentMethod,
    });
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
            className="relative z-50 w-full max-w-md bg-white rounded-t-[32px] shadow-[0_-16px_48px_rgba(0,0,0,0.18)] flex flex-col max-h-[90vh] overflow-hidden border-t border-gray-100"
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

            {/* Scrollable Content */}
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
                <>
                  {/* Products list */}
                  <div className="divide-y divide-gray-100">
                    {cartEntries.map(([id, qty]) => {
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
                          className="py-3 flex items-center gap-3"
                        >
                          {/* Clickable Product Thumbnail */}
                          <button
                            type="button"
                            onClick={() => onSelectProduct?.(item)}
                            className="w-13 h-13 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 relative group cursor-pointer text-left transition-transform active:scale-95"
                            aria-label={`Ver detalles de ${item.name}`}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <ShoppingBag className="w-5 h-5" />
                              </div>
                            )}
                          </button>

                          {/* Clickable Product Details */}
                          <div
                            onClick={() => onSelectProduct?.(item)}
                            className="flex-1 min-w-0 cursor-pointer group select-none"
                          >
                            <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate group-hover:text-emerald-700 transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                              {business.currencySymbol}{item.price.toFixed(2)} c/u
                            </p>
                          </div>

                          {/* Micro Stepper */}
                          <div className="flex items-center gap-1.5 flex-shrink-0 bg-gray-100 rounded-full p-0.5 border border-gray-200/60 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(id, -1)}
                              className="w-6 h-6 rounded-full bg-white text-gray-700 hover:text-gray-900 flex items-center justify-center shadow-2xs hover:bg-gray-50 transition-all active:scale-90"
                              aria-label={qty === 1 ? 'Eliminar del carrito' : 'Reducir cantidad'}
                            >
                              {qty === 1 ? (
                                <Trash2 className="w-2.5 h-2.5 text-red-500" />
                              ) : (
                                <Minus className="w-2.5 h-2.5" />
                              )}
                            </button>

                            <span className="w-5 text-center text-xs font-extrabold text-gray-800 tabular-nums">
                              {qty}
                            </span>

                            <button
                              type="button"
                              onClick={() => onUpdateQty(id, 1)}
                              className="w-6 h-6 rounded-full bg-white text-gray-700 hover:text-gray-900 flex items-center justify-center shadow-2xs hover:bg-gray-50 transition-all active:scale-90"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          {/* Item total */}
                          <div className="text-right w-14 flex-shrink-0">
                            <span className="font-extrabold text-xs text-gray-900 tabular-nums">
                              {business.currencySymbol}{itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* ══ CHECKOUT MINIMAL FIELDS (REGLA DE 3 TOQUES) ══ */}
                  <div className="pt-4 pb-4 space-y-3.5">
                    {/* 1. Selector Visual Toggle: Retiro en Local vs Delivery */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                          Modalidad de Entrega
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          Selecciona 1 opción
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-gray-100/90 p-1 rounded-2xl border border-gray-200/60 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleTypeChange('pickup')}
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all ${
                            orderType === 'pickup'
                              ? 'bg-white text-gray-900 shadow-sm border border-gray-200/80 scale-[1.01]'
                              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/40'
                          }`}
                        >
                          <Store className={`w-4 h-4 ${orderType === 'pickup' ? 'text-[#00594C]' : 'text-gray-400'}`} />
                          <span>Retiro en local</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTypeChange('delivery')}
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all ${
                            orderType === 'delivery'
                              ? 'bg-white text-gray-900 shadow-sm border border-gray-200/80 scale-[1.01]'
                              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/40'
                          }`}
                        >
                          <Bike className={`w-4 h-4 ${orderType === 'delivery' ? 'text-[#00594C]' : 'text-gray-400'}`} />
                          <span>Delivery</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. Dynamic Minimum Inputs */}
                    <div className="space-y-2.5">
                      {/* Input "Tu nombre" (Siempre presente) */}
                      <div>
                        <label className="flex items-center justify-between text-[11px] font-bold text-gray-700 mb-1">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            <span>Tu nombre</span>
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            {customerName ? '✓ Guardado' : 'Requerido'}
                          </span>
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="Ej. Carlos Pérez"
                          className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-gray-50/70 focus:bg-white focus:outline-none transition-all text-gray-900 placeholder-gray-400 ${
                            isNameMissing && errorMessage
                              ? 'border-red-400 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-300'
                          }`}
                        />
                      </div>

                      {/* Input "Dirección y punto de referencia" (Solo si es Delivery) */}
                      <AnimatePresence>
                        {orderType === 'delivery' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden space-y-1"
                          >
                            <label className="flex items-center justify-between text-[11px] font-bold text-gray-700 mb-1 pt-0.5">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                <span>Dirección y punto de referencia</span>
                              </span>
                              <span className="text-[10px] text-emerald-600 font-semibold">
                                {deliveryAddress ? '✓ Guardado' : 'Requerido'}
                              </span>
                            </label>
                            <input
                              type="text"
                              value={deliveryAddress}
                              onChange={(e) => handleAddressChange(e.target.value)}
                              placeholder="Ej. Av. 4 Bella Vista, Edif. Azul, Apto 3B. Frente al semáforo"
                              className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-gray-50/70 focus:bg-white focus:outline-none transition-all text-gray-900 placeholder-gray-400 ${
                                isAddressMissing && errorMessage
                              ? 'border-red-400 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-300'
                              }`}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 3. Selector de Método de Pago (Pills Rápidos 1 Toque) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                          <span>Método de Pago</span>
                        </span>
                        <span className="text-[10px] text-gray-400">
                          Se confirma por WhatsApp
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {PAYMENT_METHODS.map((method) => {
                          const isSelected = paymentMethod === method.id;
                          return (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => handlePaymentMethodChange(method.id)}
                              className={`py-2 px-2.5 rounded-xl text-left border text-xs font-bold transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'border-[#00594C] bg-emerald-50/60 text-[#00594C] ring-1 ring-[#00594C]/20 shadow-2xs'
                                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span>{method.icon}</span>
                                <span className="truncate text-[11px]">{method.label}</span>
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="w-3 h-3 text-[#00594C] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Customer Note Toggle & Input */}
                    <div>
                      {!showNoteInput ? (
                        <button
                          type="button"
                          onClick={() => setShowNoteInput(true)}
                          className="text-[11px] font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1 pt-1"
                        >
                          <span>+ Agregar nota para el comercio (opcional)</span>
                        </button>
                      ) : (
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                            <span>Nota para el comercio:</span>
                            <button
                              type="button"
                              onClick={() => {
                                setShowNoteInput(false);
                                setCustomerNote('');
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              Quitar
                            </button>
                          </div>
                          <input
                            type="text"
                            value={customerNote}
                            onChange={(e) => setCustomerNote(e.target.value)}
                            placeholder="Ej. Sin cebolla, llamar al llegar, salsa aparte..."
                            className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-gray-800 placeholder-gray-400"
                          />
                        </div>
                      )}
                    </div>

                    {/* Inline Validation Alert */}
                    <AnimatePresence>
                      {errorMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{errorMessage}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>

            {/* Footer: Subtotal + WhatsApp Slider */}
            {cartEntries.length > 0 && (
              <div className="p-4 pt-3 border-t border-gray-100 bg-white space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 block leading-tight">Total a Pagar</span>
                    <span className="text-[10px] text-gray-400 font-medium">Aceptamos Bs a tasa BCV</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-gray-900 tabular-nums">
                      {business.currencySymbol}{totalPrice.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-gray-400 font-bold ml-1">
                      {business.currency}
                    </span>
                  </div>
                </div>

                {/* Slider Button */}
                <div className="w-full">
                  <SlideConfirmWhatsApp
                    total={totalPrice}
                    currencySymbol={business.currencySymbol}
                    onConfirm={handleConfirmOrder}
                    disabled={!isReadyToOrder}
                    accentColor={business.themeColor}
                    label={slideLabel}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
