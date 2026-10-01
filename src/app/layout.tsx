import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Taply · Catálogos Multilink & Pedidos a WhatsApp',
  description: 'Crea tu catálogo interactivo multilink en 60 segundos con checkout ultra rápido a WhatsApp y cero comisiones.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="antialiased">
      <body className="min-h-screen bg-[#F8F9FA] text-gray-900 selection:bg-[#00594C] selection:text-white">
        {children}
      </body>
    </html>
  );
}
