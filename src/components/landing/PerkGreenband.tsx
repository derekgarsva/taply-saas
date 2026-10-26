'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  XCircle,
  Truck,
  Store,
  MessageCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function PerkGreenband() {
  const [activeRate, setActiveRate] = useState('124.50');
  const [rateUpdated, setRateUpdated] = useState(false);
  const [swipeState, setSwipeState] = useState<'idle' | 'confirmed' | 'cancelled'>('idle');
  const [dispatchTab, setDispatchTab] = useState<'delivery' | 'pickup'>('delivery');
  const [orderTaken, setOrderTaken] = useState(false);

  const handleUpdateRate = () => {
    setRateUpdated(true);
    setTimeout(() => setRateUpdated(false), 2000);
  };

  return (
    <section className="bg-[#0D7A53] pt-[130px] sm:pt-[150px] pb-20 relative overflow-hidden text-white">
      {/* 4 Perk Star Ornaments with clip-path and animations */}
      <div
        className="perk-star s1 hidden sm:block"
        style={{
          width: '180px',
          height: '180px',
          top: '60px',
          left: '-50px',
          transform: 'rotate(12deg)',
        }}
      />
      <div
        className="perk-star s2 hidden sm:block"
        style={{
          width: '110px',
          height: '110px',
          top: '150px',
          right: '5%',
          transform: 'rotate(-18deg)',
        }}
      />
      <div
        className="perk-star s3"
        style={{
          width: '260px',
          height: '260px',
          bottom: '-90px',
          right: '-70px',
          transform: 'rotate(25deg)',
        }}
      />
      <div
        className="perk-star s4"
        style={{
          width: '90px',
          height: '90px',
          bottom: '70px',
          left: '9%',
          transform: 'rotate(-8deg)',
        }}
      />

      <div className="perk-wrap relative z-10">
        {/* Headings */}
        <h2 className="text-white text-center text-[28px] sm:text-[36px] font-semibold tracking-[-0.01em] mb-2.5">
          Diseñado para cerrar ventas sin fricción
        </h2>
        <p className="text-[#E4F4EC] text-center max-w-[560px] mx-auto text-[16.5px] sm:text-[17.5px] mb-12 font-normal leading-relaxed">
          Tus clientes piden en 3 toques, el sistema calcula la{' '}
          <strong className="text-white font-medium">tasa oficial del día</strong> y tú
          recibes la orden lista para despachar sin perder márgenes en chat.
        </p>

        {/* ══════════════════════════════════════════════════════════════════════════
            PERK SHOTS CONTAINER (.shots & .pair)
        ══════════════════════════════════════════════════════════════════════════ */}
        <div className="grid gap-6">
          {/* ── SHOT 1: PULSO DE CAJA EN VIVO Y CONTROL DE TASA ── */}
          <div
            className="rounded-[18px] bg-white text-[#16201C] p-6 sm:p-8 overflow-hidden transition-transform"
            style={{
              boxShadow: '0 16px 42px rgba(7, 40, 29, 0.35)',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E3E8E5]">
              <div>
                <span className="text-[12px] font-semibold text-[#0D7A53] uppercase tracking-wider block mb-1">
                  Panel de Dueño en Tiempo Real
                </span>
                <h3 className="text-[22px] font-semibold text-[#0A3D2C] tracking-tight">
                  Pulso de Caja Diario y Control de Tasas
                </h3>
              </div>

              {/* Tasa Switch */}
              <div className="flex items-center gap-2 bg-[#F8FAF9] border border-[#E3E8E5] p-2 rounded-xl">
                <span className="text-[12px] font-semibold text-[#5B6B63] pl-1">
                  Tasa Activa:
                </span>
                <div className="flex items-center gap-1.5 bg-white border border-[#E3E8E5] px-2.5 py-1 rounded-lg">
                  <span className="text-[13px] font-bold text-[#0A3D2C]">
                    Bs.
                  </span>
                  <input
                    type="text"
                    value={activeRate}
                    onChange={(e) => setActiveRate(e.target.value)}
                    className="w-16 text-[13px] font-bold text-[#0A3D2C] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleUpdateRate}
                  className="bg-[#0D7A53] hover:bg-[#16A06E] text-white px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{rateUpdated ? '¡Actualizada!' : 'Actualizar'}</span>
                </button>
              </div>
            </div>

            {/* Recaudado hoy con número grande 340.00 y desglose limpio */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="lg:col-span-1 bg-[#F8FAF9] border border-[#E3E8E5] p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[12px] font-medium text-[#5B6B63]">
                  Recaudado Hoy
                </span>
                <div className="mt-2">
                  <span className="text-[28px] font-extrabold text-[#0A3D2C] tracking-tight">
                    340.00
                  </span>
                  <span className="text-[12px] font-semibold text-[#0D7A53] ml-1">
                    USD
                  </span>
                </div>
                <span className="text-[11px] text-[#5B6B63] mt-1">
                  12 pedidos procesados
                </span>
              </div>

              <div className="bg-[#F8FAF9] border border-[#E3E8E5] p-4 rounded-xl">
                <span className="text-[12px] font-medium text-[#5B6B63] block mb-1">
                  Pago Móvil
                </span>
                <span className="text-[18px] font-bold text-[#0A3D2C] block">
                  Bs. 14.280,00
                </span>
                <span className="text-[11px] text-[#5B6B63]">
                  ≈ 114.70 USD
                </span>
              </div>

              <div className="bg-[#F8FAF9] border border-[#E3E8E5] p-4 rounded-xl">
                <span className="text-[12px] font-medium text-[#5B6B63] block mb-1">
                  Zelle
                </span>
                <span className="text-[18px] font-bold text-[#0A3D2C] block">
                  120.00
                </span>
                <span className="text-[11px] text-[#5B6B63]">
                  3 pagos directos
                </span>
              </div>

              <div className="bg-[#F8FAF9] border border-[#E3E8E5] p-4 rounded-xl">
                <span className="text-[12px] font-medium text-[#5B6B63] block mb-1">
                  Binance Pay
                </span>
                <span className="text-[18px] font-bold text-[#0A3D2C] block">
                  45.00
                </span>
                <span className="text-[11px] text-[#5B6B63]">
                  USDT acreditado
                </span>
              </div>

              <div className="bg-[#F8FAF9] border border-[#E3E8E5] p-4 rounded-xl">
                <span className="text-[12px] font-medium text-[#5B6B63] block mb-1">
                  Efectivo Divisas
                </span>
                <span className="text-[18px] font-bold text-[#0A3D2C] block">
                  35.00
                </span>
                <span className="text-[11px] text-[#5B6B63]">
                  Retiro en caja
                </span>
              </div>
            </div>
          </div>

          {/* ── PAIR: 2 SHOTS EN PARALELO ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SHOT 2: GESTIÓN DE PEDIDOS POR GESTOS */}
            <div
              className="rounded-[18px] bg-white text-[#16201C] p-6 sm:p-7 flex flex-col justify-between"
              style={{
                boxShadow: '0 16px 42px rgba(7, 40, 29, 0.35)',
              }}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E3E8E5]">
                  <span className="text-[12px] font-semibold text-[#0D7A53] uppercase tracking-wider">
                    Control Táctil Rápido
                  </span>
                  <span className="text-[11px] font-bold bg-[#E4F4EC] text-[#0A3D2C] px-2 py-0.5 rounded-full">
                    Gestos Swipe
                  </span>
                </div>

                <h3 className="text-[18px] font-semibold text-[#0A3D2C] mt-3 mb-2">
                  Confirmación y Descuento Atómico de Stock
                </h3>
                <p className="text-[14px] text-[#5B6B63] mb-5">
                  Desliza a la derecha para confirmar el pago y descontar stock automáticamente. Desliza a la izquierda para descartar.
                </p>

                {/* Interactive Swipe Mockup */}
                <div className="bg-[#F8FAF9] border border-[#E3E8E5] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-bold text-[#0A3D2C]">
                      Orden #1042 · Pedro Pérez
                    </span>
                    <span className="text-[13px] font-bold text-[#0D7A53]">
                      $36.00 USD
                    </span>
                  </div>
                  <p className="text-[12px] text-[#5B6B63] mb-3">
                    1x Pan de Jamón Tradicional, 2x Golfiaos Melosos
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSwipeState('confirmed')}
                      className={`flex-1 py-2 px-3 rounded-lg text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        swipeState === 'confirmed'
                          ? 'bg-[#0D7A53] text-white shadow-sm'
                          : 'bg-[#E4F4EC] text-[#0A3D2C] hover:bg-[#0D7A53] hover:text-white'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{swipeState === 'confirmed' ? '¡Pagado y Stock -3!' : 'Swipe Derecha (Confirmar)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSwipeState('cancelled')}
                      className={`py-2 px-3 rounded-lg text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        swipeState === 'cancelled'
                          ? 'bg-red-600 text-white'
                          : 'bg-red-50 text-red-700 hover:bg-red-600 hover:text-white'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Descartar</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E3E8E5] flex items-center gap-2 text-[12px] text-[#5B6B63]">
                <ShieldCheck className="w-4 h-4 text-[#0D7A53]" />
                <span>Ejecutado con RPC atómica en Supabase en 0.2s</span>
              </div>
            </div>

            {/* SHOT 3: SUBPANEL DE DESPACHO SIN FUGAS */}
            <div
              className="rounded-[18px] bg-white text-[#16201C] p-6 sm:p-7 flex flex-col justify-between"
              style={{
                boxShadow: '0 16px 42px rgba(7, 40, 29, 0.35)',
              }}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E3E8E5]">
                  <span className="text-[12px] font-semibold text-[#0D7A53] uppercase tracking-wider">
                    Vista para Repartidores
                  </span>
                  <span className="text-[11px] font-bold bg-[#E4F4EC] text-[#0A3D2C] px-2 py-0.5 rounded-full">
                    Cero Precios Visibles
                  </span>
                </div>

                <h3 className="text-[18px] font-semibold text-[#0A3D2C] mt-3 mb-2">
                  Subpanel de Despacho sin Fugas ni Colisiones
                </h3>
                <p className="text-[14px] text-[#5B6B63] mb-5">
                  Tus repartidores y mostrador solo ven órdenes confirmadas y direcciones, con candado de bloqueo que impide duplicar entregas.
                </p>

                {/* Subpanel Tab Preview */}
                <div className="bg-[#F8FAF9] border border-[#E3E8E5] rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    <button
                      type="button"
                      onClick={() => setDispatchTab('delivery')}
                      className={`py-1.5 text-[12px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                        dispatchTab === 'delivery'
                          ? 'bg-white shadow-xs text-[#0A3D2C]'
                          : 'text-[#5B6B63] hover:text-[#0A3D2C]'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5 text-[#0D7A53]" />
                      <span>Para Delivery (3)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDispatchTab('pickup')}
                      className={`py-1.5 text-[12px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                        dispatchTab === 'pickup'
                          ? 'bg-white shadow-xs text-[#0A3D2C]'
                          : 'text-[#5B6B63] hover:text-[#0A3D2C]'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5 text-[#0D7A53]" />
                      <span>Retiro en Local (2)</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-[#E3E8E5]">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-bold text-[#0A3D2C]">
                        #1041 · Ana Morales
                      </span>
                      <span className="text-[11px] text-[#5B6B63]">
                        En espera de repartidor
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5B6B63] mt-1 line-clamp-1">
                      📍 Urb. Las Mercedes, Calle París, Torre B, Piso 5
                    </p>

                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderTaken(!orderTaken)}
                        className={`flex-1 py-1.5 px-2.5 rounded-md text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 ${
                          orderTaken
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0D7A53] hover:bg-[#16A06E] text-white'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{orderTaken ? 'Asignado a Carlos (Repartidor)' : 'Tomar Despacho'}</span>
                      </button>

                      <a
                        href="https://wa.me/584141234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-2 rounded-md bg-[#E4F4EC] text-[#0D7A53] hover:bg-[#0D7A53] hover:text-white transition-colors"
                        title="Chat con el cliente"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E3E8E5] flex items-center gap-2 text-[12px] text-[#5B6B63]">
                <Truck className="w-4 h-4 text-[#0D7A53]" />
                <span>Suscripto en vivo con Supabase Realtime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
