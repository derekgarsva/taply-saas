'use client';

import React, { forwardRef, useId, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, Sparkles, MessageCircle, ShieldCheck } from 'lucide-react';

export type SiteFooterVariant = 'columns' | 'minimal' | 'logo';

export interface SiteFooterLink {
  label: string;
  href?: string;
  external?: boolean;
}

export interface SiteFooterColumn {
  title: string;
  links: SiteFooterLink[];
}

export interface SiteFooterNewsletter {
  title?: string;
  description?: string;
  placeholder?: string;
  onSubscribe?: (email: string) => void | Promise<void>;
}

export interface SiteFooterProps {
  variant?: SiteFooterVariant;
  brand?: { name: string; href?: string; mark?: ReactNode };
  tagline?: string;
  columns?: SiteFooterColumn[];
  links?: SiteFooterLink[];
  legal?: SiteFooterLink[];
  socials?: SiteFooterLink[];
  newsletter?: SiteFooterNewsletter | null;
  status?: { label: string; tone?: 'success' | 'warning' | 'danger'; href?: string } | null;
  year?: number;
  onNavigate?: (link: SiteFooterLink) => void;
  className?: string;
}

const defaultColumns: SiteFooterColumn[] = [
  {
    title: 'Producto',
    links: [
      { label: 'Catálogos WhatsApp', href: '#features' },
      { label: 'Multilink en Bio', href: '#features' },
      { label: 'Planes & Precios', href: '#pricing' },
      { label: 'Códigos QR Mesas', href: '#features' },
    ],
  },
  {
    title: 'Demos en Vivo',
    links: [
      { label: 'Panadería La Estrella 🥐', href: '/panaderia-la-estrella' },
      { label: 'Burger Station 🍔', href: '/burger-station' },
      { label: 'Solicitar Acceso Demo ✨', href: '/solicitar-acceso' },
    ],
  },
  {
    title: 'Plataforma',
    links: [
      { label: 'Acceso Panel de Dueño', href: '/login' },
      { label: 'Crear Mi Tienda en 60s', href: '/onboarding' },
      { label: 'WhatsApp del Fundador', href: `https://wa.me/584243087887?text=${encodeURIComponent('¡Hola Derek! Me gustaría conversar sobre Taply para mi negocio.'.normalize('NFC'))}`, external: true },
    ],
  },
];

const defaultLegal: SiteFooterLink[] = [
  { label: 'Privacidad', href: '/terminos#privacidad' },
  { label: 'Términos y Condiciones', href: '/terminos' },
  { label: 'Seguridad', href: '/terminos#seguridad' },
];

const defaultSocials: SiteFooterLink[] = [
  { label: 'WhatsApp', href: `https://wa.me/584243087887?text=${encodeURIComponent('¡Hola Derek! Me gustaría conversar sobre Taply para mi negocio.'.normalize('NFC'))}`, external: true },
  { label: 'Instagram', href: 'https://instagram.com', external: true },
  { label: 'TikTok', href: 'https://tiktok.com', external: true },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function FooterLinkItem({
  link,
  onNavigate,
  className,
}: {
  link: SiteFooterLink;
  onNavigate?: (link: SiteFooterLink) => void;
  className?: string;
}) {
  const content = (
    <>
      <span>{link.label}</span>
      {link.external && (
        <ArrowUpRight className="w-3 h-3 flex-shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      )}
    </>
  );

  const handleClick = () => onNavigate?.(link);

  if (link.href) {
    if (link.external) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className={className || "inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-950 font-medium transition-colors group"}
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        href={link.href}
        onClick={handleClick}
        className={className || "inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-950 font-medium transition-colors group"}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || "inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-950 font-medium transition-colors group text-left"}
    >
      {content}
    </button>
  );
}

function ArcBrandMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 48V29C9 15 19 7 32 7s23 8 23 22v19" />
      <path d="M20 48V31c0-8 5-13 12-13s12 5 12 13v17" />
      <path d="M32 38v10" />
    </svg>
  );
}

