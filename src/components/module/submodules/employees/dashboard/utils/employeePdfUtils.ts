
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
    // Validate employee object
    if (!employee || typeof employee !== 'object') {
      console.error('Invalid employee data:', employee);
      return false;
    }

    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title - Add nullish coalescing to avoid undefined values
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(`Fiche Employé: ${employee.firstName || ''} ${employee.lastName || ''}`, 14, 22);
    
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
        if (photoData && typeof photoData === 'string' && photoData.startsWith('data:image')) {
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
    
    // Handle company display safely
    let companyName = "Non spécifiée";
    if (employee.company) {
      if (typeof employee.company === 'string') {
        companyName = employee.company;
      } else if (typeof employee.company === 'object' && employee.company !== null) {
        companyName = employee.company.name || "Non spécifiée";
      }
    }
    
    const professionalInfo = [
      ["Entreprise", companyName],
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
    
    // Prepare address information safely
    let personalAddress = "Non spécifiée";
    if (employee.address) {
      if (typeof employee.address === 'string') {
        personalAddress = employee.address;
      } else if (typeof employee.address === 'object' && employee.address !== null) {
        const addr = employee.address;
        const street = addr.street || "";
        const city = addr.city || "";
        const postalCode = addr.postalCode || "";
        const country = addr.country || "";
        
        personalAddress = `${street}, ${city} ${postalCode}, ${country}`.trim();
        if (personalAddress === ", , ") personalAddress = "Non spécifiée";
      }
    }
    
    let workAddress = "Non spécifiée";
    if (employee.workAddress && typeof employee.workAddress === 'object' && employee.workAddress !== null) {
      const addr = employee.workAddress;
      const street = addr.street || "";
      const city = addr.city || "";
      const postalCode = addr.postalCode || "";
      const country = addr.country || "";
      
      workAddress = `${street}, ${city} ${postalCode}, ${country}`.trim();
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
    
    // Skills section if available (with safety checks)
    if (employee.skills && Array.isArray(employee.skills) && employee.skills.length > 0) {
      const skillsY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text("Compétences", 14, skillsY);
      
      const skillsData = employee.skills.map(skill => {
        if (typeof skill === 'string') {
          return [skill, ""];
        } else if (skill && typeof skill === 'object') {
          return [skill.name || "", skill.level || ""];
        } else {
          return ["", ""];
        }
      }).filter(skill => skill[0] !== ""); // Remove empty skills
      
      if (skillsData.length > 0) {
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
    }
    
    // Create a safe filename
    const safeFirstName = (employee.firstName || 'employee').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const safeLastName = (employee.lastName || 'profile').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Save PDF
    doc.save(`employee_${safeFirstName}_${safeLastName}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error exporting employee to PDF:', error);
    return false;
  }
};
