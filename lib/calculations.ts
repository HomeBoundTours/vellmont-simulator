import type {
  RevenueInputs,
  CapacityInputs,
  SOPInputs,
  OperationalInputs,
  RevenueCalculations,
  CapacityCalculations,
  SOPCalculations,
  OperationalCalculations,
} from '@/types';

export function calcRevenue(inputs: RevenueInputs): RevenueCalculations {
  const { revenuePerSale, currentMonthlySales, additionalSales } = inputs;
  const currentRevenue = revenuePerSale * currentMonthlySales;
  const scenarioRevenue = revenuePerSale * (currentMonthlySales + additionalSales);
  const additionalRevenue = scenarioRevenue - currentRevenue;
  const annualizedOpportunity = additionalRevenue * 12;
  const growthPercentage = currentRevenue > 0 ? (additionalRevenue / currentRevenue) * 100 : 0;
  return { currentRevenue, scenarioRevenue, additionalRevenue, annualizedOpportunity, growthPercentage };
}

export function calcCapacity(inputs: CapacityInputs): CapacityCalculations {
  const { currentMonthlyCapacity, currentMonthlySales, additionalCapacity, revenuePerSale } = inputs;
  const currentUtilization = currentMonthlyCapacity > 0 ? (currentMonthlySales / currentMonthlyCapacity) * 100 : 0;
  const futureCapacity = currentMonthlyCapacity + additionalCapacity;
  const futureUtilization = futureCapacity > 0 ? (currentMonthlySales / futureCapacity) * 100 : 0;
  const revenueOpportunity = additionalCapacity * revenuePerSale;
  const capacityGap = Math.max(0, currentMonthlySales - currentMonthlyCapacity);
  return { currentUtilization, futureUtilization, revenueOpportunity, capacityGap };
}

export function calcSOP(inputs: SOPInputs): SOPCalculations {
  const { employeeCount, avgOnboardingHours, managerHourlyValue, annualTurnoverRate, documentationCoverage } = inputs;
  const annualTurnover = Math.round(employeeCount * (annualTurnoverRate / 100));
  const trainingTimeCost = annualTurnover * avgOnboardingHours * managerHourlyValue;
  const managementTimeCost = employeeCount * 2 * managerHourlyValue * 12;
  const undocumented = (100 - documentationCoverage) / 100;
  const documentationGapImpact = (trainingTimeCost + managementTimeCost) * undocumented;
  const totalAnnualImpact = trainingTimeCost + managementTimeCost;
  return {
    trainingTimeCost,
    managementTimeCost,
    documentationGapImpact,
    totalAnnualImpact,
    documentedCoverage: documentationCoverage,
    undocumentedCoverage: 100 - documentationCoverage,
  };
}

export function calcOperational(inputs: OperationalInputs): OperationalCalculations {
  const { teamSize, avgHourlyLaborCost, hoursLostPerWeek, weeksPerMonth } = inputs;
  const monthlyHoursLost = teamSize * hoursLostPerWeek * weeksPerMonth;
  const laborValueLost = monthlyHoursLost * avgHourlyLaborCost;
  const annualOperationalCost = laborValueLost * 12;
  const weeklyImpact = teamSize * hoursLostPerWeek * avgHourlyLaborCost;
  return { monthlyHoursLost, laborValueLost, annualOperationalCost, weeklyImpact };
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function buildRevenueChartData(inputs: RevenueInputs) {
  const months = inputs.timePeriodMonths;
  const monthly = inputs.revenuePerSale * inputs.additionalSales;
  return Array.from({ length: months }, (_, i) => ({
    month: `M${i + 1}`,
    current: inputs.revenuePerSale * inputs.currentMonthlySales,
    scenario: inputs.revenuePerSale * (inputs.currentMonthlySales + inputs.additionalSales),
    cumulative: monthly * (i + 1),
  }));
}
