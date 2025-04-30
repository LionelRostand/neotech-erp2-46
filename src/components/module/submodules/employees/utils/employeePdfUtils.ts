
import { jsPDF } from 'jspdf';
import { Employee } from '@/types/employee';
import autoTable from 'jspdf-autotable';

/**
 * Generates a PDF document containing an employee's profile information
 * @param employee The employee data
 * @returns jsPDF document instance
 */
export const generateEmployeePdf = (employee: Employee): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(18);
  doc.text(`Fiche employé : ${employee.firstName} ${employee.lastName}`, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  const today = new Date();
  doc.text(`Exporté le: ${today.toLocaleDateString('fr-FR')}`, 14, 30);
  
  // Add photo if available
  if (employee.photo || employee.photoURL || (employee.photoMeta && employee.photoMeta.data)) {
    try {
      const photoData = employee.photo || employee.photoURL || employee.photoMeta?.data;
      if (photoData) {
        // Draw border around photo
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.rect(14, 35, 40, 40);
        
        // Add photo
        doc.addImage(photoData, 'JPEG', 14, 35, 40, 40);
      }
    } catch (error) {
      console.error("Error adding image to PDF:", error);
      // On error, just continue without the image
    }
  }
  
  // Add status badge
  doc.setFillColor(employee.status === 'active' || employee.status === 'Actif' ? 39 : 150, 
                  employee.status === 'active' || employee.status === 'Actif' ? 174 : 150, 
                  employee.status === 'active' || employee.status === 'Actif' ? 96 : 150);
  doc.roundedRect(60, 35, 30, 10, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(getStatusLabel(employee.status), 62, 41);
  doc.setTextColor(0, 0, 0);
  
  // Add position/company if available
  if (employee.position) {
    doc.setFontSize(12);
    let company = '';
    if (typeof employee.company === 'string') {
      company = employee.company !== 'no_company' ? employee.company : '';
    } else if (employee.company && typeof employee.company === 'object') {
      company = employee.company.name || '';
    }
    
    const positionText = company ? `${employee.position} @ ${company}` : employee.position;
    doc.text(positionText, 60, 55);
  }
  
  // Informations personnelles section
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("Informations personnelles", 14, 90);
  doc.setFont(undefined, 'normal');
  
  // Format personal data
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return dateString;
    }
  };
  
  // Personal info table
  autoTable(doc, {
    startY: 95,
    head: [['Champ', 'Valeur']],
    body: [
      ['Prénom', employee.firstName || '-'],
      ['Nom', employee.lastName || '-'],
      ['Date de naissance', formatDate(employee.birthDate)],
      ['Email personnel', employee.email || '-'],
      ['Téléphone', employee.phone || '-'],
      ['Adresse', getFormattedAddress(employee)],
      ['Ville', employee.city || '-'],
      ['Code postal', employee.zipCode || employee.postalCode || '-'],
      ['Pays', employee.country || '-'],
    ],
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255
    },
    theme: 'grid'
  });
  
  // Informations professionnelles section
  const professionalTableY = doc.previousAutoTable?.finalY || 140;
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text("Informations professionnelles", 14, professionalTableY + 15);
  doc.setFont(undefined, 'normal');
  
  // Format work address
  const workAddress = typeof employee.workAddress === 'object' && employee.workAddress
    ? `${employee.workAddress.street || ''}, ${employee.workAddress.city || ''}, ${employee.workAddress.postalCode || ''}`
    : '-';
  
  // Get department name
  let departmentName = employee.department || '-';
  if (departmentName === 'no_department') {
    departmentName = 'Non assigné';
  }
  
  // Professional info table
  autoTable(doc, {
    startY: professionalTableY + 20,
    head: [['Champ', 'Valeur']],
    body: [
      ['Poste', employee.position || '-'],
      ['Département', departmentName],
      ['Date d\'embauche', formatDate(employee.hireDate)],
      ['Email professionnel', employee.professionalEmail || '-'],
      ['Statut', getStatusLabel(employee.status)],
      ['Type de contrat', employee.contract || '-'],
      ['Adresse professionnelle', workAddress],
    ],
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255
    },
    theme: 'grid'
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text('© ' + new Date().getFullYear() + ' - Système de gestion des ressources humaines', pageWidth / 2, 285, { align: 'center' });
    doc.text(`Page ${i} sur ${pageCount}`, pageWidth - 20, 285);
  }
  
  return doc;
};

// Helper function to get formatted address
const getFormattedAddress = (employee: Employee): string => {
  if (typeof employee.address === 'object' && employee.address) {
    return `${employee.address.street || ''}, ${employee.address.city || ''}, ${employee.address.postalCode || ''}`;
  }
  
  if (typeof employee.address === 'string' && employee.address) {
    return employee.address;
  }
  
  if (employee.streetNumber && employee.streetName) {
    return `${employee.streetNumber} ${employee.streetName}`;
  }
  
  return '-';
};

// Helper function to get status label in French
const getStatusLabel = (status?: string): string => {
  switch(status) {
    case 'active':
    case 'Actif':
      return 'Actif';
    case 'inactive':
    case 'Inactif':
      return 'Inactif';
    case 'onLeave':
    case 'En congé':
      return 'En congé';
    case 'Suspendu':
      return 'Suspendu';
    default:
      return status || '-';
  }
};

/**
 * Exports an employee's profile information to a PDF file
 * @param employee The employee data
 * @returns boolean indicating success
 */
export const exportEmployeeToPdf = (employee: Employee): boolean => {
  try {
    if (!employee) {
      console.error("No employee data provided for PDF export");
      return false;
    }
    
    // Generate employee PDF
    const doc = generateEmployeePdf(employee);
    
    // Save the PDF with a formatted filename
    const fileName = `employee_${employee.lastName.toLowerCase()}_${employee.firstName.toLowerCase()}.pdf`;
    doc.save(fileName);
    
    return true;
  } catch (error) {
    console.error("Error exporting employee to PDF:", error);
    return false;
  }
};
