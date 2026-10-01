'use client';

import React from 'react';

export default function CatalogSkeleton() {
  return (
    <div className="w-full flex-1 pb-32 font-sans transition-opacity duration-300">
      {/* Hero Banner Skeleton */}
      <div className="skeleton-box w-full h-64 relative">
        <div className="absolute bottom-4 left-5 right-5 space-y-2">
          <div className="h-3 w-20 bg-gray-300/80 rounded-md" />
          <div className="h-7 w-56 bg-gray-300/80 rounded-lg" />
          <div className="h-3 w-32 bg-gray-300/80 rounded-md" />
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="px-5 pt-4 pb-2 space-y-2">
        <div className="h-3.5 w-full bg-gray-200 rounded-md skeleton-box" />
        <div className="h-3.5 w-4/5 bg-gray-200 rounded-md skeleton-box" />
      </div>

      {/* Categories Pill Bar Skeleton */}
      <div className="px-5 py-3 flex gap-2 overflow-hidden border-b border-gray-100">
        {[64, 82, 60, 68, 74].map((w, idx) => (
          <div
            key={idx}
            className="h-8 rounded-full skeleton-box flex-shrink-0"
            style={{ width: `${w}px` }}
          />
        ))}
      </div>

      {/* Product Items Skeleton */}
      <div className="px-5 divide-y divide-gray-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-4 flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl skeleton-box flex-shrink-0" />
            <div className="flex-1 flex flex-col justify-between h-20 py-0.5">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="h-4 w-32 bg-gray-200 rounded-md skeleton-box" />
                  <div className="h-4 w-12 bg-gray-200 rounded-md skeleton-box" />
                </div>
                <div className="h-3 w-20 bg-gray-200 rounded-md skeleton-box" />
              </div>
              <div className="h-8 w-24 rounded-full skeleton-box" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto p-4 bg-gradient-to-t from-white via-white/95 to-transparent">
        <div className="w-full h-14 rounded-[28px] skeleton-box" />
      </div>
    </div>
  );
}
