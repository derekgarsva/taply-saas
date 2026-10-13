'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Store,
  Sliders,
  TrendingUp,
  QrCode,
  Lock,
  MessageCircle,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import SlideConfirmWhatsApp from '@/components/storefront/SlideConfirmWhatsApp';

export default function SolicitarAccesoPage() {
  const founderPhone = '584243087887';
  const whatsappUrl = `https://wa.me/${founderPhone}?text=${encodeURIComponent(
    '¡Hola! Quiero solicitar acceso demo al Panel de Dueño de Taply para probar cómo gestionar mi catálogo y productos.'
  )}`;

  const handleSlideConfirm = () => {
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-[#00594C] selection:text-white flex flex-col justify-between">
      {/* ── Top Navigation Bar ── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-[#00594C] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              T
            </span>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              Taply
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-gray-700 hover:text-gray-900 px-3 py-2 rounded-xl transition-colors"
            >
              Ya tengo mi PIN
            </Link>
            <Link
              href="/onboarding"
              className="h-9 px-4 rounded-full bg-[#00594C] text-white hover:bg-[#00463C] active:scale-95 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>Crear Mi Tienda</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Main Hero & Interactive Request Content ── */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-10 sm:py-14 flex flex-col justify-center">
        {/* Badge */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#00594C] text-xs font-extrabold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACCESO EXCLUSIVO · DEMO GUIADA</span>
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight leading-tight">
            Solicita acceso al <span className="text-[#00594C]">Panel de Dueño</span> con el fundador de Taply
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            Por privacidad y seguridad de las tiendas de demostración, el acceso se gestiona de forma directa y personalizada. Habla con el fundador para recibir tu PIN de prueba.
          </p>
        </div>

        {/* ── Feature Highlights Card ── */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm mb-8 space-y-4">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-gray-400">
            ¿Qué podrás probar dentro del panel demo?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#00594C] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-gray-900 leading-tight">Gestión de Catálogo</h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  Crea productos, cambia fotos y edita precios en vivo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-gray-900 leading-tight">Métricas en Tiempo Real</h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  Visitas al catálogo, tasa de conversión y pedidos WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-gray-900 leading-tight">Branding & Colores</h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  Personaliza tu color de marca, portada y métodos de pago.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-gray-900 leading-tight">Códigos QR Instantáneos</h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  Genera códigos QR de alta resolución para imprimir en mesas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── THE INTERACTIVE SLIDE-TO-CONFIRM ACTION (SIN CONTENEDOR, EDGE-TO-EDGE EN MÓVIL) ── */}
        <div className="w-full text-center py-3">
          <div className="flex items-center justify-center gap-1.5 mb-1.5 text-[#00594C]">
            <MessageCircle className="w-4 h-4 fill-current" />
            <span className="font-extrabold text-[11px] uppercase tracking-wider">
              Solicitud Directa por WhatsApp
            </span>
          </div>

          <h3 className="font-extrabold text-lg sm:text-xl text-gray-950 mb-1 tracking-tight">
            Desliza para conectar con el fundador
          </h3>
          <p className="text-xs text-gray-500 mb-5">
            Recibirás tu clave directamente en tu chat.
          </p>

          {/* Edge-to-edge responsive slider con espacio lateral simétrico */}
          <div className="w-full px-2 sm:px-4 mx-auto max-w-lg">
            <SlideConfirmWhatsApp
              onConfirm={handleSlideConfirm}
              accentColor="#00594C"
              label="Deslizar para pedir acceso al Fundador"
              doneLabel="¡Abriendo WhatsApp con el Fundador!"
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <PhoneCall className="w-3.5 h-3.5 text-gray-400" />
            <span>Atención personal al <strong>+58 424 308 7887</strong></span>
          </div>
        </div>

        {/* ── Footer Navigation Links ── */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-xs text-gray-500">
            ¿Ya tienes tu PIN asignado?{' '}
            <Link href="/login" className="underline font-bold text-[#00594C] hover:text-[#00463C]">
              Iniciar sesión aquí
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            ¿Quieres crear tu catálogo para tu propio negocio?{' '}
            <Link href="/onboarding" className="underline font-bold text-gray-900 hover:text-black">
              Crear gratis en 60 segundos
            </Link>
          </p>
        </div>
      </main>

      {/* ── Simple Footer ── */}
      <footer className="py-6 text-center border-t border-gray-100 text-xs text-gray-400">
        <p>© 2026 Taply SaaS • El catálogo multilink más rápido para vender por WhatsApp</p>
      </footer>
    </div>
  );
}
