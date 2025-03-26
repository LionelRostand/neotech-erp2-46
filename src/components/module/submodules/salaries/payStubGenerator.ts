
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { employees } from '@/data/employees';
import { SalaryEmployee } from './hooks/useSalaries';

// Importation de jspdf-autotable
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
    
    console.log('jsPDF instance created:', typeof doc);
    console.log('autoTable availability:', typeof doc.autoTable);
    
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
    if (employeeDetails) {
      doc.text(`Email: ${employeeDetails.email || 'Non spécifié'}`, 15, 143);
      doc.text(`Téléphone: ${employeeDetails.phone || 'Non spécifié'}`, 15, 150);
      doc.text(`Date d'embauche: ${employeeDetails.hireDate || 'Non spécifiée'}`, 15, 157);
    }
    
    // Compensation details section
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Détails de la Rémunération", 15, employeeDetails ? 170 : 150);
    
    console.log('Preparing to create compensation table...');
    
    // Ajout manuel de la table de rémunération (sans utiliser autoTable)
    const startY = employeeDetails ? 175 : 155;
    
    // En-tête de tableau
    doc.setFillColor(80, 80, 80);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.rect(15, startY, 90, 10, 'F');
    doc.rect(105, startY, 90, 10, 'F');
    doc.text('Description', 20, startY + 7);
    doc.text('Montant', 110, startY + 7);
    
    // Lignes du tableau
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    
    // Ligne 1
    doc.rect(15, startY + 10, 90, 10, 'S');
    doc.rect(105, startY + 10, 90, 10, 'S');
    doc.text('Salaire Brut Annuel', 20, startY + 17);
    doc.text(`${employee.salary.toLocaleString('fr-FR')} €`, 110, startY + 17);
    
    // Ligne 2
    doc.rect(15, startY + 20, 90, 10, 'S');
    doc.rect(105, startY + 20, 90, 10, 'S');
    doc.text('Salaire Mensuel Brut', 20, startY + 27);
    doc.text(`${(employee.salary / 12).toLocaleString('fr-FR')} €`, 110, startY + 27);
    
    // Ligne 3
    doc.rect(15, startY + 30, 90, 10, 'S');
    doc.rect(105, startY + 30, 90, 10, 'S');
    doc.text('Salaire Net Mensuel (Estimation)', 20, startY + 37);
    doc.text(`${((employee.salary / 12) * 0.75).toLocaleString('fr-FR')} €`, 110, startY + 37);
    
    console.log('Compensation table created manually');
    
    // Position Y finale après le tableau de rémunération
    const finalY = startY + 50;
    
    console.log('finalY position:', finalY);
    
    // Leave tracking section
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("Suivi des Congés et RTT", 15, finalY);
    
    // En-tête du tableau de suivi des congés
    doc.setFillColor(80, 80, 80);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.rect(15, finalY + 5, 45, 10, 'F');
    doc.rect(60, finalY + 5, 45, 10, 'F');
    doc.rect(105, finalY + 5, 45, 10, 'F');
    doc.rect(150, finalY + 5, 45, 10, 'F');
    doc.text('Type', 20, finalY + 12);
    doc.text('Alloués', 65, finalY + 12);
    doc.text('Pris', 110, finalY + 12);
    doc.text('Restants', 155, finalY + 12);
    
    // Lignes du tableau de congés
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    
    // Ligne 1 - Congés payés
    doc.rect(15, finalY + 15, 45, 10, 'S');
    doc.rect(60, finalY + 15, 45, 10, 'S');
    doc.rect(105, finalY + 15, 45, 10, 'S');
    doc.rect(150, finalY + 15, 45, 10, 'S');
    doc.text('Congés Payés', 20, finalY + 22);
    doc.text(`${employee.leaves.paid} jours`, 65, finalY + 22);
    doc.text(`${employee.leaves.taken} jours`, 110, finalY + 22);
    doc.text(`${employee.leaves.remaining} jours`, 155, finalY + 22);
    
    // Ligne 2 - RTT
    doc.rect(15, finalY + 25, 45, 10, 'S');
    doc.rect(60, finalY + 25, 45, 10, 'S');
    doc.rect(105, finalY + 25, 45, 10, 'S');
    doc.rect(150, finalY + 25, 45, 10, 'S');
    doc.text('RTT', 20, finalY + 32);
    doc.text(`${employee.rtt.allocated} jours`, 65, finalY + 32);
    doc.text(`${employee.rtt.taken} jours`, 110, finalY + 32);
    doc.text(`${employee.rtt.remaining} jours`, 155, finalY + 32);
    
    console.log('Leave tracking table created manually');
    
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
