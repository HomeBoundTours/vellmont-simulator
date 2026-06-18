'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AssessmentProvider, useAssessment } from '@/context/AssessmentContext';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { OverviewTab } from '@/components/tabs/OverviewTab';
import { RevenueImpactTab } from '@/components/tabs/RevenueImpactTab';
import { CapacityImpactTab } from '@/components/tabs/CapacityImpactTab';
import { SOPTab } from '@/components/tabs/SOPTab';
import { OperationalTab } from '@/components/tabs/OperationalTab';
import { ServicesTab } from '@/components/tabs/ServicesTab';
import { ExecutiveSummaryTab } from '@/components/tabs/ExecutiveSummaryTab';

const TABS: Record<string, React.ReactNode> = {
  overview: <OverviewTab />,
  revenue: <RevenueImpactTab />,
  capacity: <CapacityImpactTab />,
  sop: <SOPTab />,
  operational: <OperationalTab />,
  services: <ServicesTab />,
  summary: <ExecutiveSummaryTab />,
};

function TabContent() {
  const { activeTab, presentationMode } = useAssessment();
  return (
    <main className={`max-w-7xl mx-auto px-4 sm:px-6 w-full ${presentationMode ? 'py-4' : 'py-6'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {TABS[activeTab] ?? <OverviewTab />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export function SimulatorApp() {
  return (
    <AssessmentProvider>
      <ServiceWorkerRegistration />
      <div className="min-h-screen bg-[#020817] flex flex-col">
        {/* Ambient background glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-amber-500/[0.03] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-blue-500/[0.02] blur-3xl" />
        </div>

        <Header />
        <Navigation />
        <TabContent />

        <footer className="mt-auto border-t border-slate-900/80 py-4 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-[10px] text-slate-700 text-center leading-relaxed">
              All calculations are based on user-provided assumptions and are intended solely for planning and business modeling purposes.
              Vellmont Consulting does not guarantee specific financial or operational outcomes.
            </p>
          </div>
        </footer>
      </div>
    </AssessmentProvider>
  );
}
