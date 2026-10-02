'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Sparkles, Info, Link as LinkIcon, Lock, QrCode } from 'lucide-react';

interface TopMenuProps {
  onSelect: (action: 'taply' | 'about' | 'copy' | 'admin' | 'qr') => void;
  accentColor?: string;
}

export default function TopMenu({ onSelect, accentColor = '#00594C' }: TopMenuProps) {
  const [open, setOpen] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(prev => !prev);
  };

  const handleItem = (e: React.MouseEvent, action: 'taply' | 'about' | 'copy' | 'admin' | 'qr') => {
    e.stopPropagation();
    setOpen(false);
    onSelect(action);
  };

  return (
    <div className="relative inline-block text-left">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="w-[38px] h-[38px] rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-black/5 flex items-center justify-center text-gray-800 transition-colors"
      >
        <MoreHorizontal className="w-5 h-5 text-gray-800" />
      </motion.button>

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -6, transformOrigin: 'top right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="absolute top-[46px] right-0 w-[216px] bg-white rounded-[20px] border border-black/10 shadow-2xl p-1.5 z-50"
            role="menu"
          >
            <motion.button
              whileHover={{ x: 2, backgroundColor: 'rgba(0,0,0,0.03)' }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="popover-item"
              onClick={(e) => handleItem(e, 'qr')}
            >
              <QrCode className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
              <span>Código QR del local</span>
            </motion.button>

            <motion.button
              whileHover={{ x: 2, backgroundColor: 'rgba(0,0,0,0.03)' }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="popover-item"
              onClick={(e) => handleItem(e, 'copy')}
            >
              <LinkIcon className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
              <span>Copiar enlace</span>
            </motion.button>

            <motion.button
              whileHover={{ x: 2, backgroundColor: 'rgba(0,0,0,0.03)' }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="popover-item"
              onClick={(e) => handleItem(e, 'taply')}
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
              <span>Hecho con Taply</span>
            </motion.button>

            <motion.button
              whileHover={{ x: 2, backgroundColor: 'rgba(0,0,0,0.03)' }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="popover-item"
              onClick={(e) => handleItem(e, 'about')}
            >
              <Info className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
              <span>¿Cómo funciona?</span>
            </motion.button>

            <div className="h-px bg-gray-100 my-1" />

            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="popover-item text-emerald-900 bg-emerald-50/50 hover:bg-emerald-50"
              onClick={(e) => handleItem(e, 'admin')}
            >
              <Lock className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
              <span>Panel Dueño</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
