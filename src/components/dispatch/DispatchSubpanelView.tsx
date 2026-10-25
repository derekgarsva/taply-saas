'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bike,
  Store,
  MapPin,
  User,
  Clock,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Check,
  ExternalLink,
  Copy,
  RefreshCw,
  Radio,
  Share2,
  ArrowRight,
  Package,
  Sparkles,
  Phone,
  ShieldCheck,
  Edit2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DispatchOrder } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface DispatchSubpanelViewProps {
  business: {
    id: string;
    name: string;
    slug: string;
    themeColor: string;
    bannerImage?: string;
    logoImage?: string;
    phone?: string;
  };
  initialOrders: DispatchOrder[];
}

// Gentle Web Audio Chime when a new paid order arrives for dispatch
function playNewDispatchOrderChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(783.99, now + 0.15); // G5
    gain2.gain.setValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.6);
  } catch {}
}

// Helper to extract phone numbers from text
function extractPhoneNumber(str?: string): string | null {
  if (!str) return null;
  // Match standard Venezuelan and international phone formats
  const match = str.match(/(?:\+?58|0)?[-\s]?(?:412|414|424|416|426|212)[-\s]?\d{3}[-\s]?\d{4}/);
  if (match) {
    let clean = match[0].replace(/\D/g, '');
    if (clean.startsWith('0') && clean.length === 11) {
      clean = '58' + clean.slice(1);
    } else if (clean.length === 10) {
      clean = '58' + clean;
    }
    return clean;
  }
  return null;
}

// Helper to format friendly relative time
function formatElapsedTime(isoString: string): string {
  try {
    const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diffSec < 60) return 'Hace un momento';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `Hace ${diffHour} h`;
    return 'Hoy';
  } catch {
    return 'Reciente';
  }
}

