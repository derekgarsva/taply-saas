'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  Scale,
  CreditCard,
  Lock,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import CardNav from '@/components/navigation/CardNav';
import SiteFooter from '@/components/footer/SiteFooter';
import InView from '@/components/motion/InView';
import TextReveal from '@/components/ui/text-reveal';

export default function TerminosPage() {
  const lastUpdated = '15 de Octubre de 2026';

  const sections = [
    {
      id: 'general',
      icon: Scale,
      title: '1. Aceptación y Generalidades',
      content: (
        <>
          <p className="text-sm text-gray-600 leading-relaxed">
            Al acceder, registrarse o utilizar los servicios de <strong className="text-gray-950 font-bold">Taply SaaS</strong> (en adelante, &quot;Taply&quot; o &quot;la Plataforma&quot;), usted acepta quedar legalmente vinculado por los presentes Términos y Condiciones.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-2.5">
            Taply es una plataforma digital de software como servicio orientada al comercio digital que permite a comerciantes, marcas, emprendedores y locales gastronómicos crear catálogos interactivos multilink para la captación y gestión directa de pedidos mediante WhatsApp.
          </p>
        </>
      ),
    },
    {
      id: 'comisiones',
      icon: CreditCard,
      title: '2. Modelo 0% Comisiones por Venta',
      content: (
        <>
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 mb-3 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00594C] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#00594C] leading-relaxed">
              <strong className="font-extrabold block mb-0.5">Sin intermediación financiera ni comisiones ocultas:</strong>
              El 100% del dinero de cada venta realizada a través de tu catálogo va directamente a las cuentas bancarias o billeteras de tu negocio.
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Taply no actúa como pasarela de cobro ni custodia fondos de terceros. La plataforma facilita la preparación ordenada del pedido y la entrega estructurada de los datos de pago (Pago Móvil, Zelle, transferencias o efectivo) a través de un chat de WhatsApp directo entre el comprador final y el comerciante.
          </p>
        </>
      ),
    },
    {
      id: 'planes',
      icon: Sparkles,
      title: '3. Planes de Suscripción y Facturación',
      content: (
        <>
          <p className="text-sm text-gray-600 leading-relaxed">
            Taply opera bajo una modalidad de suscripción recurrente mensual clara, sin contratos forzosos ni penalizaciones de cancelación:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3.5">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-extrabold text-gray-900 uppercase">Plan Inicial</span>
                <span className="text-sm font-extrabold text-[#00594C]">$12 / mes</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Incluye catálogo multilink con URL personalizada, hasta 100 productos activos, pedidos ilimitados a WhatsApp y código QR para mesas.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-900 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-extrabold text-emerald-400 uppercase">Big Taply</span>
                <span className="text-sm font-extrabold text-white">$34 / mes</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Para inventario masivo (más de 100 productos), bodegones, múltiples categorías, estadísticas completas y sin marca de agua.
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            El suscriptor puede solicitar la cancelación o modificación de su plan en cualquier momento previo a su fecha de renovación periódica.
          </p>
        </>
      ),
    },
    {
      id: 'responsabilidad',
      icon: FileText,
      title: '4. Contenido y Responsabilidad del Comercio',
      content: (
        <>
          <p className="text-sm text-gray-600 leading-relaxed">
            El comerciante es el único responsable de la veracidad, calidad, legalidad y exactitud de los productos, fotografías, descripciones, precios e inventario publicados en su catálogo.
          </p>
          <ul className="mt-2.5 space-y-1.5 text-xs text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Queda terminantemente prohibido comercializar artículos ilícitos o restringidos por la legislación aplicable.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Taply se reserva el derecho de desactivar catálogos que incumplan con la normativa legal o atenten contra terceros.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'privacidad',
      icon: Lock,
      title: '5. Privacidad y Protección de Datos',
      content: (
        <>
          <p className="text-sm text-gray-600 leading-relaxed">
            Valoramos la confidencialidad de su negocio. La información de los comercios registrados se almacena de forma segura bajo estrictos protocolos de cifrado y aislamiento por tenant.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-2.5">
            El PIN de dueño de 6 dígitos utilizado para acceder al panel de administración se encuentra protegido criptográficamente. No vendemos ni compartimos las bases de datos de clientes ni la información de pedidos con anunciantes o terceros ajenos al servicio.
          </p>
        </>
      ),
    },
    {
      id: 'seguridad',
      icon: ShieldCheck,
      title: '6. Seguridad del Sistema y Disponibilidad',
      content: (
        <>
          <p className="text-sm text-gray-600 leading-relaxed">
            Nos esforzamos por garantizar una disponibilidad operativa superior al 99.8% con infraestructura distribuida y servidores optimizados para carga ultra rápida en redes móviles de Latinoamérica.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-2.5">
            Las tareas de mantenimiento programado se realizan preferentemente en horarios de baja afluencia comercial para mitigar interrupciones.
          </p>
        </>
      ),
    },
    {
      id: 'contacto',
      icon: MessageCircle,
      title: '7. Soporte Técnico y Contacto Directo',
      content: (
        <>
          <p className="text-sm text-gray-600 leading-relaxed">
            Para dudas sobre facturación, asistencia técnica, reporte de incidencias o consultas sobre estos términos, disponemos de un canal de soporte directo por WhatsApp con el equipo de fundadores:
          </p>
          <div className="mt-3.5 inline-flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
            <div className="flex items-center gap-2 text-gray-800 font-bold">
              <PhoneCall className="w-4 h-4 text-[#00594C]" />
              <span>WhatsApp Fundador: +58 424 308 7887</span>
            </div>
            <a
              href="https://wa.me/584243087887?text=Hola,%20tengo%20una%20consulta%20sobre%20los%20términos%20y%20condiciones%20de%20Taply"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00594C] hover:underline font-extrabold flex items-center gap-1"
            >
              <span>Escribir ahora</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans selection:bg-[#00594C] selection:text-white flex flex-col justify-between">
      {/* ══ FLOATING CARD NAVBAR (IDENTICAL TO HOME) ══ */}
      <CardNav />

      {/* ══ HEADER HERO ══ */}
      <header className="pt-10 pb-8 px-4 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#00594C] text-xs font-bold mb-4 shadow-2xs"
        >
          <Scale className="w-3.5 h-3.5" />
          <span>MARCO LEGAL Y OPERATIVO · TAPLY SAAS</span>
        </motion.div>

        <TextReveal
          as="h1"
          text="Términos y Condiciones de Uso"
          className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight max-w-2xl mx-auto"
        />

        <p className="mt-3 text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          Transparencia absoluta. Conoce las reglas que rigen el uso de Taply, nuestra política 0% comisiones y la seguridad de tu catálogo digital.
        </p>

        <p className="mt-2 text-[11px] font-semibold text-gray-400">
          Última actualización: {lastUpdated}
        </p>
      </header>

      {/* ══ MAIN CONTENT WITH SMOOTH SCROLL REVEAL ══ */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pb-20">
        {/* Quick Jump Anchor Pills */}
        <InView variant="fade-up" delay={0.1}>
          <div className="p-3 bg-white rounded-2xl border border-gray-200/80 shadow-2xs mb-8 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-bold text-gray-400 uppercase text-[10px] tracking-wider pr-1">
              Ir a:
            </span>
            <a
              href="#comisiones"
              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-[#00594C] font-semibold text-gray-700 transition-colors"
            >
              0% Comisiones
            </a>
            <a
              href="#planes"
              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-[#00594C] font-semibold text-gray-700 transition-colors"
            >
              Planes & Facturación
            </a>
            <a
              href="#privacidad"
              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-[#00594C] font-semibold text-gray-700 transition-colors"
            >
              Privacidad & PIN
            </a>
            <a
              href="#contacto"
              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-[#00594C] font-semibold text-gray-700 transition-colors"
            >
              Contacto
            </a>
          </div>
        </InView>

        {/* Section Cards */}
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <InView
                key={section.id}
                variant="fade-up"
                delay={0.05 * (idx + 1)}
              >
                <section
                  id={section.id}
                  className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-200/80 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00594C] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="font-extrabold text-base sm:text-lg text-gray-950 tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <div>{section.content}</div>
                </section>
              </InView>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <InView variant="fade-up" delay={0.2}>
          <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-gray-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-emerald-400">
                ¿LISTO PARA COMENZAR?
              </span>
              <h3 className="font-extrabold text-xl text-white mt-1">
                Crea tu tienda con 0% comisiones
              </h3>
              <p className="text-xs text-gray-300 mt-1 max-w-sm">
                Configura tu catálogo en 60 segundos y empieza a recibir pedidos ordenados por WhatsApp.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="h-11 px-6 rounded-full bg-white text-gray-950 hover:bg-emerald-50 active:scale-95 text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm flex-shrink-0"
            >
              <span>Crear Catálogo Gratis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </InView>
      </main>

      {/* ══ SITE FOOTER (UIARC LOGO VARIANT WITH TAPLY WATERMARK) ══ */}
      <SiteFooter variant="logo" />
    </div>
  );
}
