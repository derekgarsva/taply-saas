'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { normalizeVenezuelaPhone } from '@/lib/utils/phone';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: '¿Realmente montan mis primeros 30 productos gratis?',
    answer:
      'Sí, 100% garantizado. Al iniciar tu prueba de 14 días, nos envías tus fotos, menús o lista de productos por WhatsApp y nuestro equipo de soporte white-glove digitaliza, recorta y monta tus primeros 30 productos con sus variantes y categorías en menos de 24 horas.',
  },
  {
    question: '¿Cobran comisiones por cada venta que haga en mi catálogo?',
    answer:
      'Cero comisiones por venta. A diferencia de las plataformas tradicionales que se quedan con el 5% o 15% de tus ingresos, en Taply tus ventas son 100% tuyas. Todo el dinero entra directo a tus cuentas bancarias, Pago Móvil o Zelle sin intermediarios.',
  },
  {
    question: '¿Cómo se actualizan los montos en bolívares según la tasa del día?',
    answer:
      'Cuentas con un switch de tasa inteligente en tu panel de control. Con 1 solo clic ingresas la tasa activa (ej. BCV o monitoreo) y todo tu catálogo recalcula instantáneamente los montos en bolívares para tus clientes, sin que tengas que editar producto por producto.',
  },
  {
    question: '¿Mis clientes tienen que descargar alguna aplicación o crearse una cuenta?',
    answer:
      'No. Cero descargas y cero fricción. Tus clientes hacen clic en el enlace de tu bio de Instagram o WhatsApp, ven el catálogo inmediatamente en su navegador móvil, seleccionan en 3 toques y el pedido llega limpio y formateado directo a tu chat.',
  },
  {
    question: '¿Cómo funciona la garantía de 14 días de riesgo cero?',
    answer:
      'Tienes 14 días completos para usar Taply en la operación real de tu negocio sin ingresar tarjeta de crédito. Si al terminar el periodo sientes que no te ahorró horas o no aumentó tus cierres, cancelas con un simple mensaje de WhatsApp sin explicaciones ni penalidades.',
  },
];

export default function FaqAndFooter() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Asesor WhatsApp link normalizado
  const asesorPhoneRaw = '04146001234';
  const asesorPhoneClean = normalizeVenezuelaPhone(asesorPhoneRaw);
  const asesorWaUrl = `https://wa.me/${asesorPhoneClean}?text=${encodeURIComponent(
    'Hola! Quisiera hablar con un asesor sobre cómo activar mi negocio en Taply.'
  )}`;

  return (
    <div className="w-full bg-neutral-950 text-neutral-100 font-sans border-t border-neutral-800/80">
      {/* ══════════════════════════════════════════════════════════════════════════
          6. SECCIÓN FAQ (5 PREGUNTAS ESTRATÉGICAS)
      ══════════════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Respuestas claras</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Preguntas frecuentes sobre Taply
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Todo lo que necesitas saber antes de digitalizar tu catálogo y automatizar tus ventas por WhatsApp.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-colors hover:border-neutral-700"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 select-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400 bg-emerald-500/10' : 'text-neutral-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-3.5 font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          FOOTER DE CONVERSIÓN (HIGH-CONVERTING CLOSING CALL-TO-ACTION)
      ══════════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-neutral-800 bg-neutral-950 pt-16 pb-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Main Closing Box */}
          <div className="bg-gradient-to-b from-neutral-900 to-neutral-900/90 border border-neutral-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            {/* Soft Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Deja de perder clientes por responder tarde en WhatsApp.
              </h3>
              <p className="mt-4 text-xs sm:text-base text-neutral-400 leading-relaxed font-normal">
                Activa tu catálogo hoy mismo, recibe pedidos estructurados en 3 toques y gestiona inventario, tasas y despacho desde un solo panel.
              </p>

              {/* CTAs de Conversión */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  href="/onboarding"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
                >
                  <span>Activar mi tienda en 24 horas</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={asesorWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Hablar con un asesor</span>
                </a>
              </div>

              {/* Micro-Garantía */}
              <p className="mt-5 text-xs text-neutral-400 font-semibold">
                14 días sin riesgo • Cancelas con 1 mensaje • Cero comisiones
              </p>
            </div>
          </div>

          {/* Minimal Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                T
              </span>
              <span className="font-extrabold text-neutral-300">Taply</span>
              <span>© {new Date().getFullYear()} • Plataforma para comercios de Venezuela</span>
            </div>

            <div className="flex items-center gap-5">
              <Link href="/terminos" className="hover:text-white transition-colors">
                Términos
              </Link>
              <Link href="/solicitar-acceso" className="hover:text-white transition-colors">
                Solicitar Acceso
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                Acceso Dueño
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
