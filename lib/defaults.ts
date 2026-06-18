import type { AssessmentData } from '@/types';

export const DEFAULT_ASSESSMENT: AssessmentData = {
  clientInfo: {
    clientName: '',
    companyName: '',
    industry: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    notes: '',
  },
  revenueInputs: {
    revenuePerSale: 5000,
    currentMonthlySales: 10,
    additionalSales: 5,
    timePeriodMonths: 12,
  },
  capacityInputs: {
    currentMonthlyCapacity: 15,
    currentMonthlySales: 10,
    additionalCapacity: 10,
    revenuePerSale: 5000,
  },
  sopInputs: {
    employeeCount: 10,
    avgOnboardingHours: 40,
    managerHourlyValue: 75,
    annualTurnoverRate: 20,
    documentationCoverage: 40,
  },
  operationalInputs: {
    teamSize: 8,
    avgHourlyLaborCost: 45,
    hoursLostPerWeek: 5,
    weeksPerMonth: 4,
  },
  services: {
    salesGrowth: {
      key: 'salesGrowth',
      name: 'Sales Growth Consulting',
      description: 'Strategic revenue growth planning, sales process optimization, and pipeline development.',
      investment: 3500,
      impactAreas: ['Revenue Growth', 'Pipeline Development', 'Sales Process', 'Conversion Optimization'],
      selected: true,
    },
    operationalConsulting: {
      key: 'operationalConsulting',
      name: 'Operational Consulting',
      description: 'Operational systems improvement, workflow optimization, and capacity planning.',
      investment: 3500,
      impactAreas: ['Operational Efficiency', 'Capacity Constraints', 'Workflow Optimization', 'Cost Reduction'],
      selected: false,
    },
    sopDevelopment: {
      key: 'sopDevelopment',
      name: 'SOP Development',
      description: 'Process documentation, standard operating procedures, and scalable systems creation.',
      investment: 2500,
      impactAreas: ['Documentation Gaps', 'Scalability', 'Training Consistency', 'Knowledge Transfer'],
      selected: false,
    },
  },
};

export const INDUSTRIES = [
  'Professional Services',
  'Consulting',
  'Healthcare',
  'Technology',
  'Construction & Trades',
  'Real Estate',
  'Financial Services',
  'Legal Services',
  'Marketing & Advertising',
  'Manufacturing',
  'Retail',
  'Hospitality & Food Service',
  'Education & Training',
  'Logistics & Distribution',
  'Other',
];
