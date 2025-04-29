
import { jsPDF } from 'jspdf';
import { BadgeData } from '../BadgeTypes';
import { Employee } from '@/types/employee';

/**
 * Get company name from employee data
 */
export const getCompanyName = (employee: Employee | null): string => {
  if (!employee) return 'Non spécifiée';
  
  if (typeof employee.company === 'string') {
    return 'Neotech Consulting'; // Default company name
  }
  
  if (employee.company && typeof employee.company === 'object') {
    return employee.company.name || 'Neotech Consulting';
  }
  
  return 'Neotech Consulting';
};

/**
 * Generate PDF for badge
 */
export const generateBadgePdf = (
  badge: BadgeData, 
  employee: Employee | null, 
  companyName: string
): jsPDF => {
  // Create new PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a7' // Small card size
  });
  
  // Set up document
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  
  // Add Badge header with color
  if (badge.status === 'success') {
    doc.setFillColor(34, 197, 94); // green-500
  } else if (badge.status === 'warning') {
    doc.setFillColor(245, 158, 11); // amber-500
  } else {
    doc.setFillColor(239, 68, 68); // red-500
  }
  
  // Add colored header rectangle
  doc.rect(0, 0, 74, 5, 'F');
  
  // Add badge content
  doc.setFontSize(8);
  doc.text(`ID: ${badge.id}`, 37, 15, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(badge.employeeName || 'Employé', 37, 22, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Entreprise: ${companyName}`, 37, 28, { align: 'center' });
  
  // Add information
  doc.setFontSize(8);
  doc.text(`Département: ${badge.department || 'N/A'}`, 10, 38);
  doc.text(`Niveau d'accès: ${badge.accessLevel || 'Standard'}`, 10, 44);
  doc.text(`Statut: ${badge.statusText}`, 10, 50);
  doc.text(`Date d'émission: ${badge.date}`, 10, 56);
  
  // Add extra employee info if available
  if (employee) {
    doc.line(10, 62, 64, 62);
    doc.text('Informations supplémentaires:', 10, 68);
    doc.text(`Email: ${employee.professionalEmail || employee.email || 'Non spécifié'}`, 10, 74);
    doc.text(`Poste: ${employee.position || employee.title || 'Non spécifié'}`, 10, 80);
  }
  
  return doc;
};
