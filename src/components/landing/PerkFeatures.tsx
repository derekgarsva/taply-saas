'use client';

import React from 'react';
import { Zap, ShoppingBag, Clock } from 'lucide-react';

export default function PerkFeatures() {
  const features = [
    {
      icon: <Zap className="w-[22px] h-[22px] stroke-[#0D7A53]" />,
      title: 'Cálculo a Tasa del Día automático',
      desc: 'Actualiza tu tasa con un solo clic. El catálogo recalcula instantáneamente todos los precios en Bolívares y Dólares sin tener que editar productos a mano.',
    },
    {
      icon: <ShoppingBag className="w-[22px] h-[22px] stroke-[#0D7A53]" />,
      title: 'Control por producto y stock atómico',
      desc: 'Cada pedido confirmado con un simple gesto descuenta el inventario en tiempo real. Cero sobreventas ni pedidos cancelados por falta de producto.',
    },
    {
      icon: <Clock className="w-[22px] h-[22px] stroke-[#0D7A53]" />,
      title: 'Cero esperas para el cliente',
      desc: 'Elimina los 15 minutos de notas de voz preguntando "¿disponible?", "¿a qué tasa recibes?" o "¿dónde pago?". El cliente compra y envía todo listo en 30 segundos.',
    },
  ];

  return (
    <section id="caracteristicas" className="pb-16 pt-4 bg-[#F8FAF9]">
      <div className="perk-wrap">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-[#E3E8E5] rounded-[14px] p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(22,32,28,0.08)]"
            >
              <div className="w-[42px] h-[42px] rounded-[10px] bg-[#E4F4EC] flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-[#0A3D2C] text-[17.5px] font-semibold mb-2 tracking-tight">
                {f.title}
              </h3>
              <p className="text-[#5B6B63] text-[15px] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
