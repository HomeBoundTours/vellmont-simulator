'use client';

import { motion } from 'framer-motion';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAssessment } from '@/context/AssessmentContext';
import { calcCapacity, formatCurrency, formatCurrencyFull } from '@/lib/calculations';
import { KpiCard } from '@/components/ui/KpiCard';
import { NumberInput } from '@/components/ui/NumberInput';
import { SectionCard } from '@/components/ui/SectionCard';
import { WhyVellmont } from './OverviewTab';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-sm">
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[11px] text-slate-400">{p.name}:</span>
          <span className="text-[11px] font-bold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

function CapacityGauge({ value, label, subtitle }: { value: number; label: string; subtitle?: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  const color = clamped > 85 ? '#ef4444' : clamped > 70 ? '#f59e0b' : '#10b981';
  const data = [{ value: clamped, fill: color }];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="100%" innerRadius="120%" outerRadius="160%" startAngle={180} endAngle={0} data={data}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar dataKey="value" angleAxisId={0} cornerRadius={4} background={{ fill: '#1e293b' }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 left-0 right-0 text-center pb-1">
          <span className="text-2xl font-black tracking-tight" style={{ color }}>{clamped.toFixed(0)}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-white mt-2">{label}</p>
      {subtitle && <p className="text-[10px] text-slate-500">{subtitle}</p>}
      <div className="mt-1.5">
        {clamped > 85 ? (
          <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-0.5">
            <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
            <span className="text-[9px] text-red-300 font-medium">High utilization</span>
          </div>
        ) : clamped <= 70 ? (
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
            <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
            <span className="text-[9px] text-emerald-300 font-medium">Healthy range</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function CapacityImpactTab() {
  const { data, setCapacityInputs, presentationMode } = useAssessment();
  const { capacityInputs } = data;
  const results = calcCapacity(capacityInputs);

  const update = (field: keyof typeof capacityInputs, value: number) => {
    setCapacityInputs({ ...capacityInputs, [field]: value });
  };

  const compData = [
    { name: 'Current', Sales: capacityInputs.currentMonthlySales, Capacity: capacityInputs.currentMonthlyCapacity },
    { name: 'Scenario', Sales: capacityInputs.currentMonthlySales, Capacity: capacityInputs.currentMonthlyCapacity + capacityInputs.additionalCapacity },
  ];

  return (
    <div className="space-y-6">
      <div className={`grid gap-5 ${presentationMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {!presentationMode && (
          <SectionCard title="Capacity Inputs" className="lg:col-span-1">
            <div className="space-y-5">
              <NumberInput label="Current Monthly Capacity" value={capacityInputs.currentMonthlyCapacity} onChange={v => update('currentMonthlyCapacity', v)} suffix="units" min={1} hint="Maximum deliverable units/clients per month" />
              <NumberInput label="Current Monthly Sales" value={capacityInputs.currentMonthlySales} onChange={v => update('currentMonthlySales', v)} suffix="units" min={0} />
              <NumberInput label="Additional Capacity Scenario" value={capacityInputs.additionalCapacity} onChange={v => update('additionalCapacity', v)} suffix="units" min={0} hint="Additional capacity in this scenario" />
              <NumberInput label="Revenue Per Sale / Unit" value={capacityInputs.revenuePerSale} onChange={v => update('revenuePerSale', v)} prefix="$" min={1} />
            </div>
          </SectionCard>
        )}

        <div className={`space-y-4 ${presentationMode ? '' : 'lg:col-span-2'}`}>
          {/* Gauges */}
          <SectionCard title="Capacity Utilization">
            <div className="flex items-center justify-around py-4">
              <CapacityGauge
                value={results.currentUtilization}
                label="Current"
                subtitle={`${capacityInputs.currentMonthlySales} / ${capacityInputs.currentMonthlyCapacity} units`}
              />
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="w-5 h-5 text-slate-600" />
                <span className="text-[10px] text-slate-600">scenario</span>
              </div>
              <CapacityGauge
                value={results.futureUtilization}
                label="Scenario"
                subtitle={`${capacityInputs.currentMonthlySales} / ${capacityInputs.currentMonthlyCapacity + capacityInputs.additionalCapacity} units`}
              />
            </div>
            {results.currentUtilization > 85 && (
              <div className="mt-2 bg-red-500/8 border border-red-500/20 rounded-xl p-3">
                <p className="text-[11px] text-red-300 flex items-center gap-2 leading-relaxed">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  High capacity utilization may indicate that current demand is approaching or exceeding operational limits. This can constrain revenue growth without additional capacity investment.
                </p>
              </div>
            )}
          </SectionCard>

          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="Revenue Opportunity Created" value={formatCurrency(results.revenueOpportunity)} sub={`${capacityInputs.additionalCapacity} units × ${formatCurrency(capacityInputs.revenuePerSale)}`} variant="amber" delay={0} />
            <KpiCard label="Annualized Opportunity" value={formatCurrency(results.revenueOpportunity * 12)} sub="Based on scenario capacity" variant="emerald" delay={0.05} />
            {results.capacityGap > 0 && (
              <KpiCard label="Current Capacity Gap" value={`${results.capacityGap} units`} sub="Demand exceeds capacity" variant="red" delay={0.1} />
            )}
          </div>

          <SectionCard title="Capacity vs Sales — Current & Scenario">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compData} margin={{ top: 4, right: 4, left: 0, bottom: 4 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="Sales" name="Sales" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Capacity" name="Capacity" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4">
        <p className="text-xs font-semibold text-blue-300 mb-1">Key Insight</p>
        <p className="text-[11px] text-slate-400 leading-relaxed">Many businesses are constrained by capacity rather than demand. Understanding your capacity ceiling helps prioritize where investment in operations can create the greatest business impact.</p>
      </div>
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
        <p className="text-[11px] text-slate-500 italic leading-relaxed">All calculations are based on user-provided assumptions and are intended solely for planning and business modeling purposes. Vellmont Consulting does not guarantee specific financial or operational outcomes.</p>
      </div>
      <WhyVellmont />
    </div>
  );
}
