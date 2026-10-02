'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimatedGroupProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  variant?: 'fade-up' | 'scale-fade' | 'blur-fade';
  viewportOnce?: boolean;
}

export function AnimatedGroup({
  children,
  className = '',
  delay = 0,
  stagger = 0.08,
  variant = 'fade-up',
  viewportOnce = true,
}: AnimatedGroupProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const getItemVariants = (): Variants => {
    switch (variant) {
      case 'scale-fade':
        return {
          hidden: { opacity: 0, scale: 0.92, y: 15 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'blur-fade':
        return {
          hidden: { opacity: 0, filter: 'blur(8px)', y: 16 },
          visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'fade-up':
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          },
        };
    }
  };

  const itemVariants = getItemVariants();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, margin: '-30px' }}
      className={className}
    >
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div key={child.key || idx} variants={itemVariants}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default AnimatedGroup;
