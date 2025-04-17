
import { jsPDF } from 'jspdf';
import { Contract } from '@/hooks/useContractsData';
import { Employee } from '@/types/employee';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface DocumentObj {
  id: string;
  name: string;
  category: string;
  type: string;
  format: string;
  size: number;
  createdAt: string;
  createdBy?: string;
  path?: string;
  url?: string;
  isEncrypted?: boolean;
  employeeId?: string;
}

/**
 * Génère un PDF de contrat de travail selon le droit français
 * @param contract Objet contrat
 * @param employee Objet employé
 * @returns Résultat de la génération avec l'objet document si succès
 */
export const generateContractPdf = (contract: Contract, employee: Employee) => {
  try {
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    
    // Configuration des marges et de la taille
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    
    // Fonction pour ajouter du texte avec retour à la ligne automatique
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 7) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * lineHeight);
    };
    
    // En-tête du document
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    let y = margin;
    
    // Titre du contrat
    let contractTitle = '';
    switch(contract.type) {
      case 'CDI':
        contractTitle = 'CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE (CDI)';
        break;
      case 'CDD':
        contractTitle = 'CONTRAT DE TRAVAIL À DURÉE DÉTERMINÉE (CDD)';
        break;
      case 'Stage':
        contractTitle = 'CONVENTION DE STAGE';
        break;
      case 'Alternance':
        contractTitle = 'CONTRAT D\'ALTERNANCE';
        break;
      default:
        contractTitle = `CONTRAT DE TRAVAIL - ${contract.type.toUpperCase()}`;
    }
    
    doc.text(contractTitle, pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    // Informations des parties
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    // Date du contrat
    const today = format(new Date(), 'dd MMMM yyyy', { locale: fr });
    y = addWrappedText(`Fait à Paris, le ${today}`, margin, y, contentWidth);
    y += 10;
    
    // Parties du contrat
    doc.setFont("helvetica", "bold");
    y = addWrappedText("ENTRE LES SOUSSIGNÉS :", margin, y, contentWidth);
    y += 7;
    
    // Information de l'entreprise
    doc.setFont("helvetica", "normal");
    const companyText = "La société [Nom de l'entreprise], [forme juridique], au capital de [montant] euros, immatriculée au RCS de [ville] sous le numéro [SIRET], dont le siège social est situé [adresse complète], représentée par [Prénom Nom], agissant en qualité de [fonction],";
    y = addWrappedText(companyText, margin, y, contentWidth);
    y += 5;
    doc.text("Ci-après désignée « l'Employeur »,", margin, y);
    y += 10;
    
    doc.text("D'UNE PART,", pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    doc.text("ET", pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    // Information de l'employé
    const employeeText = `Monsieur/Madame ${employee.firstName} ${employee.lastName}, demeurant [adresse complète], né(e) le ${employee.birthDate || '[date de naissance]'} à [lieu de naissance], de nationalité française, numéro de sécurité sociale : ${employee.socialSecurityNumber || '[numéro de sécurité sociale]'},`;
    y = addWrappedText(employeeText, margin, y, contentWidth);
    y += 5;
    doc.text("Ci-après désigné(e) « le Salarié »,", margin, y);
    y += 10;
    
    doc.text("D'AUTRE PART,", pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    // Préambule
    doc.setFont("helvetica", "bold");
    y = addWrappedText("IL A ÉTÉ CONVENU CE QUI SUIT :", margin, y, contentWidth);
    y += 10;
    
    // Articles du contrat
    doc.setFont("helvetica", "bold");
    doc.text("Article 1 - Engagement", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    
    // Contenu selon le type de contrat
    if (contract.type === 'CDI') {
      const engagementText = `L'Employeur engage le Salarié à compter du ${contract.startDate} pour une durée indéterminée. Le présent contrat est régi par les dispositions légales et réglementaires en vigueur, et notamment par la convention collective applicable à l'entreprise.`;
      y = addWrappedText(engagementText, margin, y, contentWidth);
    } else if (contract.type === 'CDD') {
      const engagementText = `L'Employeur engage le Salarié à compter du ${contract.startDate} pour une durée déterminée se terminant le ${contract.endDate || '[date de fin]'}. Le présent contrat est établi conformément aux dispositions des articles L.1242-1 et suivants du Code du travail.`;
      y = addWrappedText(engagementText, margin, y, contentWidth);
      y += 7;
      const motifText = `Motif du recours au CDD : [préciser le motif légal du recours au CDD, par exemple remplacement d'un salarié absent, accroissement temporaire d'activité, etc.].`;
      y = addWrappedText(motifText, margin, y, contentWidth);
    } else if (contract.type === 'Stage') {
      const engagementText = `La société accueille le Stagiaire du ${contract.startDate} au ${contract.endDate || '[date de fin]'} dans le cadre de sa formation [préciser la formation suivie]. La présente convention est établie conformément aux dispositions des articles L.124-1 et suivants du Code de l'éducation.`;
      y = addWrappedText(engagementText, margin, y, contentWidth);
    } else if (contract.type === 'Alternance') {
      const engagementText = `L'Employeur engage le Salarié en contrat d'alternance à compter du ${contract.startDate} pour une durée de [durée] se terminant le ${contract.endDate || '[date de fin]'}. Ce contrat est établi dans le cadre de la préparation du diplôme [préciser le diplôme préparé].`;
      y = addWrappedText(engagementText, margin, y, contentWidth);
    }
    
    y += 10;
    
    // Fonction et qualification
    doc.setFont("helvetica", "bold");
    doc.text("Article 2 - Fonction et qualification", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const functionText = `Le Salarié est engagé en qualité de ${contract.position}, statut [préciser le statut: cadre/non-cadre], coefficient [préciser si applicable], niveau [préciser si applicable].`;
    y = addWrappedText(functionText, margin, y, contentWidth);
    y += 7;
    const taskText = "Le Salarié exercera notamment les fonctions suivantes, sans que cette liste soit limitative : [détailler les principales missions].";
    y = addWrappedText(taskText, margin, y, contentWidth);
    
    y += 10;
    
    // Période d'essai
    doc.setFont("helvetica", "bold");
    doc.text("Article 3 - Période d'essai", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    
    if (contract.type === 'CDI') {
      const trialText = `Le présent contrat est conclu avec une période d'essai de [durée] mois, pendant laquelle chacune des parties pourra rompre le contrat sans indemnité, en respectant un délai de prévenance conformément aux dispositions des articles L.1221-25 et L.1221-26 du Code du travail.`;
      y = addWrappedText(trialText, margin, y, contentWidth);
    } else if (contract.type === 'CDD') {
      const trialText = `Le présent contrat comporte une période d'essai de [durée] jours, pendant laquelle chacune des parties pourra rompre le contrat sans indemnité ni préavis.`;
      y = addWrappedText(trialText, margin, y, contentWidth);
    } else if (contract.type === 'Stage') {
      const trialText = `La période de stage pourra être interrompue en cas de manquement au règlement intérieur de l'entreprise ou en cas de rupture de la convention par l'établissement d'enseignement.`;
      y = addWrappedText(trialText, margin, y, contentWidth);
    } else if (contract.type === 'Alternance') {
      const trialText = `Le présent contrat comporte une période d'essai de 45 jours de présence effective en entreprise, pendant laquelle chacune des parties pourra rompre le contrat sans indemnité ni préavis.`;
      y = addWrappedText(trialText, margin, y, contentWidth);
    }
    
    y += 10;
    
    // Lieu de travail
    doc.setFont("helvetica", "bold");
    doc.text("Article 4 - Lieu de travail", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const workplaceText = `Le Salarié exercera ses fonctions à [préciser l'adresse]. Le lieu de travail pourra être modifié par l'Employeur pour des raisons d'organisation, dans la limite géographique du département [préciser le département] ou des départements limitrophes.`;
    y = addWrappedText(workplaceText, margin, y, contentWidth);
    
    y += 10;
    
    // Durée du travail
    doc.setFont("helvetica", "bold");
    doc.text("Article 5 - Durée du travail", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const workTimeText = `Le Salarié sera soumis à l'horaire en vigueur dans l'établissement, soit actuellement 35 heures par semaine. [Ajouter si applicable: Le Salarié pourra être amené à effectuer des heures supplémentaires en fonction des nécessités du service.]`;
    y = addWrappedText(workTimeText, margin, y, contentWidth);
    
    y += 10;
    
    // Rémunération
    doc.setFont("helvetica", "bold");
    doc.text("Article 6 - Rémunération", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    
    if (contract.type === 'Stage') {
      const salaryText = `Le Stagiaire percevra une gratification de ${contract.salary ? contract.salary.toLocaleString('fr-FR') : '[montant]'} euros bruts par mois pour un stage à temps plein. Cette gratification est versée mensuellement et est exonérée de charges sociales dans la limite du plafond légal.`;
      y = addWrappedText(salaryText, margin, y, contentWidth);
    } else {
      const salaryText = `En contrepartie de son travail, le Salarié percevra une rémunération mensuelle brute de ${contract.salary ? contract.salary.toLocaleString('fr-FR') : '[montant]'} euros, pour un horaire hebdomadaire de 35 heures.`;
      y = addWrappedText(salaryText, margin, y, contentWidth);
      y += 7;
      const additionalText = "Cette rémunération inclut [préciser les éléments de salaire: salaire de base, primes, avantages en nature, etc.].";
      y = addWrappedText(additionalText, margin, y, contentWidth);
    }
    
    // Nouvelle page si nécessaire
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = margin;
    } else {
      y += 10;
    }
    
    // Congés payés
    doc.setFont("helvetica", "bold");
    doc.text("Article 7 - Congés payés", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    if (contract.type === 'Stage') {
      const holidayText = `Le Stagiaire pourra bénéficier de congés selon les dispositions légales applicables aux stages et en accord avec l'établissement d'enseignement.`;
      y = addWrappedText(holidayText, margin, y, contentWidth);
    } else {
      const holidayText = `Le Salarié bénéficiera des congés payés institués par les dispositions légales et conventionnelles applicables à l'entreprise, soit actuellement 2,5 jours ouvrables par mois de travail effectif.`;
      y = addWrappedText(holidayText, margin, y, contentWidth);
    }
    
    y += 10;
    
    // Protection sociale
    doc.setFont("helvetica", "bold");
    doc.text("Article 8 - Protection sociale", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    if (contract.type === 'Stage') {
      const securityText = `Le Stagiaire continuera à bénéficier de la protection sociale dans le cadre de l'assurance maladie dont il est bénéficiaire à titre personnel ou en qualité d'ayant droit.`;
      y = addWrappedText(securityText, margin, y, contentWidth);
    } else {
      const securityText = `Le Salarié sera affilié aux organismes de retraite et de prévoyance dont relève l'entreprise, soit actuellement [noms des organismes]. Le Salarié bénéficiera également des régimes de retraite complémentaire et de prévoyance en vigueur dans l'entreprise.`;
      y = addWrappedText(securityText, margin, y, contentWidth);
    }
    
    y += 10;
    
    // Clause de confidentialité
    doc.setFont("helvetica", "bold");
    doc.text("Article 9 - Confidentialité", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const confidentialityText = `Le Salarié s'engage à observer la discrétion la plus stricte sur les informations se rapportant aux activités de l'entreprise auxquelles il aura accès à l'occasion et dans le cadre de sa fonction. Notamment, il s'interdit de communiquer à quiconque, sauf à ses supérieurs hiérarchiques, tout document et toute information concernant l'entreprise qu'il pourrait détenir.`;
    y = addWrappedText(confidentialityText, margin, y, contentWidth);
    
    y += 10;
    
    // Fin du contrat / préavis
    doc.setFont("helvetica", "bold");
    
    if (contract.type === 'CDI') {
      doc.text("Article 10 - Rupture du contrat", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const terminationText = `Le présent contrat pourra être rompu à l'initiative de l'une ou l'autre des parties, dans le respect des dispositions légales et conventionnelles en vigueur. Le préavis à respecter est déterminé conformément aux dispositions légales et conventionnelles applicables.`;
      y = addWrappedText(terminationText, margin, y, contentWidth);
    } else if (contract.type === 'CDD') {
      doc.text("Article 10 - Fin du contrat", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const terminationText = `Le présent contrat prendra fin automatiquement à son terme le ${contract.endDate || '[date de fin]'}, sans indemnité de préavis. Il pourra être rompu avant terme dans les cas strictement prévus par la loi : accord des parties, faute grave, force majeure ou embauche en CDI.`;
      y = addWrappedText(terminationText, margin, y, contentWidth);
      y += 7;
      const compensationText = `À la fin du contrat, le Salarié percevra une indemnité de fin de contrat (indemnité de précarité) égale à 10% de la rémunération totale brute perçue pendant la durée du contrat, sauf dans les cas d'exclusion prévus par la loi.`;
      y = addWrappedText(compensationText, margin, y, contentWidth);
    } else if (contract.type === 'Stage') {
      doc.text("Article 10 - Fin du stage", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const terminationText = `Le stage prendra fin à la date prévue. En cas de manquement aux règles et au règlement intérieur de l'entreprise, le stage pourra être interrompu à l'initiative de l'Employeur, après consultation de l'établissement d'enseignement.`;
      y = addWrappedText(terminationText, margin, y, contentWidth);
    } else if (contract.type === 'Alternance') {
      doc.text("Article 10 - Fin du contrat", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const terminationText = `Le présent contrat prendra fin à la date d'expiration du terme fixé. Il pourra être rompu de façon anticipée dans les cas prévus par les articles L.6222-18 et suivants du Code du travail.`;
      y = addWrappedText(terminationText, margin, y, contentWidth);
    }
    
    // Nouvelle page si nécessaire
    if (y > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage();
      y = margin;
    } else {
      y += 20;
    }
    
    // Signatures
    doc.setFont("helvetica", "bold");
    doc.text("Fait à Paris, en deux exemplaires originaux", pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.text("Le " + today, pageWidth / 2, y, { align: 'center' });
    y += 20;
    
    // Espace pour signatures
    const signatureWidth = contentWidth / 2 - 10;
    
    doc.setFont("helvetica", "normal");
    doc.text("L'Employeur", margin + signatureWidth/2, y, { align: 'center' });
    doc.text("Le Salarié", pageWidth - margin - signatureWidth/2, y, { align: 'center' });
    y += 7;
    doc.text("(Signature précédée de la mention « Lu et approuvé »)", pageWidth/2, y, { align: 'center' });
    
    // Enregistrer le PDF
    const fileName = `contrat_${contract.type.toLowerCase()}_${employee.lastName.toLowerCase()}_${employee.firstName.toLowerCase()}`;
    
    // Créer l'objet document pour stocker avec l'employé
    const documentObj: DocumentObj = {
      id: `contract_${Date.now()}`,
      name: `Contrat ${contract.type} - ${employee.firstName} ${employee.lastName}`,
      category: 'Contrat',
      type: 'Contrat de travail',
      format: 'pdf',
      size: Math.floor(doc.output('arraybuffer').byteLength / 1024), // taille en Ko
      createdAt: new Date().toISOString(),
      createdBy: 'Système',
      employeeId: employee.id
    };
    
    // Déclencher le téléchargement du PDF
    doc.save(`${fileName}.pdf`);
    
    return {
      success: true,
      documentObj,
      fileName: `${fileName}.pdf`
    };
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};
