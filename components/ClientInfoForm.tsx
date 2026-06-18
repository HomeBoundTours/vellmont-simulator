'use client';

import { motion } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import { INDUSTRIES } from '@/lib/defaults';
import { User, Building2, Briefcase, Calendar, FileText } from 'lucide-react';

export function ClientInfoForm() {
  const { data, setClientInfo } = useAssessment();
  const { clientInfo } = data;

  const update = (field: keyof typeof clientInfo, value: string) => {
    setClientInfo({ ...clientInfo, [field]: value });
  };

  const inputCls = 'w-full bg-slate-900 border border-slate-700/70 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 focus:shadow-[0_0_0_1px_rgba(245,158,11,0.2)] transition-all duration-200 font-medium';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-2xl border border-amber-500/15 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="px-5 pt-5 pb-4 border-b border-slate-800/60 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <User className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-amber-400/90">Client Information</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Assessment details for the consulting report</p>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <User className="w-3 h-3" /> Client Name
            </label>
            <input className={inputCls} placeholder="Jane Smith" value={clientInfo.clientName} onChange={e => update('clientName', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Building2 className="w-3 h-3" /> Company Name
            </label>
            <input className={inputCls} placeholder="Acme Corporation" value={clientInfo.companyName} onChange={e => update('companyName', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Briefcase className="w-3 h-3" /> Industry
            </label>
            <select className={inputCls} value={clientInfo.industry} onChange={e => update('industry', e.target.value)}>
              <option value="">Select Industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Calendar className="w-3 h-3" /> Assessment Date
            </label>
            <input type="date" className={inputCls} value={clientInfo.assessmentDate} onChange={e => update('assessmentDate', e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <FileText className="w-3 h-3" /> Session Notes
            </label>
            <textarea
              className={inputCls + ' resize-none leading-relaxed'}
              rows={2}
              placeholder="Key observations, discussion points, follow-up items..."
              value={clientInfo.notes}
              onChange={e => update('notes', e.target.value)}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
