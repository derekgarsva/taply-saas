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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: reduced ? 0 : 0.22,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
