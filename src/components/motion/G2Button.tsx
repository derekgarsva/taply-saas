'use client';

import React from 'react';
import Link from 'next/link';

interface G2ButtonProps {
  href: string;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export function G2Button({
  href,
  variant = 'primary',
  children,
  className = '',
}: G2ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Link
      href={href}
      className={`relative inline-flex w-full sm:w-auto h-13 sm:h-14 px-8 text-sm font-extrabold items-center justify-center gap-2.5 active:scale-98 transition-all duration-200 select-none rounded-full ${
        isPrimary
          ? 'bg-[#00594C] hover:bg-[#00463C] text-white shadow-md hover:shadow-lg'
          : 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-2xs hover:shadow-sm'
      } ${className}`}
      style={{
        borderRadius: '9999px',
        // Native CSS G2 Continuous Curvature (Apple / WebKit):
        // @ts-ignore
        cornerShape: 'squircle',
        WebkitCornerShape: 'squircle',
      }}
    >
      {children}
    </Link>
  );
}

export default G2Button;
