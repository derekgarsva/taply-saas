'use client';

import React from 'react';
import Link from 'next/link';
import IPhoneMockup from '@/components/IPhoneMockup';
import {
  TextEffect,
  AnimatedGroup,
  MagneticButton,
  TiltCard,
} from '@/components/motion';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Smartphone,
  Zap,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-[#00594C] selection:text-white">
      {/* ══ TOP NAVBAR ══ */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-[#00594C] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              T
            </span>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              Taply
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Características</a>
            <a href="#demos" className="hover:text-gray-900 transition-colors">Demos en Vivo</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Precios</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-gray-700 hover:text-gray-900 px-3 py-2 rounded-xl transition-colors"
            >
              Iniciar Sesión
            </Link>

            <Link
              href="/onboarding"
              className="h-10 px-4 rounded-full bg-[#00594C] text-white hover:bg-[#00463C] active:scale-95 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>Crear Catálogo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO SECTION ══ */}
      <section className="pt-12 pb-20 px-4 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#00594C] text-xs font-bold mb-6 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>La forma más rápida de vender por WhatsApp en 2026</span>
        </motion.div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-950 tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto">
          Convierte tu enlace en bio en una <span className="text-[#00594C] underline decoration-[#00594C]/30">máquina de pedidos</span> por WhatsApp
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Crea tu catálogo interactivo multilink en 60 segundos. Tus clientes eligen sus productos con un toque, deslizan para confirmar y te envían el pedido ordenado y listo con sus datos de pago.
        </motion.p>

        {/* Hero CTAs con Magnetic Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <MagneticButton strength={14} className="w-full sm:w-auto">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto h-13 px-8 rounded-full bg-[#00594C] text-white hover:bg-[#00463C] text-sm font-extrabold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>Crear Catálogo Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticButton>

          <Link
            href="/panaderia-la-estrella"
            className="w-full sm:w-auto h-13 px-7 rounded-full bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 active:scale-98 text-sm font-bold flex items-center justify-center gap-2 shadow-2xs transition-all hover:border-gray-300"
          >
            <span>Ver Demo: Panadería La Estrella 🥐</span>
          </Link>
        </motion.div>

        <p className="mt-3 text-xs text-gray-400">
          ✓ Sin comisiones por venta &nbsp;•&nbsp; ✓ Sin registros para tus clientes &nbsp;•&nbsp; ✓ Listo para Venezuela y Latinoamérica
        </p>

        {/* ══ AUTHENTIC 4K STUDIO IPHONE MOCKUP (AGENDOD STYLE) ══ */}
        <div className="mt-14 max-w-sm sm:max-w-md mx-auto relative">
          <IPhoneMockup businessName="Panadería La Estrella" slug="panaderia-la-estrella" />

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
            <span className="text-xs font-semibold text-gray-500">
              💡 Prueba sumar productos y tocar pedir en el iPhone arriba, o
            </span>
            <Link
              href="/panaderia-la-estrella"
              className="text-xs font-bold text-[#00594C] hover:underline inline-flex items-center gap-1"
            >
              <span>ver el catálogo completo en vivo</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FEATURES GRID ══ */}
      <section id="features" className="py-20 bg-gray-50 border-y border-gray-100 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#00594C] uppercase tracking-widest">
              DISEÑADO PARA VENDER MÁS
            </span>
            <h2 className="text-3xl font-extrabold text-gray-950 mt-1">
              Todo lo que necesitas para tu negocio en un solo lugar
            </h2>
          </div>

          <AnimatedGroup
            variant="blur-fade"
            stagger={0.07}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#00594C] flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">Filosofía de 3 Toques</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Olvídate de formularios eternos y carritos complicados que hacen perder clientes. El usuario abre el link, toca lo que quiere y desliza para confirmar.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">Multilink en Bio Integrado</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Combina tu catálogo con enlaces directos a tu Instagram, TikTok, botón de llamada telefónica y ubicación exacta en Google Maps.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-5">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">Códigos QR Instantáneos</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Genera y descarga en alta calidad el código QR de tu catálogo para imprimir en acrílicos de mesa, cartas físicas o calcomanías.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">Datos de Pago al Instante</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Adjunta automáticamente tus datos de Pago Móvil, Zelle o transferencias en el mensaje de WhatsApp para que el cliente pague de inmediato.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-5">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">Micro-interacciones Fluidas</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Buscador expansivo "Seek", selector táctil "Hold-to-Sweep", notificación de agotados con animación de campana y slide con física real.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900 mb-2">Panel con Métricas Reales</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Conoce cuántas personas abren tu catálogo, cuántos pedidos generas por WhatsApp y qué productos son los más buscados de tu negocio.
              </p>
            </div>
          </AnimatedGroup>
        </div>
      </section>

      {/* ══ DEMOS SHOWCASE ══ */}
      <section id="demos" className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-[#00594C] uppercase tracking-widest">
            PRUÉBALO TÚ MISMO
          </span>
          <h2 className="text-3xl font-extrabold text-gray-950 mt-1">
            Catálogos de ejemplo listos para probar
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Demo 1 */}
          <TiltCard maxTilt={5} scaleHover={1.02}>
            <Link
              href="/panaderia-la-estrella"
              className="group block p-5 rounded-3xl bg-white border border-gray-200 hover:border-[#00594C] transition-all shadow-2xs hover:shadow-md h-full"
            >
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
                  alt="Panadería La Estrella"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-gray-900">
                  PANADERÍA
                </div>
              </div>
              <h4 className="font-extrabold text-lg text-gray-900">Panadería La Estrella</h4>
              <p className="text-xs text-gray-500 mt-1">
                Masa madre, panes campesinos, cachitos y golfeados con checkout a WhatsApp.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#00594C]">
                <span>Ver Catálogo en Vivo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </TiltCard>

          {/* Demo 2 */}
          <TiltCard maxTilt={5} scaleHover={1.02}>
            <Link
              href="/burger-station"
              className="group block p-5 rounded-3xl bg-white border border-gray-200 hover:border-red-600 transition-all shadow-2xs hover:shadow-md h-full"
            >
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
                  alt="Burger Station"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-gray-900">
                  SMASH BURGERS
                </div>
              </div>
              <h4 className="font-extrabold text-lg text-gray-900">Burger Station 🍔</h4>
              <p className="text-xs text-gray-500 mt-1">
                Hamburguesas smashed con bacon crocante, papas con cheddar y refrescos.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-red-600">
                <span>Ver Catálogo en Vivo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </TiltCard>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" className="py-20 bg-gray-50 border-t border-gray-100 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#00594C] uppercase tracking-widest">
              PLANES SIMPLES
            </span>
            <h2 className="text-3xl font-extrabold text-gray-950 mt-1">
              Sin comisiones por tus ventas
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Tus ganancias son 100% tuyas, pagadas directo a tu cuenta bancaria o WhatsApp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
            {/* Free Plan */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">PLAN GRATIS</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">$0</span>
                  <span className="text-xs text-gray-400">/ para siempre</span>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Ideal para emprendimientos y locales que inician su catálogo digital.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Catálogo multilink con tu URL personalizada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Hasta 20 productos activos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Pedidos ilimitados por WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Código QR descargable para tu local</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>0% de comisiones</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/onboarding"
                  className="w-full h-11 rounded-2xl bg-gray-900 text-white font-bold text-xs flex items-center justify-center hover:bg-black transition-colors"
                >
                  Empezar Gratis
                </Link>
              </div>
            </div>

            {/* Pro Plan con 3D Tilt */}
            <TiltCard maxTilt={5} scaleHover={1.02} className="h-full">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-950 to-gray-950 text-white border border-emerald-900 shadow-md flex flex-col justify-between relative overflow-hidden h-full">
                <div className="absolute top-4 right-4 bg-emerald-500 text-emerald-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  RECOMENDADO
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase">PLAN PRO</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">$9</span>
                    <span className="text-xs text-emerald-300">/ mes</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-3">
                    Para negocios en crecimiento que quieren análisis y máxima personalización.
                  </p>

                  <ul className="mt-6 space-y-2.5 text-xs text-gray-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>Productos ilimitados</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Estadísticas completas de visitas y conversión</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Personalización total de colores y marca</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Sin marca de agua de Taply</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Soporte prioritario por WhatsApp</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/onboarding"
                    className="w-full h-11 rounded-2xl bg-white text-gray-950 font-extrabold text-xs flex items-center justify-center hover:bg-emerald-50 transition-colors shadow-sm"
                  >
                    Probar Pro Gratis por 14 días
                  </Link>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-12 bg-white border-t border-gray-100 px-4 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-[#00594C] text-white flex items-center justify-center font-extrabold text-xs">
              T
            </span>
            <span className="font-extrabold text-base text-gray-900">Taply SaaS</span>
          </div>

          <p className="text-xs text-gray-400">
            © 2026 Taply. El creador de catálogos multilink para WhatsApp sin comisiones.
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
            <Link href="/login" className="hover:text-gray-900">Acceso Dueño</Link>
            <Link href="/onboarding" className="hover:text-gray-900">Crear Tienda</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
