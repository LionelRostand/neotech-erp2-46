
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { addDocument } from '@/hooks/firestore/create-operations';
import { toast } from 'sonner';

export const addEmployeeDocument = async (employeeId: string, documentData: any) => {
  try {
    if (!employeeId) {
      console.error("EmployeeId is required to add a document");
      return null;
    }

    console.log(`Adding document for employee: ${employeeId}`, documentData);

    // 1. Sauvegarder le document dans la collection documents
    const savedDoc = await addDocument(COLLECTIONS.HR.DOCUMENTS, {
      ...documentData,
      employeeId,
      createdAt: new Date().toISOString()
    });

    if (!savedDoc || !savedDoc.id) {
      throw new Error("Erreur lors de l'enregistrement du document");
    }

    console.log(`Document saved with ID: ${savedDoc.id}`, savedDoc);

    // 2. Ajouter la référence du document dans le tableau documents de l'employé
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    
    // Créer un objet de document compatible avec la structure Employee
    const documentRef = {
      documentId: savedDoc.id,
      name: documentData.name || "Document sans nom",
      type: documentData.type || "Autre",
      date: documentData.date || new Date().toISOString(),
      fileUrl: documentData.fileUrl || null,
      fileData: documentData.fileData || null,
      fileType: documentData.fileType || "application/octet-stream"
    };
    
    await updateDoc(employeeRef, {
      documents: arrayUnion(documentRef)
    });

    console.log("Document ajouté à l'employé avec succès");
    return savedDoc;
  } catch (error) {
    console.error("Erreur lors de l'ajout du document:", error);
    toast.error(`Erreur lors de l'ajout du document: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    return null;
  }
};

// Fonction pour récupérer les types de documents
export const getDocumentTypes = () => {
  return [
    { id: "contract", name: "Contrat" },
    { id: "payslip", name: "Fiche de paie" },
    { id: "cv", name: "CV" },
    { id: "id_card", name: "Pièce d'identité" },
    { id: "diploma", name: "Diplôme" },
    { id: "certificate", name: "Certificat" },
    { id: "other", name: "Autre" }
  ];
};
