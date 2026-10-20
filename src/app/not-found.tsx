import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl mb-6">
        🔍
      </div>
      <h1 className="text-4xl font-black tracking-tight mb-2">404 - Página no encontrada</h1>
      <p className="text-slate-400 max-w-md mb-8">
        La página o catálogo que buscas no existe o fue trasladado a otra dirección.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
