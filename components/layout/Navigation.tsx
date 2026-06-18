'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, TrendingUp, Layers, FileText, Settings, Package, BookOpen } from 'lucide-react';
import { useAssessment } from '@/context/AssessmentContext';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'overview', label: 'Overview', short: 'Overview', icon: BarChart2 },
  { id: 'revenue', label: 'Revenue Impact', short: 'Revenue', icon: TrendingUp },
  { id: 'capacity', label: 'Capacity', short: 'Capacity', icon: Layers },
  { id: 'sop', label: 'SOP & Docs', short: 'SOP', icon: FileText },
  { id: 'operational', label: 'Efficiency', short: 'Efficiency', icon: Settings },
  { id: 'services', label: 'Services', short: 'Services', icon: Package },
  { id: 'summary', label: 'Executive Summary', short: 'Summary', icon: BookOpen },
];

export function Navigation() {
  const { activeTab, setActiveTab, presentationMode } = useAssessment();

  if (presentationMode) return null;

  return (
    <nav className="glass border-b border-white/[0.04] sticky top-14 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex overflow-x-auto scrollbar-hide py-1.5 gap-0.5">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 outline-none',
                  active
                    ? 'text-amber-300'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                )}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-amber-500/10 border border-amber-500/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className={cn('w-3.5 h-3.5 relative z-10 flex-shrink-0', active ? 'text-amber-400' : '')} />
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                <span className="relative z-10 sm:hidden">{tab.short}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
