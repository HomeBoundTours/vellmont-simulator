'use client';

import { cn } from '@/lib/utils';

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  noPad?: boolean;
  accent?: boolean;
}

export function SectionCard({ title, subtitle, children, className, noPad, accent }: SectionCardProps) {
  return (
    <div className={cn(
      'relative rounded-2xl border overflow-hidden',
      accent
        ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-amber-500/20'
        : 'bg-slate-900/80 border-slate-800/60',
      className
    )}>
      {/* Top highlight line */}
      {accent && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />}

      {(title || subtitle) && (
        <div className="px-5 pt-5 pb-4 border-b border-slate-800/60">
          {title && (
            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-amber-400/90">{title}</h3>
          )}
          {subtitle && <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{subtitle}</p>}
        </div>
      )}
      <div className={noPad ? '' : 'p-5'}>{children}</div>
    </div>
  );
}
