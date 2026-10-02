'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface SlidingTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  accentColor?: string;
  layoutId?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SlidingTabs({
  tabs,
  activeId,
  onChange,
  className = '',
  accentColor = '#00594C',
  layoutId = 'sliding-tab-pill',
  size = 'md',
}: SlidingTabsProps) {
  const sizeClasses = {
    sm: 'text-[11px] py-1 px-3',
    md: 'text-xs py-1.5 px-3.5',
    lg: 'text-sm py-2 px-5',
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 bg-gray-100/90 backdrop-blur-md rounded-2xl border border-gray-200/70 select-none ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-1.5 font-bold rounded-xl transition-colors duration-150 z-10 ${sizeClasses} ${
              isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl shadow-xs -z-10"
                style={{ backgroundColor: accentColor }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 32,
                }}
              />
            )}
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span className="truncate">{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default SlidingTabs;
