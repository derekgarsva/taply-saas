'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Share2 } from 'lucide-react';

interface QRCodeModalProps {
  businessName: string;
  url: string;
  onClose: () => void;
  accentColor?: string;
}

export default function QRCodeModal({ businessName, url, onClose, accentColor = '#00594C' }: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      color: {
        dark: '#111827',
        light: '#FFFFFF',
      },
    }).then(setQrDataUrl);
  }, [url]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-${businessName.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-2xl mx-auto flex items-center justify-center mb-3 text-white" style={{ backgroundColor: accentColor }}>
          <Share2 className="w-5 h-5" />
        </div>

        <h3 className="font-extrabold text-gray-900 text-lg">Código QR de tu Catálogo</h3>
        <p className="text-xs text-gray-500 mt-1 mb-4">
          Imprímelo para tus mesas, vitrinas o empaques de delivery
        </p>

        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 inline-block shadow-inner mb-4">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Código QR" className="w-52 h-52 rounded-xl" />
          ) : (
            <div className="w-52 h-52 skeleton-box rounded-xl" />
          )}
        </div>

        <p className="text-[11px] text-gray-400 font-mono break-all mb-4 truncate px-2">
          {url}
        </p>

        <button
          type="button"
          onClick={handleDownload}
          className="w-full h-11 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-sm"
          style={{ backgroundColor: accentColor }}
        >
          <Download className="w-4 h-4" />
          <span>Descargar Imagen QR (PNG)</span>
        </button>
      </div>
    </div>
  );
}
