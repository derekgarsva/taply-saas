'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Business, Product, Category, CartState } from '@/types';
import SeekTop from './SeekTop';
import TopMenu from './TopMenu';
import Stepper from './Stepper';
import NotifySoldOut from './NotifySoldOut';
import SlideConfirmWhatsApp from './SlideConfirmWhatsApp';
import QRCodeModal from './QRCodeModal';
import MultiLinkBar from './MultiLinkBar';
import { Share2, MapPin, Plus, Check, X, Sparkles, Info, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StorefrontViewProps {
  business: Business;
  products: Product[];
  categories: Category[];
}

export default function StorefrontView({
  business,
  products: initialProducts,
  categories: initialCategories,
}: StorefrontViewProps) {
  const [loading, setLoading] = useState(true);
  const [products] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartState>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<'taply' | 'about' | 'qr' | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [directWhatsAppUrl, setDirectWhatsAppUrl] = useState<string | null>(null);

  const categoryBarRef = useRef<HTMLDivElement>(null);
  const lastDeselectRef = useRef<number>(0);

  // Fast pre-heat skeleton effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 240);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const categoriesList = useMemo(() => {
    const set = new Set(['Todos']);
    initialCategories.forEach(c => set.add(c.name));
    products.forEach(p => {
      if (p.category) set.add(p.category.trim());
    });
    return Array.from(set);
  }, [initialCategories, products]);

  const handleCategorySelect = (cat: string, e?: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedCategory(cat);
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) lastDeselectRef.current = Date.now();
      const updated = { ...prev };
      if (next === 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  };

  const setExactQty = (id: string, count: number) => {
    if (count <= 0) lastDeselectRef.current = Date.now();
    setCart(prev => {
      const updated = { ...prev };
      if (count <= 0) delete updated[id];
      else updated[id] = count;
      return updated;
    });
  };

  const totalPrice = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = products.find(p => p.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [cart, products]);

  const totalItemsCount = useMemo(() => {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCat = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Handle WhatsApp Checkout
  const handleOrderWhatsApp = async () => {
    if (totalPrice === 0) return;

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.85 },
        colors: [business.themeColor || '#00594C', '#10B981', '#F59E0B'],
      });
    } catch {}

    // 1. Prepare formatted order message
    let message = `🛒 *Nuevo Pedido para ${business.name}*\n\n`;
    const orderItems: Array<{ productId: string; name: string; price: number; quantity: number }> = [];

    Object.entries(cart).forEach(([id, qty]) => {
      const item = products.find(p => p.id === id);
      if (item && qty > 0) {
        orderItems.push({ productId: item.id, name: item.name, price: item.price, quantity: qty });
        message += `• ${qty}x ${item.name} — ${business.currencySymbol}${(item.price * qty).toFixed(2)}\n`;
      }
    });

    message += `\n*Total a Pagar:* ${business.currencySymbol}${totalPrice.toFixed(2)} ${business.currency}\n\n`;
    if (business.paymentNotes) {
      message += `💳 *${business.paymentNotes}*\n\n`;
    }
    message += `📍 *Dirección de Entrega / Retiro:*\n`;

    // 2. Save order in real backend database
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          items: orderItems,
          total: totalPrice,
          whatsappMessage: message,
        }),
      }).catch(() => {});
    } catch {}

    // 3. Format phone number (Venezuelan and international rules)
    let cleanPhone = (business.phone || '').replace(/\D/g, '');
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      cleanPhone = '58' + cleanPhone.slice(1);
    } else if (cleanPhone.length === 10) {
      cleanPhone = '58' + cleanPhone;
    }

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    setDirectWhatsAppUrl(url);

    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      window.location.href = url;
    }
  };

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: business.name,
          text: `Catálogo de ${business.name} en Taply:`,
          url: url,
        })
        .catch(() => copyLink());
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    if (typeof window === 'undefined') return;
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    showToast('¡Enlace copiado al portapapeles!');
  };

  const handleMenuAction = (action: 'taply' | 'about' | 'copy' | 'admin' | 'qr') => {
    if (action === 'taply') setModal('taply');
    else if (action === 'about') setModal('about');
    else if (action === 'qr') setModal('qr');
    else if (action === 'copy') copyLink();
    else if (action === 'admin') {
      window.location.href = `/dashboard?store=${business.slug}`;
    }
  };

  const currentStoreUrl = typeof window !== 'undefined' ? window.location.href : `https://taply.app/${business.slug}`;

  return (
    <div className="mx-auto max-w-md bg-white min-h-screen relative shadow-sm border-x border-gray-100 flex flex-col font-sans">
      {/* ══ Fixed Top Bar: Search on Left | Share & 3 Dots on Right ══ */}
      {!loading && (
        <header className="fixed top-0 left-0 right-0 z-40 max-w-md mx-auto h-14 px-4 flex items-center justify-between pointer-events-none bg-transparent">
          <div className="pointer-events-auto">
            <SeekTop
              value={searchQuery}
              onChange={setSearchQuery}
              accentColor={business.themeColor}
            />
          </div>

          <div className="pointer-events-auto flex items-center space-x-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Compartir"
              className="w-[38px] h-[38px] rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-black/5 flex items-center justify-center text-gray-800 active:scale-95 transition-transform"
            >
              <Share2 className="w-4 h-4 text-gray-800" />
            </button>

            <TopMenu
              onSelect={handleMenuAction}
              accentColor={business.themeColor}
            />
          </div>
        </header>
      )}

      {/* ══ Skeleton Shimmer or Storefront Content ══ */}
      {loading ? (
        <CatalogSkeleton />
      ) : (
        <main className="w-full flex-1 pb-32 animate-fade-in">
          {/* Hero Banner Image */}
          <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
            <img
              src={business.bannerImage || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'}
              alt={business.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />

            {/* Business Info in Hero */}
            <div className="absolute bottom-4 left-5 right-5">
              <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                {business.category}
              </span>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {business.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                <span>{business.city}</span>
              </div>
            </div>
          </div>

          {/* Business Description */}
          {business.desc && (
            <div className="px-5 pt-3 pb-1">
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                {business.desc}
              </p>
            </div>
          )}

          {/* Multilink Buttons Bar (Instagram, Maps, Phone, TikTok) */}
          <MultiLinkBar links={business.links || []} accentColor={business.themeColor} />

          {/* Category Bar: Flujo natural sin cortes con píldora deslizante fluida */}
          <div
            ref={categoryBarRef}
            className="relative w-full px-5 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 border-b border-gray-100 bg-white sticky top-0 z-30"
          >
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={(e) => handleCategorySelect(cat, e)}
                  className={`relative whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors duration-150 outline-none select-none z-10 ${
                    isActive
                      ? 'text-white'
                      : 'border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 active:scale-95'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-category-pill"
                      className="absolute inset-0 rounded-full shadow-sm -z-10"
                      style={{ backgroundColor: business.themeColor || '#18181B' }}
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Product List con micro-animaciones */}
          <motion.div
            layout
            className="px-5 divide-y divide-gray-100 min-h-[320px]"
          >
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center text-gray-400 text-sm"
              >
                No encontramos productos que coincidan con tu búsqueda.
              </motion.div>
            ) : (
              filteredProducts.map((prod) => {
                const count = cart[prod.id] || 0;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    key={prod.id}
                    className={`py-4 flex items-start gap-4 transition-opacity duration-200 ${
                      !prod.available ? 'opacity-75' : 'opacity-100'
                    }`}
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          !prod.available ? 'grayscale-[25%]' : 'hover:scale-105'
                        }`}
                      />
                      {prod.featured && (
                        <div className="absolute top-1 left-1 bg-amber-400 text-amber-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                          POPULAR
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between min-h-[80px]">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-gray-900 text-sm leading-snug">
                            {prod.name}
                          </h3>
                          <div className="text-right flex-shrink-0">
                            <span className="font-bold text-gray-900 text-sm">
                              {business.currencySymbol}{prod.price.toFixed(2)}
                            </span>
                            {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                              <span className="block text-[11px] text-gray-400 line-through">
                                {business.currencySymbol}{prod.compareAtPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-[11px] text-gray-400 font-medium">
                          {prod.category}
                        </span>

                        {prod.description && (
                          <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 font-normal leading-relaxed">
                            {prod.description}
                          </p>
                        )}

                        {!prod.available && (
                          <div className="mt-0.5">
                            <span className="text-[10px] font-bold text-[#C2785C] uppercase tracking-wider">
                              AGOTADO TEMPORALMENTE
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Controls */}
                      <div className="mt-2.5 flex items-center h-[38px]">
                        {prod.available ? (
                          count === 0 ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                if (Date.now() - lastDeselectRef.current < 260) return;
                                updateQty(prod.id, 1);
                              }}
                              className="h-[38px] inline-flex items-center gap-1.5 text-white text-xs font-semibold px-4 rounded-full active:scale-95 shadow-sm select-none transition-transform"
                              style={{ backgroundColor: business.themeColor || '#18181B' }}
                            >
                              <Plus size={15} strokeWidth={2.4} />
                              <span>Añadir</span>
                            </button>
                          ) : (
                            <Stepper
                              value={count}
                              onChange={(newVal) => setExactQty(prod.id, newVal)}
                              accentColor={business.themeColor}
                            />
                          )
                        ) : (
                          <NotifySoldOut accentColor={business.themeColor} productName={prod.name} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          {/* Discreet Footer with Admin Access */}
          <footer className="mt-12 px-5 pt-6 pb-6 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400 font-medium">
              {business.name} • {business.city}
            </p>
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setModal('taply')}
                className="text-[11px] text-gray-400 hover:text-gray-600 font-medium underline"
              >
                Hecho con Taply
              </button>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                onClick={() => setModal('qr')}
                className="text-[11px] text-gray-400 hover:text-gray-600 font-medium"
              >
                Ver Código QR
              </button>
              <span className="text-gray-300">•</span>
              <Link
                href={`/dashboard?store=${business.slug}`}
                className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-700 font-medium"
              >
                <Lock className="w-3 h-3 text-gray-400" />
                <span>Acceso Dueño</span>
              </Link>
            </div>
          </footer>
        </main>
      )}

      {/* ══ Fixed Bottom Action Bar: Always Pinned to Viewport Bottom ══ */}
      {!loading && (
        <aside className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-[env(safe-area-inset-bottom,0px)]">
          <div className="max-w-md mx-auto px-4 pb-4 pt-3 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-[2px]">
            <div className="pointer-events-auto">
              <SlideConfirmWhatsApp
                total={totalPrice}
                currencySymbol={business.currencySymbol}
                onConfirm={handleOrderWhatsApp}
                disabled={totalPrice === 0}
                accentColor={business.themeColor}
              />
            </div>
          </div>
        </aside>
      )}

      {/* ══ WhatsApp direct fallback popup prompt ══ */}
      <AnimatePresence>
        {directWhatsAppUrl && totalPrice > 0 && (
          <motion.div
            initial={{ y: 25, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            className="fixed bottom-24 left-4 right-4 z-50 max-w-sm mx-auto bg-gray-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-white/10 font-sans"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-emerald-400 text-lg">💬</span>
              <span className="text-xs font-medium truncate">¿No abrió WhatsApp?</span>
            </div>
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setDirectWhatsAppUrl(null)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap active:scale-95 transition-transform"
            >
              Tocar para Enviar
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ QR Code Modal ══ */}
      {modal === 'qr' && (
        <QRCodeModal
          businessName={business.name}
          url={currentStoreUrl}
          onClose={() => setModal(null)}
          accentColor={business.themeColor}
        />
      )}

      {/* ══ Modals: Taply & About ══ */}
      <AnimatePresence>
        {modal && modal !== 'qr' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
              className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {modal === 'taply' ? (
                <div>
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 text-white"
                    style={{ backgroundColor: business.themeColor || '#00594C' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-lg">Taply SaaS</h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    Catálogos interactivos multilink ultra rápidos y sin comisiones para negocios modernos.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <p className="text-[11px] text-gray-500 font-medium">
                      ✓ Cero comisiones por venta.
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">
                      ✓ Pedidos estructurados directos a WhatsApp.
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">
                      ✓ Tu propio enlace bio y catálogo e-commerce.
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="mt-4 block text-center py-2 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors"
                  >
                    Conocer más sobre Taply
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Info className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-lg">¿Cómo pedir?</h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    Diseñado bajo la filosofía de <strong>3 toques</strong>:
                  </p>
                  <ol className="text-xs text-gray-600 mt-3 space-y-2 text-left list-decimal pl-4">
                    <li>Selecciona tus productos favoritos con el botón <strong>+ Añadir</strong>.</li>
                    <li>Desliza o toca la barra inferior de <strong>Pedir por WhatsApp</strong>.</li>
                    <li>Se abrirá WhatsApp con el pedido listo y los datos de pago para transferir.</li>
                  </ol>
                </div>
              )}

              <button
                type="button"
                onClick={() => setModal(null)}
                className="w-full mt-5 py-2.5 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-xl text-xs font-bold transition-colors"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ Toast Notification ══ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 15, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#18181B] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg pointer-events-none flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="w-full flex-1 pb-32 animate-pulse">
      {/* Banner Skeleton */}
      <div className="w-full h-64 bg-gray-200 skeleton-box" />

      {/* Info Skeleton */}
      <div className="px-5 pt-4 space-y-2">
        <div className="w-20 h-3 bg-gray-200 rounded-full" />
        <div className="w-48 h-6 bg-gray-200 rounded-lg" />
        <div className="w-32 h-3 bg-gray-200 rounded-full" />
      </div>

      {/* Category Pills Skeleton */}
      <div className="px-5 py-3 flex gap-2 overflow-hidden border-b border-gray-100">
        <div className="w-16 h-8 bg-gray-200 rounded-full" />
        <div className="w-20 h-8 bg-gray-200 rounded-full" />
        <div className="w-24 h-8 bg-gray-200 rounded-full" />
        <div className="w-16 h-8 bg-gray-200 rounded-full" />
      </div>

      {/* Products Skeleton */}
      <div className="px-5 divide-y divide-gray-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-4 flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl flex-shrink-0 skeleton-box" />
            <div className="flex-1 space-y-2 py-1">
              <div className="w-3/4 h-4 bg-gray-200 rounded" />
              <div className="w-1/4 h-3 bg-gray-200 rounded" />
              <div className="w-16 h-7 bg-gray-200 rounded-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
