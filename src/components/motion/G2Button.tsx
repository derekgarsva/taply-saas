'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { getSvgPath } from 'figma-squircle';

interface G2ButtonProps {
  href: string;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
  cornerSmoothing?: number; // 0.6 = Apple iOS G2 standard (continuous curvature)
}

export function G2Button({
  href,
  variant = 'primary',
  children,
  className = '',
  cornerSmoothing = 0.6,
}: G2ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [svgPath, setSvgPath] = useState<string>('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      if (width > 0 && height > 0) {
        const radius = Math.floor(height / 2);
        const path = getSvgPath({
          width,
          height,
          cornerRadius: radius,
          cornerSmoothing,
          preserveSmoothing: true,
        });
        setSvgPath(path);
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cornerSmoothing]);

  const isPrimary = variant === 'primary';

  return (
    <Link
      ref={ref}
      href={href}
      className={`group relative inline-flex w-full sm:w-auto h-14 min-h-[56px] px-8 py-3.5 text-sm sm:text-base font-extrabold items-center justify-center gap-2.5 active:scale-98 transition-all duration-200 select-none ${
        isPrimary
          ? 'bg-[#00594C] hover:bg-[#00463C] text-white shadow-md hover:shadow-lg'
          : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-2xs hover:shadow-sm'
      } ${className}`}
      style={{
        borderRadius: '28px',
        // @ts-ignore
        cornerShape: 'squircle',
        WebkitCornerShape: 'squircle',
        ...(svgPath ? { clipPath: `path('${svgPath}')` } : {}),
      }}
    >
      {children}
    </Link>
  );
}

export default G2Button;
