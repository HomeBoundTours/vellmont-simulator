'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Layers, Settings, FileText, Package, CheckCircle, ArrowRight } from 'lucide-react';
import { useAssessment } from '@/context/AssessmentContext';
import { calcRevenue, calcCapacity, calcOperational, calcSOP, formatCurrency } from '@/lib/calculations';
import { KpiCard } from '@/components/ui/KpiCard';
import { ClientInfoForm } from '@/components/ClientInfoForm';

const WHY_ITEMS = [
  'Revenue Growth Opportunities',
  'Capacity Expansion',
  'Operational Efficiency',
  'SOP & Documentation Development',
  'Process Improvement',
  'Business Scalability',
];

const NAV_CARDS = [
  { id: 'revenue', label: 'Revenue Impact', desc: 'Model the value of additional sales', icon: TrendingUp, color: 'amber' },
  { id: 'capacity', label: 'Capacity Impact', desc: 'Understand operational constraints', icon: Layers, color: 'blue' },
  { id: 'sop', label: 'SOP & Docs', desc: 'Quantify documentation gaps', icon: FileText, color: 'purple' },
  { id: 'operational', label: 'Efficiency', desc: 'Surface hidden operational costs', icon: Settings, color: 'emerald' },
  { id: 'services', label: 'Service Bundle', desc: 'Explore Vellmont service options', icon: Package, color: 'orange' },
  { id: 'summary', label: 'Executive Summary', desc: 'Auto-generated consulting summary', icon: CheckCircle, color: 'teal' },
];

const NAV_COLORS: Record<string, string> = {
  amber: 'text-amber-400 bg-amber-400/8 border-amber-400/15 hover:border-amber-400/30',
  blue: 'text-blue-400 bg-blue-400/8 border-blue-400/15 hover:border-blue-400/30',
  purple: 'text-purple-400 bg-purple-400/8 border-purple-400/15 hover:border-purple-400/30',
  emerald: 'text-emerald-400 bg-emerald-400/8 border-emerald-400/15 hover:border-emerald-400/30',
  orange: 'text-orange-400 bg-orange-400/8 border-orange-400/15 hover:border-orange-400/30',
  teal: 'text-teal-400 bg-teal-400/8 border-teal-400/15 hover:border-teal-400/30',
};

export function OverviewTab() {
  const { data, setActiveTab } = useAssessment();
  const rev = calcRevenue(data.revenueInputs);
  const cap = calcCapacity(data.capacityInputs);
  const ops = calcOperational(data.operationalInputs);
  const sop = calcSOP(data.sopInputs);
  const selectedServices = Object.values(data.services).filter(s => s.selected);
  const totalInvestment = selectedServices.reduce((sum, s) => sum + s.investment, 0);

  return (
    <div className="space-y-6">
      <ClientInfoForm />

      {/* KPI Snapshot */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-amber-500/30 to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-500/70 px-2">Key Findings Snapshot</span>
          <div className="h-px flex-1 bg-gradient-to-l from-amber-500/30 to-transparent" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <KpiCard
            label="Current Monthly Revenue"
            value={formatCurrency(rev.currentRevenue)}
            sub={`${data.revenueInputs.currentMonthlySales} sales at ${formatCurrency(data.revenueInputs.revenuePerSale)} each`}
            variant="default"
            icon={<TrendingUp className="w-4 h-4" />}
            delay={0}
          />
          <KpiCard
            label="Revenue Scenario Opportunity"
            value={formatCurrency(rev.additionalRevenue)}
            sub={`+${data.revenueInputs.additionalSales} additional sales/month`}
            variant="amber"
            icon={<TrendingUp className="w-4 h-4" />}
            delay={0.05}
          />
          <KpiCard
            label="Capacity Utilization"
            value={`${cap.currentUtilization.toFixed(0)}%`}
            sub={`${data.capacityInputs.currentMonthlySales} of ${data.capacityInputs.currentMonthlyCapacity} units`}
            variant={cap.currentUtilization > 85 ? 'red' : 'default'}
            icon={<Layers className="w-4 h-4" />}
            delay={0.1}
          />
          <KpiCard
            label="Annual Operational Cost"
            value={formatCurrency(ops.annualOperationalCost)}
            sub={`${ops.monthlyHoursLost.toFixed(0)} hours lost per month`}
            variant="default"
            icon={<Settings className="w-4 h-4" />}
            delay={0.15}
          />
          <KpiCard
            label="Documentation Coverage"
            value={`${data.sopInputs.documentationCoverage}%`}
            sub={`${100 - data.sopInputs.documentationCoverage}% of processes undocumented`}
            variant={data.sopInputs.documentationCoverage < 50 ? 'red' : 'default'}
            icon={<FileText className="w-4 h-4" />}
            delay={0.2}
          />
          <KpiCard
            label="Selected Investment"
            value={selectedServices.length > 0 ? `${formatCurrency(totalInvestment)}/mo` : 'None selected'}
            sub={`${selectedServices.length} service${selectedServices.length !== 1 ? 's' : ''} selected`}
            variant={selectedServices.length > 0 ? 'emerald' : 'default'}
            icon={<Package className="w-4 h-4" />}
            delay={0.25}
          />
        </div>
      </div>

      {/* Navigation cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 px-2">Explore Impact Areas</span>
          <div className="h-px flex-1 bg-gradient-to-l from-slate-700 to-transparent" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {NAV_CARDS.map((card, i) => {
            const Icon = card.icon;
            const cls = NAV_COLORS[card.color];
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.3 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(card.id)}
                className={`flex flex-col items-start gap-2 p-4 rounded-2xl border transition-all duration-200 text-left group ${cls}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white leading-tight">{card.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed hidden sm:block">{card.desc}</p>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            );
          })}
        </div>
      </div>

      <WhyVellmont />
    </div>
  );
}

export function WhyVellmont() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="relative rounded-2xl border border-amber-500/15 overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-950 p-5"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-amber-500/[0.03] blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-amber-400/90">Why Clients Hire Vellmont</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {WHY_ITEMS.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 + 0.5 }}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-xs text-slate-300 font-medium">{item}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
