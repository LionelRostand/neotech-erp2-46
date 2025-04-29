
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Employee } from '@/types/employee';
import { getPhotoUrl } from './photoUtils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Generates a PDF document containing employee information
 * @param employee Employee data
 * @returns jsPDF document object
 */
export const generateEmployeePdf = (employee: Employee): jsPDF => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Profil de ${employee.firstName} ${employee.lastName}`,
    subject: 'Fiche employé',
    creator: 'Application RH',
  });

  // Add title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(`Profil de ${employee.firstName} ${employee.lastName}`, 105, 20, { align: 'center' });

  // Add photo if available
  const photoUrl = employee.photoURL || employee.photo || getPhotoUrl(employee.photoMeta);
  if (photoUrl) {
    try {
      // Position of the photo, size, and border
      const imgX = 20;
      const imgY = 30;
      const imgWidth = 40;
      const imgHeight = 40;
      
      // Add the image
      doc.addImage(photoUrl, 'JPEG', imgX, imgY, imgWidth, imgHeight);
      
      // Add a border around the photo
      doc.setDrawColor(200, 200, 200);
      doc.rect(imgX, imgY, imgWidth, imgHeight);
    } catch (error) {
      console.error('Error adding photo to PDF:', error);
      // Continue PDF generation without the photo
    }
  }

  // Add status badge
  const statusMap: Record<string, { text: string, color: [number, number, number] }> = {
    'active': { text: 'Actif', color: [39, 174, 96] },
    'Actif': { text: 'Actif', color: [39, 174, 96] },
    'inactive': { text: 'Inactif', color: [127, 140, 141] },
    'Inactif': { text: 'Inactif', color: [127, 140, 141] },
    'onLeave': { text: 'En congé', color: [241, 196, 15] },
    'En congé': { text: 'En congé', color: [241, 196, 15] },
    'Suspendu': { text: 'Suspendu', color: [231, 76, 60] },
  };

  const status = statusMap[employee.status] || { text: employee.status, color: [127, 140, 141] };
  
  // Add employee basic info beside photo
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text(`Poste: ${employee.position || 'Non spécifié'}`, 70, 40);
  doc.text(`Département: ${employee.department || 'Non spécifié'}`, 70, 48);
  doc.text(`Entreprise: ${typeof employee.company === 'string' ? employee.company : (employee.company?.name || 'Non spécifiée')}`, 70, 56);
  
  // Add status badge
  doc.setFillColor(...status.color);
  doc.roundedRect(70, 60, 30, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(status.text, 85, 67, { align: 'center' });

  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 80, 190, 80);
  
  // Reset text color
  doc.setTextColor(40, 40, 40);

  // Add personal information section
  doc.setFontSize(16);
  doc.text('Informations personnelles', 20, 95);

  const personalInfo = [
    ['Prénom', employee.firstName || ''],
    ['Nom', employee.lastName || ''],
    ['Date de naissance', employee.birthDate ? format(new Date(employee.birthDate), 'dd/MM/yyyy', { locale: fr }) : ''],
    ['Email personnel', employee.email || ''],
    ['Téléphone', employee.phone || ''],
  ];

  autoTable(doc, {
    startY: 100,
    head: [],
    body: personalInfo,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 60 }
    },
  });

  // Add address information
  doc.setFontSize(14);
  doc.text('Adresse personnelle', 20, doc.lastAutoTable.finalY + 10);

  const address = typeof employee.address === 'object' ? employee.address : { 
    street: employee.streetNumber ? `${employee.streetNumber} ${employee.streetName || ''}` : employee.streetName || '',
    city: employee.city || '',
    postalCode: employee.zipCode || employee.postalCode || '',
    country: employee.country || '',
    state: employee.region || ''
  };

  const personalAddress = [
    ['Adresse', address.street || ''],
    ['Ville', address.city || ''],
    ['Code postal', address.postalCode || ''],
    ['Région', address.state || ''],
    ['Pays', address.country || ''],
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [],
    body: personalAddress,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 60 }
    },
  });

  // Add professional information section
  doc.setFontSize(16);
  doc.text('Informations professionnelles', 110, 95);

  const professionalInfo = [
    ['Date d\'embauche', employee.hireDate ? format(new Date(employee.hireDate), 'dd/MM/yyyy', { locale: fr }) : ''],
    ['Email professionnel', employee.professionalEmail || ''],
    ['Type de contrat', employee.contract || ''],
    ['Poste', employee.position || ''],
    ['Département', employee.department || ''],
  ];

  autoTable(doc, {
    startY: 100,
    margin: { left: 110 },
    head: [],
    body: professionalInfo,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 60 }
    },
  });

  // Add professional address
  doc.setFontSize(14);
  doc.text('Adresse professionnelle', 110, doc.lastAutoTable.finalY + 10);

  const workAddress = employee.workAddress || {
    street: '',
    city: '',
    postalCode: '',
    country: ''
  };

  const professionalAddress = [
    ['Adresse', workAddress.street || ''],
    ['Ville', workAddress.city || ''],
    ['Code postal', workAddress.postalCode || ''],
    ['Pays', workAddress.country || ''],
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    margin: { left: 110 },
    head: [],
    body: professionalAddress,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 60 }
    },
  });

  // Add skills section if available
  if (employee.skills && employee.skills.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Compétences', 105, 20, { align: 'center' });
    
    const skillsData = employee.skills.map(skill => {
      if (typeof skill === 'string') {
        return [skill, ''];
      }
      return [skill.name, skill.level];
    });
    
    autoTable(doc, {
      startY: 30,
      head: [['Compétence', 'Niveau']],
      body: skillsData,
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] }
    });
  }

  // Add footer with page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} sur ${totalPages}`, 105, 290, { align: 'center' });
    doc.text(`Généré le ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: fr })}`, 105, 285, { align: 'center' });
  }

  return doc;
};

/**
 * Export employee profile as PDF
 * @param employee Employee data
 * @returns true if successful, false if error
 */
export const exportEmployeePdf = (employee: Employee): boolean => {
  try {
    if (!employee || !employee.id) {
      throw new Error('Données employé invalides');
    }
    
    const doc = generateEmployeePdf(employee);
    
    // Generate filename
    const lastName = employee.lastName?.toLowerCase() || 'employe';
    const fileName = `profil_${lastName}_${employee.id}.pdf`;
    
    // Save PDF
    doc.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error exporting employee PDF:', error);
    return false;
  }
};
