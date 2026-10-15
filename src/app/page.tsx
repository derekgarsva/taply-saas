'use client';

import React from 'react';
import Link from 'next/link';
import IPhoneMockup from '@/components/IPhoneMockup';
import {
  TextEffect,
  AnimatedGroup,
  MagneticButton,
  G2Button,
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
import CardNav from '@/components/navigation/CardNav';
import SiteFooter from '@/components/footer/SiteFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-[#00594C] selection:text-white">
      {/* ══ FLOATING CARD NAVBAR WITH SLIDING PILL NAVIGATION MENU ══ */}
      <CardNav />

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

        {/* Hero CTAs con Magnetic Button y Continuidad G2 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xs sm:max-w-none mx-auto"
        >
          <MagneticButton as="div" strength={14} className="w-full sm:w-auto">
            <G2Button href="/onboarding" variant="primary">
              <span>Crear Catálogo Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </G2Button>
          </MagneticButton>

          <MagneticButton as="div" strength={14} className="w-full sm:w-auto">
            <G2Button href="/panaderia-la-estrella" variant="secondary">
              <span>Ver Demo en Vivo</span>
            </G2Button>
          </MagneticButton>
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
            {/* Starter Plan $12 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">PLAN INICIAL</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">$12</span>
                  <span className="text-xs text-gray-400">/ mes</span>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Perfecto para locales y marcas que inician su catálogo digital profesional.
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Catálogo multilink con tu URL personalizada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Hasta <strong>100 productos activos</strong></span>
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
                    <span>Botón con tus datos de pago (Pago Móvil, Zelle)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>0% de comisiones por tus ventas</strong></span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/onboarding"
                  className="w-full h-11 rounded-2xl bg-gray-900 text-white font-bold text-xs flex items-center justify-center hover:bg-black transition-colors"
                >
                  Empezar con Plan Inicial ($12)
                </Link>
              </div>
            </div>

            {/* Big Taply $34 con 3D Tilt */}
            <TiltCard maxTilt={5} scaleHover={1.02} className="h-full">
              <div className="p-8 rounded-3xl bg-gradient-to-b from-emerald-950 to-gray-950 text-white border border-emerald-900 shadow-md flex flex-col justify-between relative overflow-hidden h-full">
                <div className="absolute top-4 right-4 bg-emerald-500 text-emerald-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  MÁS DE 100 PRODUCTOS
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase">BIG TAPLY</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">$34</span>
                    <span className="text-xs text-emerald-300">/ mes</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-3">
                    Para bodegones, panaderías grandes, restaurantes y tiendas con inventario masivo.
                  </p>

                  <ul className="mt-6 space-y-2.5 text-xs text-gray-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span><strong>Más de 100 productos e inventario masivo</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Múltiples categorías y buscador avanzado</span>
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
                      <span>Soporte prioritario VIP por WhatsApp</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/onboarding"
                    className="w-full h-11 rounded-2xl bg-white text-gray-950 font-extrabold text-xs flex items-center justify-center hover:bg-emerald-50 transition-colors shadow-sm"
                  >
                    Elegir Big Taply ($34)
                  </Link>
                </div>
              </div>
            </TiltCard>
          </div>

        </div>
      </section>

      {/* ══ SITE FOOTER (UIARC LOGO VARIANT WITH NEWSLETTER & RISING BRAND MARK) ══ */}
      <SiteFooter variant="logo" />
    </div>
  );
}
