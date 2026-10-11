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
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [svgPath, setSvgPath] = useState<string>('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      if (width > 0 && height > 0) {
        setDimensions({ width, height });
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
      className={`group relative w-full sm:w-auto h-13 px-8 text-sm font-extrabold flex items-center justify-center gap-2 active:scale-98 transition-all duration-200 select-none ${
        isPrimary
          ? 'text-white shadow-md hover:shadow-lg'
          : 'text-gray-900 shadow-2xs hover:shadow-sm'
      } ${className}`}
      style={{
        borderRadius: '26px',
        // @ts-ignore
        cornerShape: 'squircle',
        WebkitCornerShape: 'squircle',
      }}
    >
      {/* Background layer with G2 Curvature Continuity */}
      {svgPath ? (
        <svg
          className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          <path
            d={svgPath}
            className={`transition-colors duration-200 ${
              isPrimary
                ? 'fill-[#00594C] group-hover:fill-[#00463C]'
                : 'fill-white stroke-gray-300 group-hover:fill-gray-50'
            }`}
            strokeWidth={isPrimary ? 0 : 1}
          />
        </svg>
      ) : (
        /* SSR & initial mount fallback */
        <div
          className={`absolute inset-0 -z-10 rounded-full transition-colors duration-200 ${
            isPrimary
              ? 'bg-[#00594C] group-hover:bg-[#00463C]'
              : 'bg-white border border-gray-300 group-hover:bg-gray-50'
          }`}
          style={{
            borderRadius: '26px',
            // @ts-ignore
            cornerShape: 'squircle',
            WebkitCornerShape: 'squircle',
          }}
        />
      )}

      {children}
    </Link>
  );
}

export default G2Button;
