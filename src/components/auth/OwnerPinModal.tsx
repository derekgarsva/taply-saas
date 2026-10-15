'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  ArrowRight,
  Sparkles,
  X,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Store,
  KeyRound
} from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator
} from '@/components/ui/input-otp';
import { Business } from '@/types';

interface OwnerPinModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
}

export default function OwnerPinModal({
  business,
  isOpen,
  onClose,
}: OwnerPinModalProps) {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const isSubmittingRef = useRef(false);

  const isDemo =
    business.slug === 'panaderia-la-estrella' ||
    business.slug === 'burger-station' ||
    business.slug.includes('demo');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      setIsVerifying(false);
      setIsSuccess(false);
      setIsNavigating(false);
      isSubmittingRef.current = false;
    }
  }, [isOpen]);

  const verifyPin = async (inputPin: string) => {
    if (isSubmittingRef.current || isNavigating) return;
    if (inputPin.length < 4) {
      setError('Ingresa los 6 dígitos de tu clave');
      return;
    }

    isSubmittingRef.current = true;
    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: business.slug,
          pin: inputPin.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Clave incorrecta. Intenta nuevamente.');
      }

      // PIN is valid!
      setIsSuccess(true);
      setIsNavigating(true);

      // Smooth transition to dashboard without glitch or click spam
      setTimeout(() => {
        router.push(`/dashboard?store=${business.slug}`);
      }, 550);
    } catch (err: any) {
      setError(err.message || 'Clave incorrecta');
      setIsSuccess(false);
      isSubmittingRef.current = false;
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (newVal: string) => {
    if (isNavigating) return;
    setPin(newVal);
    if (error) setError(null);

    // Auto verify when all 6 digits are typed
    if (newVal.length === 6 && !isSubmittingRef.current) {
      verifyPin(newVal);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop with smooth blur and entrance fade */}
        <motion.div
          key="pin-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={() => {
            if (!isNavigating && !isVerifying) onClose();
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Card with spring motion */}
        <motion.div
          key="pin-card"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{
            type: 'spring',
            duration: 0.35,
            bounce: 0.15,
          }}
          className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 p-6 sm:p-8 flex flex-col items-center text-center font-sans"
        >
          {/* Top Bar with Back/Close Button */}
          <div className="w-full flex items-center justify-between mb-4">
            <button
              type="button"
              disabled={isNavigating || isVerifying}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors p-1.5 -ml-2 rounded-xl hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver a la tienda</span>
            </button>

            <button
              type="button"
              disabled={isNavigating || isVerifying}
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Business Brand Header */}
          <div className="mb-4 flex flex-col items-center">
            {business.logoImage ? (
              <img
                src={business.logoImage}
                alt={business.name}
                className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-gray-100 mb-2.5"
              />
            ) : (
              <div
                className="w-14 h-14 rounded-2xl text-white flex items-center justify-center font-extrabold text-xl shadow-sm mb-2.5"
                style={{ backgroundColor: business.themeColor || '#00594C' }}
              >
                {business.name.charAt(0)}
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-bold mb-1.5">
              <Lock className="w-3 h-3 text-[#00594C]" />
              <span>Panel de Control del Dueño</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight">
              {business.name}
            </h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Ingresa tu clave de 6 dígitos para administrar tu catálogo, productos y pedidos.
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══ 6-Digit OTP Interactive Component ══ */}
          <div className="my-3 py-2 w-full flex justify-center">
            <InputOTP
              maxLength={6}
              value={pin}
              onChange={handleOtpChange}
              disabled={isVerifying || isNavigating}
              aria-invalid={!!error}
              success={isSuccess}
              containerClassName="gap-2 sm:gap-2.5"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Action Button: Validar / Entrar */}
          <div className="w-full mt-3">
            <button
              type="button"
              disabled={pin.length < 4 || isVerifying || isNavigating}
              onClick={() => verifyPin(pin)}
              className="w-full h-12 rounded-2xl bg-[#00594C] hover:bg-[#00463C] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>¡Clave correcta! Entrando al panel...</span>
                </>
              ) : isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Verificando clave...</span>
                </>
              ) : (
                <>
                  <span>Ingresar al Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* ══ LINK ESPECÍFICO PARA NEGOCIOS DEMO: DISCRETO PERO LEGIBLE ══ */}
          {isDemo ? (
            <div className="mt-5 pt-4 border-t border-gray-100 w-full text-center">
              <Link
                href="/solicitar-acceso"
                onClick={() => setIsNavigating(true)}
                className="inline-flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-[#00594C] font-semibold transition-colors underline decoration-gray-300 underline-offset-4 active:opacity-70"
              >
                <span>¿No tienes tu clave de prueba?</span>
                <span className="font-bold text-[#00594C]">
                  Solicitar acceso al panel dueño con el fundador de Taply →
                </span>
              </Link>
            </div>
          ) : (
            <div className="mt-4 pt-3 border-t border-gray-100 w-full text-center">
              <Link
                href={`/login?store=${business.slug}`}
                onClick={() => setIsNavigating(true)}
                className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
              >
                ¿Olvidaste tu clave de acceso o necesitas recuperarla?
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
