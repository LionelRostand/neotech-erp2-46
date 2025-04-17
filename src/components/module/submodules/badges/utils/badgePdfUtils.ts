
import { jsPDF } from 'jspdf';
import { BadgeData } from '../BadgeTypes';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';

/**
 * Génère un PDF pour un badge d'employé
 */
export const generateBadgePdf = (
  badge: BadgeData,
  employee: Employee | null,
  companyName: string
): jsPDF => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85, 54]
  });
  
  // Fond du badge
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, 85, 54, 'F');
  
  // Couleur de l'entête selon le statut
  let headerColor;
  if (badge.status === 'success') {
    headerColor = [34, 197, 94];
  } else if (badge.status === 'warning') {
    headerColor = [234, 179, 8];
  } else {
    headerColor = [239, 68, 68];
  }
  doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
  doc.rect(0, 0, 85, 12, 'F');
  
  // Entête avec nom de l'entreprise
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName.toUpperCase(), 5, 7);
  
  // ID du badge
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.text(`ID: ${badge.id}`, 42.5, 18, { align: 'center' });
  
  // Nom de l'employé
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(badge.employeeName, 42.5, 25, { align: 'center' });
  
  // Département et niveau d'accès
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Département: ${badge.department || 'N/A'}`, 42.5, 31, { align: 'center' });
  doc.text(`Accès: ${badge.accessLevel || 'Standard'}`, 42.5, 36, { align: 'center' });
  
  // Statut du badge
  let statusColor;
  if (badge.status === 'success') {
    statusColor = [34, 197, 94];
  } else if (badge.status === 'warning') {
    statusColor = [234, 179, 8];
  } else {
    statusColor = [239, 68, 68];
  }
  
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(`Statut: ${badge.statusText}`, 42.5, 41, { align: 'center' });
  
  // Email professionnel
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text(`Email: ${employee?.professionalEmail || 'N/A'}`, 42.5, 46, { align: 'center' });
  
  // Pied de page
  doc.setFillColor(70, 70, 70);
  doc.rect(0, 50, 85, 4, 'F');
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.text('Ce badge doit être porté visiblement à tout moment', 42.5, 52.5, { align: 'center' });
  
  // QR code (simulé)
  doc.setFillColor(0, 0, 0);
  doc.rect(5, 36, 10, 10, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(6, 37, 8, 8, 'F');
  doc.setFillColor(0, 0, 0);
  doc.rect(7, 38, 6, 6, 'F');
  
  return doc;
};

/**
 * Extrait le nom de l'entreprise d'un employé
 */
export const getCompanyName = (employee: Employee | null): string => {
  if (!employee) return "Enterprise";
  
  if (!employee.company) return "Enterprise";
  
  if (typeof employee.company === 'string') {
    return employee.company;
  }
  
  const companyObj = employee.company as Company;
  return companyObj.name || "Enterprise";
};
