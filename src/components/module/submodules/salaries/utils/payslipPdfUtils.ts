
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PaySlip } from '@/types/payslip';

// Ajout des types pour jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

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
  const salaryData = payslip.details.map(detail => {
    // Vérifier si amount est un nombre avant d'appliquer toFixed
    const formattedAmount = typeof detail.amount === 'number'
      ? detail.amount.toFixed(2) + ' €'
      : detail.amount + ' €';
    
    return [
      detail.label,
      detail.base || '',
      formattedAmount
    ];
  });

  // Ajouter le tableau des détails de salaire
  doc.autoTable({
    startY: 90,
    head: [['Description', 'Base', 'Montant']],
    body: salaryData,
    theme: 'grid',
    headStyles: { fillColor: [70, 78, 95] }
  });

  // Summary
  const finalY = doc.lastAutoTable.finalY || 200;
  
  // Vérification que grossSalary est un nombre
  const grossSalary = typeof payslip.grossSalary === 'number' 
    ? payslip.grossSalary.toFixed(2) 
    : payslip.grossSalary;
  
  // Vérification que totalDeductions est un nombre
  const totalDeductions = typeof payslip.totalDeductions === 'number' 
    ? payslip.totalDeductions.toFixed(2) 
    : payslip.totalDeductions;
  
  // Vérification que netSalary est un nombre
  const netSalary = typeof payslip.netSalary === 'number' 
    ? payslip.netSalary.toFixed(2) 
    : payslip.netSalary;
  
  doc.text(`Salaire brut: ${grossSalary} €`, 20, finalY + 10);
  doc.text(`Total des cotisations: ${totalDeductions} €`, 20, finalY + 20);
  doc.text(`Net à payer: ${netSalary} €`, 20, finalY + 30);

  return doc;
};
