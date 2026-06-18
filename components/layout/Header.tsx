'use client';

import { motion } from 'framer-motion';
import { Maximize2, Minimize2, Save, FolderOpen, Download, Sparkles } from 'lucide-react';
import { useAssessment } from '@/context/AssessmentContext';
import { SaveLoadModal } from '@/components/SaveLoadModal';
import { ExportModal } from '@/components/ExportModal';
import { useState } from 'react';

export function Header() {
  const { presentationMode, setPresentationMode, data } = useAssessment();
  const [saveOpen, setSaveOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-white/[0.04]">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 min-w-0 flex-shrink-0"
          >
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 flex-shrink-0">
              <span className="text-slate-950 font-black text-sm tracking-tight">V</span>
            </div>
            <div className="min-w-0 hidden xs:block">
              <p className="text-white font-semibold text-sm leading-none tracking-tight">Vellmont Consulting</p>
              <p className="text-slate-500 text-[10px] leading-none mt-[3px] font-medium tracking-wide uppercase hidden sm:block">
                Business Impact Simulator
              </p>
            </div>
          </motion.div>

          {/* Client chip */}
          {data.clientInfo.companyName && !presentationMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden md:flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-full px-3.5 py-1.5 min-w-0 max-w-xs"
            >
              <div className="relative flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
              </div>
              <span className="text-xs text-slate-300 font-medium truncate">{data.clientInfo.companyName}</span>
              {data.clientInfo.industry && (
                <span className="text-[10px] text-slate-500 flex-shrink-0 hidden lg:block">· {data.clientInfo.industry}</span>
              )}
            </motion.div>
          )}

          {/* Presentation mode banner */}
          {presentationMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden sm:flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-semibold text-amber-300 tracking-wide">Presentation Mode</span>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1"
          >
            {!presentationMode && (
              <>
                <button
                  onClick={() => setSaveOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-lg transition-all duration-150"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save</span>
                </button>
                <button
                  onClick={() => setSaveOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-lg transition-all duration-150"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Load</span>
                </button>
                <button
                  onClick={() => setExportOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-all duration-150 shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </>
            )}
            <button
              onClick={() => setPresentationMode(!presentationMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ml-1 ${
                presentationMode
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
              title={presentationMode ? 'Exit Presentation' : 'Presentation Mode'}
            >
              {presentationMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{presentationMode ? 'Exit' : 'Present'}</span>
            </button>
          </motion.div>
        </div>
      </header>

      <SaveLoadModal open={saveOpen} onClose={() => setSaveOpen(false)} />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
    </>
  );
}
