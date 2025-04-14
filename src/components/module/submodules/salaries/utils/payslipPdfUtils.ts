
import { jsPDF } from 'jspdf';
// Importer jspdf-autotable correctement
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
  try {
    // Créer une instance de jsPDF
    const doc = new jsPDF();

    // Vérifier que autoTable est disponible
    if (typeof doc.autoTable !== 'function') {
      console.error('autoTable function is not available on jsPDF instance');
      // Utiliser une méthode alternative pour générer le PDF sans autoTable
      return generateSimplePDF(payslip);
    }

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
    const finalY = doc.lastAutoTable ? (doc.lastAutoTable.finalY || 200) : 200;
    
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
  } catch (error) {
    console.error('Erreur dans generatePayslipPDF:', error);
    // En cas d'erreur, utiliser la méthode de secours
    return generateSimplePDF(payslip);
  }
};

// Méthode alternative pour générer un PDF simple sans utiliser autoTable
const generateSimplePDF = (payslip: PaySlip): jsPDF => {
  const doc = new jsPDF();
  
  // Header
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

  // Salary details - simple text instead of table
  doc.text("Détails de la paie:", 20, 90);
  
  let yPosition = 100;
  const lineHeight = 7;
  
  // Afficher les détails sans utiliser autoTable
  payslip.details.forEach(detail => {
    const formattedAmount = typeof detail.amount === 'number'
      ? detail.amount.toFixed(2) + ' €'
      : detail.amount + ' €';
    
    doc.text(`${detail.label}: ${formattedAmount}`, 20, yPosition);
    yPosition += lineHeight;
  });
  
  // Summary
  yPosition += 10;
  
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
  
  doc.text(`Salaire brut: ${grossSalary} €`, 20, yPosition);
  doc.text(`Total des cotisations: ${totalDeductions} €`, 20, yPosition + 10);
  doc.text(`Net à payer: ${netSalary} €`, 20, yPosition + 20);

  return doc;
};
