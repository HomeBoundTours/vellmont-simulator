export interface ClientInfo {
  clientName: string;
  companyName: string;
  industry: string;
  assessmentDate: string;
  notes: string;
}

export interface RevenueInputs {
  revenuePerSale: number;
  currentMonthlySales: number;
  additionalSales: number;
  timePeriodMonths: number;
}

export interface CapacityInputs {
  currentMonthlyCapacity: number;
  currentMonthlySales: number;
  additionalCapacity: number;
  revenuePerSale: number;
}

export interface SOPInputs {
  employeeCount: number;
  avgOnboardingHours: number;
  managerHourlyValue: number;
  annualTurnoverRate: number;
  documentationCoverage: number;
}

export interface OperationalInputs {
  teamSize: number;
  avgHourlyLaborCost: number;
  hoursLostPerWeek: number;
  weeksPerMonth: number;
}

export type ServiceKey = 'salesGrowth' | 'operationalConsulting' | 'sopDevelopment';

export interface ServiceItem {
  key: ServiceKey;
  name: string;
  description: string;
  investment: number;
  impactAreas: string[];
  selected: boolean;
}

export interface AssessmentData {
  id?: string;
  clientInfo: ClientInfo;
  revenueInputs: RevenueInputs;
  capacityInputs: CapacityInputs;
  sopInputs: SOPInputs;
  operationalInputs: OperationalInputs;
  services: Record<ServiceKey, ServiceItem>;
  createdAt?: string;
  updatedAt?: string;
}

export interface RevenueCalculations {
  currentRevenue: number;
  scenarioRevenue: number;
  additionalRevenue: number;
  annualizedOpportunity: number;
  growthPercentage: number;
}

export interface CapacityCalculations {
  currentUtilization: number;
  futureUtilization: number;
  revenueOpportunity: number;
  capacityGap: number;
}

export interface SOPCalculations {
  trainingTimeCost: number;
  managementTimeCost: number;
  documentationGapImpact: number;
  totalAnnualImpact: number;
  documentedCoverage: number;
  undocumentedCoverage: number;
}

export interface OperationalCalculations {
  monthlyHoursLost: number;
  laborValueLost: number;
  annualOperationalCost: number;
  weeklyImpact: number;
}

export interface ServiceCalculations {
  selectedServices: ServiceItem[];
  totalInvestment: number;
  addressedAreas: string[];
}
