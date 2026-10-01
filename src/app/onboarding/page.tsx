'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, Store, Phone, MapPin, AlertCircle } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'PANADERÍA / CAFÉ',
    city: 'Caracas, Venezuela',
    phone: '',
    desc: 'Los mejores productos artesanales preparados cada día con ingredientes frescos.',
    themeColor: '#00594C',
  });

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      setError('Por favor indica el nombre de tu negocio.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear la tienda');
      }

      const created = await res.json();
      router.push(`/dashboard?store=${created.slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <span className="w-10 h-10 rounded-2xl bg-[#00594C] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
            T
          </span>
          <span className="font-extrabold text-2xl tracking-tight text-gray-900">
            Taply
          </span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Crea tu Catálogo Multilink en 60 segundos
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Comienza gratis sin tarjeta ni configuraciones complicadas
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200 rounded-3xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nombre de tu Negocio
              </label>
              <input
                type="text"
                placeholder="Ej. Hamburguesas El Ávila"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full h-11 px-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Enlace de tu Catálogo
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 h-11">
                <span className="text-xs text-gray-400 font-mono">taply.app/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 bg-transparent text-xs font-mono text-gray-900 outline-none font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Rubro
                </label>
                <input
                  type="text"
                  placeholder="Ej. PASTELERÍA"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  placeholder="Ej. Maracaibo"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                WhatsApp para recibir pedidos
              </label>
              <input
                type="text"
                placeholder="584141234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-11 px-3.5 text-xs font-mono bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
                required
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Solo números con código de país (ej. 58 para Venezuela).
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#00594C] text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-sm"
              >
                <span>{loading ? 'Creando catálogo...' : 'Crear mi Catálogo Gratis'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/dashboard?store=panaderia-la-estrella"
              className="text-xs text-gray-500 hover:text-gray-900 font-medium"
            >
              ¿Quieres probar una demo ya lista? <span className="underline font-bold text-[#00594C]">Entrar a La Estrella</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
