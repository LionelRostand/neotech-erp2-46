
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';
import { employees } from '@/data/employees';

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

export const generatePayStubPDF = (employee: any) => {
  const doc = new jsPDF();
  
  // Set up document basics
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  
  // Create a grey rectangle for the logo area
  doc.setFillColor(240, 240, 240);
  doc.rect(15, 15, 50, 30, 'F');
  
  // Add logo placeholder with styling
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text("LOGO", 40, 30, { align: "center" });
  doc.setFontSize(10);
  doc.text(COMPANY_INFO.name, 40, 37, { align: "center" });
  
  // Add company information on the right side
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text(COMPANY_INFO.name, 195, 20, { align: "right" });
  
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(COMPANY_INFO.tagline, 195, 27, { align: "right" });
  doc.text(COMPANY_INFO.address, 195, 34, { align: "right" });
  doc.text(COMPANY_INFO.siret, 195, 41, { align: "right" });
  doc.text(COMPANY_INFO.phone, 195, 48, { align: "right" });
  doc.text(COMPANY_INFO.email, 195, 55, { align: "right" });
  doc.text(COMPANY_INFO.website, 195, 62, { align: "right" });
  
  // Add separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, 65, 195, 65);
  
  // Document title
  doc.setFontSize(18);
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
  
  // Compensation table
  doc.autoTable({
    startY: employeeDetails ? 175 : 155,
    head: [['Description', 'Montant']],
    body: [
      ['Salaire Brut Annuel', `${employee.salary.toLocaleString('fr-FR')} €`],
      ['Salaire Mensuel Brut', `${(employee.salary / 12).toLocaleString('fr-FR')} €`],
      ['Salaire Net Mensuel (Estimation)', `${((employee.salary / 12) * 0.75).toLocaleString('fr-FR')} €`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [80, 80, 80] },
    margin: { left: 15, right: 15 }
  });
  
  const finalY = (doc as any).autoTable.previous?.finalY || 200;
  
  // Leave tracking section
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text("Suivi des Congés et RTT", 15, finalY + 15);
  
  // Leave tracking table
  doc.autoTable({
    startY: finalY + 20,
    head: [['Type', 'Alloués', 'Pris', 'Restants']],
    body: [
      ['Congés Payés', `${employee.leaves.paid} jours`, `${employee.leaves.taken} jours`, `${employee.leaves.remaining} jours`],
      ['RTT', `${employee.rtt.allocated} jours`, `${employee.rtt.taken} jours`, `${employee.rtt.remaining} jours`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [80, 80, 80] },
    margin: { left: 15, right: 15 }
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Ce document est confidentiel. Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 285, { align: "center" });
  
  // Save the PDF with a filename based on employee info
  doc.save(`bulletin_paie_${employee.name.replace(/\s+/g, '_')}_${employee.paymentDate.replace(/\//g, '-')}.pdf`);
  toast.success("Bulletin de paie téléchargé avec succès");
};
