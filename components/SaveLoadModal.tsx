'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, FolderOpen, Trash2, RefreshCw, Clock, Building2 } from 'lucide-react';
import { useAssessment } from '@/context/AssessmentContext';
import type { AssessmentData } from '@/types';

interface Props { open: boolean; onClose: () => void; }

export function SaveLoadModal({ open, onClose }: Props) {
  const { save, load, loadList, remove, reset, data } = useAssessment();
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (open) { loadList().then(setAssessments); setMsg(null); }
  }, [open, loadList]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await save();
      setMsg({ text: 'Assessment saved.', type: 'success' });
      loadList().then(setAssessments);
    } catch {
      setMsg({ text: 'Save failed. Please try again.', type: 'error' });
    }
    setSaving(false);
  };

  const handleLoad = async (id: string) => {
    await load(id);
    onClose();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await remove(id);
    setAssessments(prev => prev.filter(a => a.id !== id));
  };

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
            className="relative w-full sm:max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-slate-900 border border-slate-700/60 shadow-2xl overflow-hidden"
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
              <div>
                <h2 className="text-sm font-bold text-white">Assessments</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Save and manage client assessments</p>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {msg && (
                <div className={`text-xs rounded-xl px-3 py-2.5 font-medium ${msg.type === 'success' ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20' : 'text-red-300 bg-red-500/10 border border-red-500/20'}`}>
                  {msg.text}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Current Assessment'}
                </button>
                <button
                  onClick={() => { reset(); setMsg({ text: 'Reset to defaults.', type: 'success' }); }}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-sm transition-all border border-slate-700/50"
                  title="Reset to defaults"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-2.5">
                  Saved Assessments {assessments.length > 0 && `(${assessments.length})`}
                </p>
                {assessments.length === 0 ? (
                  <div className="text-center py-8 text-slate-600">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No saved assessments yet.</p>
                    <p className="text-[11px] mt-0.5">Save your current work above.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assessments.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')).map(a => (
                      <div
                        key={a.id}
                        onClick={() => handleLoad(a.id!)}
                        className="flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/30 rounded-xl p-3.5 cursor-pointer transition-all group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <Building2 className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            <p className="text-xs font-semibold text-white truncate">
                              {a.clientInfo.companyName || a.clientInfo.clientName || 'Untitled Assessment'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 pl-5">
                            <Clock className="w-2.5 h-2.5 text-slate-600" />
                            <p className="text-[10px] text-slate-500">
                              {a.updatedAt ? new Date(a.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                              {a.clientInfo.industry && ` · ${a.clientInfo.industry}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                          <span className="text-[10px] text-amber-400 font-medium hidden group-hover:inline-block">Load</span>
                          <button
                            onClick={(e) => handleDelete(a.id!, e)}
                            className="p-1 text-slate-600 hover:text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
