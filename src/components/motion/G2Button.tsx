'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { getSvgPath } from 'figma-squircle';

interface G2ButtonProps {
  href: string;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
  cornerRadius?: number; // 20px = optimal squircle for 56px height
  cornerSmoothing?: number; // 0.6 = Apple iOS G2 standard (continuous curvature)
}

export function G2Button({
  href,
  variant = 'primary',
  children,
  className = '',
  cornerRadius = 20,
  cornerSmoothing = 0.6,
}: G2ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [svgPath, setSvgPath] = useState<string>('');
  const [dims, setDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      if (width > 0 && height > 0) {
        setDims({ width, height });
        const path = getSvgPath({
          width,
          height,
          cornerRadius,
          cornerSmoothing,
        });
        setSvgPath(path);
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cornerRadius, cornerSmoothing]);

  const isPrimary = variant === 'primary';

  return (
    <Link
      ref={ref}
      href={href}
      className={`group relative inline-flex w-full sm:w-auto h-14 min-h-[56px] px-8 py-3.5 text-sm sm:text-base font-extrabold items-center justify-center gap-2.5 active:scale-98 transition-all duration-200 select-none ${
        isPrimary
          ? 'text-white shadow-md hover:shadow-lg'
          : 'text-gray-900 shadow-2xs hover:shadow-sm'
      } ${className}`}
      style={{
        borderRadius: `${cornerRadius}px`,
        // Native CSS G2 Continuous Curvature (Apple / WebKit):
        // @ts-ignore
        cornerShape: 'squircle',
        WebkitCornerShape: 'squircle',
      }}
    >
      {/* Background layer with true G2 continuous curvature (Apple/Figma squircle) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={dims.width > 0 ? `0 0 ${dims.width} ${dims.height}` : undefined}
      >
        {svgPath ? (
          <path
            d={svgPath}
            fill={isPrimary ? '#00594C' : '#ffffff'}
            stroke={isPrimary ? 'none' : '#e5e7eb'}
            strokeWidth={isPrimary ? 0 : 1}
            className={`transition-colors duration-200 ${
              isPrimary
                ? 'group-hover:fill-[#00463C]'
                : 'group-hover:fill-[#f9fafb] group-hover:stroke-[#d1d5db]'
            }`}
          />
        ) : (
          <rect
            width="100%"
            height="100%"
            rx={cornerRadius}
            fill={isPrimary ? '#00594C' : '#ffffff'}
            stroke={isPrimary ? 'none' : '#e5e7eb'}
            strokeWidth={isPrimary ? 0 : 1}
          />
        )}
      </svg>

      <span className="relative z-10 flex items-center justify-center gap-2.5">
        {children}
      </span>
    </Link>
  );
}

export default G2Button;
