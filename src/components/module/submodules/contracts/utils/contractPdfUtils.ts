
import { jsPDF } from 'jspdf';
import { Contract } from '@/hooks/useContractsData';
import { Employee, Document } from '@/types/employee';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PdfResult {
  success: boolean;
  error?: string;
  documentId?: string;
  documentObj?: Document;
}

/**
 * Génère un PDF de contrat en fonction du type de contrat
 */
export const generateContractPdf = (contract: Contract, employee: Employee): PdfResult => {
  try {
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    
    // Ajouter entête
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("CONTRAT DE TRAVAIL", 105, 20, { align: "center" });
    
    // Ajouter type de contrat
    doc.setFontSize(16);
    doc.text(`${contract.type.toUpperCase()}`, 105, 30, { align: "center" });
    
    // Ajouter séparateur
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);
    
    // Information sur l'employeur
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ENTRE LES SOUSSIGNÉS", 20, 45);
    doc.setFont("helvetica", "normal");
    doc.text("La société [Nom de la société]", 20, 55);
    doc.text("Siège social : [Adresse du siège social]", 20, 62);
    doc.text("Représentée par : [Nom du représentant]", 20, 69);
    doc.text("En qualité de : [Qualité du représentant]", 20, 76);
    doc.text("Ci-après dénommée \"l'Employeur\"", 20, 83);
    
    // Information sur l'employé
    doc.setFont("helvetica", "bold");
    doc.text("ET", 20, 95);
    doc.setFont("helvetica", "normal");
    doc.text(`M./Mme ${employee.firstName} ${employee.lastName}`, 20, 105);
    doc.text(`Demeurant : ${getFormattedAddress(employee)}`, 20, 112);
    doc.text(`Né(e) le : ${employee.birthDate || "Non spécifié"}`, 20, 119);
    doc.text(`N° de sécurité sociale : ${employee.socialSecurityNumber || "Non spécifié"}`, 20, 126);
    doc.text("Ci-après dénommé(e) \"le/la Salarié(e)\"", 20, 133);
    
    // Contenu du contrat selon le type
    doc.setFont("helvetica", "bold");
    doc.text("IL A ÉTÉ CONVENU CE QUI SUIT :", 20, 145);
    doc.setFont("helvetica", "normal");
    
    // Ajouter contenu spécifique selon le type de contrat
    let yPos = 155;
    
    // Article 1 - Engagement
    doc.setFont("helvetica", "bold");
    doc.text("Article 1 - Engagement", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    switch (contract.type.toLowerCase()) {
      case 'cdi':
        doc.text("Le/La Salarié(e) est engagé(e) pour une durée indéterminée à compter du " + 
          contract.startDate + ".", 20, yPos);
        break;
      case 'cdd':
        doc.text("Le/La Salarié(e) est engagé(e) pour une durée déterminée de " + 
          getContractDuration(contract) + " à compter du " + contract.startDate + 
          (contract.endDate ? " jusqu'au " + contract.endDate : "") + ".", 20, yPos);
        break;
      case 'stage':
        doc.text("Le/La Stagiaire est engagé(e) pour une période de stage de " + 
          getContractDuration(contract) + " à compter du " + contract.startDate + 
          (contract.endDate ? " jusqu'au " + contract.endDate : "") + ".", 20, yPos);
        break;
      case 'alternance':
        doc.text("Le/La Alternant(e) est engagé(e) pour une période d'alternance de " + 
          getContractDuration(contract) + " à compter du " + contract.startDate + 
          (contract.endDate ? " jusqu'au " + contract.endDate : "") + ".", 20, yPos);
        break;
      default:
        doc.text("Le/La Salarié(e) est engagé(e) à compter du " + contract.startDate + ".", 20, yPos);
    }
    
    // Article 2 - Fonction
    yPos += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Article 2 - Fonction", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    doc.text(`Le/La Salarié(e) est engagé(e) en qualité de ${contract.position} au sein du ` + 
      `département ${contract.department || "Non spécifié"}.`, 20, yPos);
    
    // Article 3 - Rémunération
    yPos += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Article 3 - Rémunération", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    if (contract.salary) {
      doc.text(`Le/La Salarié(e) percevra une rémunération brute annuelle de ${contract.salary.toLocaleString('fr-FR')} euros, ` + 
        `versée sur 12 mois.`, 20, yPos);
    } else {
      doc.text("Le/La Salarié(e) percevra une rémunération brute conforme à la convention collective applicable.", 20, yPos);
    }
    
    // Signatures
    yPos = 240;
    doc.text("Fait à __________________, le __________________", 20, yPos);
    
    yPos += 20;
    doc.text("L'Employeur", 40, yPos);
    doc.text("Le/La Salarié(e)", 160, yPos);
    doc.text("(Signature précédée de la mention \"Lu et approuvé\")", 160, yPos + 7);
    
    // Générer un ID unique pour le document
    const documentId = uuidv4();
    
    // Nom du fichier
    const fileName = `contrat_${contract.type.toLowerCase()}_${employee.lastName.toLowerCase()}_${format(new Date(), 'yyyyMMdd')}`;
    
    // Convertir le PDF en une chaîne base64
    const pdfData = doc.output('datauristring');
    
    // Créer un nouvel objet document à ajouter à l'employé
    const newDocument: Document = {
      id: documentId,
      name: `Contrat de travail - ${contract.type} - ${format(new Date(), 'dd/MM/yyyy')}`,
      type: 'Contrat',
      date: new Date().toISOString(),
      fileType: 'application/pdf',
      fileData: pdfData.split(',')[1], // Supprimer le préfixe "data:application/pdf;base64,"
      fileSize: Math.round(pdfData.length * 0.75), // Estimation approximative de la taille
      employeeId: employee.id
    };
    
    return {
      success: true,
      documentId,
      documentObj: newDocument
    };
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Récupère l'adresse formatée de l'employé
 */
const getFormattedAddress = (employee: Employee): string => {
  if (typeof employee.address === 'string') {
    return employee.address || 'Adresse non spécifiée';
  }
  
  if (employee.address) {
    const { street, city, postalCode, country } = employee.address;
    return `${street || ''}, ${postalCode || ''} ${city || ''}, ${country || ''}`.trim() || 'Adresse non spécifiée';
  }
  
  return 'Adresse non spécifiée';
};

/**
 * Calcule la durée du contrat en mois ou jours
 */
const getContractDuration = (contract: Contract): string => {
  if (!contract.endDate || !contract.startDate) {
    return 'durée non spécifiée';
  }
  
  try {
    const startDate = new Date(contract.startDate);
    const endDate = new Date(contract.endDate);
    
    // Différence en millisecondes
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    
    // Convertir en jours
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} jours`;
    }
    
    // Calculer les mois approximativement
    const diffMonths = Math.round(diffDays / 30);
    return diffMonths === 1 ? '1 mois' : `${diffMonths} mois`;
  } catch (error) {
    console.error('Erreur lors du calcul de la durée du contrat:', error);
    return 'durée non spécifiée';
  }
};
