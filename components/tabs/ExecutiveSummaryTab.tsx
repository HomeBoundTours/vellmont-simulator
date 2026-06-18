'use client';

import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Layers, Settings, FileText, AlertCircle, Calendar, Building2 } from 'lucide-react';
import { useAssessment } from '@/context/AssessmentContext';
import { calcRevenue, calcCapacity, calcSOP, calcOperational, formatCurrency, formatCurrencyFull } from '@/lib/calculations';
import { SectionCard } from '@/components/ui/SectionCard';
import { WhyVellmont } from './OverviewTab';

export function ExecutiveSummaryTab() {
  const { data } = useAssessment();
  const rev = calcRevenue(data.revenueInputs);
  const cap = calcCapacity(data.capacityInputs);
  const sop = calcSOP(data.sopInputs);
  const ops = calcOperational(data.operationalInputs);

  const selected = Object.values(data.services).filter(s => s.selected);
  const totalInvestment = selected.reduce((sum, s) => sum + s.investment, 0);
  const allAreas = [...new Set(selected.flatMap(s => s.impactAreas))];

  const hasClient = data.clientInfo.companyName || data.clientInfo.clientName;
  const date = data.clientInfo.assessmentDate
    ? new Date(data.clientInfo.assessmentDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const findings = [
    rev.additionalRevenue > 0 && {
      icon: TrendingUp,
      color: 'amber',
      heading: 'Revenue Growth Opportunity',
      detail: `A scenario of ${data.revenueInputs.additionalSales} additional sales per month represents ${formatCurrencyFull(rev.additionalRevenue)} in modeled additional monthly revenue (${formatCurrencyFull(rev.annualizedOpportunity)} annualized based on your inputs).`,
    },
    cap.currentUtilization > 75 && {
      icon: Layers,
      color: cap.currentUtilization > 85 ? 'red' : 'blue',
      heading: 'Capacity Constraints Identified',
      detail: `Current capacity utilization is modeled at ${cap.currentUtilization.toFixed(0)}%. Operations approaching or exceeding 80% utilization may face constraints on revenue growth without additional capacity investment.`,
    },
    ops.annualOperationalCost > 0 && {
      icon: Settings,
      color: 'emerald',
      heading: 'Operational Efficiency Opportunity',
      detail: `Based on the inputs provided, ${ops.monthlyHoursLost.toFixed(0)} hours per month may be lost to operational inefficiencies, representing ${formatCurrencyFull(ops.laborValueLost)} in modeled monthly labor cost (${formatCurrencyFull(ops.annualOperationalCost)} annually).`,
    },
    sop.documentationGapImpact > 0 && {
      icon: FileText,
      color: 'purple',
      heading: 'Documentation Gap Identified',
      detail: `With ${data.sopInputs.documentationCoverage}% documentation coverage, undocumented processes may be contributing to ${formatCurrencyFull(sop.documentationGapImpact)} in modeled annual impact on training efficiency and management overhead.`,
    },
  ].filter(Boolean) as Array<{ icon: any; color: string; heading: string; detail: string }>;

  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    amber: { bg: 'bg-amber-500/8', icon: 'text-amber-400 bg-amber-500/12 border-amber-500/20', border: 'border-amber-500/20' },
    red: { bg: 'bg-red-500/8', icon: 'text-red-400 bg-red-500/12 border-red-500/20', border: 'border-red-500/20' },
    blue: { bg: 'bg-blue-500/8', icon: 'text-blue-400 bg-blue-500/12 border-blue-500/20', border: 'border-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/8', icon: 'text-emerald-400 bg-emerald-500/12 border-emerald-500/20', border: 'border-emerald-500/20' },
    purple: { bg: 'bg-purple-500/8', icon: 'text-purple-400 bg-purple-500/12 border-purple-500/20', border: 'border-purple-500/20' },
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl border border-amber-500/15 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #020817 60%, #0c1527 100%)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-amber-500/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-blue-500/[0.04] blur-2xl pointer-events-none" />

        <div className="relative p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-400/80 bg-amber-500/8 border border-amber-500/15 rounded-full px-2.5 py-0.5">
                  Executive Summary
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight mb-3">
                Business Impact Assessment
              </h1>

              {hasClient && (
                <div className="space-y-1.5">
                  {data.clientInfo.companyName && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="text-sm font-semibold text-slate-200">{data.clientInfo.companyName}</span>
                      {data.clientInfo.industry && <span className="text-xs text-slate-500">· {data.clientInfo.industry}</span>}
                    </div>
                  )}
                  {data.clientInfo.clientName && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Prepared for</span>
                      <span className="text-xs font-medium text-slate-300">{data.clientInfo.clientName}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-1.5 mt-3">
                <Calendar className="w-3 h-3 text-slate-600" />
                <span className="text-[11px] text-slate-500">{date}</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
              <span className="text-slate-950 font-black text-xl">V</span>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-800/60">
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Based on the information entered, several opportunities may exist to improve business performance.
              The following observations are derived from user-provided assumptions and are intended for planning and modeling purposes only.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Findings */}
      <SectionCard title="Key Observations">
        {findings.length === 0 ? (
          <p className="text-[11px] text-slate-500 italic">Complete the assessment inputs in each tab to generate observations.</p>
        ) : (
          <div className="space-y-4">
            {findings.map((finding, i) => {
              const Icon = finding.icon;
              const cls = colorMap[finding.color] || colorMap.amber;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className={`flex gap-3 rounded-xl border p-4 ${cls.bg} ${cls.border}`}
                >
                  <div className={`p-2 rounded-xl border flex-shrink-0 h-fit ${cls.icon}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1 leading-tight">{finding.heading}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{finding.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Selected Services */}
      {selected.length > 0 && (
        <SectionCard title="Vellmont Consulting Services Discussed" accent>
          <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
            Selected services may help address identified areas through improved systems, documentation, operational processes, and growth planning.
          </p>
          <div className="space-y-3 mb-4">
            {selected.map(s => (
              <div key={s.key} className="flex items-start gap-3 py-2.5 border-b border-slate-800/60 last:border-0">
                <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{s.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{s.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {s.impactAreas.map(area => (
                      <span key={area} className="text-[10px] bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700/50">{area}</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400 flex-shrink-0 tabular-nums">{formatCurrency(s.investment)}/mo</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-800/60">
            <span className="text-xs font-bold text-white">Total Monthly Investment</span>
            <span className="text-base font-black text-amber-400 tabular-nums">{formatCurrency(totalInvestment)}/mo</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-slate-500">Annual Investment</span>
            <span className="text-xs font-semibold text-slate-300 tabular-nums">{formatCurrency(totalInvestment * 12)}/yr</span>
          </div>

          {allAreas.length > 0 && (
            <div className="mt-4 bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-3">
              <p className="text-[11px] font-semibold text-emerald-300 mb-2">Combined Services Address:</p>
              <div className="flex flex-wrap gap-2">
                {allAreas.map(area => (
                  <div key={area} className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span className="text-[11px] text-emerald-300 font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Notes */}
      {data.clientInfo.notes && (
        <SectionCard title="Session Notes">
          <p className="text-[12px] text-slate-300 leading-relaxed whitespace-pre-wrap">{data.clientInfo.notes}</p>
        </SectionCard>
      )}

      {/* Disclaimer */}
      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/40 p-5">
        <div className="flex gap-2.5 mb-2">
          <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Important Disclaimer</p>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          This analysis is based solely on user-provided assumptions and is intended for planning and modeling purposes only.
          All figures, calculations, and observations represent hypothetical scenarios — not forecasts, projections, or guarantees of any specific financial or operational outcome.
          Vellmont Consulting does not warrant or represent that any specific results will be achieved.
          Actual outcomes depend on a wide range of factors outside the scope of this tool.
        </p>
      </div>

      <WhyVellmont />
    </div>
  );
}
