'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAssessment } from '@/context/AssessmentContext';
import { calcSOP, formatCurrency, formatCurrencyFull } from '@/lib/calculations';
import { KpiCard } from '@/components/ui/KpiCard';
import { SliderInput } from '@/components/ui/SliderInput';
import { NumberInput } from '@/components/ui/NumberInput';
import { SectionCard } from '@/components/ui/SectionCard';
import { WhyVellmont } from './OverviewTab';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-sm">
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
          <span className="text-[11px] text-slate-400">{p.name}:</span>
          <span className="text-[11px] font-bold text-white">{formatCurrencyFull(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function SOPTab() {
  const { data, setSOPInputs, presentationMode } = useAssessment();
  const { sopInputs } = data;
  const results = calcSOP(sopInputs);

  const update = (field: keyof typeof sopInputs, value: number) => {
    setSOPInputs({ ...sopInputs, [field]: value });
  };

  const pieData = [
    { name: 'Documented', value: sopInputs.documentationCoverage, color: '#10b981' },
    { name: 'Undocumented', value: 100 - sopInputs.documentationCoverage, color: '#ef4444' },
  ];

  const costData = [
    { name: 'Training Cost', value: results.trainingTimeCost, fill: '#f59e0b' },
    { name: 'Mgmt Time', value: results.managementTimeCost, fill: '#3b82f6' },
    { name: 'Doc Gap Impact', value: results.documentationGapImpact, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className={`grid gap-5 ${presentationMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {!presentationMode && (
          <SectionCard title="Documentation Inputs" className="lg:col-span-1">
            <div className="space-y-5">
              <NumberInput label="Employee Count" value={sopInputs.employeeCount} onChange={v => update('employeeCount', v)} suffix="people" min={1} />
              <NumberInput label="Avg Onboarding Hours" value={sopInputs.avgOnboardingHours} onChange={v => update('avgOnboardingHours', v)} suffix="hours" min={1} hint="Hours required to onboard one new employee" />
              <NumberInput label="Manager Hourly Value" value={sopInputs.managerHourlyValue} onChange={v => update('managerHourlyValue', v)} prefix="$" suffix="/hr" min={1} hint="Estimated hourly value of manager's time" />
              <SliderInput label="Annual Employee Turnover" value={sopInputs.annualTurnoverRate} min={0} max={100} onChange={v => update('annualTurnoverRate', v)} format={v => `${v}%`} hint="Percentage of staff that turns over annually" />
              <SliderInput label="Documentation Coverage" value={sopInputs.documentationCoverage} min={0} max={100} onChange={v => update('documentationCoverage', v)} format={v => `${v}%`} hint="What percentage of processes are documented?" />
            </div>
          </SectionCard>
        )}

        <div className={`space-y-4 ${presentationMode ? '' : 'lg:col-span-2'}`}>
          {/* Coverage meter */}
          <SectionCard title="Documentation Coverage">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={26} outerRadius={44} dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-semibold text-emerald-400">Documented</span>
                    <span className="text-[11px] font-bold text-emerald-400 tabular-nums">{sopInputs.documentationCoverage}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${sopInputs.documentationCoverage}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-semibold text-red-400">Undocumented Gap</span>
                    <span className="text-[11px] font-bold text-red-400 tabular-nums">{100 - sopInputs.documentationCoverage}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500" style={{ width: `${100 - sopInputs.documentationCoverage}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="Annual Training Cost" value={formatCurrency(results.trainingTimeCost)} sub={`${Math.round(sopInputs.employeeCount * sopInputs.annualTurnoverRate / 100)} employees × ${sopInputs.avgOnboardingHours}hrs`} variant="amber" delay={0} />
            <KpiCard label="Management Time Cost" value={formatCurrency(results.managementTimeCost)} sub="Annual manager overhead" variant="blue" delay={0.05} />
            <KpiCard label="Documentation Gap Impact" value={formatCurrency(results.documentationGapImpact)} sub="Cost of undocumented processes" variant="red" delay={0.1} />
            <KpiCard label="Total Modeled Annual Cost" value={formatCurrency(results.totalAnnualImpact)} sub="Training + management combined" variant="default" delay={0.15} />
          </div>

          <SectionCard title="Annual Cost Breakdown">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData} layout="vertical" margin={{ top: 0, right: 8, left: 4, bottom: 0 }} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" tickFormatter={v => formatCurrency(v)} tick={{ fill: '#475569', fontSize: 10, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Inter' }} width={90} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="value" name="Annual Cost" radius={[0, 4, 4, 0]}>
                    {costData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="rounded-2xl border border-purple-500/15 bg-purple-500/5 p-4">
        <p className="text-xs font-semibold text-purple-300 mb-1">Key Insight</p>
        <p className="text-[11px] text-slate-400 leading-relaxed">The cost of undocumented processes extends beyond paperwork. It impacts training efficiency, operational consistency, and the organization's ability to scale. These modeled costs represent potential areas of improvement, not guaranteed savings.</p>
      </div>
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
        <p className="text-[11px] text-slate-500 italic leading-relaxed">All calculations are based on user-provided assumptions and are intended solely for planning and business modeling purposes. Vellmont Consulting does not guarantee specific financial or operational outcomes.</p>
      </div>
      <WhyVellmont />
    </div>
  );
}
