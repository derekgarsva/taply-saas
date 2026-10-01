'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Sparkles, Store } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard?store=panaderia-la-estrella');
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
          Acceso al Panel de Control
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Gestiona tus productos, categorías y pedidos WhatsApp
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200 rounded-3xl sm:px-10">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="dueno@laestrella.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#00594C]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-12 bg-[#00594C] text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-sm"
              >
                <span>Entrar al Panel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <span className="block text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              O entra directo en modo Demo
            </span>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => router.push('/dashboard?store=panaderia-la-estrella')}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-800 flex items-center justify-between transition-colors"
              >
                <span>🥐 Panadería La Estrella</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Probar</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard?store=burger-station')}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-800 flex items-center justify-between transition-colors"
              >
                <span>🍔 Burger Station</span>
                <span className="text-[10px] text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Probar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
