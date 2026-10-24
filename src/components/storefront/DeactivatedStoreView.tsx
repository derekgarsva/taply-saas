'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, MessageCircle, ArrowUpRight, Instagram, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Business } from '@/types';

interface DeactivatedStoreViewProps {
  business: Business;
}

export default function DeactivatedStoreView({ business }: DeactivatedStoreViewProps) {
  let cleanPhone = (business.phone || '').replace(/\D/g, '');
  if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    cleanPhone = '58' + cleanPhone.slice(1);
  } else if (cleanPhone.length === 10) {
    cleanPhone = '58' + cleanPhone;
  }
  const cleanMsg = `Hola, me comunico para consultar información sobre ${business.name}.`.normalize('NFC');
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(cleanMsg)}`
    : null;

  return (
    <div className="min-h-screen bg-[#0A0D12] text-white flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[120px] opacity-25"
          style={{ backgroundColor: business.themeColor || '#F59E0B' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0D12]/80 to-[#0A0D12]" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-md mx-auto w-full px-5 pt-12 pb-8 flex-1 flex flex-col justify-center items-center text-center">
        {/* Banner Peek */}
        {business.bannerImage && (
          <div className="w-full h-32 rounded-3xl overflow-hidden relative mb-[-40px] opacity-40 shadow-2xl border border-white/5">
            <Image
              src={business.bannerImage}
              alt={business.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 400px"
            />
          </div>
        )}

        {/* Business Avatar / Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-24 h-24 rounded-3xl p-1 bg-gradient-to-b from-white/20 to-white/5 shadow-2xl backdrop-blur-xl mb-4"
        >
          <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-[#131720]">
            {business.logoImage ? (
              <Image
                src={business.logoImage}
                alt={business.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-white/80">
                {business.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </motion.div>

        {/* Name and Category */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="space-y-1.5 mb-6"
        >
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            {business.name}
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs uppercase font-medium tracking-wider text-white/50">
            {business.category} {business.city ? `• ${business.city}` : ''}
          </p>
        </motion.div>

        {/* Discreet Elegant Notice Card */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="w-full bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-md text-left mb-6 relative overflow-hidden"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">
              Catálogo en pausa temporal
            </span>
          </div>

          <p className="text-sm text-white/70 leading-relaxed font-normal">
            Este catálogo se encuentra actualmente en pausa programada por actualización de productos e inventario. El carrito y los pedidos digitales se reanudarán próximamente.
          </p>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> En mantenimiento
            </span>
            <span>Atención directa activa</span>
          </div>
        </motion.div>

        {/* Direct Action Channels */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full space-y-3 mb-6"
        >
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-medium text-sm transition-all shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Contactar directamente al negocio</span>
            </a>
          )}

          {/* Business Links */}
          {business.links && business.links.filter(l => l.active).length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/40 text-center">
                Canales oficiales
              </p>
              {business.links.filter(l => l.active).map(link => {
                const getIcon = () => {
                  switch (link.type) {
                    case 'instagram': return <Instagram className="w-4 h-4 text-pink-400" />;
                    case 'maps': return <MapPin className="w-4 h-4 text-emerald-400" />;
                    case 'phone': return <Phone className="w-4 h-4 text-blue-400" />;
                    default: return <ArrowUpRight className="w-4 h-4 text-white/60" />;
                  }
                };
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all text-xs text-white/80"
                  >
                    <div className="flex items-center gap-2.5">
                      {getIcon()}
                      <span>{link.label}</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/40" />
                  </a>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Small Merchant Hint */}
        <p className="text-[11px] text-white/30 text-center">
          ¿Eres el titular de este negocio?{' '}
          <a href="/login" className="text-white/60 hover:text-white underline underline-offset-2">
            Accede a tu panel
          </a>
        </p>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center border-t border-white/[0.04]">
        <div className="flex items-center justify-center gap-1.5 text-xs text-white/40 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>Potenciado por Taply</span>
        </div>
      </footer>
    </div>
  );
}
