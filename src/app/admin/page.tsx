'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
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
  Calendar,
  X,
  ChevronRight,
  Filter,
  BarChart3,
  Layers,
  Clock,
  Sparkles,
  ArrowUpRight,
  Copy,
  Activity
} from 'lucide-react';
import { Business, PlatformPayment, PlatformMetrics } from '@/types';
import ThemeToggle from '@/components/admin/ThemeToggle';
import MorphSelect, { MorphOption } from '@/components/admin/MorphSelect';
import Sparkline from '@/components/admin/Sparkline';
import MetricCard from '@/components/admin/MetricCard';
import LineChart, { DataPoint } from '@/components/admin/LineChart';
import SwipeActionRow from '@/components/admin/SwipeActionRow';
import BottomSheet from '@/components/admin/BottomSheet';
import Timeline, { TimelineItem } from '@/components/admin/Timeline';

type BusinessWithStats = Business & {
  productCount: number;
  orderCount: number;
  totalSales: number;
};

// ─────────────────────────────────────────────────────────────
// 1. Passcode Gateway Component (PIN 548282 server verified)
// ─────────────────────────────────────────────────────────────
function PasscodeGateway({
  onAuthenticated,
  theme,
  onToggleTheme,
}: {
  onAuthenticated: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}) {
  const isDark = theme === 'dark';
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const handleSubmit = useCallback(
    async (pinToVerify: string) => {
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
    },
    [onAuthenticated]
  );

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
    <div
      className={`min-h-[100dvh] flex flex-col items-center justify-center py-6 sm:py-10 px-4 relative overflow-hidden select-none transition-colors duration-300 ${
        isDark ? 'bg-black text-white' : 'bg-[#F8F9FB] text-neutral-900'
      }`}
    >
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      <motion.div
        animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm flex flex-col items-center relative z-10"
      >
        {/* Brand Shield Emblem */}
        <div className="relative mb-4 sm:mb-6">
          <div
            className={`w-14 sm:w-16 h-14 sm:h-16 rounded-3xl p-0.5 border shadow-2xl flex items-center justify-center backdrop-blur-xl ${
              isDark
                ? 'bg-neutral-900/60 border-neutral-800'
                : 'bg-white border-neutral-200 shadow-neutral-200/50'
            }`}
          >
            <div
              className={`w-full h-full rounded-[22px] flex items-center justify-center ${
                isDark ? 'bg-[#0A0A0A]' : 'bg-neutral-50'
              }`}
            >
              <ShieldCheck className="w-7 sm:w-8 h-7 sm:h-8 text-emerald-500" />
            </div>
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 ${
              isDark ? 'border-black' : 'border-white'
            }`}
          >
            <Lock className="w-2.5 h-2.5 text-black" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-lg sm:text-xl font-bold tracking-tight mb-1 text-center">
          Consola Central Taply
        </h1>
        <p
          className={`text-xs text-center mb-5 sm:mb-8 max-w-[260px] ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}
        >
          Ingresa la clave de autorización de 6 dígitos para acceder al SuperAdmin
        </p>

        {/* 6-Digit Indicator Dots */}
        <div className="flex items-center gap-3.5 sm:gap-4 mb-5 sm:mb-8">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const isFilled = index < pin.length;
            return (
              <motion.div
                key={index}
                animate={{
                  scale: isFilled ? [1, 1.25, 1] : 1,
                  backgroundColor: error
                    ? '#EF4444'
                    : isFilled
                    ? '#10B981'
                    : isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                }}
                transition={{ duration: 0.2 }}
                className={`w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full border transition-all ${
                  error
                    ? 'border-red-500 shadow-lg shadow-red-500/40'
                    : isFilled
                    ? 'border-emerald-400 shadow-lg shadow-emerald-500/40'
                    : isDark
                    ? 'border-neutral-800'
                    : 'border-neutral-300'
                }`}
              />
            );
          })}
        </div>

        {/* Feedback / Error Message */}
        <div className="h-6 mb-3 sm:mb-4 flex items-center justify-center">
          {loading && (
            <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verificando autorización...
            </div>
          )}
          {error && !loading && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
        </div>

        {/* Apple-style Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-[280px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              disabled={loading}
              className={`h-13 sm:h-16 rounded-2xl text-lg sm:text-xl font-medium transition-all flex items-center justify-center active:scale-95 touch-manipulation border ${
                isDark
                  ? 'bg-neutral-900/60 hover:bg-neutral-800 border-neutral-800 text-white'
                  : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-900 shadow-sm'
              }`}
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClear}
            disabled={loading || pin.length === 0}
            className={`h-13 sm:h-16 rounded-2xl text-[11px] sm:text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center active:scale-95 touch-manipulation disabled:opacity-20 ${
              isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Borrar
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            disabled={loading}
            className={`h-13 sm:h-16 rounded-2xl text-lg sm:text-xl font-medium transition-all flex items-center justify-center active:scale-95 touch-manipulation border ${
              isDark
                ? 'bg-neutral-900/60 hover:bg-neutral-800 border-neutral-800 text-white'
                : 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-900 shadow-sm'
            }`}
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            disabled={loading || pin.length === 0}
            className={`h-13 sm:h-16 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center active:scale-95 touch-manipulation disabled:opacity-20 ${
              isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            ⌫
          </button>
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <p className={`text-[11px] ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Taply Master Operations · Autenticación Server-Side
          </p>
        </div>
      </motion.div>
    </div>

  );
}

// ─────────────────────────────────────────────────────────────
// 2. Main SuperAdmin Command Center Page
// ─────────────────────────────────────────────────────────────
export default function SuperAdminPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [businesses, setBusinesses] = useState<BusinessWithStats[]>([]);
  const [payments, setPayments] = useState<PlatformPayment[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [activeSection, setActiveSection] = useState<'all' | 'stores' | 'payments' | 'timeline'>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Bottom Sheet Modal state for new payment
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false);
  const [selectedBizId, setSelectedBizId] = useState('');
  const [customBizName, setCustomBizName] = useState('');
  const [paymentPlan, setPaymentPlan] = useState<'Plan Inicial ($12)' | 'Big Taply ($34)' | 'Personalizado'>('Plan Inicial ($12)');
  const [paymentAmount, setPaymentAmount] = useState('12');
  const [paymentMethod, setPaymentMethod] = useState<'Pago Móvil' | 'Zelle' | 'Binance USDT' | 'Efectivo Divisas' | 'Stripe'>('Pago Móvil');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Toggle Theme
  const handleToggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('taply-admin-theme', nextTheme);
    } catch (e) {}
  };

  // Restore theme on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('taply-admin-theme') as 'dark' | 'light' | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch (e) {}
  }, []);

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
        if (bizData.businesses && bizData.businesses.length > 0 && !selectedBizId) {
          setSelectedBizId(bizData.businesses[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoadingData(false);
    }
  }, [selectedBizId]);

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

  // Update business plan from admin table / selector
  const handleUpdateBusinessPlan = async (bizId: string, newPlan: string) => {
    try {
      const res = await fetch('/api/admin/businesses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bizId, plan: newPlan }),
      });

      if (!res.ok) {
        throw new Error('Error al actualizar plan');
      }

      setBusinesses((prev) =>
        prev.map((b) => (b.id === bizId ? { ...b, plan: newPlan } : b))
      );
      const bizName = businesses.find((b) => b.id === bizId)?.name || 'comercio';
      triggerToast(`⭐ Plan de "${bizName}" actualizado a ${newPlan}. Límites aplicados en tiempo real.`);
      fetchData();
    } catch {
      triggerToast('❌ Error al cambiar el plan del comercio');
    }
  };

  // Open payment sheet pre-selecting a business
  const handleOpenPaymentForBiz = (bizId: string) => {
    setSelectedBizId(bizId);
    setIsPaymentSheetOpen(true);
  };

  // Handle plan change inside payment sheet
  const handlePlanChange = (newPlan: 'Plan Inicial ($12)' | 'Big Taply ($34)' | 'Personalizado') => {
    setPaymentPlan(newPlan);
    if (newPlan === 'Plan Inicial ($12)') setPaymentAmount('12');
    else if (newPlan === 'Big Taply ($34)') setPaymentAmount('34');
  };

  // Submit payment from BottomSheet
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPayment(true);
    setPaymentError(null);

    const business = businesses.find((b) => b.id === selectedBizId);
    const businessName = business ? business.name : customBizName;
    const businessSlug = business ? business.slug : customBizName.toLowerCase().replace(/\s+/g, '-');

    if (!businessName.trim()) {
      setPaymentError('Selecciona o ingresa el nombre del negocio');
      setSubmittingPayment(false);
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
          plan: paymentPlan,
          amount: Number(paymentAmount) || 0,
          currency: 'USD',
          method: paymentMethod,
          reference: paymentReference.trim() || undefined,
          notes: paymentNotes.trim() || undefined,
          status: 'completado',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar');
      }

      // If tied to a store, update its plan immediately in real time
      if (selectedBizId && paymentPlan) {
        await fetch('/api/admin/businesses', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedBizId, plan: paymentPlan }),
        }).catch(() => {});
      }

      setIsPaymentSheetOpen(false);
      setPaymentReference('');
      setPaymentNotes('');
      triggerToast('✅ Cobro asentado y plan del negocio sincronizado en tiempo real.');
      fetchData();
    } catch (err: any) {
      setPaymentError(err.message || 'Error al registrar el pago');
    } finally {
      setSubmittingPayment(false);
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

  // Dynamic Series for Arc UI LineChart
  const chartSeries = useMemo(() => {
    const rev = metrics?.totalRevenue || 228;
    const gmv = metrics?.totalGmv || 52;
    const ord = metrics?.totalOrders || 8;

    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy'];

    const revenueSeries: DataPoint[] = days.map((d, i) => ({
      label: d,
      value: Math.round(rev * (0.35 + (i / 6) * 0.65)),
      date: `Octubre ${i + 5}`,
    }));

    const gmvSeries: DataPoint[] = days.map((d, i) => ({
      label: d,
      value: Math.round(gmv * (0.2 + (i / 6) * 0.8)),
      date: `Octubre ${i + 5}`,
    }));

    const ordersSeries: DataPoint[] = days.map((d, i) => ({
      label: d,
      value: Math.max(1, Math.round(ord * (0.25 + (i / 6) * 0.75))),
      date: `Octubre ${i + 5}`,
    }));

    return {
      revenue: revenueSeries,
      gmv: gmvSeries,
      orders: ordersSeries,
    };
  }, [metrics]);

  // Timeline Activity Items
  const timelineItems: TimelineItem[] = useMemo(() => {
    const items: TimelineItem[] = [];

    // Payments events
    payments.forEach((p) => {
      items.push({
        id: `tl_${p.id}`,
        title: `Pago Recibido · ${p.businessName}`,
        subtitle: `${p.plan} mediante ${p.method} (Ref: ${p.reference || 'N/A'})`,
        timestamp: new Date(p.createdAt).toLocaleDateString('es-LA', {
          day: '2-digit',
          month: 'short',
        }),
        type: 'payment',
        badge: p.method,
        amount: p.amount,
      });
    });

    // Business milestone events
    businesses.forEach((b) => {
      items.push({
        id: `tl_biz_${b.id}`,
        title: `Comercio Registrado · ${b.name}`,
        subtitle: `${b.category} en ${b.city || 'Venezuela'} · ${b.productCount} productos`,
        timestamp: b.createdAt
          ? new Date(b.createdAt).toLocaleDateString('es-LA', { day: '2-digit', month: 'short' })
          : 'Reciente',
        type: 'store',
        badge: b.active !== false ? 'Activo' : 'Pausado',
      });
    });

    return items.slice(0, 8);
  }, [payments, businesses]);

  // Initial authentication check loading
  if (isAuthenticated === null) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors ${
          isDark ? 'bg-black text-white' : 'bg-[#F8F9FB] text-neutral-900'
        }`}
      >
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  // Not authenticated: show Passcode Screen
  if (!isAuthenticated) {
    return (
      <PasscodeGateway
        onAuthenticated={() => setIsAuthenticated(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        isDark ? 'bg-black text-white' : 'bg-[#F8F9FB] text-neutral-900'
      }`}
    >
      {/* Toast Feedback */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl text-xs font-semibold flex items-center gap-2 ${
              isDark
                ? 'bg-neutral-900/95 border-neutral-700 text-white'
                : 'bg-white/95 border-neutral-300 text-neutral-900'
            }`}
          >
            <span>{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header
        className={`sticky top-0 z-40 px-4 sm:px-6 py-3.5 border-b backdrop-blur-2xl transition-colors ${
          isDark
            ? 'bg-black/80 border-neutral-800/80'
            : 'bg-white/85 border-neutral-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand Pill */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black text-sm shadow-md shadow-emerald-500/20 flex-shrink-0">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">Taply SuperAdmin</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">
                  Master
                </span>
              </div>
              <p
                className={`text-[11px] hidden sm:flex items-center gap-1.5 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                SaaS Operations En Vivo
              </p>
            </div>
          </div>

          {/* Quick Actions & Theme Switch */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle theme={theme} onToggle={handleToggleTheme} />

            <button
              onClick={fetchData}
              disabled={loadingData}
              className={`p-2 rounded-2xl border transition-all text-xs flex items-center gap-1.5 disabled:opacity-40 ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:text-black hover:border-neutral-300 shadow-sm'
              }`}
              title="Refrescar datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Actualizar</span>
            </button>

            <button
              onClick={handleLogout}
              className={`p-2 rounded-2xl border transition-all text-xs flex items-center gap-1.5 ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-900/50'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:text-red-600 hover:border-red-200 shadow-sm'
              }`}
              title="Bloquear consola"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Bloquear</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8 pb-24 sm:pb-12">
        {/* Navigation Tabs using Arc UI MorphSelect */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="overflow-x-auto max-w-full pb-1 -mb-1 scrollbar-none">
            <MorphSelect
              layoutId="admin-section-nav"
              theme={theme}
              value={activeSection}
              onChange={(val) => setActiveSection(val as any)}
              options={[
                { id: 'all', label: 'Consola General', icon: <Layers className="w-3.5 h-3.5" /> },
                { id: 'stores', label: 'Comercios', badge: businesses.length },
                { id: 'payments', label: 'Suscripciones', badge: payments.length },
                { id: 'timeline', label: 'Auditoría', icon: <Clock className="w-3.5 h-3.5" /> },
              ]}
            />
          </div>

          <button
            onClick={() => setIsPaymentSheetOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-semibold text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Registrar Pago</span>
          </button>
        </div>

        {/* 1. Arc UI Metric Cards Grid with Sparklines */}
        {(activeSection === 'all' || activeSection === 'payments') && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              theme={theme}
              title="MRR Recurrente"
              value={`$${metrics?.mrr || 38}.00`}
              unit="/ mes"
              trend={{ value: '+18.4%', positive: true }}
              subtitle="Suscripciones activas"
              sparklineData={[19, 19, 19, 38, 38, 38, 38]}
              sparklineColor="#10B981"
              icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
            />

            <MetricCard
              theme={theme}
              title="Balance Cobrado"
              value={`$${metrics?.totalRevenue || 228}.00`}
              unit="USD"
              trend={{ value: '+24.0%', positive: true }}
              subtitle="Total ingresos en software"
              sparklineData={[38, 57, 76, 114, 152, 190, 228]}
              sparklineColor="#3B82F6"
              icon={<DollarSign className="w-4 h-4 text-blue-500" />}
            />

            <MetricCard
              theme={theme}
              title="GMV Plataforma"
              value={`$${metrics?.totalGmv?.toFixed(2) || '52.00'}`}
              unit="USD"
              trend={{ value: '+31.5%', positive: true }}
              subtitle={`${metrics?.totalOrders || 2} pedidos por WhatsApp`}
              sparklineData={[15, 22, 28, 35, 42, 48, 52]}
              sparklineColor="#A855F7"
              icon={<ShoppingBag className="w-4 h-4 text-purple-500" />}
            />

            <MetricCard
              theme={theme}
              title="Comercios Activos"
              value={metrics?.activeStores || 2}
              unit={`/ ${metrics?.totalStores || 2}`}
              trend={{ value: '100%', positive: true }}
              subtitle="Tasa de retención sólida"
              sparklineData={[1, 1, 2, 2, 2, 2, 2]}
              sparklineColor="#F59E0B"
              icon={<Store className="w-4 h-4 text-amber-500" />}
            />
          </section>
        )}

        {/* 2. Arc UI Interactive Line Chart */}
        {(activeSection === 'all' || activeSection === 'payments') && (
          <section>
            <LineChart series={chartSeries} theme={theme} />
          </section>
        )}

        {/* 3. Master Stores Section (with Arc UI Swipe Actions on Mobile) */}
        {(activeSection === 'all' || activeSection === 'stores') && (
          <section
            className={`rounded-3xl p-5 sm:p-6 border transition-colors ${
              isDark
                ? 'bg-[#0A0A0A] border-neutral-800'
                : 'bg-white border-neutral-200 shadow-sm'
            }`}
          >
            {/* Header and Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Store className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-base font-bold tracking-tight">
                    Control Central de Comercios
                  </h3>
                </div>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  En móvil desliza hacia la izquierda para acciones rápidas o usa el switch de 1 clic
                </p>
              </div>

              {/* Search & Morph Filter */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="relative flex-1 md:w-52">
                  <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Buscar negocio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full rounded-xl pl-9 pr-3 py-1.5 text-base sm:text-xs transition-colors focus:outline-none focus:border-emerald-500 border ${
                      isDark
                        ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-600'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
                    }`}
                  />
                </div>

                <MorphSelect
                  layoutId="store-filter-pill"
                  theme={theme}
                  size="sm"
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val as any)}
                  options={[
                    { id: 'all', label: 'Todos' },
                    { id: 'active', label: 'Activos' },
                    { id: 'inactive', label: 'Pausados' },
                  ]}
                />
              </div>
            </div>

            {/* Mobile / Tablet Cards with Arc UI SwipeActions */}
            <div className="space-y-3 md:hidden">
              {filteredBusinesses.map((biz) => {
                const isActive = biz.active !== false;

                return (
                  <SwipeActionRow
                    key={biz.id}
                    theme={theme}
                    isActive={isActive}
                    onToggleActive={() => handleToggleBusiness(biz)}
                    onViewStore={() => window.open(`/${biz.slug}`, '_blank')}
                    onRecordPayment={() => handleOpenPaymentForBiz(biz.id)}
                  >
                    <div className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-2xl overflow-hidden relative flex-shrink-0 border ${
                            isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                          }`}
                        >
                          {biz.logoImage ? (
                            <Image
                              src={biz.logoImage}
                              alt={biz.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500">
                              {biz.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="font-bold text-sm truncate flex items-center gap-1.5">
                            <span>{biz.name}</span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                                isDark ? 'bg-neutral-900 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              /{biz.slug}
                            </span>
                          </div>
                          <p
                            className={`text-xs truncate ${
                              isDark ? 'text-neutral-400' : 'text-neutral-500'
                            }`}
                          >
                            {biz.category} {biz.city ? `· ${biz.city}` : ''}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-emerald-500 font-semibold">
                              ${biz.totalSales?.toFixed(2) || '0.00'} GMV
                            </span>
                            <span className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              • {biz.productCount} prods
                            </span>
                            <select
                              value={
                                (biz.plan || '').toLowerCase().includes('big') || (biz.plan || '').toLowerCase().includes('34') || (biz.plan || '').toLowerCase().includes('37')
                                  ? 'Big Taply ($34)'
                                  : 'Plan Inicial ($12)'
                              }
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleUpdateBusinessPlan(biz.id, e.target.value);
                              }}
                              className={`text-[10px] font-bold rounded-lg px-2 py-0.5 border outline-none cursor-pointer ${
                                (biz.plan || '').toLowerCase().includes('big') || (biz.plan || '').toLowerCase().includes('34') || (biz.plan || '').toLowerCase().includes('37')
                                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
                              }`}
                            >
                              <option value="Plan Inicial ($12)">Inicial ($12)</option>
                              <option value="Big Taply ($34)">Big Taply ($34)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* 1-Click Killswitch toggle button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBusiness(biz);
                        }}
                        disabled={togglingId === biz.id}
                        className={`w-12 h-6 rounded-full p-0.5 transition-colors relative flex-shrink-0 ${
                          isActive ? 'bg-emerald-500' : isDark ? 'bg-neutral-800' : 'bg-neutral-300'
                        }`}
                        title={isActive ? 'Pausar catálogo' : 'Activar catálogo'}
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
                  </SwipeActionRow>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr
                    className={`border-b uppercase tracking-wider text-[10px] font-semibold ${
                      isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-400'
                    }`}
                  >
                    <th className="pb-3">Negocio</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3 text-center">Catálogo</th>
                    <th className="pb-3 text-center">Pedidos</th>
                    <th className="pb-3 text-right">Ventas GMV</th>
                    <th className="pb-3 text-center">Enlaces</th>
                    <th className="pb-3 text-right">Interruptor (Killswitch)</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark ? 'divide-neutral-900' : 'divide-neutral-100'
                  }`}
                >
                  {filteredBusinesses.map((biz) => {
                    const isActive = biz.active !== false;
                    const isToggling = togglingId === biz.id;

                    return (
                      <tr
                        key={biz.id}
                        className={`transition-colors ${
                          isDark ? 'hover:bg-neutral-900/40' : 'hover:bg-neutral-50'
                        }`}
                      >
                        {/* Business Info */}
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-2xl overflow-hidden relative flex-shrink-0 border ${
                                isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                              }`}
                            >
                              {biz.logoImage ? (
                                <Image
                                  src={biz.logoImage}
                                  alt={biz.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500">
                                  {biz.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold flex items-center gap-1.5">
                                <span>{biz.name}</span>
                                <span className={`text-[10px] font-mono ${
                                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                                }`}>
                                  /{biz.slug}
                                </span>
                              </div>
                              <p className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                                {biz.category} {biz.city ? `· ${biz.city}` : ''}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="py-4">
                          <select
                            value={
                              (biz.plan || '').toLowerCase().includes('big') || (biz.plan || '').toLowerCase().includes('34') || (biz.plan || '').toLowerCase().includes('37')
                                ? 'Big Taply ($34)'
                                : 'Plan Inicial ($12)'
                            }
                            onChange={(e) => handleUpdateBusinessPlan(biz.id, e.target.value)}
                            className={`px-2.5 py-1.5 rounded-xl border font-bold text-[11px] outline-none cursor-pointer transition-colors ${
                              (biz.plan || '').toLowerCase().includes('big') || (biz.plan || '').toLowerCase().includes('34') || (biz.plan || '').toLowerCase().includes('37')
                                ? isDark
                                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:border-amber-400'
                                  : 'bg-amber-50 border-amber-300 text-amber-900 hover:border-amber-400'
                                : isDark
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:border-emerald-400'
                                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:border-emerald-400'
                            }`}
                            title="Cambiar plan y límite de productos en tiempo real"
                          >
                            <option value="Plan Inicial ($12)">Plan Inicial ($12) • 100 prods</option>
                            <option value="Big Taply ($34)">Big Taply ($34) • Ilimitado</option>
                          </select>
                        </td>

                        {/* Products */}
                        <td className="py-4 text-center">
                          <span className="font-bold">{biz.productCount}</span>
                          <span className={`text-[10px] block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            ítems
                          </span>
                        </td>

                        {/* Orders */}
                        <td className="py-4 text-center">
                          <span className="font-bold">{biz.orderCount}</span>
                          <span className={`text-[10px] block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            pedidos
                          </span>
                        </td>

                        {/* GMV Sales */}
                        <td className="py-4 text-right">
                          <span className="font-bold text-emerald-500">
                            ${biz.totalSales?.toFixed(2) || '0.00'}
                          </span>
                          <span className={`text-[10px] block ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            WhatsApp
                          </span>
                        </td>

                        {/* Links & Quick Actions */}
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <a
                              href={`/${biz.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`p-1.5 rounded-xl border transition-colors ${
                                isDark
                                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                                  : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black'
                              }`}
                              title="Ver Catálogo en vivo"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleOpenPaymentForBiz(biz.id)}
                              className="p-1.5 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                              title="Asentar cobro a esta tienda"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* 1-Click Killswitch Toggle */}
                        <td className="py-4 text-right">
                          <div className="inline-flex items-center gap-2.5">
                            <span
                              className={`text-[11px] font-semibold ${
                                isActive ? 'text-emerald-500' : 'text-amber-500'
                              }`}
                            >
                              {isActive ? 'En Línea' : 'Pausado'}
                            </span>

                            <button
                              onClick={() => handleToggleBusiness(biz)}
                              disabled={isToggling}
                              className={`w-12 h-6 rounded-full p-0.5 transition-colors relative focus:outline-none ${
                                isActive
                                  ? 'bg-emerald-500'
                                  : isDark
                                  ? 'bg-neutral-800'
                                  : 'bg-neutral-300'
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
            </div>

            {filteredBusinesses.length === 0 && (
              <div className={`py-12 text-center text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                No se encontraron comercios con los criterios de búsqueda.
              </div>
            )}
          </section>
        )}

        {/* 4. Timeline & Audit Stream (Arc UI Timeline) */}
        {(activeSection === 'all' || activeSection === 'timeline') && (
          <section
            className={`rounded-3xl p-5 sm:p-6 border transition-colors ${
              isDark
                ? 'bg-[#0A0A0A] border-neutral-800'
                : 'bg-white border-neutral-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-base font-bold tracking-tight">
                    Línea de Tiempo & Registro de Actividad
                  </h3>
                </div>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Eventos en vivo de facturación, altas de comercios y cambios de estado
                </p>
              </div>

              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                }`}
              >
                {timelineItems.length} eventos registrados
              </span>
            </div>

            <Timeline items={timelineItems} theme={theme} />
          </section>
        )}

        {/* 5. Subscription Payments Ledger */}
        {(activeSection === 'all' || activeSection === 'payments') && (
          <section
            className={`rounded-3xl p-5 sm:p-6 border transition-colors ${
              isDark
                ? 'bg-[#0A0A0A] border-neutral-800'
                : 'bg-white border-neutral-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-base font-bold tracking-tight">
                    Libro de Pagos de Suscripciones
                  </h3>
                </div>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Registro financiero de cobros de software recaudados a los titulares
                </p>
              </div>

              <button
                onClick={() => setIsPaymentSheetOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-semibold text-xs transition-all shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Cobro</span>
              </button>
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr
                    className={`border-b uppercase tracking-wider text-[10px] font-semibold ${
                      isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-200 text-neutral-400'
                    }`}
                  >
                    <th className="pb-3">Fecha</th>
                    <th className="pb-3">Comercio</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Método</th>
                    <th className="pb-3">Referencia</th>
                    <th className="pb-3 text-right">Monto USD</th>
                    <th className="pb-3 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark ? 'divide-neutral-900' : 'divide-neutral-100'
                  }`}
                >
                  {payments.map((p) => (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isDark ? 'hover:bg-neutral-900/40' : 'hover:bg-neutral-50'
                      }`}
                    >
                      <td className={`py-3.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {new Date(p.createdAt).toLocaleDateString('es-LA', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5">
                        <span className="font-semibold">{p.businessName}</span>
                        <span
                          className={`text-[10px] block font-mono ${
                            isDark ? 'text-neutral-500' : 'text-neutral-400'
                          }`}
                        >
                          /{p.businessSlug}
                        </span>
                      </td>

                      <td className={`py-3.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        {p.plan}
                      </td>

                      <td className="py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-lg border text-[11px] font-medium ${
                            isDark
                              ? 'bg-neutral-900 border-neutral-800 text-neutral-300'
                              : 'bg-neutral-100 border-neutral-200 text-neutral-700'
                          }`}
                        >
                          {p.method}
                        </span>
                      </td>

                      <td className={`py-3.5 font-mono text-[11px] ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        {p.reference || '—'}
                      </td>

                      <td className="py-3.5 text-right font-bold text-emerald-500">
                        ${p.amount.toFixed(2)}
                      </td>

                      <td className="py-3.5 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Completado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {payments.length === 0 && (
                <div className={`py-12 text-center text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  No hay pagos registrados aún en el libro financiero.
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* 6. Arc UI Bottom Sheet for Registering Payments (Drag to dismiss on mobile) */}
      <BottomSheet
        theme={theme}
        isOpen={isPaymentSheetOpen}
        onClose={() => setIsPaymentSheetOpen(false)}
        title="Registrar Pago de Suscripción"
        description="Asienta un cobro recibido y actualiza el balance de la plataforma"
      >
        {paymentError && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {paymentError}
          </div>
        )}

        <form onSubmit={handleSubmitPayment} className="space-y-4">
          {/* Select Business */}
          <div>
            <label
              className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`}
            >
              Comercio Titular
            </label>
            <select
              value={selectedBizId}
              onChange={(e) => setSelectedBizId(e.target.value)}
              className={`w-full rounded-2xl px-3.5 py-2.5 text-base sm:text-sm transition-colors border focus:outline-none focus:border-emerald-500 ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-white'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-900'
              }`}
            >
              {businesses.map((biz) => (
                <option key={biz.id} value={biz.id} className={isDark ? 'bg-neutral-900 text-white' : 'bg-white text-black'}>
                  {biz.name} ({biz.city || biz.category})
                </option>
              ))}
              <option value="" className={isDark ? 'bg-neutral-900 text-white' : 'bg-white text-black'}>
                Otro comercio (Nuevo / Externo)
              </option>
            </select>
          </div>

          {!selectedBizId && (
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Nombre del Negocio
              </label>
              <input
                type="text"
                placeholder="Ej. Pizzería Roma"
                value={customBizName}
                onChange={(e) => setCustomBizName(e.target.value)}
                className={`w-full rounded-2xl px-3.5 py-2.5 text-base sm:text-sm transition-colors border focus:outline-none focus:border-emerald-500 ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-600'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
                }`}
              />
            </div>
          )}

          {/* Plan Selector using Morph style */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Plan Contratado
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Plan Inicial ($12)', 'Big Taply ($34)', 'Personalizado'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => handlePlanChange(p)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    paymentPlan === p
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500'
                      : isDark
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Amount and Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Monto ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className={`w-full rounded-2xl px-3.5 py-2.5 text-base sm:text-sm transition-colors border focus:outline-none focus:border-emerald-500 ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-white'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Método de Cobro
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className={`w-full rounded-2xl px-3.5 py-2.5 text-base sm:text-sm transition-colors border focus:outline-none focus:border-emerald-500 ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-white'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              >
                <option value="Pago Móvil" className={isDark ? 'bg-neutral-900' : 'bg-white'}>Pago Móvil</option>
                <option value="Zelle" className={isDark ? 'bg-neutral-900' : 'bg-white'}>Zelle</option>
                <option value="Binance USDT" className={isDark ? 'bg-neutral-900' : 'bg-white'}>Binance USDT</option>
                <option value="Efectivo Divisas" className={isDark ? 'bg-neutral-900' : 'bg-white'}>Efectivo Divisas</option>
                <option value="Stripe" className={isDark ? 'bg-neutral-900' : 'bg-white'}>Stripe (Tarjeta)</option>
              </select>
            </div>
          </div>

          {/* Reference */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Referencia Bancaria / ID
            </label>
            <input
              type="text"
              placeholder="Ej. PM-0134-8931 o Hash"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              className={`w-full rounded-2xl px-3.5 py-2.5 text-base sm:text-sm transition-colors border focus:outline-none focus:border-emerald-500 ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-600'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsPaymentSheetOpen(false)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-colors ${
                isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submittingPayment}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {submittingPayment ? 'Registrando...' : 'Confirmar y Asentar Pago'}
            </button>
          </div>
        </form>
      </BottomSheet>
    </div>
  );
}