function NewsletterBox({
  title = 'Recibe novedades y tips de ventas',
  description = 'Estrategias para vender por WhatsApp y nuevos lanzamientos.',
  placeholder = 'tu-correo@negocio.com',
  onSubscribe,
}: SiteFooterNewsletter) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  const validate = (value: string) => {
    if (!value.trim()) return 'Ingresa tu correo electrónico';
    if (!EMAIL_REGEX.test(value.trim())) return 'Ingresa un formato de correo válido';
    return null;
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (state !== 'idle') return;

    const problem = validate(email);
    setError(problem);
    if (problem) return;

    setState('loading');
    try {
      if (onSubscribe) {
        await onSubscribe(email.trim());
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setState('done');
    } catch {
      setState('idle');
      setError('No pudimos procesar la suscripción. Intenta en un momento.');
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-2 text-left" noValidate>
      {title && (
        <h3 className="font-extrabold text-xs sm:text-sm text-gray-950 tracking-tight">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-[11px] text-gray-500 leading-snug">
          {description}
        </p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <input
            id={`${id}-email`}
            type="email"
            value={email}
            disabled={state !== 'idle'}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder={placeholder}
            className={`w-full h-10 px-3.5 text-xs bg-gray-50 border rounded-xl outline-none transition-colors ${
              error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#00594C]'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={state !== 'idle'}
          className="h-10 px-4 rounded-xl bg-[#00594C] hover:bg-[#00463C] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs disabled:opacity-70 flex-shrink-0"
        >
          {state === 'loading' ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : state === 'done' ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" strokeWidth={2.5} />
              <span>¡Listo!</span>
            </>
          ) : (
            <span>Suscribirme</span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {(error || state === 'done') && (
          <motion.p
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            className={`text-[11px] font-semibold ${
              state === 'done' ? 'text-emerald-700' : 'text-red-600'
            }`}
          >
            {state === 'done' ? `¡Gracias por suscribirte con ${email}!` : error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

export const SiteFooter = forwardRef<HTMLElement, SiteFooterProps>(function SiteFooter(
  {
    variant = 'logo',
    brand = { name: 'Taply' },
    tagline = 'Catálogos interactivos multilink para vender por WhatsApp sin comisiones.',
    columns = defaultColumns,
    links,
    legal = defaultLegal,
    socials = defaultSocials,
    newsletter = {
      title: 'Recibe novedades y actualizaciones',
      description: 'Tips de conversión para tiendas en WhatsApp. Sin spam.',
    },
    status = { label: 'Todos los sistemas operativos', tone: 'success' },
    year = new Date().getFullYear(),
    onNavigate,
    className = '',
  },
  ref,
) {
  const gradientId = useId().replace(/:/g, '');
  const reduced = !!useReducedMotion();

  const brandNode = (
    <Link
      href="/"
      className="inline-flex items-center gap-2 group"
      onClick={() => onNavigate?.({ label: brand.name, href: '/' })}
    >
      <span className="w-8 h-8 rounded-xl bg-[#00594C] text-white flex items-center justify-center font-extrabold text-sm shadow-xs group-hover:scale-105 transition-transform">
        T
      </span>
      <span className="font-extrabold text-lg tracking-tight text-gray-950">
        {brand.name}
      </span>
    </Link>
  );

  return (
    <footer
      ref={ref}
      className={`relative w-full bg-white border-t border-gray-100 overflow-hidden font-sans pt-12 sm:pt-16 pb-6 ${className}`}
    >
      {/* ══ TOP ROW: INTRO & COLUMNS ══ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-100">
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-5 space-y-4">
            {brandNode}
            {tagline && (
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
                {tagline}
              </p>
            )}

            {newsletter && variant !== 'minimal' && (
              <div className="pt-2">
                <NewsletterBox {...newsletter} />
              </div>
            )}
          </div>

          {/* Nav Link Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {columns.map((column) => (
              <div key={column.title} className="space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-950">
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterLinkItem link={link} onNavigate={onNavigate} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ══ BOTTOM ROW: LEGAL, COPYRIGHT & STATUS ══ */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          {/* Copyright & Legal */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <span className="font-medium text-gray-400">
              © {year} {brand.name}. Todos los derechos reservados.
            </span>
            {legal && legal.length > 0 && (
              <ul className="flex items-center gap-3">
                {legal.map((l) => (
                  <li key={l.label}>
                    <FooterLinkItem link={l} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Status & Socials */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-5">
            {status && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#00594C] text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{status.label}</span>
              </div>
            )}

            {socials && socials.length > 0 && (
              <ul className="flex items-center gap-3.5">
                {socials.map((s) => (
                  <li key={s.label}>
                    <FooterLinkItem link={s} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ══ LOGO VARIANT: GIANT "taply" TYPOGRAPHIC WATERMARK RISING AT THE BOTTOM ══ */}
      {variant === 'logo' && (
        <motion.div
          className="relative w-full max-w-6xl mx-auto mt-12 -mb-6 pointer-events-none select-none overflow-hidden flex justify-center text-center"
          initial={reduced ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="text-[22vw] sm:text-[20vw] md:text-[18vw] lg:text-[210px] font-black tracking-tighter lowercase leading-none select-none text-transparent bg-gradient-to-b from-[#00594C]/25 via-[#00594C]/8 to-transparent bg-clip-text block"
            style={{
              WebkitTextStroke: '1.5px rgba(0, 89, 76, 0.25)',
            }}
          >
            taply
          </span>
        </motion.div>
      )}
    </footer>
  );
});

SiteFooter.displayName = 'SiteFooter';
export default SiteFooter;