export default function DispatchSubpanelView({
  business,
  initialOrders,
}: DispatchSubpanelViewProps) {
  const [activeTab, setActiveTab] = useState<'delivery' | 'pickup'>('delivery');
  const [orders, setOrders] = useState<DispatchOrder[]>(initialOrders);
  const [riderName, setRiderName] = useState<string>('Repartidor');
  const [editingRiderName, setEditingRiderName] = useState<boolean>(false);
  const [tempRiderName, setTempRiderName] = useState<string>('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [collisionToast, setCollisionToast] = useState<{ id: string; message: string } | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [realtimeConnected, setRealtimeConnected] = useState<boolean>(false);
  const [phonePromptOrder, setPhonePromptOrder] = useState<DispatchOrder | null>(null);
  const [manualPhoneInput, setManualPhoneInput] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const themeColor = business.themeColor || '#00594C';

  // 1. Load saved rider name from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('taply_rider_name');
      if (saved && saved.trim()) {
        setRiderName(saved.trim());
      }
    } catch {}
  }, []);

  const handleSaveRiderName = (name: string) => {
    const clean = name.trim() || 'Repartidor';
    setRiderName(clean);
    try {
      localStorage.setItem('taply_rider_name', clean);
    } catch {}
    setEditingRiderName(false);
  };

  // 2. Fetch fresh dispatch orders
  const refreshOrders = async () => {
    try {
      const res = await fetch(`/api/dispatch/orders?businessId=${encodeURIComponent(business.id)}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.orders) {
          setOrders(data.orders);
        }
      }
    } catch (err) {
      console.warn('Error refreshing dispatch orders:', err);
    }
  };

  // 3. Supabase Realtime Subscription
  useEffect(() => {
    if (!business?.id) return;
    const supabase = createClient();
    if (!supabase) return;

    const channelName = `realtime_dispatch_${business.id.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `business_id=eq.${business.id}`,
        },
        (payload: any) => {
          setRealtimeConnected(true);

          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new;
            const normalizedStatus = String(row.status || '').toLowerCase();

            // Only orders that are 'pagado' or 'en_camino' belong in the dispatch subpanel
            if (normalizedStatus === 'pagado' || normalizedStatus === 'en_camino') {
              // Parse details if aggregated
              let customerName = row.customer_name;
              let customerPhone = row.customer_phone;
              let deliveryAddress = row.delivery_address;
              let note = row.customer_notes;

              if (note && typeof note === 'string' && note.includes('|')) {
                const parts = note.split('|').map((p: string) => p.trim());
                for (const p of parts) {
                  if (p.startsWith('Cliente:')) customerName = p.replace('Cliente:', '').trim();
                  else if (p.startsWith('Tlf:') || p.startsWith('Teléfono:') || p.startsWith('Telefono:'))
                    customerPhone = p.replace(/^(Tlf:|Teléfono:|Telefono:)/, '').trim();
                  else if (p.startsWith('Dir:') || p.startsWith('Dirección:'))
                    deliveryAddress = p.replace(/^(Dir:|Dirección:)/, '').trim();
                  else if (p.startsWith('Nota:')) note = p.replace('Nota:', '').trim();
                }
              }

              // SANITIZATION: Strictly NO prices or financial fields
              const updatedDispatchOrder: DispatchOrder = {
                id: row.id,
                businessId: row.business_id,
                status: normalizedStatus as any,
                deliveryType:
                  row.delivery_type === 'retiro' || row.delivery_type === 'pickup'
                    ? 'pickup'
                    : 'delivery',
                customerName: customerName || undefined,
                customerPhone: customerPhone || undefined,
                deliveryAddress: deliveryAddress || undefined,
                customerNote: note || undefined,
                assignedTo: row.assigned_to || undefined,
                createdAt: row.created_at || new Date().toISOString(),
                items: Array.isArray(row.items)
                  ? row.items.map((it: any) => ({
                      productId: it.productId || it.id,
                      name: it.name,
                      quantity: it.quantity || 1,
                    }))
                  : [],
              };

              // Play audio chime if it is a newly paid order
              if (normalizedStatus === 'pagado') {
                playNewDispatchOrderChime();
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate([150, 50, 200]);
                }
              }

              setOrders((prev) => {
                const existingIdx = prev.findIndex((o) => o.id === updatedDispatchOrder.id);
                if (existingIdx >= 0) {
                  const copy = [...prev];
                  copy[existingIdx] = updatedDispatchOrder;
                  return copy;
                }
                return [updatedDispatchOrder, ...prev];
              });
            } else if (
              normalizedStatus === 'entregado' ||
              normalizedStatus === 'completado' ||
              normalizedStatus === 'cancelado'
            ) {
              // Order is finished or discarded: remove from dispatch subpanel
              setOrders((prev) => prev.filter((o) => o.id !== row.id));
            }
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeConnected(true);
        } else {
          setRealtimeConnected(false);
        }
      });

    // Gentle polling fallback every 12 seconds in case mobile connection drops
    const interval = setInterval(refreshOrders, 12000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [business?.id]);

  // 4. Separate orders by delivery type
  const deliveryOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.deliveryType === 'delivery' &&
        (o.status === 'pagado' || o.status === 'en_camino')
    );
  }, [orders]);

  const pickupOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.deliveryType === 'pickup' &&
        (o.status === 'pagado' || o.status === 'en_camino' || o.status === 'en_proceso')
    );
  }, [orders]);

  // 5. Actions: Take Delivery (with Anti-Collision check)
  const handleTakeOrder = async (order: DispatchOrder) => {
    setActionLoadingId(order.id);
    setCollisionToast(null);

    try {
      const res = await fetch('/api/dispatch/take-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          orderId: order.id,
          riderName: riderName.trim() || 'Repartidor',
        }),
      });

      const data = await res.json();

      if (res.status === 409 || data?.code === 'ALREADY_TAKEN') {
        // ANTI-COLLISION: Another rider took it first!
        const errMsg = data.error || '¡Esta orden ya fue tomada por otro repartidor!';
        setCollisionToast({ id: order.id, message: errMsg });
        // Refresh local state to reflect the other rider
        refreshOrders();
        return;
      }

      if (!res.ok) {
        setCollisionToast({ id: order.id, message: data.error || 'Error al tomar el pedido' });
        return;
      }

      // Success: update order in local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: 'en_camino', assignedTo: riderName } : o
        )
      );

      setSuccessToast(`¡Tomaste el pedido ${order.id}! Ya está en camino.`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch {
      setCollisionToast({ id: order.id, message: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // 6. Actions: Complete Delivery / Pickup
  const handleCompleteOrder = async (order: DispatchOrder) => {
    setActionLoadingId(order.id);

    try {
      const res = await fetch('/api/dispatch/complete-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          orderId: order.id,
          deliveryType: order.deliveryType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setCollisionToast({ id: order.id, message: data.error || 'Error al completar orden' });
        return;
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {}

      // Remove from active list
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setSuccessToast(`¡Pedido ${order.id} entregado con éxito! 🎉`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch {
      setCollisionToast({ id: order.id, message: 'Error de red al completar el pedido' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // 7. Actions: WhatsApp Link Generation & Trigger
  const handleWhatsAppCustomer = (order: DispatchOrder) => {
    const rawPhone =
      order.customerPhone ||
      extractPhoneNumber(order.deliveryAddress) ||
      extractPhoneNumber(order.customerNote);

    if (!rawPhone) {
      // Prompt rider to enter phone if not present in address or metadata
      setPhonePromptOrder(order);
      setManualPhoneInput('');
      return;
    }

    sendWhatsAppMessage(order, rawPhone);
  };

  const sendWhatsAppMessage = (order: DispatchOrder, phone: string) => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0') && clean.length === 11) {
      clean = '58' + clean.slice(1);
    } else if (clean.length === 10) {
      clean = '58' + clean;
    }

    const greeting = `¡Hola ${order.customerName || 'Cliente'}! 👋 Te escribo de *${business.name}* sobre tu pedido *${order.id}*.\n\nYa voy en camino a entregarlo en: ${order.deliveryAddress || 'tu dirección'}.\n\n¡Estaré atento a tu confirmación! 🛵`;

    const url = `https://wa.me/${clean}?text=${encodeURIComponent(greeting.normalize('NFC'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* ══ Top App Bar: Brand + Rider Profile Pill + Realtime Pulse ══ */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md flex-shrink-0"
              style={{ backgroundColor: themeColor }}
            >
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-white truncate">
                  {business.name}
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Despacho
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>En vivo</span>
                <span>•</span>
                <span>Cocina y Delivery</span>
              </p>
            </div>
          </div>

          {/* Rider Name Pill (Tap to edit) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTempRiderName(riderName);
                setEditingRiderName(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-all active:scale-95"
              title="Cambiar nombre de repartidor"
            >
              <Bike className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="max-w-[100px] truncate">{riderName}</span>
              <Edit2 className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={refreshOrders}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-slate-400 hover:text-white transition-all active:scale-95"
              title="Refrescar lista"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ══ Navigation Tabs: Para Delivery vs Retiro en Local ══ */}
      <div className="sticky top-[61px] z-20 bg-slate-900 border-b border-slate-800/80 px-4 pt-3 pb-2.5">
        <div className="max-w-4xl mx-auto flex gap-2">
          {/* Tab 1: Para Delivery */}
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'delivery'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 scale-[1.01]'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Para Delivery</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeTab === 'delivery'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {deliveryOrders.length}
            </span>
          </button>

          {/* Tab 2: Retiro en Local */}
          <button
            onClick={() => setActiveTab('pickup')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'pickup'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/40 scale-[1.01]'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Retiro en Local</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeTab === 'pickup'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {pickupOrders.length}
            </span>
          </button>
        </div>
      </div>

      {/* ══ Main Content Area ══ */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5">
        {/* Banner: Strict Privacy Notice */}
        <div className="mb-4 px-3.5 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-2.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Vista de despacho protegida: sin precios ni finanzas. Solo datos operativos de entrega.</span>
        </div>

        {/* Global Toast: Anti-Collision or General Alerts */}
        <AnimatePresence>
          {collisionToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-between gap-3 shadow-md"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{collisionToast.message}</span>
              </div>
              <button
                onClick={() => setCollisionToast(null)}
                className="text-rose-400 hover:text-white font-bold px-2 py-0.5"
              >
                ✕
              </button>
            </motion.div>
          )}

          {successToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ TAB 1: PARA DELIVERY ══ */}
        {activeTab === 'delivery' && (
          <div className="space-y-4">
            {deliveryOrders.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl bg-slate-800/30 border border-dashed border-slate-800">
                <Bike className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-200">No hay órdenes para delivery</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Cuando el dueño confirme pedidos con entrega por delivery, aparecerán aquí en tiempo real para ser despachados.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {deliveryOrders.map((order) => {
                  const isAssignedToMe =
                    order.assignedTo &&
                    order.assignedTo.toLowerCase() === riderName.toLowerCase();
                  const isTakenBySomeoneElse =
                    order.status === 'en_camino' && !isAssignedToMe;
                  const isLoading = actionLoadingId === order.id;

                  return (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                        order.status === 'en_camino'
                          ? isAssignedToMe
                            ? 'bg-slate-800/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                            : 'bg-slate-800/50 border-slate-700/70 opacity-80'
                          : 'bg-slate-800/90 border-slate-700/80 shadow-md hover:border-slate-600'
                      }`}
                    >
                      {/* Order Header: ID, Badge, Timestamp */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-white tracking-tight">
                            {order.id}
                          </span>
                          <span
                            className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                              order.status === 'en_camino'
                                ? 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            }`}
                          >
                            {order.status === 'en_camino'
                              ? isAssignedToMe
                                ? '🛵 En camino (Por ti)'
                                : `🛵 En camino (${order.assignedTo || 'Otro rider'})`
                              : 'Listo para despacho'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatElapsedTime(order.createdAt)}</span>
                        </div>
                      </div>

                      {/* Customer Name */}
                      <div className="flex items-center gap-2 mb-3 text-slate-200">
                        <User className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-sm font-bold truncate">
                          {order.customerName || 'Cliente'}
                        </span>
                      </div>

                      {/* Delivery Address & Reference (High Visibility for Riders) */}
                      <div className="mb-4 p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/70">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Dirección de Entrega y Referencia
                              </p>
                              <p className="text-sm font-bold text-white mt-0.5 leading-snug break-words">
                                {order.deliveryAddress || 'Sin dirección especificada (coordinar en chat)'}
                              </p>
                            </div>
                          </div>

                          {/* Quick copy address */}
                          {order.deliveryAddress && (
                            <button
                              onClick={() => handleCopyText(order.deliveryAddress!, `addr-${order.id}`)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex-shrink-0"
                              title="Copiar dirección"
                            >
                              {copiedId === `addr-${order.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items to Pack / Deliver (Strictly WITHOUT prices) */}
                      <div className="mb-4 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Productos del Pedido ({order.items.reduce((s, it) => s + it.quantity, 0)} unidades)
                        </p>
                        <div className="divide-y divide-slate-700/40 rounded-xl bg-slate-900/40 border border-slate-700/40 px-3 py-1">
                          {order.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="py-1.5 flex items-center justify-between text-xs text-slate-200"
                            >
                              <span className="font-semibold text-white">
                                {it.quantity}x {it.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Note (if any) */}
                      {order.customerNote && (
                        <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                          <span className="font-bold">Nota del cliente: </span>
                          <span>{order.customerNote}</span>
                        </div>
                      )}

                      {/* Action Bar: WhatsApp direct link + Sequential Delivery Action */}
                      <div className="pt-2 border-t border-slate-700/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                        {/* WhatsApp Direct Link Button */}
                        <button
                          type="button"
                          onClick={() => handleWhatsAppCustomer(order)}
                          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 transition-all active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chatear por WhatsApp</span>
                        </button>

                        {/* Sequential Delivery State Action */}
                        <div className="flex-1 sm:flex-initial flex items-center justify-end">
                          {order.status === 'pagado' ? (
                            /* State 1: Ready to be claimed */
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleTakeOrder(order)}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
                            >
                              {isLoading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Bike className="w-4 h-4" />
                                  <span>Tomar Despacho / En camino</span>
                                </>
                              )}
                            </button>
                          ) : (
                            /* State 2: Already on the way */
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleCompleteOrder(order)}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs font-black bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
                            >
                              {isLoading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Entrega Completada</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        )}

        {/* ══ TAB 2: RETIRO EN LOCAL ══ */}
        {activeTab === 'pickup' && (
          <div className="space-y-4">
            {pickupOrders.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl bg-slate-800/30 border border-dashed border-slate-800">
                <Store className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-200">No hay órdenes para retiro</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Los pedidos para retiro en mostrador pagados aparecerán aquí para entrega directa.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {pickupOrders.map((order) => {
                  const isLoading = actionLoadingId === order.id;

                  return (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-2xl p-4 sm:p-5 bg-slate-800/90 border border-slate-700/80 shadow-md hover:border-slate-600 transition-all"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-white tracking-tight">
                            {order.id}
                          </span>
                          <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            🏪 Retiro en Tienda
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatElapsedTime(order.createdAt)}</span>
                        </div>
                      </div>

                      {/* Customer Name */}
                      <div className="flex items-center gap-2 mb-3 text-slate-200">
                        <User className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="text-sm font-bold truncate">
                          {order.customerName || 'Cliente en Mostrador'}
                        </span>
                      </div>

                      {/* Items to Deliver (Strictly WITHOUT prices) */}
                      <div className="mb-4 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Productos a Entregar ({order.items.reduce((s, it) => s + it.quantity, 0)} unidades)
                        </p>
                        <div className="divide-y divide-slate-700/40 rounded-xl bg-slate-900/40 border border-slate-700/40 px-3 py-1">
                          {order.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="py-1.5 flex items-center justify-between text-xs text-slate-200"
                            >
                              <span className="font-semibold text-white">
                                {it.quantity}x {it.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Note (if any) */}
                      {order.customerNote && (
                        <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                          <span className="font-bold">Nota: </span>
                          <span>{order.customerNote}</span>
                        </div>
                      )}

                      {/* Action Button: Entregado en Local */}
                      <div className="pt-2 border-t border-slate-700/50 flex items-center justify-end">
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleCompleteOrder(order)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-xs font-black bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Entregado en Local</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        )}
      </main>

      {/* ══ Modal: Edit Rider Name ══ */}
      <AnimatePresence>
        {editingRiderName && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl bg-slate-800 border border-slate-700 p-5 shadow-2xl"
            >
              <h3 className="text-sm font-bold text-white mb-1">
                Nombre del Repartidor
              </h3>
              <p className="text-xs text-slate-400 mb-3">
                Este nombre se asignará automáticamente cuando tomes una orden para que otros repartidores sepan quién la lleva.
              </p>
              <input
                type="text"
                value={tempRiderName}
                onChange={(e) => setTempRiderName(e.target.value)}
                placeholder="Ej. Carlos Rodríguez"
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 mb-4"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRiderName(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-650 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveRiderName(tempRiderName)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm"
                >
                  Guardar Nombre
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══ Modal: Manual Phone for WhatsApp Contact ══ */}
      <AnimatePresence>
        {phonePromptOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl bg-slate-800 border border-slate-700 p-5 shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-2 text-[#25D366]">
                <MessageCircle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">
                  Contactar Cliente por WhatsApp
                </h3>
              </div>
              <p className="text-xs text-slate-300 mb-3">
                Introduce el número de teléfono o WhatsApp de{' '}
                <strong className="text-white">{phonePromptOrder.customerName || 'el cliente'}</strong>:
              </p>
              <input
                type="tel"
                value={manualPhoneInput}
                onChange={(e) => setManualPhoneInput(e.target.value)}
                placeholder="Ej. 04141234567"
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 mb-4"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPhonePromptOrder(null)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-650 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!manualPhoneInput.trim()}
                  onClick={() => {
                    const phone = manualPhoneInput.trim();
                    setPhonePromptOrder(null);
                    if (phone) {
                      sendWhatsAppMessage(phonePromptOrder, phone);
                    }
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-xs font-bold text-slate-950 shadow-sm disabled:opacity-50"
                >
                  Abrir WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
