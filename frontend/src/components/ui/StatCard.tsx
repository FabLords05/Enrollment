/**
 * StatCard.tsx  ─  ADD-ONLY  ─  Do NOT modify existing files
 *
 * Reusable dashboard stat card — drop into:
 *   frontend/src/components/ui/StatCard.tsx
 */

import React from 'react';
import Icon from './Icon';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  sub?: string;
  /** Tailwind text colour class for the icon bg, e.g. 'text-blue-600' */
  iconColor?: string;
  /** Tailwind bg colour class for the icon bg, e.g. 'bg-blue-50' */
  iconBg?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  sub,
  iconColor = 'text-ustpBlue',
  iconBg = 'bg-blue-50',
  trend,
  trendLabel,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`${iconBg} ${iconColor} rounded-xl p-3 shrink-0`}>
        <Icon name={icon} size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">{label}</div>
        <div className="text-2xl font-extrabold text-ustpDarkBlue leading-tight">{value}</div>
        {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
        {trend && trendLabel && (
          <div className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendLabel}
          </div>
        )}
      </div>
    </div>
  );
}
