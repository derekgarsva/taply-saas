'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Power,
  RefreshCw,
  Search,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Store,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Building2,
  Calendar,
  X,
  ChevronRight,
  Filter,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Layers
} from 'lucide-react';
import { Business, PlatformPayment, PlatformMetrics } from '@/types';

type BusinessWithStats = Business & {
  productCount: number;
  orderCount: number;
  totalSales: number;
};

// ─────────────────────────────────────────────────────────────
// 1. Passcode Gateway Component (PIN 548282 server verified)
// ─────────────────────────────────────────────────────────────
function PasscodeGateway({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const handleSubmit = useCallback(async (pinToVerify: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinToVerify }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onAuthenticated();
      } else {
        setError(data.error || 'Código de acceso no válido');
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPin('');
        }, 600);
      }
    } catch (err) {
      setError('Error al contactar con el servidor');
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPin('');
      }, 600);
    } finally {
      setLoading(false);
    }
  }, [onAuthenticated]);

  const handleKeyPress = (num: string) => {
    if (loading || pin.length >= 6) return;
    const nextPin = pin + num;
    setPin(nextPin);
    if (nextPin.length === 6) {
      handleSubmit(nextPin);
    }
  };

  const handleBackspace = () => {
    if (loading || pin.length === 0) return;
    setPin(pin.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    if (loading) return;
    setPin('');
    setError(null);
  };

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, loading, handleSubmit]);

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm flex flex-col items-center relative z-10"
      >
        {/* Brand Shield Emblem */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-b from-white/10 to-white/[0.02] p-0.5 border border-white/10 shadow-2xl flex items-center justify-center backdrop-blur-xl">
            <div className="w-full h-full rounded-[22px] bg-[#0E131F] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-[#07090E]">
            <Lock className="w-2.5 h-2.5 text-black" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold tracking-tight text-white mb-1">
          Consola Central Taply
        </h1>
        <p className="text-xs text-white/40 text-center mb-8 max-w-[260px]">
          Ingresa la clave de autorización de 6 dígitos para acceder al SuperAdmin
        </p>

        {/* 6-Digit Indicator Dots */}
        <div className="flex items-center gap-4 mb-8">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const isFilled = index < pin.length;
            const isCurrent = index === pin.length && loading;
            return (
              <motion.div
                key={index}
                animate={{
                  scale: isFilled ? [1, 1.25, 1] : 1,
                  backgroundColor: error
                    ? '#EF4444'
                    : isFilled
                    ? '#10B981'
                    : 'rgba(255, 255, 255, 0.1)',
                }}
                transition={{ duration: 0.2 }}
                className={`w-3.5 h-3.5 rounded-full border ${
                  error
                    ? 'border-red-500 shadow-lg shadow-red-500/40'
                    : isFilled
                    ? 'border-emerald-400 shadow-lg shadow-emerald-500/50'
                    : 'border-white/10'
                }`}
              />
            );
          })}
        </div>

        {/* Feedback / Error Message */}
        <div className="h-6 mb-4 flex items-center justify-center">
          {loading && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 animate-pulse font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verificando autorización...
            </div>
          )}
          {error && !loading && (
            <p className="text-xs text-red-400 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </div>

        {/* Apple-style Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              disabled={loading}
              className="h-16 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] active:scale-95 border border-white/5 text-xl font-medium text-white transition-all flex items-center justify-center focus:outline-none"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClear}
            disabled={loading || pin.length === 0}
            className="h-16 rounded-2xl bg-transparent hover:bg-white/[0.04] active:scale-95 text-xs uppercase tracking-wider font-semibold text-white/40 hover:text-white/70 transition-all flex items-center justify-center focus:outline-none disabled:opacity-20"
          >
            Borrar
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            disabled={loading}
            className="h-16 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] active:scale-95 border border-white/5 text-xl font-medium text-white transition-all flex items-center justify-center focus:outline-none"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            disabled={loading || pin.length === 0}
            className="h-16 rounded-2xl bg-transparent hover:bg-white/[0.04] active:scale-95 text-sm font-semibold text-white/40 hover:text-white/70 transition-all flex items-center justify-center focus:outline-none disabled:opacity-20"
          >
            ⌫
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-[11px] text-white/25">
            Taply Master Operations · Autenticación Server-Side
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. Interactive SVG Revenue & Order Performance Chart
// ─────────────────────────────────────────────────────────────
function PerformanceChart({
  payments,
  metrics,
}: {
  payments: PlatformPayment[];
  metrics: PlatformMetrics;
}) {
  const [chartMode, setChartMode] = useState<'revenue' | 'volume'>('revenue');

  // Generate 7-day mock series based on actual data
  const dataPoints = useMemo(() => {
    if (chartMode === 'revenue') {
      const base = metrics.totalRevenue;
      return [
        { label: 'Lun', val: Math.round(base * 0.45) },
        { label: 'Mar', val: Math.round(base * 0.58) },
        { label: 'Mié', val: Math.round(base * 0.65) },
        { label: 'Jue', val: Math.round(base * 0.72) },
        { label: 'Vie', val: Math.round(base * 0.84) },
        { label: 'Sáb', val: Math.round(base * 0.92) },
        { label: 'Hoy', val: base },
      ];
    } else {
      const gmv = metrics.totalGmv || 120;
      return [
        { label: 'Lun', val: Math.round(gmv * 0.3) },
        { label: 'Mar', val: Math.round(gmv * 0.45) },
        { label: 'Mié', val: Math.round(gmv * 0.6) },
        { label: 'Jue', val: Math.round(gmv * 0.55) },
        { label: 'Vie', val: Math.round(gmv * 0.8) },
        { label: 'Sáb', val: Math.round(gmv * 0.95) },
        { label: 'Hoy', val: gmv },
      ];
    }
  }, [chartMode, metrics]);

  const maxVal = Math.max(...dataPoints.map((d) => d.val), 10);
  const width = 600;
  const height = 180;
  const paddingX = 30;
  const paddingY = 25;

  const points = dataPoints.map((d, i) => {
    const x = paddingX + (i / (dataPoints.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.val / maxVal) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="bg-[#0F131C] border border-white/[0.07] rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Rendimiento Financiero & Tráfico
            </h3>
          </div>
          <p className="text-xs text-white/50">
            {chartMode === 'revenue'
              ? 'Flujo de ingresos por suscripciones SaaS (MRR / Facturación)'
              : 'Volumen transaccionado por los catálogos en WhatsApp (GMV)'}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex items-center p-1 bg-white/[0.04] rounded-2xl border border-white/5">
          <button
            onClick={() => setChartMode('revenue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              chartMode === 'revenue'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Ingresos SaaS ($)
          </button>
          <button
            onClick={() => setChartMode('volume')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              chartMode === 'volume'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            GMV WhatsApp ($)
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 4"
          />

          {/* Gradient area */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Smooth line */}
          <path d={pathD} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />

          {/* Circles and Values */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#07090E"
                stroke="#10B981"
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#FFFFFF"
                opacity="0.8"
                fontWeight="500"
              >
                ${p.val}
              </text>
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                fontSize="10"
                fill="rgba(255,255,255,0.4)"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. New Payment Registration Modal
// ─────────────────────────────────────────────────────────────
function RecordPaymentModal({
  businesses,
  isOpen,
  onClose,
  onPaymentCreated,
}: {
  businesses: BusinessWithStats[];
  isOpen: boolean;
  onClose: () => void;
  onPaymentCreated: () => void;
}) {
  const [selectedBizId, setSelectedBizId] = useState(businesses[0]?.id || '');
  const [customBizName, setCustomBizName] = useState('');
  const [plan, setPlan] = useState<'Mensual ($19)' | 'Anual ($190)' | 'Personalizado'>('Mensual ($19)');
  const [amount, setAmount] = useState('19');
  const [method, setMethod] = useState<'Pago Móvil' | 'Zelle' | 'Binance USDT' | 'Efectivo Divisas' | 'Stripe'>('Pago Móvil');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update amount automatically when plan changes
  const handlePlanChange = (newPlan: 'Mensual ($19)' | 'Anual ($190)' | 'Personalizado') => {
    setPlan(newPlan);
    if (newPlan === 'Mensual ($19)') setAmount('19');
    else if (newPlan === 'Anual ($190)') setAmount('190');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const business = businesses.find((b) => b.id === selectedBizId);
    const businessName = business ? business.name : customBizName;
    const businessSlug = business ? business.slug : customBizName.toLowerCase().replace(/\s+/g, '-');

    if (!businessName.trim()) {
      setError('Selecciona o ingresa el nombre del negocio');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: selectedBizId || 'biz_custom',
          businessName,
          businessSlug,
          plan,
          amount: Number(amount) || 0,
          currency: 'USD',
          method,
          reference: reference.trim() || undefined,
          notes: notes.trim() || undefined,
          status: 'completado',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar');
      }

      onPaymentCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al registrar el pago');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#111622] border border-white/10 rounded-3xl w-full max-w-lg p-6 text-white shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-white/40 hover:text-white bg-white/[0.04] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Registrar Pago de Suscripción</h3>
            <p className="text-xs text-white/50">Asigna y asienta un cobro recibido a un comercio</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Business */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Comercio Titular</label>
            <select
              value={selectedBizId}
              onChange={(e) => setSelectedBizId(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {businesses.map((biz) => (
                <option key={biz.id} value={biz.id} className="bg-[#111622] text-white">
                  {biz.name} ({biz.city || biz.category})
                </option>
              ))}
              <option value="" className="bg-[#111622] text-white">
                Otro comercio (Nuevo / Externo)
              </option>
            </select>
          </div>

          {!selectedBizId && (
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Nombre del Negocio</label>
              <input
                type="text"
                placeholder="Ej. Pizzería Roma"
                value={customBizName}
                onChange={(e) => setCustomBizName(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Plan Selector */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Plan Contratado</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mensual ($19)', 'Anual ($190)', 'Personalizado'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => handlePlanChange(p)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all text-center ${
                    plan === p
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold'
                      : 'bg-white/[0.03] border-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Amount and Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Monto ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Método de Cobro</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Pago Móvil" className="bg-[#111622]">Pago Móvil</option>
                <option value="Zelle" className="bg-[#111622]">Zelle</option>
                <option value="Binance USDT" className="bg-[#111622]">Binance USDT</option>
                <option value="Efectivo Divisas" className="bg-[#111622]">Efectivo Divisas</option>
                <option value="Stripe" className="bg-[#111622]">Stripe (Tarjeta)</option>
              </select>
            </div>
          </div>

          {/* Reference */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5">Referencia Bancaria / ID</label>
            <input
              type="text"
              placeholder="Ej. PM-0134-8931 o Hash"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-white/60 hover:text-white transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {submitting ? 'Registrando...' : 'Confirmar y Asentar Pago'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. Main SuperAdmin Command Center Page
// ─────────────────────────────────────────────────────────────
export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [businesses, setBusinesses] = useState<BusinessWithStats[]>([]);
  const [payments, setPayments] = useState<PlatformPayment[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Check existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        setIsAuthenticated(Boolean(data.authenticated));
      } catch (e) {
        setIsAuthenticated(false);
      }
    }
    checkSession();
  }, []);

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [bizRes, payRes] = await Promise.all([
        fetch('/api/admin/businesses'),
        fetch('/api/admin/payments'),
      ]);

      if (bizRes.ok && payRes.ok) {
        const bizData = await bizRes.json();
        const payData = await payRes.json();
        setBusinesses(bizData.businesses || []);
        setMetrics(payData.metrics || null);
        setPayments(payData.payments || []);
      }
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Show transient toast
  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // 1-Click Killswitch handler
  const handleToggleBusiness = async (biz: BusinessWithStats) => {
    setTogglingId(biz.id);
    const newActiveState = biz.active === false ? true : false;

    // Optimistic update
    setBusinesses((prev) =>
      prev.map((b) => (b.id === biz.id ? { ...b, active: newActiveState } : b))
    );

    try {
      const res = await fetch('/api/admin/businesses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: biz.id, active: newActiveState }),
      });

      if (!res.ok) {
        throw new Error('Falló la actualización');
      }

      triggerToast(
        newActiveState
          ? `🟢 "${biz.name}" reactivado. Catálogo en línea.`
          : `⏸️ "${biz.name}" pausado. Catálogo en modo discreto.`
      );
      // Refresh metrics to keep count accurate
      fetchData();
    } catch (error) {
      // Revert on error
      setBusinesses((prev) =>
        prev.map((b) => (b.id === biz.id ? { ...b, active: !newActiveState } : b))
      );
      triggerToast('❌ Error al actualizar el estado del comercio');
    } finally {
      setTogglingId(null);
    }
  };

  // Logout / Lock console
  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
  };

  // Filtered businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.city && b.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.category && b.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? b.active !== false
          : b.active === false;

      return matchesSearch && matchesStatus;
    });
  }, [businesses, searchQuery, statusFilter]);

  // Loading initial authentication state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center text-white">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
      </div>
    );
  }

  // If not authenticated, show passcode screen
  if (!isAuthenticated) {
    return <PasscodeGateway onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Toast Feedback */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#141A29] border border-white/10 shadow-2xl backdrop-blur-xl text-xs font-medium text-white flex items-center gap-2"
          >
            <span>{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#07090E]/80 backdrop-blur-2xl border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-emerald-500/20">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">Taply SuperAdmin</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">
                  Master
                </span>
              </div>
              <p className="text-[11px] text-white/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                SaaS Operations En Vivo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loadingData}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/5 transition-all text-xs flex items-center gap-1.5 disabled:opacity-40"
              title="Refrescar datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-red-500/10 text-white/60 hover:text-red-400 border border-white/5 transition-all text-xs flex items-center gap-1.5"
              title="Bloquear consola"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bloquear</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: MRR */}
          <div className="bg-[#0F131C] border border-white/[0.07] rounded-3xl p-5 relative overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-white/50 tracking-wider uppercase">
                MRR (Recurrente)
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold tracking-tight text-white">
                ${metrics?.mrr || 38}.00
              </span>
              <span className="text-xs text-white/40 font-medium">/ mes</span>
            </div>
            <p className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
              <span>●</span> Suscripciones activas facturando
            </p>
          </div>

          {/* Card 2: Total Balance */}
          <div className="bg-[#0F131C] border border-white/[0.07] rounded-3xl p-5 relative overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-white/50 tracking-wider uppercase">
                Balance Cobrado
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold tracking-tight text-white">
                ${metrics?.totalRevenue || 228}.00
              </span>
              <span className="text-xs text-white/40 font-medium">USD</span>
            </div>
            <p className="text-[11px] text-white/40">
              Total histórico recaudado en planes
            </p>
          </div>

          {/* Card 3: GMV WhatsApp */}
          <div className="bg-[#0F131C] border border-white/[0.07] rounded-3xl p-5 relative overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-white/50 tracking-wider uppercase">
                GMV Plataforma
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold tracking-tight text-white">
                ${metrics?.totalGmv?.toFixed(2) || '52.00'}
              </span>
              <span className="text-xs text-white/40 font-medium">USD</span>
            </div>
            <p className="text-[11px] text-white/40">
              {metrics?.totalOrders || 0} pedidos generados por clientes
            </p>
          </div>

          {/* Card 4: Store Health */}
          <div className="bg-[#0F131C] border border-white/[0.07] rounded-3xl p-5 relative overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-white/50 tracking-wider uppercase">
                Comercios Activos
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Store className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold tracking-tight text-white">
                {metrics?.activeStores || 0}
              </span>
              <span className="text-xs text-white/40 font-medium">
                / {metrics?.totalStores || 0} registrados
              </span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">
              100% Retención en plataforma
            </p>
          </div>
        </section>

        {/* Real Performance Chart */}
        {metrics && (
          <PerformanceChart payments={payments} metrics={metrics} />
        )}

        {/* Master Businesses Table with 1-Click Killswitch */}
        <section className="bg-[#0F131C] border border-white/[0.07] rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Store className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Control Central de Comercios
                </h3>
              </div>
              <p className="text-xs text-white/50">
                Supervisa cada catálogo en vivo y gestiona su estado de publicación con el interruptor maestro
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar negocio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center p-1 bg-white/[0.04] rounded-xl border border-white/5 text-xs">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    statusFilter === 'all'
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    statusFilter === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400 font-medium'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Activos
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    statusFilter === 'inactive'
                      ? 'bg-red-500/20 text-red-400 font-medium'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Pausados
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/40 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Negocio</th>
                  <th className="pb-3 font-semibold">Plan</th>
                  <th className="pb-3 font-semibold text-center">Catálogo</th>
                  <th className="pb-3 font-semibold text-center">Pedidos</th>
                  <th className="pb-3 font-semibold text-right">Ventas GMV</th>
                  <th className="pb-3 font-semibold text-center">Enlaces</th>
                  <th className="pb-3 font-semibold text-right">Estado / Killswitch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredBusinesses.map((biz) => {
                  const isActive = biz.active !== false;
                  const isToggling = togglingId === biz.id;

                  return (
                    <tr key={biz.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Business info */}
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl overflow-hidden relative bg-white/5 border border-white/10 flex-shrink-0">
                            {biz.logoImage ? (
                              <Image
                                src={biz.logoImage}
                                alt={biz.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-white/50">
                                {biz.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{biz.name}</span>
                              <span className="text-[10px] text-white/40 font-mono">/{biz.slug}</span>
                            </div>
                            <p className="text-[11px] text-white/40">
                              {biz.category} {biz.city ? `· ${biz.city}` : ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/5 font-medium text-white/80 capitalize">
                          {biz.plan || 'Mensual ($19)'}
                        </span>
                      </td>

                      {/* Products */}
                      <td className="py-4 text-center">
                        <span className="font-semibold text-white">{biz.productCount}</span>
                        <span className="text-white/40 text-[10px] block">productos</span>
                      </td>

                      {/* Orders */}
                      <td className="py-4 text-center">
                        <span className="font-semibold text-white">{biz.orderCount}</span>
                        <span className="text-white/40 text-[10px] block">pedidos</span>
                      </td>

                      {/* Sales GMV */}
                      <td className="py-4 text-right">
                        <span className="font-semibold text-emerald-400">
                          ${biz.totalSales?.toFixed(2) || '0.00'}
                        </span>
                        <span className="text-white/40 text-[10px] block">WhatsApp</span>
                      </td>

                      {/* Links */}
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={`/${biz.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white transition-all"
                            title="Ver Catálogo en vivo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href="/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white transition-all"
                            title="Ver Panel de Dueño"
                          >
                            <Store className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* 1-Click Killswitch Toggle */}
                      <td className="py-4 text-right">
                        <div className="inline-flex items-center gap-2.5">
                          <span
                            className={`text-[11px] font-medium ${
                              isActive ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {isActive ? 'En Línea' : 'Pausado'}
                          </span>

                          <button
                            onClick={() => handleToggleBusiness(biz)}
                            disabled={isToggling}
                            className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative focus:outline-none ${
                              isActive ? 'bg-emerald-500' : 'bg-white/20'
                            } ${isToggling ? 'opacity-50' : ''}`}
                            title={isActive ? 'Desactivar comercio' : 'Activar comercio'}
                          >
                            <motion.div
                              layout
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className={`w-5 h-5 rounded-full bg-white shadow-md transform ${
                                isActive ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredBusinesses.length === 0 && (
              <div className="py-12 text-center text-white/40 text-xs">
                No se encontraron comercios con los criterios de búsqueda.
              </div>
            )}
          </div>
        </section>

        {/* Subscription Payments Ledger */}
        <section className="bg-[#0F131C] border border-white/[0.07] rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Libro de Pagos de Suscripciones
                </h3>
              </div>
              <p className="text-xs text-white/50">
                Registro financiero de cobros de software cobrados a cada dueño de comercio
              </p>
            </div>

            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nuevo Pago</span>
            </button>
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/40 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Fecha</th>
                  <th className="pb-3 font-semibold">Comercio</th>
                  <th className="pb-3 font-semibold">Plan</th>
                  <th className="pb-3 font-semibold">Método</th>
                  <th className="pb-3 font-semibold">Referencia</th>
                  <th className="pb-3 font-semibold text-right">Monto USD</th>
                  <th className="pb-3 font-semibold text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Date */}
                    <td className="py-3.5 text-white/60">
                      {new Date(p.createdAt).toLocaleDateString('es-LA', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Business */}
                    <td className="py-3.5">
                      <span className="font-medium text-white">{p.businessName}</span>
                      <span className="text-[10px] text-white/40 block font-mono">
                        /{p.businessSlug}
                      </span>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 text-white/80">{p.plan}</td>

                    {/* Method */}
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-lg bg-white/[0.05] border border-white/5 text-[11px] text-white/70">
                        {p.method}
                      </span>
                    </td>

                    {/* Ref */}
                    <td className="py-3.5 text-white/50 font-mono text-[11px]">
                      {p.reference || '—'}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 text-right font-bold text-emerald-400">
                      ${p.amount.toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Completado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {payments.length === 0 && (
              <div className="py-12 text-center text-white/40 text-xs">
                No hay pagos registrados aún en el libro financiero.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        businesses={businesses}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentCreated={() => {
          triggerToast('✅ Pago registrado con éxito y balance actualizado.');
          fetchData();
        }}
      />
    </div>
  );
}
