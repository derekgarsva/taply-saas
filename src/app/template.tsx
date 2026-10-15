'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Global fluid & expensive screen transitions between routes in Next.js App Router.
 * Uses luxury cubic-bezier easing with gentle optical blur-to-sharp and subtle 0.995 scale.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, y: 8, scale: 0.996, filter: 'blur(3px)' }
      }
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
      transition={{
        duration: 0.36,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full will-change-[transform,opacity,filter]"
    >
      {children}
    </motion.div>
  );
}
