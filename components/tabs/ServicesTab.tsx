'use client';

import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Settings, FileText } from 'lucide-react';
import { useAssessment } from '@/context/AssessmentContext';
import type { ServiceKey } from '@/types';
import { formatCurrency } from '@/lib/calculations';
import { NumberInput } from '@/components/ui/NumberInput';
import { SectionCard } from '@/components/ui/SectionCard';
import { WhyVellmont } from './OverviewTab';

const SERVICE_ICONS: Record<ServiceKey, React.ReactNode> = {
  salesGrowth: <TrendingUp className="w-5 h-5" />,
  operationalConsulting: <Settings className="w-5 h-5" />,
  sopDevelopment: <FileText className="w-5 h-5" />,
};

const SERVICE_GRADIENTS: Record<ServiceKey, string> = {
  salesGrowth: 'from-amber-500/15 to-amber-600/5 border-amber-500/25',
  operationalConsulting: 'from-blue-500/15 to-blue-600/5 border-blue-500/25',
  sopDevelopment: 'from-purple-500/15 to-purple-600/5 border-purple-500/25',
};

const SERVICE_ICON_BG: Record<ServiceKey, string> = {
  salesGrowth: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  operationalConsulting: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  sopDevelopment: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
};

const SERVICE_ACCENT: Record<ServiceKey, string> = {
  salesGrowth: 'via-amber-500/50',
  operationalConsulting: 'via-blue-500/50',
  sopDevelopment: 'via-purple-500/50',
};

export function ServicesTab() {
  const { data, toggleService, setServiceInvestment } = useAssessment();
  const { services } = data;

  const serviceList = Object.values(services);
  const selected = serviceList.filter(s => s.selected);
  const totalInvestment = selected.reduce((sum, s) => sum + s.investment, 0);
  const allAreas = [...new Set(selected.flatMap(s => s.impactAreas))];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {serviceList.map((service, i) => (
          <motion.div
            key={service.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative"
          >
            <div
              onClick={() => toggleService(service.key)}
              className={`relative rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden ${
                service.selected
                  ? `bg-gradient-to-br ${SERVICE_GRADIENTS[service.key]}`
                  : 'bg-slate-900/80 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {service.selected && (
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${SERVICE_ACCENT[service.key]} to-transparent`} />
              )}

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-xl border ${service.selected ? SERVICE_ICON_BG[service.key] : 'bg-slate-800 text-slate-500 border-slate-700/50'}`}>
                    {SERVICE_ICONS[service.key]}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    service.selected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                  }`}>
                    {service.selected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5 leading-tight">{service.name}</h3>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">{service.description}</p>

                <div className="space-y-1 mb-4">
                  {service.impactAreas.map(area => (
                    <div key={area} className="flex items-center gap-1.5">
                      <div className={`w-1 h-1 rounded-full flex-shrink-0 ${service.selected ? 'bg-amber-400' : 'bg-slate-600'}`} />
                      <span className="text-[11px] text-slate-400">{area}</span>
                    </div>
                  ))}
                </div>

                <div onClick={e => e.stopPropagation()}>
                  <NumberInput label="Monthly Investment" value={service.investment} onChange={v => setServiceInvestment(service.key, v)} prefix="$" suffix="/mo" min={0} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bundle Summary */}
      <SectionCard title="Bundle Summary" accent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Selected Services</h4>
            {selected.length === 0 ? (
              <p className="text-[11px] text-slate-600 italic">No services selected. Click a card above to add.</p>
            ) : (
              <div className="space-y-2">
                {selected.map(s => (
                  <div key={s.key} className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-semibold text-white">{s.name}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400 tabular-nums">{formatCurrency(s.investment)}/mo</span>
                  </div>
                ))}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">Total Monthly</span>
                    <span className="text-sm font-black text-amber-400 tabular-nums">{formatCurrency(totalInvestment)}/mo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Annual Investment</span>
                    <span className="text-xs font-semibold text-slate-300 tabular-nums">{formatCurrency(totalInvestment * 12)}/yr</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Business Areas Addressed</h4>
            {allAreas.length === 0 ? (
              <p className="text-[11px] text-slate-600 italic">Select services to see addressed business areas.</p>
            ) : (
              <div className="space-y-2">
                {allAreas.map((area, i) => (
                  <motion.div
                    key={area}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-slate-300 font-medium">{area}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selected.length > 0 && (
          <div className="mt-4 bg-amber-500/8 border border-amber-500/20 rounded-xl p-3">
            <p className="text-[11px] font-semibold text-amber-300 mb-2">Combined Services Address:</p>
            <div className="flex flex-wrap gap-1.5">
              {allAreas.map(area => (
                <span key={area} className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-200/80 bg-amber-500/10 border border-amber-500/15 rounded-full px-2.5 py-0.5">
                  <CheckCircle className="w-2.5 h-2.5" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
        <p className="text-[11px] text-slate-500 italic leading-relaxed">Service investment amounts are examples only. Final pricing is determined through individual consultation. This tool does not calculate guaranteed ROI or projected financial outcomes. All figures are for planning and modeling purposes.</p>
      </div>
      <WhyVellmont />
    </div>
  );
}
