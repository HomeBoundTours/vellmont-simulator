import type { AssessmentData } from '@/types';
import { calcRevenue, calcCapacity, calcSOP, calcOperational } from './calculations';

export function exportJSON(data: AssessmentData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.clientInfo.companyName || 'assessment'}-vellmont.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCSV(data: AssessmentData): void {
  const rev = calcRevenue(data.revenueInputs);
  const cap = calcCapacity(data.capacityInputs);
  const sop = calcSOP(data.sopInputs);
  const ops = calcOperational(data.operationalInputs);

  const rows = [
    ['Category', 'Metric', 'Value'],
    ['Client', 'Name', data.clientInfo.clientName],
    ['Client', 'Company', data.clientInfo.companyName],
    ['Client', 'Industry', data.clientInfo.industry],
    ['Client', 'Date', data.clientInfo.assessmentDate],
    ['Revenue', 'Revenue Per Sale', data.revenueInputs.revenuePerSale],
    ['Revenue', 'Current Monthly Sales', data.revenueInputs.currentMonthlySales],
    ['Revenue', 'Additional Sales Scenario', data.revenueInputs.additionalSales],
    ['Revenue', 'Current Monthly Revenue', rev.currentRevenue],
    ['Revenue', 'Scenario Monthly Revenue', rev.scenarioRevenue],
    ['Revenue', 'Additional Revenue', rev.additionalRevenue],
    ['Revenue', 'Annualized Opportunity', rev.annualizedOpportunity],
    ['Capacity', 'Current Capacity', data.capacityInputs.currentMonthlyCapacity],
    ['Capacity', 'Current Utilization %', cap.currentUtilization.toFixed(1)],
    ['Capacity', 'Additional Capacity Scenario', data.capacityInputs.additionalCapacity],
    ['Capacity', 'Revenue Opportunity', cap.revenueOpportunity],
    ['Operational', 'Team Size', data.operationalInputs.teamSize],
    ['Operational', 'Monthly Hours Lost', ops.monthlyHoursLost],
    ['Operational', 'Monthly Labor Cost', ops.laborValueLost],
    ['Operational', 'Annual Cost', ops.annualOperationalCost],
    ['SOP', 'Employee Count', data.sopInputs.employeeCount],
    ['SOP', 'Documentation Coverage %', data.sopInputs.documentationCoverage],
    ['SOP', 'Annual Training Cost', sop.trainingTimeCost],
    ['SOP', 'Documentation Gap Impact', sop.documentationGapImpact],
  ];

  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.clientInfo.companyName || 'assessment'}-vellmont.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
