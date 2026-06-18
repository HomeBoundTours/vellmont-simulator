'use client';

import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAssessment } from '@/context/AssessmentContext';
import { calcOperational, formatCurrency, formatCurrencyFull } from '@/lib/calculations';
import { KpiCard } from '@/components/ui/KpiCard';
import { NumberInput } from '@/components/ui/NumberInput';
import { SectionCard } from '@/components/ui/SectionCard';
import { WhyVellmont } from './OverviewTab';
import { Clock, Users, DollarSign, AlertTriangle } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-sm">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[11px] text-slate-400">{p.name}:</span>
          <span className="text-[11px] font-bold text-white">{formatCurrencyFull(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function OperationalTab() {
  const { data, setOperationalInputs, presentationMode } = useAssessment();
  const { operationalInputs } = data;
  const results = calcOperational(operationalInputs);

  const update = (field: keyof typeof operationalInputs, value: number) => {
    setOperationalInputs({ ...operationalInputs, [field]: value });
  };

  const annualData = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    cumulative: results.laborValueLost * (i + 1),
  }));

  const weeklyHoursTotal = operationalInputs.teamSize * operationalInputs.hoursLostPerWeek;
  const monthlyHours = results.monthlyHoursLost;
  const annualHours = monthlyHours * 12;

  return (
    <div className="space-y-6">
      <div className={`grid gap-5 ${presentationMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {!presentationMode && (
          <SectionCard title="Efficiency Inputs" className="lg:col-span-1">
            <div className="space-y-5">
              <NumberInput label="Team Size" value={operationalInputs.teamSize} onChange={v => update('teamSize', v)} suffix="people" min={1} hint="Number of employees in scope" />
              <NumberInput label="Avg Hourly Labor Cost" value={operationalInputs.avgHourlyLaborCost} onChange={v => update('avgHourlyLaborCost', v)} prefix="$" suffix="/hr" min={1} hint="Loaded cost per employee per hour" />
              <NumberInput label="Hours Lost Per Person / Week" value={operationalInputs.hoursLostPerWeek} onChange={v => update('hoursLostPerWeek', v)} suffix="hrs" min={0} max={40} hint="Estimated hours lost to inefficiencies per week" />
              <NumberInput label="Weeks Per Month" value={operationalInputs.weeksPerMonth} onChange={v => update('weeksPerMonth', v)} suffix="weeks" min={1} max={5} />
            </div>
          </SectionCard>
        )}

        <div className={`space-y-4 ${presentationMode ? '' : 'lg:col-span-2'}`}>
          {/* Dashboard */}
          <SectionCard title="Hours Lost Overview">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Per Week', value: weeklyHoursTotal.toFixed(0), sub: 'hours', icon: Clock, color: 'text-amber-400' },
                { label: 'Per Month', value: monthlyHours.toFixed(0), sub: 'hours', icon: Clock, color: 'text-orange-400' },
                { label: 'Per Year', value: annualHours.toFixed(0), sub: 'hours', icon: Clock, color: 'text-red-400' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/40"
                  >
                    <Icon className={`w-3.5 h-3.5 mx-auto mb-2 ${item.color}`} />
                    <p className={`text-xl font-black tabular-nums ${item.color}`}>{item.value}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.sub} {item.label.toLowerCase()}</p>
                  </motion.div>
                );
              })}
            </div>
          </SectionCard>

          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="Weekly Labor Value Lost" value={formatCurrency(results.weeklyImpact)} sub={`${operationalInputs.teamSize} people × ${operationalInputs.hoursLostPerWeek}hrs`} variant="amber" delay={0} />
            <KpiCard label="Monthly Labor Value Lost" value={formatCurrency(results.laborValueLost)} sub={`${results.monthlyHoursLost.toFixed(0)} total hours`} variant="red" delay={0.05} />
            <KpiCard label="Annual Operational Cost" value={formatCurrency(results.annualOperationalCost)} sub="Modeled cost of inefficiency" variant="red" delay={0.1} />
            <KpiCard label="Per Employee / Year" value={formatCurrency(results.annualOperationalCost / Math.max(1, operationalInputs.teamSize))} sub="Average annual impact per person" variant="default" delay={0.15} />
          </div>

          <SectionCard title="12-Month Cumulative Cost Accumulation">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={annualData} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
                  <defs>
                    <linearGradient id="opsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => formatCurrency(v)} tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={52} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(239,68,68,0.2)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="cumulative" name="Cumulative Cost" stroke="#ef4444" strokeWidth={2} fill="url(#opsGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
        <p className="text-xs font-semibold text-emerald-300 mb-1">Key Insight</p>
        <p className="text-[11px] text-slate-400 leading-relaxed">Operational inefficiencies often create hidden costs and capacity constraints that compound over time. These modeled figures represent the potential scale of improvement opportunity within your organization, not guaranteed outcomes.</p>
      </div>
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
        <p className="text-[11px] text-slate-500 italic leading-relaxed">All calculations are based on user-provided assumptions and are intended solely for planning and business modeling purposes. Vellmont Consulting does not guarantee specific financial or operational outcomes.</p>
      </div>
      <WhyVellmont />
    </div>
  );
}
