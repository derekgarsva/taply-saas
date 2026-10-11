'use client';

import React from 'react';
import { DollarSign, Store, Power, ShoppingBag, Clock } from 'lucide-react';

export interface TimelineItem {
  id: string;
  title: string;
  subtitle?: string;
  timestamp: string;
  type: 'payment' | 'store' | 'status' | 'order';
  badge?: string;
  amount?: number;
}

interface TimelineProps {
  items: TimelineItem[];
  theme?: 'dark' | 'light';
}

export default function Timeline({ items, theme = 'dark' }: TimelineProps) {
  const isDark = theme === 'dark';

  const getIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      case 'store':
        return <Store className="w-3.5 h-3.5 text-blue-400" />;
      case 'status':
        return <Power className="w-3.5 h-3.5 text-amber-400" />;
      case 'order':
        return <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  const getIconBg = (type: TimelineItem['type']) => {
    switch (type) {
      case 'payment':
        return isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200';
      case 'store':
        return isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200';
      case 'status':
        return isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200';
      case 'order':
        return isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200';
      default:
        return isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-100 border-neutral-200';
    }
  };

  if (items.length === 0) {
    return (
      <div className={`p-8 text-center text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
        No hay eventos recientes en el registro cronológico.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-neutral-500/30 before:to-transparent">
      {items.map((item) => (
        <div key={item.id} className="relative group">
          {/* Node Icon on the vertical line */}
          <div
            className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center shadow-sm z-10 transition-transform group-hover:scale-110 ${getIconBg(
              item.type
            )}`}
          >
            {getIcon(item.type)}
          </div>

          {/* Event Content Box */}
          <div
            className={`p-3.5 rounded-2xl border transition-colors ${
              isDark
                ? 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900'
                : 'bg-neutral-50/80 border-neutral-200/80 hover:border-neutral-300 hover:bg-white'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className={`text-xs font-semibold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {item.title}
              </span>
              <span className={`text-[10px] font-medium flex-shrink-0 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {item.timestamp}
              </span>
            </div>

            {item.subtitle && (
              <p className={`text-[11px] leading-relaxed mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {item.subtitle}
              </p>
            )}

            <div className="flex items-center gap-2">
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isDark
                      ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                      : 'bg-neutral-200 text-neutral-700 border border-neutral-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {item.amount !== undefined && (
                <span className="text-xs font-bold text-emerald-500">
                  +${item.amount.toFixed(2)} USD
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
