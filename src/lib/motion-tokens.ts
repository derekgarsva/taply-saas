/**
 * Motion Tokens for high-end UI animations (Uiarc / Apple / Linear design standard)
 */
export const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.22,
    standard: 0.38,
    considered: 0.65,
    slow: 0.9,
  },
  stagger: {
    tight: 0.02,
    word: 0.038,
    element: 0.06,
  },
  blur: {
    subtle: 2,
    soft: 4,
    text: 8,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1] as const, // Smooth luxury decel
    exit: [0.4, 0, 0.6, 1] as const,
    standard: [0.2, 0, 0, 1] as const,
    inOut: [0.4, 0, 0.2, 1] as const,
  },
  spring: {
    smooth: { type: 'spring', stiffness: 280, damping: 28, visualDuration: 0.35, bounce: 0.15 },
    snappy: { type: 'spring', stiffness: 420, damping: 32, visualDuration: 0.2, bounce: 0.05 },
  },
};

export default motionTokens;
