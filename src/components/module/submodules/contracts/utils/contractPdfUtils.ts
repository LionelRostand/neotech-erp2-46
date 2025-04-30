
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
 * Génère un PDF pour un contrat d'employé
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
    
    // Ajouter la date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 195, 10, { align: "right" });
    
    // Informations sur l'employé
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Informations sur l'employé", 14, 40);
    
    const employeeInfo = [
      ["Nom", `${employeeData.firstName} ${employeeData.lastName}`],
      ["Email", employeeData.email || ""],
      ["Téléphone", employeeData.phone || ""],
      ["Adresse", typeof employeeData.address === 'string' ? employeeData.address : 
        employeeData.address ? [
          employeeData.address.street || "",
          employeeData.address.city || "", 
          employeeData.address.postalCode || "",
          employeeData.address.country || ""
        ].filter(Boolean).join(", ") : ""],
    ];

    autoTable(doc, {
      startY: 45,
      head: [],
      body: employeeInfo,
      theme: 'grid',
      headStyles: {
        fillColor: [220, 230, 240],
        textColor: [0, 51, 102],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 }
      }
    });
    
    // Informations sur le contrat
    doc.text("Détails du contrat", 14, doc.lastAutoTable.finalY + 15);
    
    const contractInfo = [
      ["Type de contrat", contract.type || ""],
      ["Statut", contract.status || ""],
      ["Poste", contract.position || ""],
      ["Date de début", contract.startDate || ""],
      ["Date de fin", contract.endDate || "Non définie"],
      ["Département", contract.department || ""],
      ["Salaire annuel", contract.salary ? `${contract.salary.toLocaleString('fr-FR')} €` : "Non spécifié"],
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
        0: { fontStyle: 'bold', cellWidth: 40 }
      }
    });
    
    // Signature
    doc.text("Signatures", 14, doc.lastAutoTable.finalY + 15);
    
    // Lignes pour signatures
    doc.line(14, doc.lastAutoTable.finalY + 40, 95, doc.lastAutoTable.finalY + 40);
    doc.text("Employeur", 55, doc.lastAutoTable.finalY + 45, { align: "center" });
    
    doc.line(115, doc.lastAutoTable.finalY + 40, 196, doc.lastAutoTable.finalY + 40);
    doc.text("Employé", 155, doc.lastAutoTable.finalY + 45, { align: "center" });

    // Clause de confidentialité
    doc.setFontSize(10);
    doc.text("Ce document est strictement confidentiel et ne doit pas être partagé sans autorisation.", 105, 285, { align: "center" });

    // Créer un nom de fichier
    const lastName = employeeData.lastName?.toLowerCase().replace(/\s+/g, '_') || 'employe';
    const contractType = contract.type?.toLowerCase().replace(/\s+/g, '_') || 'contrat';
    const timestamp = new Date().getTime();
    const fileName = `contrat_${contractType}_${lastName}_${timestamp}.pdf`;
    
    // Obtenir la version base64 pour l'enregistrement
    const pdfBase64 = doc.output('datauristring');
    
    // 1. Sauvegarder dans les documents RH
    const documentData = {
      title: `Contrat - ${employeeData.firstName} ${employeeData.lastName}`,
      type: "contract",
      employeeId: employeeData.id,
      uploadDate: new Date().toISOString(),
      fileType: "application/pdf",
      fileData: pdfBase64,
      description: `Contrat ${contract.type} - ${contract.position}`,
      status: "active"
    };

    const savedDoc = await addDocument(COLLECTIONS.HR.DOCUMENTS, documentData);
    
    // 2. Ajouter le document dans les documents de l'employé
    if (savedDoc && savedDoc.id) {
      await addEmployeeDocument(employeeData.id, {
        ...documentData,
        id: savedDoc.id,
        name: `Contrat ${contract.type}`,
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
