'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface TextEffectProps {
  children: string;
  className?: string;
  as?: React.ElementType;
  delay?: number;
  duration?: number;
  per?: 'word' | 'char';
  variant?: 'fade-slide' | 'fade-blur' | 'scale';
}

export function TextEffect({
  children,
  className = '',
  as: Component = 'span',
  delay = 0,
  duration = 0.4,
  per = 'word',
  variant = 'fade-slide',
}: TextEffectProps) {
  const words = children.split(' ');

  const getContainerVariants = (): Variants => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: per === 'char' ? 0.025 : 0.06,
        delayChildren: delay,
      },
    },
  });

  const getItemVariants = (): Variants => {
    switch (variant) {
      case 'fade-blur':
        return {
          hidden: { opacity: 0, filter: 'blur(8px)', y: 8 },
          visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: { duration, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.85, y: 10 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration, type: 'spring', stiffness: 260, damping: 20 },
          },
        };
      case 'fade-slide':
      default:
        return {
          hidden: { opacity: 0, y: 14 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, ease: [0.16, 1, 0.3, 1] },
          },
        };
    }
  };

  const containerVariants = getContainerVariants();
  const itemVariants = getItemVariants();

  return (
    <Component className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="inline-block"
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
            {per === 'char' ? (
              word.split('').map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  variants={itemVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))
            ) : (
              <motion.span variants={itemVariants} className="inline-block">
                {word}
              </motion.span>
            )}
          </span>
        ))}
      </motion.span>
    </Component>
  );
}

export default TextEffect;
