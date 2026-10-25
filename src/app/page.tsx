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
import TextReveal from '@/components/ui/text-reveal';
import AppleFeatureCarousel from '@/components/home/AppleFeatureCarousel';
import BentoGridSection from '@/components/home/BentoGridSection';
import ValueStackSection from '@/components/home/ValueStackSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-[#00594C] selection:text-white">
      {/* ══ FLOATING CARD NAVBAR WITH SLIDING PILL NAVIGATION MENU ══ */}
      <CardNav />

      {/* ══ HERO SECTION ══ */}
      <section className="pt-12 pb-16 px-4 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#00594C] text-xs font-bold mb-6 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>La solución definitiva para vender por WhatsApp en 2026</span>
        </motion.div>

        <TextReveal
          as="h1"
          text="Convierte tu WhatsApp en una caja registradora automática y maneja todo tu negocio desde un solo panel."
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.12] max-w-4xl mx-auto"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Elimina las horas perdidas respondiendo precios uno a uno, enviando fotos sueltas y descifrando capturas. Tus clientes eligen sus productos en 3 toques y tú recibes los pedidos listos y ordenados directo a tu WhatsApp y panel en tiempo real.
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
              <span>Probar 14 días sin costo</span>
              <ArrowRight className="w-4 h-4" />
            </G2Button>
          </MagneticButton>

          <MagneticButton as="div" strength={14} className="w-full sm:w-auto">
            <G2Button href="/panaderia-la-estrella" variant="secondary">
              <span>Ver Demo en Vivo</span>
            </G2Button>
          </MagneticButton>
        </motion.div>

        {/* Microcopy Requerido */}
        <p className="mt-4 text-xs font-semibold text-emerald-800 bg-emerald-50/70 border border-emerald-100/90 py-1 px-3.5 rounded-full inline-block">
          Te montamos tus primeros 30 productos gratis • Listo en 24h • Cero comisiones
        </p>

        {/* ══ IPHONE MINIMAL PLAYER (PANTALLA LIMPIA SIN MARCOS) ══ */}
        <div className="mt-14 max-w-sm sm:max-w-md mx-auto relative">
          <IPhoneMockup businessName="Panadería La Estrella" slug="panaderia-la-estrella" />

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
            <span className="text-xs font-semibold text-gray-500">
              💡 Mira la experiencia fluida de Taply en el iPhone, o
            </span>
            <Link
              href="/panaderia-la-estrella"
              className="text-xs font-bold text-[#00594C] hover:underline inline-flex items-center gap-1"
            >
              <span>ver el catálogo demo completo en vivo</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ BENTO GRID SECTION: CAJA DIARIO, PIPELINE DESPACHO Y CONTROL DE STOCK ══ */}
      <BentoGridSection />

      {/* ══ FEATURES APPLE-STYLE INTERACTIVE CAROUSEL ══ */}
      <section id="caracteristicas" className="py-20 sm:py-24 bg-gray-50/70 border-y border-gray-200/80 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-black text-[#00594C] uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 inline-block mb-3">
              DISEÑADO PARA VENDER MÁS
            </span>
            <TextReveal
              as="h2"
              text="Todo lo que necesitas para tu negocio en un solo lugar"
              className="text-3xl sm:text-4xl font-black text-gray-950 mt-1 tracking-tight"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-3 max-w-lg mx-auto">
              Diseñado con la filosofía de 3 toques para convertir visitantes casuales en pedidos confirmados por WhatsApp.
            </p>
          </div>

          <AppleFeatureCarousel />
        </div>
      </section>

      {/* ══ DEMOS SHOWCASE ══ */}
      <section id="demos" className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-[#00594C] uppercase tracking-widest">
            PRUÉBALO TÚ MISMO
          </span>
          <TextReveal
            as="h2"
            text="Catálogos de ejemplo listos para probar"
            className="text-3xl font-extrabold text-gray-950 mt-1"
          />
        </div>

        <AnimatedGroup
          variant="blur-fade"
          stagger={0.1}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
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
        </AnimatedGroup>
      </section>

      {/* ══ STACK DE VALOR Y GARANTÍA INVERTIDA DE 14 DÍAS ══ */}
      <ValueStackSection />

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

          <AnimatedGroup
            variant="blur-fade"
            stagger={0.12}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch"
          >
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
                  Probar 14 días sin costo (Plan Inicial)
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
                    Probar 14 días sin costo (Big Taply)
                  </Link>
                </div>
              </div>
            </TiltCard>
          </AnimatedGroup>

        </div>
      </section>

      {/* ══ SITE FOOTER (UIARC LOGO VARIANT WITH NEWSLETTER & RISING BRAND MARK) ══ */}
      <SiteFooter variant="logo" />
    </div>
  );
}
