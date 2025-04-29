
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { BadgeData } from '../BadgeTypes';
import { Employee } from '@/types/employee';

/**
 * Generates a PDF of the badge
 */
export const generateBadgePdf = (
  badge: BadgeData,
  employee: Employee | null,
  companyName: string
): jsPDF => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text("BADGE D'ACCÈS", 105, 20, { align: "center" });

  // Add company name
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text(companyName || "Entreprise", 105, 30, { align: "center" });

  // Add colored bar based on badge status
  doc.setFillColor(
    badge.status === "success" ? 46 : badge.status === "warning" ? 220 : 255,
    badge.status === "success" ? 204 : badge.status === "warning" ? 165 : 76,
    badge.status === "success" ? 113 : badge.status === "warning" ? 0 : 70
  );
  doc.rect(20, 35, 170, 5, "F");

  // Add badge info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  
  // Create a table with badge info
  const tableData = [
    ["Nom", badge.employeeName || "N/A"],
    ["Badge ID", badge.id || "N/A"],
    ["Département", badge.department || "N/A"],
    ["Niveau d'accès", badge.accessLevel || "N/A"],
    ["Statut", badge.statusText || "N/A"],
    ["Date de création", badge.date || "N/A"],
  ];
  
  if (employee) {
    tableData.push(
      ["Email", employee.email || "N/A"],
      ["Position", employee.position || "N/A"]
    );
  }
  
  // @ts-ignore - jspdf-autotable types are not properly defined
  doc.autoTable({
    startY: 45,
    head: [["Information", "Valeur"]],
    body: tableData,
    theme: "striped",
    headStyles: { 
      fillColor: [0, 123, 255],
      textColor: 255
    },
    styles: {
      overflow: "linebreak",
      cellWidth: "auto"
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 110 }
    },
    margin: { left: 20, right: 20 },
  });
  
  // Add footer with generation date
  const today = new Date().toLocaleDateString('fr-FR');
  const footerText = `Document généré le ${today}`;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(footerText, 105, doc.internal.pageSize.height - 10, { align: "center" });
  
  return doc;
};

/**
 * Get company name from employee data or badge
 */
export const getCompanyName = (employee: Employee | null): string => {
  if (employee?.company) return employee.company;
  return "Entreprise";
};
