
// We need to import the necessary types
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PaySlip, PaySlipDetail } from '@/types/payslip';

// Define FontStyle and HAlignType to match the types from jspdf-autotable
type FontStyle = 'normal' | 'bold' | 'italic' | 'bolditalic';
type HAlignType = 'left' | 'center' | 'right' | 'justify';

// Update the generation function to use proper types
export const generatePayslipPdf = (payslip: PaySlip): jsPDF => {
  const doc = new jsPDF();
  
  // Format currency with spaces for thousands
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' €';
  };

  // Company header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(payslip.employerName || 'Entreprise', 14, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (payslip.employerAddress) {
    doc.text(payslip.employerAddress, 14, 25);
  }
  
  if (payslip.employerSiret) {
    doc.text(`SIRET: ${payslip.employerSiret}`, 14, 30);
  }
  
  // Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('BULLETIN DE PAIE', 105, 40, { align: 'center' });
  
  // Period
  doc.setFontSize(12);
  doc.text(`Période: ${payslip.period}`, 105, 48, { align: 'center' });
  
  // Employee info
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const yStart = 60;
  const employeeInfo = [
    [`Nom: ${payslip.employee.lastName}`, `Prénom: ${payslip.employee.firstName}`],
    [`Emploi: ${payslip.employee.role || 'Non spécifié'}`, `Date d'embauche: ${payslip.employee.startDate || 'Non spécifié'}`],
    [`N° SS: ${payslip.employee.socialSecurityNumber || 'Non spécifié'}`, `Heures travaillées: ${payslip.hoursWorked || '0'}`]
  ];
  
  let y = yStart;
  employeeInfo.forEach(row => {
    doc.text(row[0], 14, y);
    doc.text(row[1], 105, y);
    y += 7;
  });
  
  // Salary details section
  y += 10;
  
  // First, group details by type
  const earnings = payslip.details.filter(detail => detail.type === 'earning');
  const deductions = payslip.details.filter(detail => detail.type === 'deduction');
  
  // Create table header for earnings
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('RÉMUNÉRATIONS', 14, y);
  
  y += 10;
  
  // Earnings table
  const earningsTableHeaders = [
    [
      { content: 'Rubrique', styles: { fontStyle: 'bold' as FontStyle } },
      { content: 'Base', styles: { fontStyle: 'bold' as FontStyle } },
      { content: 'Taux', styles: { fontStyle: 'bold' as FontStyle } },
      { content: 'Montant', styles: { halign: 'right' as HAlignType } }
    ]
  ];
  
  const earningsData = earnings.map(detail => [
    detail.label,
    detail.base || '',
    detail.rate || '',
    { content: formatCurrency(detail.amount), styles: { halign: 'right' as HAlignType } }
  ]);
  
  // Add gross salary row
  earningsData.push([
    { content: 'SALAIRE BRUT', styles: { fontStyle: 'bold' as FontStyle } },
    '',
    '',
    { content: formatCurrency(payslip.grossSalary), styles: { halign: 'right' as HAlignType } }
  ]);
  
  // Use autoTable with proper types
  autoTable(doc, {
    startY: y,
    head: earningsTableHeaders,
    body: earningsData,
    theme: 'plain',
    styles: {
      fontSize: 10
    },
    columnStyles: {
      0: { cellWidth: 80 },
      3: { cellWidth: 30 }
    },
    margin: { left: 14, right: 14 }
  });
  
  y = (doc as any).lastAutoTable.finalY + 15;
  
  // Deductions table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('COTISATIONS ET CONTRIBUTIONS', 14, y);
  
  y += 10;
  
  const deductionsTableHeaders = [
    [
      { content: 'Rubrique', styles: { fontStyle: 'bold' as FontStyle } },
      { content: 'Base', styles: { fontStyle: 'bold' as FontStyle } },
      { content: 'Taux', styles: { fontStyle: 'bold' as FontStyle } },
      { content: 'Montant', styles: { halign: 'right' as HAlignType } }
    ]
  ];
  
  const deductionsData = deductions.map(detail => [
    detail.label,
    detail.base || '',
    detail.rate || '',
    { content: formatCurrency(detail.amount), styles: { halign: 'right' as HAlignType } }
  ]);
  
  // Add total deductions row
  deductionsData.push([
    { content: 'TOTAL DES COTISATIONS', styles: { fontStyle: 'bold' as FontStyle } },
    '',
    '',
    { content: formatCurrency(payslip.totalDeductions), styles: { halign: 'right' as HAlignType } }
  ]);
  
  autoTable(doc, {
    startY: y,
    head: deductionsTableHeaders,
    body: deductionsData,
    theme: 'plain',
    styles: {
      fontSize: 10
    },
    columnStyles: {
      0: { cellWidth: 80 },
      3: { cellWidth: 30 }
    },
    margin: { left: 14, right: 14 }
  });
  
  y = (doc as any).lastAutoTable.finalY + 15;
  
  // Net salary section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  
  // Create a table for the net salary display
  const netSalaryData = [
    [
      { content: 'SALAIRE NET À PAYER', styles: { fontStyle: 'bold' as FontStyle } },
      { content: formatCurrency(payslip.netSalary), styles: { fontStyle: 'bold' as FontStyle } }
    ]
  ];
  
  autoTable(doc, {
    startY: y,
    body: netSalaryData,
    theme: 'plain',
    styles: {
      fontSize: 12
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 80, halign: 'right' as HAlignType }
    },
    margin: { left: 14, right: 14 }
  });
  
  y = (doc as any).lastAutoTable.finalY + 15;
  
  // Leave balances if available
  if (payslip.conges || payslip.rtt) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SOLDE DES CONGÉS', 14, y);
    
    y += 10;
    
    const leaveBalanceHeaders = [
      [
        { content: 'Type', styles: { fontStyle: 'bold' as FontStyle } },
        { content: 'Acquis', styles: { fontStyle: 'bold' as FontStyle } },
        { content: 'Pris', styles: { fontStyle: 'bold' as FontStyle } },
        { content: 'Solde', styles: { fontStyle: 'bold' as FontStyle } }
      ]
    ];
    
    const leaveBalanceData = [];
    
    if (payslip.conges) {
      leaveBalanceData.push([
        'Congés payés',
        payslip.conges.acquired.toString(),
        payslip.conges.taken.toString(),
        payslip.conges.balance.toString()
      ]);
    }
    
    if (payslip.rtt) {
      leaveBalanceData.push([
        'RTT',
        payslip.rtt.acquired.toString(),
        payslip.rtt.taken.toString(),
        payslip.rtt.balance.toString()
      ]);
    }
    
    if (leaveBalanceData.length > 0) {
      autoTable(doc, {
        startY: y,
        head: leaveBalanceHeaders,
        body: leaveBalanceData,
        theme: 'plain',
        styles: {
          fontSize: 10
        },
        margin: { left: 14, right: 14 }
      });
      
      y = (doc as any).lastAutoTable.finalY + 15;
    }
  }
  
  // Payment details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date de paiement: ${payslip.paymentDate || 'Non spécifié'}`, 14, y);
  
  if (payslip.paymentMethod) {
    doc.text(`Mode de paiement: ${payslip.paymentMethod}`, 14, y + 5);
  }
  
  // Footer with page number
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} / ${pageCount}`, 195, 287, { align: 'right' as HAlignType });
    doc.text('Document à conserver sans limitation de durée', 14, 287);
  }
  
  return doc;
};
