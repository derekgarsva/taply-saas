'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Check,
  X,
  Bike,
  Store,
  Clock,
  MessageCircle,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Radio,
  RefreshCw,
  CreditCard,
  MapPin,
  User,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, Business, Product } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface PendingOrdersListProps {
  business: Business;
  initialOrders: Order[];
  onOrderUpdated?: (order: Order) => void;
  currencySymbol?: string;
  currency?: string;
}

// Gentle Web Audio Chime for new incoming Realtime orders
function playIncomingOrderChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch {}
}

export default function PendingOrdersList({
  business,
  initialOrders,
  onOrderUpdated,
  currencySymbol = '$',
  currency = 'USD',
}: PendingOrdersListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [realtimeActive, setRealtimeActive] = useState<boolean>(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [lastActionToast, setLastActionToast] = useState<{ id: string; text: string; type: 'success' | 'cancel' } | null>(null);
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

  // Sync state if initialOrders changes from parent
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // ════════════════════════════════════════════════════════════════════════════
  // 3. CONEXIÓN A SUPABASE REALTIME (postgres_changes sobre tabla orders)
  // ════════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!business?.id) return;
    const supabase = createClient();
    if (!supabase) return;

    const channelName = `realtime_orders_${business.id.replace(/[^a-zA-Z0-9_]/g, '_')}`;
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
          if (payload.eventType === 'INSERT') {
            const raw = payload.new;
            // Parse customer notes if aggregated with |
            let customerName = raw.customer_name;
            let deliveryAddress = raw.delivery_address;
            let paymentMethod = raw.payment_method;
            let note = raw.customer_notes;

            if (note && typeof note === 'string' && note.includes('|')) {
              const parts = note.split('|').map((p: string) => p.trim());
              for (const p of parts) {
                if (p.startsWith('Cliente:')) customerName = p.replace('Cliente:', '').trim();
                else if (p.startsWith('Dir:') || p.startsWith('Dirección:')) deliveryAddress = p.replace(/^(Dir:|Dirección:)/, '').trim();
                else if (p.startsWith('Pago:')) paymentMethod = p.replace('Pago:', '').trim();
                else if (p.startsWith('Nota:')) note = p.replace('Nota:', '').trim();
              }
            }

            const newOrder: Order = {
              id: raw.id,
              businessId: raw.business_id,
              items: Array.isArray(raw.items) ? raw.items : [],
              total: Number(raw.total) || 0,
              status: (raw.status || 'pendiente').toLowerCase() as any,
              deliveryType: raw.delivery_type || 'pickup',
              customerName: customerName || undefined,
              deliveryAddress: deliveryAddress || undefined,
              paymentMethod: paymentMethod || undefined,
              customerNote: note || undefined,
              whatsappMessage: raw.whatsapp_message,
              createdAt: raw.created_at || new Date().toISOString(),
            };

            // Play incoming order sound & vibration
            playIncomingOrderChime();
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate([100, 50, 150]);
            }

            setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
            setLastActionToast({
              id: newOrder.id,
              text: `¡Nuevo pedido recibido! ${newOrder.id}`,
              type: 'success',
            });
          } else if (payload.eventType === 'UPDATE') {
            const raw = payload.new;
            setOrders((prev) =>
              prev.map((ord) => {
                if (ord.id === raw.id) {
                  return {
                    ...ord,
                    status: (raw.status || ord.status).toLowerCase() as any,
                  };
                }
                return ord;
              })
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeActive(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setRealtimeActive(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [business?.id]);

  // Filter only pending orders for this triage view
  const pendingOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        !o.status ||
        o.status.toLowerCase() === 'pendiente' ||
        o.status.toLowerCase() === 'nuevo'
    );
  }, [orders]);

  // ════════════════════════════════════════════════════════════════════════════
  // 2. ACCIONES: CONFIRMAR PAGO (Swipe Der) Y DESCARTAR (Swipe Izq)
  // ════════════════════════════════════════════════════════════════════════════
  const handleConfirmPayment = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      const res = await fetch('/api/orders/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          orderId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo confirmar el pago');
      }

      // Celebratory mini confetti
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#10B981', '#059669', '#34D399'],
        });
      } catch {}

      // Update state locally
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'pagado' } : o))
      );
      if (onOrderUpdated && data.order) {
        onOrderUpdated(data.order);
      }

      setLastActionToast({
        id: orderId,
        text: `Orden ${orderId} pagada y stock descontado`,
        type: 'success',
      });
    } catch (err: any) {
      console.error('Error confirming payment:', err);
      alert(err.message || 'Error al confirmar el pago');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          orderId,
          status: 'cancelado',
        }),
      });

      if (!res.ok) {
        throw new Error('No se pudo cancelar la orden');
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelado' } : o))
      );
      if (onOrderUpdated) {
        onOrderUpdated({ ...orders.find((o) => o.id === orderId)!, status: 'cancelado' });
      }

      setLastActionToast({
        id: orderId,
        text: `Orden ${orderId} descartada`,
        type: 'cancel',
      });
    } catch (err: any) {
      console.error('Error canceling order:', err);
      alert(err.message || 'Error al descartar la orden');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* ══ HEADER DE PEDIDOS PENDIENTES ══ */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-gray-900 text-lg tracking-tight">
                Pedidos Pendientes
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300/80">
                {pendingOrders.length} {pendingOrders.length === 1 ? 'pendiente' : 'pendientes'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Confirma los pagos de WhatsApp para descontar el stock automáticamente o descarta pedidos inválidos.
            </p>
          </div>

          {/* Actions: Dispatch Link + Realtime Live Status Pill */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <a
              href={`/despacho/${business.slug || business.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-2xs active:scale-95"
              title="Abrir vista de despacho para cocina y repartidores"
            >
              <Bike className="w-3.5 h-3.5 text-emerald-400" />
              <span>Subpanel de Despacho</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                realtimeActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  realtimeActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                }`}
              />
              <span>{realtimeActive ? 'En vivo (Realtime)' : 'Conectando en vivo...'}</span>
            </div>
          </div>
        </div>

        {/* Swipe Gesture Hint Banner (Mobile & Laptop Friendly) */}
        {pendingOrders.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
            <div className="flex items-center gap-2 truncate">
              <span className="hidden sm:inline">💡</span>
              <span className="font-semibold text-gray-800">Gesto táctil:</span>
              <span className="text-emerald-700 font-bold">👉 Desliza a la derecha para Confirmar Pago</span>
              <span className="text-gray-300">|</span>
              <span className="text-red-700 font-bold">👈 Desliza a la izquierda para Descartar</span>
            </div>
            <span className="hidden sm:inline-block text-[10px] text-gray-400 font-medium">
              (O usa los botones de 1 toque)
            </span>
          </div>
        )}
      </div>

      {/* ══ ACTION TOAST FEEDBACK ══ */}
      <AnimatePresence>
        {lastActionToast && (
          <motion.div
            key={lastActionToast.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`p-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-xs ${
              lastActionToast.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {lastActionToast.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
              <span>{lastActionToast.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setLastActionToast(null)}
              className="text-gray-400 hover:text-gray-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ LISTA DE TARJETAS CON SWIPE ACTIONS ══ */}
      {pendingOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200/90 text-center space-y-3 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h4 className="font-extrabold text-gray-900 text-base">
            ¡Estás al día! No hay pedidos pendientes
          </h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            Cuando un cliente haga un pedido desde tu catálogo digital por WhatsApp, la tarjeta aparecerá aquí en tiempo real sin recargar la página.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {pendingOrders.map((order) => (
              <SwipeableOrderCard
                key={order.id}
                order={order}
                business={business}
                isProcessing={processingId === order.id}
                isExpanded={expandedDetailsId === order.id}
                onToggleExpand={() =>
                  setExpandedDetailsId((cur) => (cur === order.id ? null : order.id))
                }
                onConfirm={() => handleConfirmPayment(order.id)}
                onCancel={() => handleCancelOrder(order.id)}
                currencySymbol={currencySymbol}
                currency={currency}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TARJETA INTERACTIVA CON GESTOS TÁCTILES (Framer Motion drag="x")
// ════════════════════════════════════════════════════════════════════════════════
interface SwipeableOrderCardProps {
  order: Order;
  business: Business;
  isProcessing: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  currencySymbol: string;
  currency: string;
}

function SwipeableOrderCard({
  order,
  business,
  isProcessing,
  isExpanded,
  onToggleExpand,
  onConfirm,
  onCancel,
  currencySymbol,
  currency,
}: SwipeableOrderCardProps) {
  const x = useMotionValue(0);
  const [leaving, setLeaving] = useState<'right' | 'left' | null>(null);

  // Background color layers revealed as user drags
  // Drag to right (>0): Green Check layer
  // Drag to left (<0): Red Trash layer
  const rightOpacity = useTransform(x, [15, 80], [0, 1]);
  const leftOpacity = useTransform(x, [-15, -80], [0, 1]);
  const rightScale = useTransform(x, [0, 100], [0.8, 1.05]);
  const leftScale = useTransform(x, [0, -100], [0.8, 1.05]);

  const SWIPE_THRESHOLD = 95;

  const handleDragEnd = (_: any, info: any) => {
    if (isProcessing) return;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Full swipe Right -> Confirm Payment
    if (offset > SWIPE_THRESHOLD || velocity > 400) {
      setLeaving('right');
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
      setTimeout(() => {
        onConfirm();
      }, 150);
      return;
    }

    // Full swipe Left -> Discard / Cancel Order
    if (offset < -SWIPE_THRESHOLD || velocity < -400) {
      setLeaving('left');
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
      setTimeout(() => {
        onCancel();
      }, 150);
      return;
    }
  };

  const totalItemsCount = (order.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);
  const isDelivery = order.deliveryType === 'delivery';

  // Format order date
  const orderTimeFormatted = useMemo(() => {
    try {
      const d = new Date(order.createdAt);
      if (isNaN(d.getTime())) return 'Reciente';
      const diffMins = Math.floor((Date.now() - d.getTime()) / 60000);
      if (diffMins < 1) return 'Hace un momento';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Hace ${diffHours} h`;
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Reciente';
    }
  }, [order.createdAt]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{
        opacity: leaving ? 0 : 1,
        y: 0,
        scale: 1,
        x: leaving === 'right' ? 380 : leaving === 'left' ? -380 : 0,
      }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="relative rounded-3xl overflow-hidden shadow-2xs select-none"
    >
      {/* ══ REVEALED BACKGROUND ACTIONS ══ */}
      {/* Action 1: Right Swipe (Green / Confirmar Pago) */}
      <motion.div
        style={{ opacity: rightOpacity }}
        className="absolute inset-y-0 left-0 w-full bg-emerald-600 flex items-center justify-start pl-6 z-0"
      >
        <motion.div style={{ scale: rightScale }} className="flex items-center gap-2 text-white font-black text-sm">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight">CONFIRMAR PAGO</span>
            <span className="text-[10px] text-emerald-100 font-semibold">Descontar stock</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Action 2: Left Swipe (Red / Descartar) */}
      <motion.div
        style={{ opacity: leftOpacity }}
        className="absolute inset-y-0 right-0 w-full bg-red-600 flex items-center justify-end pr-6 z-0"
      >
        <motion.div style={{ scale: leftScale }} className="flex items-center gap-2 text-white font-black text-sm">
          <div className="flex flex-col text-right">
            <span className="leading-tight">DESCARTAR</span>
            <span className="text-[10px] text-red-100 font-semibold">Sin alterar stock</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <X className="w-6 h-6 stroke-[3]" />
          </div>
        </motion.div>
      </motion.div>

      {/* ══ FOREGROUND CARD CONTENT (DRAGGABLE) ══ */}
      <motion.div
        drag={isProcessing ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.45}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative z-10 bg-white p-4 sm:p-5 border border-gray-200/90 rounded-3xl cursor-grab active:cursor-grabbing hover:border-gray-300 transition-colors"
      >
        {/* Top Meta Line: ID + Status + Time + Delivery badge */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-sm text-gray-900 tracking-tight">
              {order.id.startsWith('#') ? order.id : `#${order.id}`}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>Pendiente</span>
            </span>

            {/* Delivery vs Retiro Pill */}
            <span
              className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDelivery
                  ? 'bg-blue-50 text-blue-800 border border-blue-200/60'
                  : 'bg-purple-50 text-purple-800 border border-purple-200/60'
              }`}
            >
              {isDelivery ? <Bike className="w-3 h-3" /> : <Store className="w-3 h-3" />}
              <span>{isDelivery ? 'Delivery' : 'Retiro en local'}</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium flex-shrink-0">
            <Clock className="w-3 h-3" />
            <span>{orderTimeFormatted}</span>
          </div>
        </div>

        {/* Customer & Total Details */}
        <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="font-extrabold text-sm text-gray-900 truncate">
                {order.customerName || 'Cliente de WhatsApp'}
              </span>
            </div>

            {/* Delivery address if available */}
            {isDelivery && order.deliveryAddress && (
              <div className="flex items-start gap-1.5 mt-1 text-xs text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-tight">{order.deliveryAddress}</span>
              </div>
            )}

            {/* Payment method pill */}
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700">
                <CreditCard className="w-3 h-3 text-gray-400" />
                <span>{order.paymentMethod || 'Pago Móvil'}</span>
              </span>

              <span className="text-[11px] text-gray-400">
                {totalItemsCount} {totalItemsCount === 1 ? 'producto' : 'productos'}
              </span>
            </div>
          </div>

          {/* Amount Badge */}
          <div className="text-left sm:text-right flex-shrink-0 bg-emerald-50/60 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border sm:border-0 border-emerald-100">
            <span className="text-xs text-gray-500 font-medium block leading-tight">Total a Cobrar</span>
            <span className="text-xl font-black text-[#00594C] tabular-nums tracking-tight">
              {currencySymbol}{order.total.toFixed(2)}
            </span>
            <span className="text-[10px] text-gray-400 font-bold ml-1">{currency} (tasa BCV)</span>
          </div>
        </div>

        {/* Accordion Toggle for Items breakdown & notes */}
        <div className="pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onToggleExpand}
            className="w-full flex items-center justify-between text-[11px] font-bold text-gray-500 hover:text-gray-900 transition-colors py-1"
          >
            <span>{isExpanded ? 'Ocultar desglose de productos' : `Ver ${order.items?.length || 0} productos y nota`}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-2 space-y-2"
              >
                {/* Items List */}
                <ul className="bg-gray-50 p-3 rounded-2xl divide-y divide-gray-200/60 text-xs text-gray-800">
                  {(order.items || []).map((it, idx) => (
                    <li key={idx} className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-[#00594C] w-5 text-right">{it.quantity}x</span>
                        <span className="font-semibold">{it.name}</span>
                      </div>
                      <span className="font-bold text-gray-600 tabular-nums">
                        {currencySymbol}{(it.price * it.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Customer Note if present */}
                {order.customerNote && (
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
                    <span className="font-extrabold block text-[10px] uppercase tracking-wider text-amber-800 mb-0.5">
                      Nota del Cliente:
                    </span>
                    <p className="italic">{order.customerNote}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ══ LAPTOP / DESKTOP QUICK ACTION BUTTONS (AND TOUCH ACCESSIBLE FALLBACK) ══ */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
            <span className="hidden sm:inline">Desliza o haz clic para procesar:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Discard Button (Swipe Left Equivalent) */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={onCancel}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100/80 text-red-700 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Descartar</span>
            </button>

            {/* Confirm Payment Button (Swipe Right Equivalent) */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={onConfirm}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Confirmar Pago ({currencySymbol}{order.total.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
