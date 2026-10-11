'use client';

import React from 'react';
import Sparkline from './Sparkline';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  sparklineData?: number[];
  sparklineColor?: string;
  icon: React.ReactNode;
  subtitle?: string;
  theme?: 'dark' | 'light';
}

export default function MetricCard({
  title,
  value,
  unit,
  trend,
  sparklineData,
  sparklineColor = '#10B981',
  icon,
  subtitle,
  theme = 'dark',
}: MetricCardProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`relative rounded-3xl p-5 transition-all duration-200 border flex flex-col justify-between overflow-hidden backdrop-blur-xl ${
        isDark
          ? 'bg-[#0A0A0A] border-neutral-800/90 text-white shadow-xl shadow-black/40 hover:border-neutral-700'
          : 'bg-white border-neutral-200/90 text-neutral-900 shadow-sm hover:shadow-md hover:border-neutral-300'
      }`}
    >
      {/* Top row: Title and Icon */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={`text-xs font-semibold tracking-wider uppercase ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}
        >
          {title}
        </span>
        <div
          className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-colors ${
            isDark
              ? 'bg-neutral-900 border border-neutral-800 text-neutral-200'
              : 'bg-neutral-100 border border-neutral-200 text-neutral-700'
          }`}
        >
          {icon}
        </div>
      </div>

      {/* Main value and Sparkline */}
      <div className="flex items-end justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight">
            {value}
          </span>
          {unit && (
            <span
              className={`text-xs font-medium ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              {unit}
            </span>
          )}
        </div>

        {sparklineData && sparklineData.length > 1 && (
          <div className="flex-shrink-0">
            <Sparkline
              data={sparklineData}
              color={sparklineColor}
              width={75}
              height={26}
            />
          </div>
        )}
      </div>

      {/* Bottom metadata / trend badge */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-dashed ${
        isDark ? 'border-neutral-900' : 'border-neutral-100'
      }">
        {subtitle && (
          <span
            className={`text-[11px] truncate ${
              isDark ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            {subtitle}
          </span>
        )}

        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
              trend.positive
                ? isDark
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-emerald-100 text-emerald-700'
                : isDark
                ? 'bg-red-500/15 text-red-400'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trend.positive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
