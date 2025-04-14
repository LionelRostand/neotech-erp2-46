
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PaySlip } from '@/types/payslip';

export const generatePayslipPDF = (payslip: PaySlip): jsPDF => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(16);
  doc.text("BULLETIN DE PAIE", 105, 20, { align: "center" });
  
  // Employer information
  doc.setFontSize(12);
  doc.text(payslip.employerName, 20, 30);
  doc.text(payslip.employerAddress, 20, 35);
  doc.text(`SIRET: ${payslip.employerSiret}`, 20, 40);

  // Employee information
  doc.text("Informations salarié", 20, 55);
  doc.setFontSize(10);
  doc.text(`Nom: ${payslip.employee.lastName}`, 20, 60);
  doc.text(`Prénom: ${payslip.employee.firstName}`, 20, 65);
  doc.text(`Période: ${payslip.month} ${payslip.year}`, 20, 70);
  doc.text(`N° SS: ${payslip.employee.socialSecurityNumber}`, 20, 75);

  // Salary details
  const salaryData = payslip.details.map(detail => [
    detail.label,
    detail.base || '',
    detail.amount.toFixed(2) + ' €'
  ]);

  // @ts-ignore - jspdf-autotable types
  doc.autoTable({
    startY: 90,
    head: [['Description', 'Base', 'Montant']],
    body: salaryData,
    theme: 'grid',
    headStyles: { fillColor: [70, 78, 95] }
  });

  // Summary
  // @ts-ignore - jspdf-autotable types
  const finalY = doc.lastAutoTable.finalY || 200;
  
  doc.text(`Salaire brut: ${payslip.grossSalary.toFixed(2)} €`, 20, finalY + 10);
  doc.text(`Total des cotisations: ${payslip.totalDeductions.toFixed(2)} €`, 20, finalY + 20);
  doc.text(`Net à payer: ${payslip.netSalary.toFixed(2)} €`, 20, finalY + 30);

  return doc;
};
