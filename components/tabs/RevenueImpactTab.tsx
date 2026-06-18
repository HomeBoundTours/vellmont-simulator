'use client';

import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { useAssessment } from '@/context/AssessmentContext';
import { calcRevenue, buildRevenueChartData, formatCurrency, formatCurrencyFull } from '@/lib/calculations';
import { KpiCard } from '@/components/ui/KpiCard';
import { SliderInput } from '@/components/ui/SliderInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { SectionCard } from '@/components/ui/SectionCard';
import { WhyVellmont } from './OverviewTab';
import { Sparkles } from 'lucide-react';

const SALE_MILESTONES = [1, 5, 10, 20, 50];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl shadow-black/50 backdrop-blur-sm">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[11px] text-slate-400">{p.name}:</span>
          <span className="text-[11px] font-bold text-white">{formatCurrencyFull(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function RevenueImpactTab() {
  const { data, setRevenueInputs, presentationMode } = useAssessment();
  const { revenueInputs } = data;
  const results = calcRevenue(revenueInputs);
  const chartData = buildRevenueChartData(revenueInputs);

  const update = (field: keyof typeof revenueInputs, value: number) => {
    setRevenueInputs({ ...revenueInputs, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-600/10 via-amber-500/5 to-slate-900 border border-amber-500/20"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_70%)]" />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-amber-400/90">Revenue Scenario Modeling</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">What Is One Additional Sale Worth?</h2>
          <p className="text-xs text-slate-400 mb-5">
            Based on an average sale value of <span className="text-amber-300 font-semibold">{formatCurrencyFull(revenueInputs.revenuePerSale)}</span>
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {SALE_MILESTONES.map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="bg-slate-900/60 border border-slate-700/50 hover:border-amber-500/30 rounded-xl p-3 text-center transition-colors"
              >
                <p className="text-[10px] text-slate-500 mb-1.5 font-medium">{n} {n === 1 ? 'sale' : 'sales'}</p>
                <p className="text-base font-bold text-amber-300 leading-none tabular-nums">{formatCurrency(n * revenueInputs.revenuePerSale)}</p>
                <p className="text-[9px] text-slate-600 mt-1">per month</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className={`grid gap-5 ${presentationMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {/* Inputs */}
        {!presentationMode && (
          <SectionCard title="Scenario Inputs" className="lg:col-span-1">
            <div className="space-y-5">
              <NumberInput label="Average Revenue Per Sale" value={revenueInputs.revenuePerSale} onChange={v => update('revenuePerSale', v)} prefix="$" min={1} hint="Your average deal or transaction value" />
              <NumberInput label="Current Monthly Sales" value={revenueInputs.currentMonthlySales} onChange={v => update('currentMonthlySales', v)} suffix="sales" min={0} />
              <NumberInput label="Additional Sales Scenario" value={revenueInputs.additionalSales} onChange={v => update('additionalSales', v)} suffix="sales" min={0} hint="Additional sales per month in this scenario" />
              <SliderInput label="Time Period" value={revenueInputs.timePeriodMonths} min={1} max={60} onChange={v => update('timePeriodMonths', v)} format={v => `${v} months`} hint="Drag to adjust the projection window" />
            </div>
          </SectionCard>
        )}

        <div className={`space-y-4 ${presentationMode ? '' : 'lg:col-span-2'}`}>
          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="Current Monthly Revenue" value={formatCurrency(results.currentRevenue)} sub={`${revenueInputs.currentMonthlySales} sales`} variant="default" delay={0} />
            <KpiCard label="Scenario Monthly Revenue" value={formatCurrency(results.scenarioRevenue)} sub={`${revenueInputs.currentMonthlySales + revenueInputs.additionalSales} sales`} variant="amber" delay={0.05} />
            <KpiCard label="Additional Monthly Revenue" value={formatCurrency(results.additionalRevenue)} sub={`+${results.growthPercentage.toFixed(1)}% growth`} variant="emerald" delay={0.1} />
            <KpiCard label={`${revenueInputs.timePeriodMonths}-Month Opportunity`} value={formatCurrency(results.additionalRevenue * revenueInputs.timePeriodMonths)} sub="Cumulative additional revenue" variant="blue" delay={0.15} />
          </div>

          <SectionCard title="Monthly Revenue Comparison">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.slice(0, 12)} margin={{ top: 4, right: 4, left: 0, bottom: 4 }} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => formatCurrency(v)} tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={52} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="current" name="Current" fill="#334155" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="scenario" name="Scenario" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title={`${revenueInputs.timePeriodMonths}-Month Cumulative Opportunity`}>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
                  <defs>
                    <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => formatCurrency(v)} tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={52} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(245,158,11,0.2)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="cumulative" name="Cumulative" stroke="#f59e0b" strokeWidth={2} fill="url(#cumGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
        <p className="text-[11px] text-slate-500 italic leading-relaxed">All calculations are based on user-provided assumptions and are intended solely for planning and business modeling purposes. Vellmont Consulting does not guarantee specific financial or operational outcomes.</p>
      </div>
      <WhyVellmont />
    </div>
  );
}
