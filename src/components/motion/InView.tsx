'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface InViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: 'fade-up' | 'fade-scale' | 'slide-left' | 'slide-right' | 'blur-in';
  once?: boolean;
}

export function InView({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  variant = 'fade-up',
  once = true,
}: InViewProps) {
  const getVariants = (): Variants => {
    switch (variant) {
      case 'fade-scale':
        return {
          hidden: { opacity: 0, scale: 0.94, y: 15 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'slide-left':
        return {
          hidden: { opacity: 0, x: -24 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'slide-right':
        return {
          hidden: { opacity: 0, x: 24 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'blur-in':
        return {
          hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
          visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'fade-up':
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
    }
  };

  return (
    <motion.div
      variants={getVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default InView;
