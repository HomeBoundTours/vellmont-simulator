'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AssessmentData, ClientInfo, RevenueInputs, CapacityInputs, SOPInputs, OperationalInputs, ServiceKey } from '@/types';
import { DEFAULT_ASSESSMENT } from '@/lib/defaults';
import { saveAssessment, loadAssessment, listAssessments, deleteAssessment } from '@/lib/storage';

interface AssessmentContextType {
  data: AssessmentData;
  setClientInfo: (info: ClientInfo) => void;
  setRevenueInputs: (inputs: RevenueInputs) => void;
  setCapacityInputs: (inputs: CapacityInputs) => void;
  setSOPInputs: (inputs: SOPInputs) => void;
  setOperationalInputs: (inputs: OperationalInputs) => void;
  toggleService: (key: ServiceKey) => void;
  setServiceInvestment: (key: ServiceKey, amount: number) => void;
  save: () => Promise<string>;
  load: (id: string) => Promise<void>;
  loadList: () => Promise<AssessmentData[]>;
  remove: (id: string) => Promise<void>;
  reset: () => void;
  presentationMode: boolean;
  setPresentationMode: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AssessmentContext = createContext<AssessmentContextType | null>(null);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AssessmentData>(DEFAULT_ASSESSMENT);
  const [presentationMode, setPresentationMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const setClientInfo = useCallback((info: ClientInfo) => {
    setData(prev => ({ ...prev, clientInfo: info }));
  }, []);

  const setRevenueInputs = useCallback((inputs: RevenueInputs) => {
    setData(prev => ({ ...prev, revenueInputs: inputs }));
  }, []);

  const setCapacityInputs = useCallback((inputs: CapacityInputs) => {
    setData(prev => ({ ...prev, capacityInputs: inputs }));
  }, []);

  const setSOPInputs = useCallback((inputs: SOPInputs) => {
    setData(prev => ({ ...prev, sopInputs: inputs }));
  }, []);

  const setOperationalInputs = useCallback((inputs: OperationalInputs) => {
    setData(prev => ({ ...prev, operationalInputs: inputs }));
  }, []);

  const toggleService = useCallback((key: ServiceKey) => {
    setData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: { ...prev.services[key], selected: !prev.services[key].selected },
      },
    }));
  }, []);

  const setServiceInvestment = useCallback((key: ServiceKey, amount: number) => {
    setData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: { ...prev.services[key], investment: amount },
      },
    }));
  }, []);

  const save = useCallback(async () => {
    const id = await saveAssessment(data);
    setData(prev => ({ ...prev, id }));
    return id;
  }, [data]);

  const load = useCallback(async (id: string) => {
    const loaded = await loadAssessment(id);
    if (loaded) setData(loaded);
  }, []);

  const loadList = useCallback(() => listAssessments(), []);

  const remove = useCallback(async (id: string) => {
    await deleteAssessment(id);
  }, []);

  const reset = useCallback(() => {
    setData({ ...DEFAULT_ASSESSMENT, clientInfo: { ...DEFAULT_ASSESSMENT.clientInfo, assessmentDate: new Date().toISOString().split('T')[0] } });
  }, []);

  return (
    <AssessmentContext.Provider value={{
      data, setClientInfo, setRevenueInputs, setCapacityInputs,
      setSOPInputs, setOperationalInputs, toggleService, setServiceInvestment,
      save, load, loadList, remove, reset,
      presentationMode, setPresentationMode, activeTab, setActiveTab,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider');
  return ctx;
}
