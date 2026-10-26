'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Zap,
  Clock,
  Package,
  Layers,
  Bike,
  DollarSign,
  QrCode,
  Gift,
} from 'lucide-react';
import { G2Button, MagneticButton } from '@/components/motion';

export default function ValueStackSection() {
  const stackItems = [
    {
      title: 'Catálogo Digital Interactivo de 3 Toques',
      desc: 'Catálogo web multilink ultra-rápido sin descargas ni registros para tus clientes. Selector de delivery/retiro y autocompletado en 1 segundo.',
      value: '$40 / mes',
      badge: 'Incluido',
      icon: Layers,
    },
    {
      title: 'Servicio White-Glove Onboarding (Montaje de 30 productos)',
      desc: 'No pierdes ni 1 minuto subiendo fotos ni precios: nuestro equipo digitaliza y carga tus primeros 30 productos en menos de 24 horas.',
      value: '$90 valor',
      badge: '100% Gratis en tu prueba',
      icon: Package,
    },
    {
      title: 'Subpanel de Despacho en Vivo (Cocina & Delivery)',
      desc: 'Pantalla privada para repartidores y empaque con WhatsApp directo al cliente, filtros de retiro/delivery y protección anti-colisión.',
      value: '$35 / mes',
      badge: 'Incluido',
      icon: Bike,
    },
    {
      title: 'Panel del Dueño con Arqueo de Caja & Swipe Actions',
      desc: 'Cuadre diario automático con desglose por Pago Móvil, Zelle y efectivo. Descuento de stock por gestos swipe sin errores.',
      value: '$30 / mes',
      badge: 'Incluido',
      icon: DollarSign,
    },
    {
      title: 'Pack de Branding & Código QR Físico en Alta Resolución',
      desc: 'Arte descargable listo para imprimir y pegar en tus mesas, mostradores, servilleteros o bolsas de entrega.',
      value: '$25 valor',
      badge: 'Listo para imprimir',
      icon: QrCode,
    },
  ];

  return (
    <section id="oferta" className="py-20 sm:py-28 bg-[#FBFBFA] border-t border-black/[0.05] px-4 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#00594C] text-xs font-black uppercase tracking-wider mb-3.5 shadow-2xs"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Stack de Valor • Oferta Especial</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight"
          >
            Todo lo que recibes al empezar hoy
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 mt-3 max-w-xl mx-auto leading-relaxed"
          >
            No compras solo un software: compras horas de tranquilidad, pedidos ordenados y un equipo que te monta tu catálogo sin que tengas que teclear nada.
          </motion.p>
        </div>

        {/* ══ VALUE STACK BREAKDOWN CARD ══ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-white border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-10 mb-10"
        >
          <div className="divide-y divide-gray-100">
            {stackItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="py-4.5 sm:py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00594C] border border-emerald-100/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed max-w-2xl">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 self-end sm:self-center pl-13 sm:pl-0">
                    <span className="text-xs font-bold text-gray-400 line-through">
                      {item.value}
                    </span>
                    <p className="text-xs font-black text-emerald-700">GRATIS</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stack Summary Banner */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F5F7] -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 sm:p-8 rounded-b-3xl">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                Valor Real del Paquete Completo
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-gray-400 line-through">$220 USD</span>
                <span className="text-3xl font-black text-gray-900">
                  Prueba 14 Días Sin Costo
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Luego desde solo $12/mes • 0% comisiones sobre tus ventas
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#00594C] hover:bg-[#00473D] text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <span>Probar 14 días sin costo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ══ LA GARANTÍA INVERTIDA DE 14 DÍAS (RISK REVERSAL TOTAL) ══ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-950 to-gray-950 text-white p-7 sm:p-10 border border-emerald-900/60 shadow-xl relative overflow-hidden"
        >
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-lg shadow-emerald-950/40">
              <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase tracking-wider mb-2 border border-emerald-500/30">
                <Sparkles className="w-3 h-3" />
                <span>Garantía Invertida de 14 Días</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                El riesgo lo asumimos nosotros al 100%
              </h3>

              <div className="mt-3 text-xs sm:text-sm text-gray-300 space-y-2.5 leading-relaxed font-normal">
                <p>
                  Prueba Taply durante <strong>14 días completos sin pagar un solo centavo</strong>. Te cargamos tus primeros <strong>30 productos gratis</strong> con fotos, precios y categorías, y dejamos tu catálogo listo para vender en menos de 24 horas.
                </p>
                <p>
                  Si al cabo de 14 días sientes que Taply no te ahorró al menos 10 horas de atención por WhatsApp, no duplicó la velocidad con la que salen tus pedidos y no ordenó tu negocio, simplemente nos avisas.
                </p>
                <p className="text-emerald-300 font-semibold">
                  No pagarás absolutamente nada, no te haremos preguntas y te quedarás con tus 30 productos digitalizados y organizados como agradecimiento por tu tiempo.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action inside Guarantee */}
          <div className="mt-8 pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Sin tarjeta de crédito requerida • Montaje en menos de 24 horas</span>
            </div>

            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-white hover:bg-emerald-50 text-gray-950 font-black text-xs transition-all shadow-md active:scale-95 text-center"
            >
              <span>Activar mis 14 días sin costo + Carga de 30 productos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
