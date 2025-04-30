
import { jsPDF } from 'jspdf';
import { Contract } from '@/hooks/useContractsData';
import { Employee } from '@/types/employee';
import { getEmployee } from '@/components/module/submodules/employees/services/employeeService';
import { addEmployeeDocument } from '@/components/module/submodules/employees/services/documentService';
import autoTable from 'jspdf-autotable';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDocument } from '@/hooks/firestore/create-operations';
import { toast } from 'sonner';

/**
 * Génère un PDF pour un contrat d'employé conforme au droit du travail français
 * @param contract Le contrat pour lequel générer un PDF
 * @param employee L'employé associé au contrat
 * @returns true si la génération a réussi, false sinon
 */
export const generateContractPdf = async (contract: Contract, employee?: Employee | null): Promise<boolean> => {
  try {
    // Si l'employé n'est pas fourni, essayer de le récupérer
    let employeeData = employee;
    if (!employeeData && contract.employeeId) {
      employeeData = await getEmployee(contract.employeeId);
    }

    // Vérifier qu'on a toutes les données nécessaires
    if (!contract || !employeeData) {
      console.error("Données insuffisantes pour générer le PDF");
      return false;
    }

    // Créer le PDF
    const doc = new jsPDF();
    
    // Ajouter un en-tête
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    doc.text("CONTRAT DE TRAVAIL", 105, 20, { align: "center" });
    
    // Type de contrat en sous-titre
    doc.setFontSize(14);
    doc.text(contract.type.toUpperCase(), 105, 30, { align: "center" });
    
    // Ajouter la date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 195, 10, { align: "right" });
    
    // Mentions légales françaises
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Entre les soussignés :", 14, 40);
    
    doc.text("La société [NOM DE LA SOCIÉTÉ], [forme juridique], au capital de [montant] euros, immatriculée au RCS de [ville] sous le numéro [SIRET], dont le siège social est situé [adresse complète], représentée par [nom et prénom] en qualité de [fonction], dûment habilité à cet effet,", 14, 50);
    doc.text("ci-après désignée « l'Employeur »,", 105, 60, { align: "center" });
    doc.text("D'une part,", 14, 70);
    
    doc.text("Et", 14, 80);
    
    doc.text(`${employeeData.firstName} ${employeeData.lastName}, demeurant ${typeof employeeData.address === 'string' ? employeeData.address : (employeeData.address ? `${employeeData.address.street}, ${employeeData.address.city}, ${employeeData.address.postalCode}` : "")}, ${employeeData.birthDate ? `né(e) le ${employeeData.birthDate}` : ""}`, 14, 90);
    doc.text("ci-après désigné(e) « le/la Salarié(e) »,", 105, 100, { align: "center" });
    doc.text("D'autre part,", 14, 110);
    
    doc.text("Il a été convenu ce qui suit :", 14, 120);
    
    // Article 1 - Engagement
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("Article 1 - Engagement", 14, 130);
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`L'Employeur engage le/la Salarié(e) en qualité de ${contract.position}, à compter du ${contract.startDate}, sous réserve des résultats de la visite médicale d'embauche.`, 14, 140);
    
    // Article 2 - Durée du contrat
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("Article 2 - Durée du contrat", 14, 155);
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    
    if (contract.type.toLowerCase().includes('cdi')) {
      doc.text("Le présent contrat est conclu pour une durée indéterminée.", 14, 165);
    } else {
      doc.text(`Le présent contrat est conclu pour une durée déterminée de ${contract.endDate ? calculateDuration(contract.startDate, contract.endDate) : "non précisée"}, à compter du ${contract.startDate}${contract.endDate ? ` et jusqu'au ${contract.endDate}` : ""}.`, 14, 165);
      
      doc.text("Le contrat est conclu pour le motif suivant : [préciser le motif conformément à la législation]", 14, 175);
    }
    
    // Informations sur l'employé en tableau
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("Informations sur le/la Salarié(e)", 14, 190);
    
    const employeeInfo = [
      ["Nom complet", `${employeeData.firstName} ${employeeData.lastName}`],
      ["Email", employeeData.email || ""],
      ["Téléphone", employeeData.phone || ""],
      ["Adresse", typeof employeeData.address === 'string' ? employeeData.address : 
        employeeData.address ? [
          employeeData.address.street || "",
          employeeData.address.city || "", 
          employeeData.address.postalCode || "",
          employeeData.address.country || ""
        ].filter(Boolean).join(", ") : ""],
      ["Date de naissance", employeeData.birthDate || "Non spécifiée"],
      ["Numéro de sécurité sociale", employeeData.socialSecurityNumber || "Non spécifié"],
    ];

    autoTable(doc, {
      startY: 195,
      head: [],
      body: employeeInfo,
      theme: 'grid',
      headStyles: {
        fillColor: [220, 230, 240],
        textColor: [0, 51, 102],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 }
      }
    });
    
    // Informations sur le contrat
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("Détails du contrat", 14, doc.lastAutoTable.finalY + 15);
    
    const contractInfo = [
      ["Type de contrat", contract.type || ""],
      ["Statut", contract.status || ""],
      ["Poste", contract.position || ""],
      ["Date de début", contract.startDate || ""],
      ["Date de fin", contract.endDate || "Non applicable (CDI)"],
      ["Département", contract.department || ""],
      ["Salaire annuel brut", contract.salary ? `${contract.salary.toLocaleString('fr-FR')} €` : "Non spécifié"],
      ["Convention collective", "Convention collective nationale applicable"],
      ["Temps de travail", "35 heures hebdomadaires (temps complet)"],
      ["Période d'essai", contract.type.toLowerCase().includes('cdi') ? "4 mois renouvelable une fois" : "Selon la durée du contrat, conformément à la convention collective applicable"],
    ];
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [],
      body: contractInfo,
      theme: 'grid',
      headStyles: {
        fillColor: [220, 230, 240],
        textColor: [0, 51, 102],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 }
      }
    });
    
    // Articles supplémentaires conformément au droit du travail français
    doc.addPage();
    
    // Article 3 - Rémunération
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("Article 3 - Rémunération", 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`En contrepartie de son travail, le/la Salarié(e) percevra une rémunération annuelle brute de ${contract.salary ? contract.salary.toLocaleString('fr-FR') : "[montant]"} euros, versée sur 12 mois, soit un salaire mensuel brut de ${contract.salary ? (contract.salary / 12).toLocaleString('fr-FR', { maximumFractionDigits: 2 }) : "[montant]"} euros.`, 14, 30);
    doc.text("Cette rémunération inclut les éventuelles heures supplémentaires effectuées dans la limite du contingent annuel fixé par la convention collective applicable.", 14, 40);
    
    // Article 4 - Lieu de travail
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("Article 4 - Lieu de travail", 14, 55);
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Le/La Salarié(e) exercera ses fonctions à/au [adresse du lieu de travail].`, 14, 65);
    doc.text("Toutefois, compte tenu de la nature des activités de la société et des nécessités du poste, le lieu de travail pourra être modifié au sein du même secteur géographique, ce que le/la Salarié(e) accepte expressément.", 14, 75);
    
    // Article 5 - Horaires de travail
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("Article 5 - Horaires de travail", 14, 90);
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Le/La Salarié(e) sera soumis(e) à l'horaire en vigueur dans l'entreprise, soit actuellement 35 heures hebdomadaires réparties comme suit :", 14, 100);
    doc.text("- Du lundi au vendredi : de 9h00 à 17h00, avec une pause déjeuner d'une heure.", 14, 110);
    
    // Article 6 - Congés payés
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("Article 6 - Congés payés", 14, 125);
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Le/La Salarié(e) bénéficiera des congés payés institués par les dispositions légales et conventionnelles, soit 2,5 jours ouvrables par mois de travail effectif, soit 30 jours ouvrables pour une année complète de présence.", 14, 135);
    
    // Article 7 - Obligations professionnelles
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("Article 7 - Obligations professionnelles", 14, 150);
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Le/La Salarié(e) s'engage à respecter les directives et instructions émanant de la Direction et à se conformer aux règles régissant le fonctionnement interne de l'entreprise, notamment le règlement intérieur s'il existe.", 14, 160);
    doc.text("Le/La Salarié(e) s'engage à informer l'Employeur, sans délai, de tout changement qui interviendrait dans les situations qu'il/elle a signalées lors de son engagement (adresse, situation de famille, etc.).", 14, 175);
    
    // Signature
    doc.text("Fait en deux exemplaires originaux à [Ville], le [date]", 14, 215);
    
    // Lignes pour signatures
    doc.line(14, 235, 95, 235);
    doc.text("Signature de l'Employeur", 55, 240, { align: "center" });
    doc.text("Précédée de la mention « Lu et approuvé »", 55, 245, { align: "center" });
    
    doc.line(115, 235, 196, 235);
    doc.text("Signature du/de la Salarié(e)", 155, 240, { align: "center" });
    doc.text("Précédée de la mention « Lu et approuvé »", 155, 245, { align: "center" });

    // Clause de confidentialité
    doc.setFontSize(8);
    doc.text("Ce document est strictement confidentiel et établi conformément au droit du travail français. Il ne constitue pas un conseil juridique.", 105, 285, { align: "center" });

    // Créer un nom de fichier
    const lastName = employeeData.lastName?.toLowerCase().replace(/\s+/g, '_') || 'employe';
    const contractType = contract.type?.toLowerCase().replace(/\s+/g, '_') || 'contrat';
    const timestamp = new Date().getTime();
    const fileName = `contrat_${contractType}_${lastName}_${timestamp}.pdf`;
    
    // Obtenir la version base64 pour l'enregistrement
    const pdfBase64 = doc.output('datauristring');
    
    // 1. Sauvegarder dans les documents RH
    const documentData = {
      title: `Contrat de travail - ${employeeData.firstName} ${employeeData.lastName}`,
      type: "contract",
      employeeId: employeeData.id,
      uploadDate: new Date().toISOString(),
      fileType: "application/pdf",
      fileData: pdfBase64,
      description: `Contrat ${contract.type} - ${contract.position} conforme au droit du travail français`,
      status: "active"
    };

    const savedDoc = await addDocument(COLLECTIONS.HR.DOCUMENTS, documentData);
    
    // 2. Ajouter le document dans les documents de l'employé
    if (savedDoc && savedDoc.id) {
      await addEmployeeDocument(employeeData.id, {
        ...documentData,
        id: savedDoc.id,
        name: `Contrat ${contract.type} - Droit français`,
        date: new Date().toISOString()
      });
    }
    
    // 3. Télécharger le PDF
    doc.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF du contrat:', error);
    toast.error(`Erreur lors de la génération du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    return false;
  }
};

