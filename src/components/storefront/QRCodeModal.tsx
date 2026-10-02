'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { X, Download, Share2 } from 'lucide-react';

interface QRCodeModalProps {
  businessName: string;
  url: string;
  onClose: () => void;
  accentColor?: string;
}

export default function QRCodeModal({
  businessName,
  url,
  onClose,
  accentColor = '#00594C',
}: QRCodeModalProps) {
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl relative text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
            className="w-11 h-11 rounded-2xl mx-auto flex items-center justify-center mb-3 text-white shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            <Share2 className="w-5 h-5" />
          </motion.div>

          <h3 className="font-extrabold text-gray-900 text-lg">Código QR de tu Catálogo</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Imprímelo para tus mesas, vitrinas o empaques de delivery
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-3 bg-gray-50 rounded-2xl border border-gray-100 inline-block shadow-inner mb-4"
          >
            {qrDataUrl ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={qrDataUrl}
                alt="Código QR"
                className="w-52 h-52 rounded-xl"
              />
            ) : (
              <div className="w-52 h-52 skeleton-box rounded-xl" />
            )}
          </motion.div>

          <p className="text-[11px] text-gray-400 font-mono break-all mb-4 truncate px-2">
            {url}
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={handleDownload}
            className="w-full h-11 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            <Download className="w-4 h-4" />
            <span>Descargar Imagen QR (PNG)</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
