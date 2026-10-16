'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Plus, Minus, Sparkles, ChevronLeft, ChevronRight, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '@/types';
import NotifySoldOut from './NotifySoldOut';
import SlideConfirmWhatsApp from './SlideConfirmWhatsApp';

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
  totalCartPrice?: number;
  totalItemsCount?: number;
  uniqueProductCount?: number;
  onConfirmWhatsApp?: () => void;
  onOpenCart?: () => void;
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
  totalCartPrice = 0,
  totalItemsCount = 0,
  uniqueProductCount = 0,
  onConfirmWhatsApp,
  onOpenCart,
}: ProductDetailSheetProps) {
  const dragControls = useDragControls();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cache the product so that when parent sets product to null on close,
  // the sheet doesn't disappear abruptly and instead completes its exit animation
  const [cachedProduct, setCachedProduct] = useState<Product | null>(product);

  useEffect(() => {
    if (product) {
      setCachedProduct(product);
    }
  }, [product]);

  const activeProduct = product || cachedProduct;

  // Compute normalized list of images
  const imageList = useMemo(() => {
    if (!activeProduct) return [];
    if (Array.isArray(activeProduct.images) && activeProduct.images.length > 0) {
      return activeProduct.images.filter(Boolean);
    }
    return activeProduct.image ? [activeProduct.image] : [];
  }, [activeProduct]);

  // Reset image index whenever product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeProduct?.id]);

  const handleNextImage = () => {
    if (imageList.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const handlePrevImage = () => {
    if (imageList.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  if (!activeProduct) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (!isOpen) {
          setCachedProduct(null);
        }
      }}
    >
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center pointer-events-none">
          {/* Transparent Backdrop (Smooth fade out on exit, closes on click outside) */}
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-transparent pointer-events-auto z-10"
          />

          {/* Bottom Sheet Modal with Matching Fluid Spring Physics on Enter and Exit */}
          <motion.div
            key="sheet-modal"
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
            onClick={(e) => e.stopPropagation()}
            className="relative z-20 pointer-events-auto w-full max-w-md bg-white rounded-t-[32px] shadow-[0_-16px_48px_rgba(0,0,0,0.18)] flex flex-col max-h-[90vh] overflow-hidden border-t border-gray-100 will-change-transform"
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
                {activeProduct.category}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                aria-label="Cerrar detalle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-6 overscroll-contain space-y-4">
              {/* Product Hero Image Carousel with Smooth Swiping */}
              <div className="space-y-2">
                <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-2xs group select-none">
                  {imageList.length > 0 ? (
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0.75, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.25}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -35 || info.velocity.x < -200) {
                          handleNextImage();
                        } else if (info.offset.x > 35 || info.velocity.x > 200) {
                          handlePrevImage();
                        }
                      }}
                      className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
                    >
                      <img
                        src={imageList[currentImageIndex]}
                        alt={`${activeProduct.name} foto ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                    </motion.div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Sparkles className="w-12 h-12 text-gray-300" />
                    </div>
                  )}

                  {/* Multiple Images Navigation Controls (Arrows) */}
                  {imageList.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage();
                        }}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 active:scale-90 text-white flex items-center justify-center backdrop-blur-xs transition-all z-10 cursor-pointer"
                        aria-label="Foto anterior"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage();
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 active:scale-90 text-white flex items-center justify-center backdrop-blur-xs transition-all z-10 cursor-pointer"
                        aria-label="Foto siguiente"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Floating Counter Badge */}
                      <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-xs">
                        {currentImageIndex + 1} / {imageList.length}
                      </div>

                      {/* Indicator Dots */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/30 backdrop-blur-xs px-2 py-1 rounded-full">
                        {imageList.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(idx);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                              idx === currentImageIndex
                                ? 'w-4 bg-white shadow-xs'
                                : 'w-1.5 bg-white/50 hover:bg-white/80'
                            }`}
                            aria-label={`Ver foto ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {activeProduct.featured && (
                    <div className="absolute top-2.5 left-2.5 bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs z-10">
                      POPULAR
                    </div>
                  )}

                  {!activeProduct.available && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        Agotado Temporalmente
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnails row if multiple images */}
                {imageList.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-0.5 px-0.5">
                    {imageList.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                          idx === currentImageIndex
                            ? 'border-[#00594C] scale-105 shadow-xs ring-2 ring-[#00594C]/20'
                            : 'border-gray-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Miniatura ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-extrabold text-gray-900 text-xl leading-tight">
                    {activeProduct.name}
                  </h2>
                  <div className="text-right flex-shrink-0">
                    <span className="font-extrabold text-gray-900 text-lg">
                      {currencySymbol}{activeProduct.price.toFixed(2)}
                    </span>
                    {activeProduct.compareAtPrice && activeProduct.compareAtPrice > activeProduct.price && (
                      <span className="block text-xs text-gray-400 line-through">
                        {currencySymbol}{activeProduct.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      activeProduct.available ? 'text-emerald-600' : 'text-gray-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        activeProduct.available ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                    />
                    {activeProduct.available ? 'Disponible para ordenar' : 'No disponible'}
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Descripción
                </h3>
                {activeProduct.description ? (
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line font-normal">
                    {activeProduct.description}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    Sin descripción adicional.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 pt-3 border-t border-gray-100 bg-white space-y-2.5">
              {activeProduct.available ? (
                <div className="w-full">
                  <AnimatePresence mode="wait" initial={false}>
                    {quantity === 0 ? (
                      /* ── 1. BOTÓN "Añadir al pedido" (Cuando aún no está en el carrito) ── */
                      <motion.button
                        key="add-button"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.16 }}
                        type="button"
                        onClick={() => onUpdateQty(1)}
                        className="w-full h-12 rounded-2xl text-white font-bold text-sm shadow-md flex items-center justify-between px-5 active:scale-98 transition-transform cursor-pointer"
                        style={{ backgroundColor: themeColor }}
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                          <span>Añadir al pedido</span>
                        </span>
                        <span className="tabular-nums font-extrabold">
                          {currencySymbol}{activeProduct.price.toFixed(2)}
                        </span>
                      </motion.button>
                    ) : (
                      /* ── 2. COMPONENTE CONVERTIDO EN SUMAR / RESTAR (Cuando ya está en el carrito) ── */
                      <motion.div
                        key="stepper-converted"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.16 }}
                        className="w-full h-12 rounded-2xl bg-gray-50 border border-gray-200/90 shadow-2xs px-2 flex items-center justify-between"
                      >
                        {/* Botón Restar (o basura si es 1 para quitar del pedido) */}
                        <button
                          type="button"
                          onClick={() => onUpdateQty(-1)}
                          className="w-9 h-9 rounded-xl bg-white text-gray-700 hover:text-gray-950 border border-gray-200/80 shadow-2xs flex items-center justify-center transition-all active:scale-90 hover:bg-gray-50 cursor-pointer"
                          aria-label={quantity === 1 ? 'Quitar del pedido' : 'Restar uno'}
                          title={quantity === 1 ? 'Quitar del pedido' : 'Restar uno'}
                        >
                          {quantity === 1 ? (
                            <Trash2 className="w-4 h-4 text-rose-500" />
                          ) : (
                            <Minus className="w-4 h-4 stroke-[2.5]" />
                          )}
                        </button>

                        {/* Cantidad y Subtotal al Centro */}
                        <div className="flex flex-col items-center justify-center select-none text-center">
                          <span className="text-sm font-black text-gray-950 tabular-nums leading-tight">
                            {quantity} {quantity === 1 ? 'unidad' : 'unidades'}
                          </span>
                          <span className="text-[10px] text-gray-500 font-semibold leading-none mt-0.5">
                            Subtotal: {currencySymbol}{(activeProduct.price * quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Botón Sumar */}
                        <button
                          type="button"
                          onClick={() => onUpdateQty(1)}
                          className="w-9 h-9 rounded-xl bg-white text-gray-700 hover:text-gray-950 border border-gray-200/80 shadow-2xs flex items-center justify-center transition-all active:scale-90 hover:bg-gray-50 cursor-pointer"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NotifySoldOut accentColor={themeColor} productName={activeProduct.name} />
              )}

              {/* Continuar con WhatsApp & Carrito (disponible al tener productos agregados) */}
              {totalCartPrice > 0 && onConfirmWhatsApp && (
                <div className="flex items-center gap-2.5 pt-1">
                  <div className="flex-1 min-w-0">
                    <SlideConfirmWhatsApp
                      total={totalCartPrice}
                      currencySymbol={currencySymbol}
                      onConfirm={onConfirmWhatsApp}
                      disabled={totalCartPrice === 0}
                      accentColor={themeColor}
                      label="Pedir por WhatsApp"
                    />
                  </div>

                  {onOpenCart && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={onOpenCart}
                      className="relative flex-shrink-0 h-14 w-14 rounded-full bg-white text-gray-900 border border-gray-200/90 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.12)] flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors"
                      aria-label="Ver desglose del carrito"
                    >
                      <ShoppingBag className="w-5 h-5 text-gray-800" />
                      <span
                        className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold text-white flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: themeColor }}
                      >
                        {totalItemsCount}
                      </span>
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