/**
 * Calcule la durée entre deux dates au format français
 */
const calculateDuration = (startDateStr: string, endDateStr: string): string => {
  try {
    // Conversion des dates françaises (JJ/MM/AAAA) en objets Date
    const parts1 = startDateStr.split('/');
    const parts2 = endDateStr.split('/');
    
    let startDate: Date, endDate: Date;
    
    if (parts1.length === 3) {
      // Format JJ/MM/AAAA
      startDate = new Date(parseInt(parts1[2]), parseInt(parts1[1]) - 1, parseInt(parts1[0]));
    } else {
      // Essayer comme date ISO
      startDate = new Date(startDateStr);
    }
    
    if (parts2.length === 3) {
      // Format JJ/MM/AAAA
      endDate = new Date(parseInt(parts2[2]), parseInt(parts2[1]) - 1, parseInt(parts2[0]));
    } else {
      // Essayer comme date ISO
      endDate = new Date(endDateStr);
    }
    
    // Calcul de la différence en mois
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    
    if (months < 1) {
      // Différence en jours
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (months < 12) {
      return `${months} mois`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} an${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` et ${remainingMonths} mois` : ''}`;
    }
  } catch (error) {
    console.error('Erreur lors du calcul de la durée:', error);
    return "durée non déterminée";
  }
};
