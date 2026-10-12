'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  ArrowRight,
  Sparkles,
  Store,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Mail,
  Clock,
  ShieldAlert,
  X
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recovery modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'reset'>('request');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  // Countdown timer for anti-spam rate limiting
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !pin.trim()) {
      setError('Por favor ingresa tu correo (o link de tienda) y tu PIN.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), pin: pin.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciales inválidas.');
      }

      // Success: redirect directly to this owner's dashboard
      router.push(`/dashboard?store=${data.business.slug}`);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
      setRecoveryError('Ingresa un correo electrónico válido.');
      return;
    }

    if (cooldown > 0) {
      setRecoveryError(`Por favor espera ${cooldown}s antes de enviar otra solicitud.`);
      return;
    }

    setRecoveryLoading(true);
    setRecoveryError(null);
    setRecoveryMessage(null);

    try {
      const res = await fetch('/api/auth/forgot-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.retryAfter) {
          setCooldown(data.retryAfter);
        }
        throw new Error(data.error || 'Demasiadas solicitudes.');
      }

      setRecoveryMessage(data.message);
      setCooldown(data.retryAfter || 60);

      // If in dev or demo, pre-fill code for effortless testing
      if (data.devToken) {
        setRecoveryCode(data.devToken);
      }

      setRecoveryStep('reset');
    } catch (err: any) {
      setRecoveryError(err.message || 'Error al solicitar recuperación.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryCode.trim() || !newPin.trim()) {
      setRecoveryError('Ingresa el código de 6 dígitos y tu nuevo PIN.');
      return;
    }

    if (newPin.trim().length < 4) {
      setRecoveryError('El PIN debe tener al menos 4 dígitos.');
      return;
    }

    setRecoveryLoading(true);
    setRecoveryError(null);

    try {
      const res = await fetch('/api/auth/reset-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recoveryEmail.trim(),
          token: recoveryCode.trim(),
          newPin: newPin.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Código incorrecto o expirado.');
      }

      // Close modal and prefill login
      setShowForgotModal(false);
      setPin(newPin.trim());
      setIdentifier(recoveryEmail.trim());
      setError(null);
      alert('¡PIN actualizado con éxito! Ya puedes iniciar sesión.');
    } catch (err: any) {
      setRecoveryError(err.message || 'Error al restablecer el PIN.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <span className="w-10 h-10 rounded-2xl bg-[#00594C] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
            T
          </span>
          <span className="font-extrabold text-2xl tracking-tight text-gray-900">
            Taply
          </span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Acceso al Panel de Control
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Gestiona tus productos, categorías y pedidos WhatsApp
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200 rounded-3xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Correo Electrónico o URL de tu Tienda
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="dueno@laestrella.com o panaderia-la-estrella"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  PIN de Acceso
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true);
                    setRecoveryStep('request');
                    setRecoveryError(null);
                    setRecoveryMessage(null);
                  }}
                  className="text-[11px] font-semibold text-[#00594C] hover:underline"
                >
                  ¿Olvidaste tu PIN?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="PIN de 4 a 6 dígitos (ej. 1234)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#00594C] text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-sm disabled:opacity-70"
              >
                <span>{loading ? 'Verificando...' : 'Entrar al Panel'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <span className="block text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              O entra directo en modo Demo
            </span>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIdentifier('panaderia-la-estrella');
                  setPin('1234');
                  router.push('/dashboard?store=panaderia-la-estrella');
                }}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-800 flex items-center justify-between transition-colors"
              >
                <span>🥐 Panadería La Estrella</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Probar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIdentifier('burger-station');
                  setPin('1234');
                  router.push('/dashboard?store=burger-station');
                }}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-800 flex items-center justify-between transition-colors"
              >
                <span>🍔 Burger Station</span>
                <span className="text-[10px] text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Probar</span>
              </button>
            </div>

            <div className="mt-5 text-center">
              <Link
                href="/onboarding"
                className="text-xs text-gray-500 hover:text-gray-900 font-medium"
              >
                ¿Aún no tienes tu catálogo? <span className="underline font-bold text-[#00594C]">Crear gratis en 60s</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── FORGOT PIN / RECOVERY MODAL (WITH RATE LIMIT & ANTI-SPAM PROTECTION) ── */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative"
            >
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#00594C]/10 text-[#00594C] flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">
                    {recoveryStep === 'request' ? 'Recuperar PIN de Acceso' : 'Verificar y Restablecer PIN'}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {recoveryStep === 'request'
                      ? 'Protegido con límite anti-spam de 60 segundos'
                      : 'Ingresa el código recibido para crear un nuevo PIN'}
                  </p>
                </div>
              </div>

              {recoveryError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{recoveryError}</span>
                </div>
              )}

              {recoveryMessage && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{recoveryMessage}</span>
                </div>
              )}

              {recoveryStep === 'request' ? (
                <form onSubmit={handleRequestRecovery} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Correo Electrónico Registrado
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        placeholder="tu-correo@ejemplo.com"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="w-full h-11 pl-10 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                        required
                      />
                    </div>
                  </div>

                  {/* Anti-spam security notice */}
                  <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/60 flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-800 leading-relaxed">
                      <strong>Protección anti-abuso:</strong> Solo se permite 1 solicitud de recuperación cada 60 segundos por correo para evitar saturación.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={recoveryLoading || cooldown > 0}
                      className="w-full h-11 bg-[#00594C] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-transform disabled:opacity-60"
                    >
                      {recoveryLoading ? (
                        'Enviando código...'
                      ) : cooldown > 0 ? (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Reintentar en {cooldown}s
                        </span>
                      ) : (
                        <span>Enviar Código de Seguridad</span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Código de 6 Dígitos
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value)}
                      className="w-full h-11 px-3.5 text-center tracking-widest font-mono text-base bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nuevo PIN (4 a 6 dígitos)
                    </label>
                    <input
                      type="password"
                      placeholder="••••"
                      maxLength={6}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="w-full h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                      required
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRecoveryStep('request')}
                      className="w-1/3 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={recoveryLoading}
                      className="flex-1 h-11 bg-[#00594C] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-transform disabled:opacity-70"
                    >
                      <span>{recoveryLoading ? 'Actualizando...' : 'Restablecer mi PIN'}</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
