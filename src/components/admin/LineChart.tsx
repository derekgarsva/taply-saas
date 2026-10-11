'use client';

import React, { useState, useMemo } from 'react';
import MorphSelect from './MorphSelect';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

export interface DataPoint {
  label: string;
  value: number;
  date?: string;
}

interface LineChartProps {
  series: {
    revenue: DataPoint[];
    gmv: DataPoint[];
    orders: DataPoint[];
  };
  theme?: 'dark' | 'light';
}

export default function LineChart({
  series,
  theme = 'dark',
}: LineChartProps) {
  const isDark = theme === 'dark';
  const [metricType, setMetricType] = useState<'revenue' | 'gmv' | 'orders'>('revenue');
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeData = useMemo(() => {
    const raw = series[metricType] || [];
    if (timeRange === '7d') {
      return raw.slice(-7);
    }
    return raw;
  }, [series, metricType, timeRange]);

  const maxVal = Math.max(...activeData.map((d) => d.value), 10);
  const minVal = Math.min(...activeData.map((d) => d.value), 0);
  const total = activeData.reduce((acc, d) => acc + d.value, 0);
  const avg = Math.round(total / (activeData.length || 1));

  // Chart Dimensions
  const width = 640;
  const height = 200;
  const paddingX = 35;
  const paddingY = 30;

  const points = activeData.map((d, i) => {
    const x = paddingX + (i / (activeData.length - 1 || 1)) * (width - paddingX * 2);
    const range = maxVal - minVal || 1;
    const y = height - paddingY - ((d.value - minVal) / range) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY + 15} L ${points[0].x} ${height - paddingY + 15} Z`
    : '';

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 transition-colors border backdrop-blur-xl ${
        isDark
          ? 'bg-[#0A0A0A] border-neutral-800 text-white shadow-2xl'
          : 'bg-white border-neutral-200 text-neutral-900 shadow-sm'
      }`}
    >
      {/* Top Header: Title and Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold tracking-tight">
              Análisis y Tendencia de Rendimiento
            </h3>
          </div>
          <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Métricas transaccionales y de suscripción en tiempo real
          </p>
        </div>

        {/* Controls: Metric Switch & Range Switch */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <MorphSelect
            layoutId="metric-type-pill"
            theme={theme}
            size="sm"
            value={metricType}
            onChange={(val) => setMetricType(val as any)}
            options={[
              { id: 'revenue', label: 'Ingresos ($)' },
              { id: 'gmv', label: 'GMV WhatsApp' },
              { id: 'orders', label: 'Pedidos' },
            ]}
          />

          <MorphSelect
            layoutId="time-range-pill"
            theme={theme}
            size="sm"
            value={timeRange}
            onChange={(val) => setTimeRange(val as any)}
            options={[
              { id: '7d', label: '7 Días' },
              { id: '30d', label: '30 Días' },
            ]}
          />
        </div>
      </div>

      {/* Summary stats ticker */}
      <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-dashed ${
        isDark ? 'border-neutral-900' : 'border-neutral-200'
      }">
        <div>
          <span className={`text-[10px] font-semibold uppercase tracking-wider block ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}>
            Total Período
          </span>
          <span className="text-base sm:text-lg font-bold">
            {metricType === 'orders' ? total : `$${total.toFixed(0)}`}
          </span>
        </div>
        <div>
          <span className={`text-[10px] font-semibold uppercase tracking-wider block ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}>
            Promedio Diario
          </span>
          <span className="text-base sm:text-lg font-bold">
            {metricType === 'orders' ? avg : `$${avg.toFixed(0)}`}
          </span>
        </div>
        <div>
          <span className={`text-[10px] font-semibold uppercase tracking-wider block ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}>
            Pico Máximo
          </span>
          <span className="text-base sm:text-lg font-bold text-emerald-500">
            {metricType === 'orders' ? maxVal : `$${maxVal.toFixed(0)}`}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 overflow-visible"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="mainLineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={(height - paddingY + paddingY) / 2}
            x2={width - paddingX}
            y2={(height - paddingY + paddingY) / 2}
            stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
            strokeDasharray="4 4"
          />

          {/* Gradient Underfill */}
          <path d={areaD} fill="url(#mainLineGradient)" />

          {/* Smooth Path Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover Crosshair vertical bar */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={paddingY - 10}
              x2={hoveredPoint.x}
              y2={height - paddingY}
              stroke="#10B981"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.8"
            />
          )}

          {/* Interactive Point Hotspots */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onTouchStart={() => setHoveredIndex(idx)}
              >
                {/* Hit area */}
                <circle cx={p.x} cy={p.y} r="18" fill="transparent" />

                {/* Visible dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill={isDark ? '#000000' : '#FFFFFF'}
                  stroke="#10B981"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* X axis labels */}
                <text
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isDark ? (isHovered ? '#FFFFFF' : '#737373') : (isHovered ? '#000000' : '#A3A3A3')}
                  fontWeight={isHovered ? '600' : '500'}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className={`absolute pointer-events-none -translate-x-1/2 px-3 py-1.5 rounded-xl border shadow-xl backdrop-blur-md text-xs font-medium z-30 transition-all ${
              isDark
                ? 'bg-neutral-900/95 border-neutral-700 text-white'
                : 'bg-white/95 border-neutral-300 text-neutral-900'
            }`}
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${Math.max(0, (hoveredPoint.y / height) * 100 - 32)}%`,
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span className="font-bold">
                {metricType === 'orders' ? `${hoveredPoint.value} pedidos` : `$${hoveredPoint.value.toFixed(2)}`}
              </span>
            </div>
            <div className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {hoveredPoint.date || hoveredPoint.label}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
