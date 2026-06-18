'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, FileJson, FileSpreadsheet, Printer, Sparkles } from 'lucide-react';
import { useAssessment } from '@/context/AssessmentContext';
import { exportJSON, exportCSV } from '@/lib/exportUtils';

interface Props { open: boolean; onClose: () => void; }

export function ExportModal({ open, onClose }: Props) {
  const { data } = useAssessment();
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const handlePDF = async () => {
    setLoading('pdf');
    setDone(null);
    try {
      const { generatePDF } = await import('@/lib/pdfExport');
      await generatePDF(data);
      setDone('pdf');
    } catch (e) {
      console.error(e);
    }
    setLoading(null);
  };

  const options = [
    {
      id: 'pdf',
      icon: FileText,
      title: 'Download PDF Report',
      description: 'Professional branded consulting report — ideal for sharing with stakeholders.',
      action: handlePDF,
      primary: true,
      badge: 'Recommended',
    },
    {
      id: 'print',
      icon: Printer,
      title: 'Print / Save to PDF',
      description: "Opens browser print dialog. Choose 'Save as PDF' for a local copy.",
      action: () => window.print(),
      primary: false,
    },
    {
      id: 'json',
      icon: FileJson,
      title: 'Export JSON',
      description: 'Full assessment data — use for backup or future import.',
      action: () => { exportJSON(data); setDone('json'); },
      primary: false,
    },
    {
      id: 'csv',
      icon: FileSpreadsheet,
      title: 'Export CSV',
      description: 'Key metrics in spreadsheet format for further analysis.',
      action: () => { exportCSV(data); setDone('csv'); },
      primary: false,
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
            className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-slate-900 border border-slate-700/60 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
              <div>
                <h2 className="text-sm font-bold text-white">Export Assessment</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Generate your consulting deliverable</p>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-2.5">
              {options.map(opt => {
                const Icon = opt.icon;
                const isLoading = loading === opt.id;
                const isDone = done === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={opt.action}
                    disabled={isLoading}
                    className={`w-full flex items-start gap-3.5 p-4 rounded-xl border transition-all text-left group ${
                      opt.primary
                        ? 'bg-amber-500/8 border-amber-500/25 hover:border-amber-500/50 hover:bg-amber-500/12'
                        : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'
                    } disabled:opacity-60`}
                  >
                    <div className={`p-2 rounded-xl border flex-shrink-0 transition-all ${
                      opt.primary
                        ? 'bg-amber-500/12 text-amber-400 border-amber-500/20'
                        : 'bg-slate-700/50 text-slate-400 border-slate-700/50'
                    }`}>
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-bold leading-tight ${opt.primary ? 'text-amber-200' : 'text-white'}`}>
                          {isLoading ? 'Generating...' : isDone ? '✓ Downloaded!' : opt.title}
                        </p>
                        {opt.badge && !isLoading && !isDone && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-1.5 py-0.5 hidden sm:inline-flex">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{opt.description}</p>
                    </div>
                    <Download className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${opt.primary ? 'text-amber-400' : 'text-slate-500'}`} />
                  </motion.button>
                );
              })}

              <p className="text-[11px] text-slate-600 text-center pt-1">
                PDF reports include all analysis, charts, and Vellmont branding.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
