
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
 * Génère un PDF de contrat en fonction du type de contrat selon le code du travail français
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
    doc.text("SIRET : [Numéro SIRET]", 20, 69);
    doc.text("Code NAF : [Code NAF]", 20, 76);
    doc.text("Représentée par : [Nom du représentant]", 20, 83);
    doc.text("En qualité de : [Qualité du représentant]", 20, 90);
    doc.text("Ci-après dénommée \"l'Employeur\"", 20, 97);
    
    // Information sur l'employé
    doc.setFont("helvetica", "bold");
    doc.text("ET", 20, 110);
    doc.setFont("helvetica", "normal");
    doc.text(`M./Mme ${employee.firstName} ${employee.lastName}`, 20, 120);
    doc.text(`Demeurant : ${getFormattedAddress(employee)}`, 20, 127);
    doc.text(`Né(e) le : ${employee.birthDate || "Non spécifié"}`, 20, 134);
    doc.text(`N° de sécurité sociale : ${employee.socialSecurityNumber || "Non spécifié"}`, 20, 141);
    doc.text("Ci-après dénommé(e) \"le/la Salarié(e)\"", 20, 148);
    
    // Contenu du contrat selon le type
    doc.setFont("helvetica", "bold");
    doc.text("IL A ÉTÉ CONVENU CE QUI SUIT :", 20, 160);
    doc.setFont("helvetica", "normal");
    
    // Ajouter contenu spécifique selon le type de contrat
    let yPos = 170;
    
    // Article 1 - Engagement
    doc.setFont("helvetica", "bold");
    doc.text("Article 1 - Engagement et qualification", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    switch (contract.type.toLowerCase()) {
      case 'cdi':
        doc.text(`Le/La Salarié(e) est engagé(e) pour une durée indéterminée à compter du ${contract.startDate}.`, 20, yPos);
        yPos += 8;
        doc.text("La présente embauche est soumise à la Convention Collective applicable à l'entreprise.", 20, yPos);
        yPos += 8;
        doc.text(`Le/La Salarié(e) est engagé(e) en qualité de ${contract.position}, coefficient [X], niveau [X],`, 20, yPos);
        yPos += 8;
        doc.text("statut [Cadre/Non cadre] selon la Convention Collective.", 20, yPos);
        break;
      case 'cdd':
        doc.text(`Le/La Salarié(e) est engagé(e) pour une durée déterminée de ${getContractDuration(contract)} à compter du ${contract.startDate}`, 20, yPos);
        yPos += 8;
        doc.text(`jusqu'au ${contract.endDate || "[Date à préciser]"}.`, 20, yPos);
        yPos += 8;
        doc.text("Motif du recours au CDD : [Remplacement d'un salarié absent / Accroissement temporaire d'activité /", 20, yPos);
        yPos += 8;
        doc.text("Emploi saisonnier / Emploi d'usage].", 20, yPos);
        yPos += 8;
        doc.text(`Le/La Salarié(e) est engagé(e) en qualité de ${contract.position}, coefficient [X], niveau [X],`, 20, yPos);
        yPos += 8;
        doc.text("statut [Cadre/Non cadre] selon la Convention Collective.", 20, yPos);
        break;
      case 'stage':
        doc.text(`Le/La Stagiaire est engagé(e) pour une période de stage de ${getContractDuration(contract)} à compter du ${contract.startDate}`, 20, yPos);
        yPos += 8;
        doc.text(`jusqu'au ${contract.endDate || "[Date à préciser]"}.`, 20, yPos);
        yPos += 8;
        doc.text("Convention de stage n° : [Numéro de la convention]", 20, yPos);
        yPos += 8;
        doc.text("Établissement d'enseignement : [Nom de l'établissement]", 20, yPos);
        yPos += 8;
        doc.text(`Le stage a pour objet : [Description des missions]`, 20, yPos);
        break;
      case 'alternance':
        doc.text(`Le/La Alternant(e) est engagé(e) pour une période d'alternance de ${getContractDuration(contract)} à compter du ${contract.startDate}`, 20, yPos);
        yPos += 8;
        doc.text(`jusqu'au ${contract.endDate || "[Date à préciser]"}.`, 20, yPos);
        yPos += 8;
        doc.text("Type de contrat : [Contrat d'apprentissage / Contrat de professionnalisation]", 20, yPos);
        yPos += 8;
        doc.text("Établissement de formation : [Nom de l'établissement]", 20, yPos);
        yPos += 8;
        doc.text("Diplôme préparé : [Intitulé du diplôme]", 20, yPos);
        break;
      default:
        doc.text(`Le/La Salarié(e) est engagé(e) à compter du ${contract.startDate}.`, 20, yPos);
    }
    
    // Article 2 - Période d'essai
    yPos += 16;
    doc.setFont("helvetica", "bold");
    doc.text("Article 2 - Période d'essai", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    
    switch (contract.type.toLowerCase()) {
      case 'cdi':
        doc.text("Le présent contrat est soumis à une période d'essai de [X] mois, qui s'achèvera le [date].", 20, yPos);
        yPos += 8;
        doc.text("Durant cette période, chacune des parties pourra rompre le contrat sans indemnité, sous réserve", 20, yPos);
        yPos += 8;
        doc.text("du respect du délai de prévenance prévu par les articles L.1221-25 et L.1221-26 du Code du travail.", 20, yPos);
        break;
      case 'cdd':
        doc.text(`Le présent contrat est soumis à une période d'essai de ${Math.min(parseInt(getContractDuration(contract)), 30)} jours.`, 20, yPos);
        yPos += 8;
        doc.text("Durant cette période, chacune des parties pourra rompre le contrat sans indemnité, sous réserve", 20, yPos);
        yPos += 8;
        doc.text("du respect du délai de prévenance prévu par les articles L.1221-25 et L.1221-26 du Code du travail.", 20, yPos);
        break;
      default:
        if (contract.type.toLowerCase() !== 'stage') {
          doc.text("Le présent contrat est soumis à une période d'essai conformément aux dispositions légales et conventionnelles.", 20, yPos);
        } else {
          doc.text("Une période d'évaluation initiale de 15 jours est prévue. Durant cette période, la convention de stage", 20, yPos);
          yPos += 8;
          doc.text("peut être rompue par l'une ou l'autre des parties.", 20, yPos);
        }
    }
    
    // Article 3 - Rémunération
    yPos += 16;
    doc.setFont("helvetica", "bold");
    doc.text("Article 3 - Rémunération", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    if (contract.salary) {
      switch (contract.type.toLowerCase()) {
        case 'stage':
          doc.text(`Le/La Stagiaire percevra une gratification mensuelle de ${(contract.salary / 12).toFixed(2).replace('.', ',')} euros.`, 20, yPos);
          yPos += 8;
          doc.text("Cette gratification n'a pas le caractère d'un salaire au sens de l'article L. 3221-3 du Code du travail.", 20, yPos);
          break;
        case 'alternance':
          doc.text(`L'Alternant(e) percevra une rémunération mensuelle brute de ${(contract.salary / 12).toFixed(2).replace('.', ',')} euros,`, 20, yPos);
          yPos += 8;
          doc.text("conformément aux dispositions légales et conventionnelles relatives aux contrats en alternance.", 20, yPos);
          break;
        default:
          doc.text(`Le/La Salarié(e) percevra une rémunération brute annuelle de ${contract.salary.toLocaleString('fr-FR')} euros,`, 20, yPos);
          yPos += 8;
          doc.text(`soit ${(contract.salary / 12).toFixed(2).replace('.', ',')} euros bruts mensuels, versée sur 12 mois.`, 20, yPos);
          yPos += 8;
          doc.text("À cette rémunération s'ajouteront les éventuelles primes et indemnités prévues par les accords d'entreprise.", 20, yPos);
      }
    } else {
      doc.text("Le/La Salarié(e) percevra une rémunération brute conforme à la convention collective applicable.", 20, yPos);
    }
    
    // Article 4 - Durée du travail
    yPos += 16;
    doc.setFont("helvetica", "bold");
    doc.text("Article 4 - Durée du travail", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    doc.text("La durée hebdomadaire de travail est fixée à 35 heures, réparties comme suit :", 20, yPos);
    yPos += 8;
    doc.text("Du lundi au vendredi, de 9h00 à 17h00, avec une pause déjeuner d'une heure.", 20, yPos);
    yPos += 8;
    doc.text("Le/La Salarié(e) peut être amené(e) à effectuer des heures supplémentaires à la demande de l'employeur,", 20, yPos);
    yPos += 8;
    doc.text("qui seront rémunérées conformément aux dispositions légales et conventionnelles en vigueur.", 20, yPos);
    
    // Article 5 - Obligations
    yPos += 16;
    doc.setFont("helvetica", "bold");
    doc.text("Article 5 - Obligations du salarié", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    doc.text("Le/La Salarié(e) s'engage à respecter les directives et instructions de l'employeur, ainsi que le règlement", 20, yPos);
    yPos += 8;
    doc.text("intérieur de l'entreprise. Il/Elle s'engage également à faire preuve de discrétion et à respecter la confidentialité", 20, yPos);
    yPos += 8;
    doc.text("des informations auxquelles il/elle pourrait avoir accès dans le cadre de ses fonctions.", 20, yPos);
    
    // Article 6 - Congés payés
    yPos += 16;
    doc.setFont("helvetica", "bold");
    doc.text("Article 6 - Congés payés", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    doc.text("Le/La Salarié(e) bénéficiera des congés payés légaux, soit 2,5 jours ouvrables par mois de travail effectif,", 20, yPos);
    yPos += 8;
    doc.text("ainsi que des jours de congés exceptionnels prévus par la convention collective applicable.", 20, yPos);
    
    // Article 7 - Protection sociale
    yPos += 16;
    doc.setFont("helvetica", "bold");
    doc.text("Article 7 - Protection sociale", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    doc.text("Le/La Salarié(e) bénéficiera des régimes de retraite et de prévoyance en vigueur dans l'entreprise.", 20, yPos);
    yPos += 8;
    doc.text("Il/Elle sera affilié(e) à la caisse de retraite complémentaire : [Nom et adresse de la caisse].", 20, yPos);
    
    // Mentions légales spécifiques
    if (contract.type.toLowerCase() === 'cdd') {
      // Ajouter une deuxième page pour les mentions spécifiques au CDD
      doc.addPage();
      yPos = 20;
      
      doc.setFont("helvetica", "bold");
      doc.text("Article 8 - Indemnité de fin de contrat", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      doc.text("À l'issue du contrat, le/la Salarié(e) percevra une indemnité de fin de contrat (prime de précarité) égale à 10%", 20, yPos);
      yPos += 8;
      doc.text("de la rémunération brute totale versée pendant la durée du contrat, sauf dans les cas d'exclusion prévus par la loi.", 20, yPos);
      
      yPos += 16;
      doc.setFont("helvetica", "bold");
      doc.text("Article 9 - Renouvellement et rupture anticipée", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      doc.text("Le présent contrat pourra être renouvelé une fois pour une durée déterminée qui, ajoutée à la durée du", 20, yPos);
      yPos += 8;
      doc.text("contrat initial, ne peut excéder la durée maximale prévue à l'article L.1242-8 du Code du travail.", 20, yPos);
      yPos += 12;
      doc.text("Le contrat peut être rompu avant l'échéance du terme uniquement dans les cas suivants :", 20, yPos);
      yPos += 8;
      doc.text("- Accord entre les parties", 20, yPos);
      yPos += 8;
      doc.text("- Faute grave du salarié ou de l'employeur", 20, yPos);
      yPos += 8;
      doc.text("- Force majeure", 20, yPos);
      yPos += 8;
      doc.text("- Embauche du salarié en CDI", 20, yPos);
      yPos += 8;
      doc.text("- Inaptitude constatée par le médecin du travail", 20, yPos);
    } else if (contract.type.toLowerCase() === 'stage') {
      // Ajout des mentions spécifiques aux stages
      yPos += 16;
      doc.setFont("helvetica", "bold");
      doc.text("Article 8 - Encadrement et suivi", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      doc.text("Tuteur de stage en entreprise : [Nom et fonction]", 20, yPos);
      yPos += 8;
      doc.text("Enseignant référent de l'établissement d'enseignement : [Nom]", 20, yPos);
      yPos += 8;
      doc.text("Le stagiaire est soumis au règlement intérieur de l'entreprise, notamment en ce qui concerne", 20, yPos);
      yPos += 8;
      doc.text("les horaires et les règles d'hygiène et de sécurité en vigueur dans l'entreprise.", 20, yPos);
    } else if (contract.type.toLowerCase() === 'alternance') {
      // Ajout des mentions spécifiques à l'alternance
      yPos += 16;
      doc.setFont("helvetica", "bold");
      doc.text("Article 8 - Formation et suivi", 20, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 10;
      doc.text("Maître d'apprentissage/Tuteur : [Nom et fonction]", 20, yPos);
      yPos += 8;
      doc.text("L'alternant s'engage à travailler pour l'employeur pendant la durée du contrat et à suivre", 20, yPos);
      yPos += 8;
      doc.text("régulièrement la formation dispensée par le centre de formation.", 20, yPos);
      yPos += 8;
      doc.text("L'employeur s'engage à assurer à l'alternant une formation professionnelle complète", 20, yPos);
      yPos += 8;
      doc.text("correspondant au métier préparé et à lui verser un salaire.", 20, yPos);
    }
    
    // Ajout des clauses de fin communes
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    } else {
      yPos += 16;
    }
    
    doc.setFont("helvetica", "bold");
    doc.text("Article final - Droit applicable et juridiction compétente", 20, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 10;
    doc.text("Le présent contrat est soumis au droit français. Tout litige relatif à son exécution ou à sa rupture sera", 20, yPos);
    yPos += 8;
    doc.text("soumis à la juridiction du Conseil de Prud'hommes territorialement compétent.", 20, yPos);
    
    // Signatures
    yPos += 20;
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
