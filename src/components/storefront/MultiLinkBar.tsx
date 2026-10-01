'use client';

import React from 'react';
import { MultiLinkItem } from '@/types';
import { Instagram, MapPin, Phone, Globe, ExternalLink } from 'lucide-react';

interface MultiLinkBarProps {
  links: MultiLinkItem[];
  accentColor?: string;
}

export default function MultiLinkBar({ links, accentColor = '#00594C' }: MultiLinkBarProps) {
  const activeLinks = links.filter(l => l.active && l.url);

  if (activeLinks.length === 0) return null;

  const getIcon = (type: MultiLinkItem['type']) => {
    switch (type) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5" />;
      case 'maps':
        return <MapPin className="w-3.5 h-3.5" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5" />;
      case 'website':
        return <Globe className="w-3.5 h-3.5" />;
      case 'tiktok':
        return <span className="font-extrabold text-[11px] leading-none">♪</span>;
      default:
        return <ExternalLink className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="px-5 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
      {activeLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200/90 text-gray-700 hover:text-gray-900 text-xs font-semibold shadow-2xs hover:shadow-xs active:scale-95 transition-all"
        >
          <span style={{ color: accentColor }}>{getIcon(link.type)}</span>
          <span className="truncate max-w-[130px]">{link.label}</span>
        </a>
      ))}
    </div>
  );
}
