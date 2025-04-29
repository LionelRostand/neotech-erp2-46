
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Employee } from '@/types/employee';

/**
 * Export employee data to PDF file
 * @param employee Employee data to export
 * @returns boolean Success status
 */
export const exportEmployeePdf = (employee: Employee): boolean => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(`Fiche Employé: ${employee.firstName} ${employee.lastName}`, 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR');
    doc.text(`Exporté le: ${formattedDate}`, 14, 32);
    
    // Add photo if available
    if (employee.photoURL || employee.photo || (employee.photoMeta && employee.photoMeta.data)) {
      try {
        const photoData = employee.photoMeta?.data || employee.photoURL || employee.photo;
        if (photoData && photoData.startsWith('data:image')) {
          doc.addImage(photoData, 'JPEG', 150, 20, 40, 40);
        }
      } catch (photoError) {
        console.error("Error adding photo to PDF:", photoError);
      }
    }
    
    // Personal Information
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Informations personnelles", 14, 50);
    
    const personalInfo = [
      ["Nom", employee.lastName || ""],
      ["Prénom", employee.firstName || ""],
      ["Email", employee.email || ""],
      ["Email Professionnel", employee.professionalEmail || ""],
      ["Téléphone", employee.phone || ""],
      ["Date de naissance", employee.birthDate || ""],
      ["Statut", employee.status || ""],
    ];
    
    autoTable(doc, {
      startY: 55,
      head: [["Champ", "Valeur"]],
      body: personalInfo,
      theme: 'striped',
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    
    // Professional Information
    const professionalInfoY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Informations professionnelles", 14, professionalInfoY);
    
    const professionalInfo = [
      ["Entreprise", typeof employee.company === 'string' ? employee.company : (employee.company?.name || "Non spécifiée")],
      ["Département", employee.department || ""],
      ["Poste", employee.position || ""],
      ["Date d'embauche", employee.hireDate || ""],
      ["Contrat", employee.contract || ""],
    ];
    
    autoTable(doc, {
      startY: professionalInfoY + 5,
      head: [["Champ", "Valeur"]],
      body: professionalInfo,
      theme: 'striped',
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    
    // Address Information
    const addressInfoY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Coordonnées", 14, addressInfoY);
    
    // Prepare address information
    let personalAddress = "Non spécifiée";
    if (employee.address) {
      if (typeof employee.address === 'string') {
        personalAddress = employee.address;
      } else {
        const addr = employee.address;
        personalAddress = `${addr.street || ""}, ${addr.city || ""} ${addr.postalCode || ""}, ${addr.country || ""}`.trim();
        if (personalAddress === ", , ") personalAddress = "Non spécifiée";
      }
    }
    
    let workAddress = "Non spécifiée";
    if (employee.workAddress) {
      const addr = employee.workAddress;
      workAddress = `${addr.street || ""}, ${addr.city || ""} ${addr.postalCode || ""}, ${addr.country || ""}`.trim();
      if (workAddress === ", , ") workAddress = "Non spécifiée";
    }
    
    const addressInfo = [
      ["Adresse personnelle", personalAddress],
      ["Adresse professionnelle", workAddress],
    ];
    
    autoTable(doc, {
      startY: addressInfoY + 5,
      head: [["Type", "Adresse"]],
      body: addressInfo,
      theme: 'striped',
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    
    // Skills section if available
    if (employee.skills && employee.skills.length > 0) {
      const skillsY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text("Compétences", 14, skillsY);
      
      const skillsData = employee.skills.map(skill => {
        if (typeof skill === 'string') {
          return [skill, ""];
        } else {
          return [skill.name, skill.level];
        }
      });
      
      autoTable(doc, {
        startY: skillsY + 5,
        head: [["Compétence", "Niveau"]],
        body: skillsData,
        theme: 'striped',
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontStyle: 'bold'
        }
      });
    }
    
    // Save PDF
    doc.save(`employee_${employee.firstName}_${employee.lastName}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error exporting employee to PDF:', error);
    return false;
  }
};
