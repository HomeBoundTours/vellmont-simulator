'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  variant?: 'default' | 'amber' | 'emerald' | 'blue' | 'red' | 'purple';
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
  trend?: 'up' | 'down' | 'neutral';
}

const VARIANTS = {
  default: 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50',
  amber: 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30',
  emerald: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
  blue: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30',
  red: 'bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/30',
  purple: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30',
};

const VALUE_COLORS = {
  default: 'text-white',
  amber: 'text-amber-300',
  emerald: 'text-emerald-300',
  blue: 'text-blue-300',
  red: 'text-red-300',
  purple: 'text-purple-300',
};

const ICON_COLORS = {
  default: 'text-slate-400',
  amber: 'text-amber-400',
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  red: 'text-red-400',
  purple: 'text-purple-400',
};

export function KpiCard({ label, value, sub, variant = 'default', icon, className, delay = 0, trend }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'relative overflow-hidden rounded-2xl border p-4 sm:p-5',
        VARIANTS[variant],
        className
      )}
    >
      {/* Subtle inner highlight */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 leading-tight max-w-[75%]">{label}</p>
          {icon && (
            <div className={cn('flex-shrink-0 opacity-70', ICON_COLORS[variant])}>
              {icon}
            </div>
          )}
        </div>
        <p className={cn('text-2xl sm:text-3xl font-bold leading-none tracking-tight', VALUE_COLORS[variant])}>{value}</p>
        {sub && (
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{sub}</p>
        )}
      </div>
    </motion.div>
  );
}
