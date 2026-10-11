'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  theme?: 'dark' | 'light';
  maxWidth?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  theme = 'dark',
  maxWidth = 'max-w-lg',
}: BottomSheetProps) {
  const isDark = theme === 'dark';

  // Listen to Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
          />

          {/* Modal / Bottom Sheet Box */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 400) {
                onClose();
              }
            }}
            className={`relative z-10 w-full ${maxWidth} rounded-t-[32px] md:rounded-3xl p-6 shadow-2xl border transition-colors max-h-[90vh] flex flex-col ${
              isDark
                ? 'bg-[#0A0A0A] border-neutral-800 text-white shadow-black/80'
                : 'bg-white border-neutral-200 text-neutral-900 shadow-xl'
            }`}
          >
            {/* iOS Drag Handle Pill (Mobile) */}
            <div className="w-12 h-1.5 rounded-full bg-neutral-400/40 mx-auto mb-4 md:hidden cursor-grab active:cursor-grabbing" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                {title && (
                  <h3 className="text-base sm:text-lg font-bold tracking-tight">
                    {title}
                  </h3>
                )}
                {description && (
                  <p
                    className={`text-xs mt-0.5 ${
                      isDark ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                  >
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${
                  isDark
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-black'
                }`}
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 pr-1 -mr-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
