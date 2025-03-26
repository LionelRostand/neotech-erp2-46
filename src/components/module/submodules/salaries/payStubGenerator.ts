
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { employees } from '@/data/employees';
import { SalaryEmployee } from './hooks/useSalaries';

// Import any necessary fonts
import 'jspdf-autotable';

const COMPANY_INFO = {
  name: "STORM GROUP",
  tagline: "Enterprise Solutions",
  address: "123 Business Street, 75000 Paris",
  siret: "SIRET: 123 456 789 00012",
  phone: "+33 1 23 45 67 89",
  email: "contact@stormgroup.com",
  website: "www.stormgroup.com",
};

export const getEmployeeDetails = (employeeId: string) => {
  return employees.find(emp => emp.id === employeeId);
};

export const generatePayStubPDF = (employee: SalaryEmployee) => {
  try {
    console.log('Starting PDF generation for employee:', employee.name);
    
    // Create a new jsPDF instance
    const doc = new jsPDF();
    
    // Set up document basics
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    
    // Add company logo area
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 15, 55, 40, 'F');
    
    // Add logo placeholder
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text("STORM", 30, 35);
    doc.setFontSize(14);
    doc.text("GROUP", 47, 35);
    
    // Add company tagline
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(COMPANY_INFO.tagline, 42.5, 45, { align: "center" });
    
    // Add company information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(COMPANY_INFO.name, 195, 20, { align: "right" });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(COMPANY_INFO.address, 195, 28, { align: "right" });
    doc.text(COMPANY_INFO.siret, 195, 36, { align: "right" });
    doc.text(COMPANY_INFO.phone, 195, 44, { align: "right" });
    doc.text(COMPANY_INFO.email, 195, 52, { align: "right" });
    doc.text(COMPANY_INFO.website, 195, 60, { align: "right" });
    
    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 65, 195, 65);
    
    // Document title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text("BULLETIN DE PAIE", 105, 80, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Période: ${employee.paymentDate}`, 105, 90, { align: "center" });
    
    // Employee information section
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Informations Employé", 15, 105);
    
    doc.setFontSize(10);
    doc.text(`Nom: ${employee.name}`, 15, 115);
    doc.text(`Poste: ${employee.position}`, 15, 122);
    doc.text(`Département: ${employee.department}`, 15, 129);
    doc.text(`ID Employé: ${employee.employeeId || `EMP${employee.id.toString().padStart(3, '0')}`}`, 15, 136);
    
    const employeeDetails = employee.employeeId ? getEmployeeDetails(employee.employeeId) : null;
    let finalY = 143;
    
    if (employeeDetails) {
      doc.text(`Email: ${employeeDetails.email || 'Non spécifié'}`, 15, finalY);
      finalY += 7;
      doc.text(`Téléphone: ${employeeDetails.phone || 'Non spécifié'}`, 15, finalY);
      finalY += 7;
      doc.text(`Date d'embauche: ${employeeDetails.hireDate || 'Non spécifiée'}`, 15, finalY);
      finalY += 13;
    } else {
      finalY = 143;
    }
    
    // Compensation details section
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Détails de la Rémunération", 15, finalY);
    finalY += 5;
    
    // Manually create compensation table
    const compensationStartY = finalY;
    finalY += 10;
    
    // Table header
    doc.setFillColor(80, 80, 80);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.rect(15, compensationStartY, 90, 10, 'F');
    doc.rect(105, compensationStartY, 90, 10, 'F');
    doc.text('Description', 20, compensationStartY + 7);
    doc.text('Montant', 110, compensationStartY + 7);
    
    // Table rows
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    
    // Row 1
    doc.rect(15, finalY, 90, 10, 'S');
    doc.rect(105, finalY, 90, 10, 'S');
    doc.text('Salaire Brut Annuel', 20, finalY + 7);
    doc.text(`${employee.salary.toLocaleString('fr-FR')} €`, 110, finalY + 7);
    finalY += 10;
    
    // Row 2
    doc.rect(15, finalY, 90, 10, 'S');
    doc.rect(105, finalY, 90, 10, 'S');
    doc.text('Salaire Mensuel Brut', 20, finalY + 7);
    doc.text(`${(employee.salary / 12).toLocaleString('fr-FR')} €`, 110, finalY + 7);
    finalY += 10;
    
    // Row 3
    doc.rect(15, finalY, 90, 10, 'S');
    doc.rect(105, finalY, 90, 10, 'S');
    doc.text('Salaire Net Mensuel (Estimation)', 20, finalY + 7);
    doc.text(`${((employee.salary / 12) * 0.75).toLocaleString('fr-FR')} €`, 110, finalY + 7);
    finalY += 20;
    
    // Leave tracking section
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Suivi des Congés et RTT", 15, finalY);
    finalY += 5;
    
    // Create leave tracking table header
    const leaveStartY = finalY;
    doc.setFillColor(80, 80, 80);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.rect(15, leaveStartY, 45, 10, 'F');
    doc.rect(60, leaveStartY, 45, 10, 'F');
    doc.rect(105, leaveStartY, 45, 10, 'F');
    doc.rect(150, leaveStartY, 45, 10, 'F');
    doc.text('Type', 20, leaveStartY + 7);
    doc.text('Alloués', 65, leaveStartY + 7);
    doc.text('Pris', 110, leaveStartY + 7);
    doc.text('Restants', 155, leaveStartY + 7);
    finalY += 10;
    
    // Table rows
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    
    // Row 1 - Congés payés
    doc.rect(15, finalY, 45, 10, 'S');
    doc.rect(60, finalY, 45, 10, 'S');
    doc.rect(105, finalY, 45, 10, 'S');
    doc.rect(150, finalY, 45, 10, 'S');
    doc.text('Congés Payés', 20, finalY + 7);
    doc.text(`${employee.leaves.paid} jours`, 65, finalY + 7);
    doc.text(`${employee.leaves.taken} jours`, 110, finalY + 7);
    doc.text(`${employee.leaves.remaining} jours`, 155, finalY + 7);
    finalY += 10;
    
    // Row 2 - RTT
    doc.rect(15, finalY, 45, 10, 'S');
    doc.rect(60, finalY, 45, 10, 'S');
    doc.rect(105, finalY, 45, 10, 'S');
    doc.rect(150, finalY, 45, 10, 'S');
    doc.text('RTT', 20, finalY + 7);
    doc.text(`${employee.rtt.allocated} jours`, 65, finalY + 7);
    doc.text(`${employee.rtt.taken} jours`, 110, finalY + 7);
    doc.text(`${employee.rtt.remaining} jours`, 155, finalY + 7);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Ce document est confidentiel. Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 285, { align: "center" });
    
    // Save the PDF with a properly formatted filename
    const fileName = `bulletin_paie_${employee.name.replace(/\s+/g, '_')}_${employee.paymentDate.replace(/\//g, '-')}.pdf`;
    console.log('Saving PDF with filename:', fileName);
    doc.save(fileName);
    toast.success("Bulletin de paie téléchargé avec succès");
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    toast.error("Erreur lors de la génération du bulletin de paie");
  }
};
