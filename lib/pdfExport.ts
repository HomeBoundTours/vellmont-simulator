import type { AssessmentData } from '@/types';
import { calcRevenue, calcCapacity, calcSOP, calcOperational, formatCurrencyFull, formatPercent } from './calculations';

export async function generatePDF(data: AssessmentData): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210;
  const MARGIN = 18;
  const CONTENT_W = W - MARGIN * 2;
  let y = 0;

  const rev = calcRevenue(data.revenueInputs);
  const cap = calcCapacity(data.capacityInputs);
  const sop = calcSOP(data.sopInputs);
  const ops = calcOperational(data.operationalInputs);
  const selected = Object.values(data.services).filter(s => s.selected);
  const totalInvestment = selected.reduce((sum, s) => sum + s.investment, 0);

  const colors = {
    dark: [15, 23, 42] as [number, number, number],
    amber: [245, 158, 11] as [number, number, number],
    slate: [71, 85, 105] as [number, number, number],
    light: [241, 245, 249] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    emerald: [16, 185, 129] as [number, number, number],
    red: [239, 68, 68] as [number, number, number],
    blue: [59, 130, 246] as [number, number, number],
  };

  function addPage() {
    doc.addPage();
    y = MARGIN;
  }

  function checkPage(needed: number) {
    if (y + needed > 270) addPage();
  }

  // ── COVER PAGE ──────────────────────────────────────────────────
  doc.setFillColor(...colors.dark);
  doc.rect(0, 0, W, 297, 'F');

  // Amber accent bar
  doc.setFillColor(...colors.amber);
  doc.rect(0, 0, 6, 297, 'F');

  // Logo area
  doc.setFillColor(...colors.amber);
  doc.roundedRect(MARGIN, 50, 16, 16, 3, 3, 'F');
  doc.setTextColor(...colors.dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('V', MARGIN + 5.5, 61);

  doc.setTextColor(...colors.white);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Vellmont Consulting', MARGIN, 90);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 190, 200);
  doc.text('Business Impact Assessment', MARGIN, 100);

  // Divider
  doc.setDrawColor(...colors.amber);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, 110, W - MARGIN, 110);

  // Client info
  if (data.clientInfo.companyName || data.clientInfo.clientName) {
    doc.setTextColor(...colors.white);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.clientInfo.companyName || data.clientInfo.clientName, MARGIN, 125);
  }

  if (data.clientInfo.clientName && data.clientInfo.companyName) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 160, 175);
    doc.text(`Prepared for ${data.clientInfo.clientName}`, MARGIN, 133);
  }

  const dateStr = data.clientInfo.assessmentDate
    ? new Date(data.clientInfo.assessmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(dateStr, MARGIN, 141);
  if (data.clientInfo.industry) doc.text(data.clientInfo.industry, MARGIN, 148);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('This document is prepared for planning and modeling purposes only.', MARGIN, 280);
  doc.text('Vellmont Consulting does not guarantee specific outcomes.', MARGIN, 286);

  // ── PAGE 2: EXECUTIVE SUMMARY ──────────────────────────────────
  addPage();

  function sectionHeader(title: string) {
    checkPage(14);
    doc.setFillColor(...colors.amber);
    doc.rect(MARGIN, y, CONTENT_W, 7, 'F');
    doc.setTextColor(...colors.dark);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), MARGIN + 3, y + 5);
    y += 11;
  }

  function kpiRow(items: Array<{ label: string; value: string; color?: [number, number, number] }>) {
    checkPage(20);
    const w = CONTENT_W / items.length;
    items.forEach((item, i) => {
      const x = MARGIN + i * w;
      doc.setFillColor(28, 40, 60);
      doc.roundedRect(x, y, w - 2, 16, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text(item.label, x + 3, y + 5);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...(item.color || colors.white));
      doc.text(item.value, x + 3, y + 12);
    });
    y += 20;
  }

  function bodyText(text: string, indent = 0) {
    const lines = doc.splitTextToSize(text, CONTENT_W - indent);
    lines.forEach((line: string) => {
      checkPage(6);
      doc.text(line, MARGIN + indent, y);
      y += 5;
    });
  }

  function bulletPoint(text: string) {
    checkPage(6);
    doc.setFillColor(...colors.amber);
    doc.circle(MARGIN + 2, y - 1, 0.8, 'F');
    doc.text(text, MARGIN + 6, y);
    y += 5.5;
  }

  // Page header
  doc.setFillColor(...colors.dark);
  doc.rect(0, 0, W, 297, 'F');
  doc.setFillColor(...colors.amber);
  doc.rect(0, 0, 6, 297, 'F');

  y = MARGIN;
  doc.setTextColor(...colors.white);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', MARGIN, y);
  y += 8;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Business Impact Assessment · Vellmont Consulting', MARGIN, y);
  y += 10;

  sectionHeader('Assessment Overview');
  doc.setTextColor(180, 190, 200);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  bodyText('Based on the information entered, several opportunities may exist to improve business performance. The following observations are derived from user-provided assumptions and are intended for planning and modeling purposes only.');
  y += 3;

  sectionHeader('Revenue Modeling');
  kpiRow([
    { label: 'Current Monthly Revenue', value: formatCurrencyFull(rev.currentRevenue) },
    { label: 'Scenario Monthly Revenue', value: formatCurrencyFull(rev.scenarioRevenue), color: colors.amber },
    { label: 'Additional Revenue / Month', value: formatCurrencyFull(rev.additionalRevenue), color: colors.emerald },
    { label: 'Annualized Opportunity', value: formatCurrencyFull(rev.annualizedOpportunity), color: colors.emerald },
  ]);

  doc.setTextColor(180, 190, 200);
  doc.setFontSize(9);
  bulletPoint(`Average Revenue Per Sale: ${formatCurrencyFull(data.revenueInputs.revenuePerSale)}`);
  bulletPoint(`Current Monthly Sales: ${data.revenueInputs.currentMonthlySales} — Scenario: ${data.revenueInputs.currentMonthlySales + data.revenueInputs.additionalSales}`);
  bulletPoint(`Revenue Growth Scenario: +${rev.growthPercentage.toFixed(1)}%`);
  y += 4;

  sectionHeader('Capacity Analysis');
  kpiRow([
    { label: 'Current Utilization', value: formatPercent(cap.currentUtilization), color: cap.currentUtilization > 85 ? colors.red : colors.white },
    { label: 'Scenario Utilization', value: formatPercent(cap.futureUtilization), color: colors.blue },
    { label: 'Revenue Opportunity', value: formatCurrencyFull(cap.revenueOpportunity), color: colors.amber },
    { label: 'Annualized', value: formatCurrencyFull(cap.revenueOpportunity * 12), color: colors.amber },
  ]);

  sectionHeader('Operational Efficiency');
  kpiRow([
    { label: 'Monthly Hours Lost', value: `${ops.monthlyHoursLost.toFixed(0)} hrs` },
    { label: 'Monthly Labor Cost', value: formatCurrencyFull(ops.laborValueLost), color: colors.red },
    { label: 'Annual Operational Cost', value: formatCurrencyFull(ops.annualOperationalCost), color: colors.red },
    { label: 'Cost Per Employee', value: formatCurrencyFull(ops.annualOperationalCost / Math.max(1, data.operationalInputs.teamSize)) },
  ]);

  sectionHeader('Documentation & SOP Analysis');
  kpiRow([
    { label: 'Documentation Coverage', value: `${data.sopInputs.documentationCoverage}%` },
    { label: 'Annual Training Cost', value: formatCurrencyFull(sop.trainingTimeCost), color: colors.amber },
    { label: 'Management Time Cost', value: formatCurrencyFull(sop.managementTimeCost), color: colors.blue },
    { label: 'Documentation Gap Impact', value: formatCurrencyFull(sop.documentationGapImpact), color: colors.red },
  ]);

  if (selected.length > 0) {
    sectionHeader('Vellmont Consulting Services');
    doc.setTextColor(180, 190, 200);
    doc.setFontSize(9);
    selected.forEach(s => {
      checkPage(12);
      doc.setFillColor(28, 40, 60);
      doc.roundedRect(MARGIN, y, CONTENT_W, 10, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.white);
      doc.text(s.name, MARGIN + 3, y + 4);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.amber);
      doc.text(formatCurrencyFull(s.investment) + '/mo', W - MARGIN - 25, y + 4);
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7.5);
      doc.text(s.impactAreas.join(' · '), MARGIN + 3, y + 8.5);
      y += 13;
    });
    y += 2;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.white);
    doc.text(`Total Monthly Investment: ${formatCurrencyFull(totalInvestment)}/mo  ·  Annual: ${formatCurrencyFull(totalInvestment * 12)}`, MARGIN, y);
    y += 8;
  }

  if (data.clientInfo.notes) {
    sectionHeader('Session Notes');
    doc.setTextColor(180, 190, 200);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    bodyText(data.clientInfo.notes);
    y += 4;
  }

  // Disclaimer
  checkPage(25);
  doc.setFillColor(20, 30, 48);
  doc.roundedRect(MARGIN, y, CONTENT_W, 22, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('DISCLAIMER', MARGIN + 3, y + 5);
  doc.setFont('helvetica', 'normal');
  const disclaimer = 'All calculations are based on user-provided assumptions and are intended solely for planning and business modeling purposes. Vellmont Consulting does not guarantee specific financial or operational outcomes. Actual results depend on many factors outside the scope of this tool.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, CONTENT_W - 6);
  disclaimerLines.forEach((line: string, i: number) => {
    doc.text(line, MARGIN + 3, y + 10 + i * 4);
  });

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(50, 65, 85);
    doc.text(`Vellmont Consulting · Business Impact Assessment · Page ${i} of ${pageCount}`, MARGIN, 292);
  }

  const filename = [data.clientInfo.companyName || data.clientInfo.clientName || 'Assessment', 'Vellmont', dateStr].filter(Boolean).join(' - ').replace(/[^a-zA-Z0-9 -]/g, '') + '.pdf';
  doc.save(filename);
}
