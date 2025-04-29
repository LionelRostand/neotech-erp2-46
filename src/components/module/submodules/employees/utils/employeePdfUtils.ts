
import { jsPDF } from 'jspdf';
import { Employee } from '@/types/employee';

export const exportEmployeePdf = (employee: Employee) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();

    // Get company name for display
    const companyName = getCompanyName(employee);
    
    // Add title
    doc.setFontSize(20);
    doc.text('Fiche Employé', 105, 20, { align: 'center' });

    // Add employee info
    doc.setFontSize(12);
    doc.text(`Nom: ${employee.firstName} ${employee.lastName}`, 20, 40);
    doc.text(`Poste: ${employee.position || 'Non spécifié'}`, 20, 50);
    doc.text(`Département: ${employee.department || 'Non spécifié'}`, 20, 60);
    doc.text(`Entreprise: ${companyName}`, 20, 70);
    doc.text(`Email: ${employee.email}`, 20, 80);
    doc.text(`Téléphone: ${employee.phone || 'Non spécifié'}`, 20, 90);
    doc.text(`Statut: ${employee.status}`, 20, 100);
    doc.text(`Date d'embauche: ${employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('fr-FR') : 'Non spécifiée'}`, 20, 110);

    // Save the PDF
    doc.save(`employee-${employee.id}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

// Helper function to get company name from employee data
export const getCompanyName = (employee: Employee): string => {
  if (!employee.company) return 'Non spécifiée';
  
  if (typeof employee.company === 'string') {
    return employee.company;
  }
  
  if (employee.company && typeof employee.company === 'object') {
    return employee.company.name || 'Non spécifiée';
  }
  
  return 'Non spécifiée';
};
