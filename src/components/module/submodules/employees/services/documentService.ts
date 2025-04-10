
import { Employee } from '@/types/employee';
import { getDocumentById, addDocument } from '@/hooks/firestore/firestore-utils';
import { updateDocument, setDocument } from '@/hooks/firestore/update-operations';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';

// Interface for employee documents
export interface EmployeeDocument {
  name: string;
  date: string;
  type: string;
  fileUrl?: string;
  id?: string;
  size?: number;
  employeeId?: string;
}

// Vérifier si l'employé existe dans Firestore
const checkEmployeeExists = async (employeeId: string): Promise<boolean> => {
  try {
    console.log(`Vérification de l'existence de l'employé ${employeeId}...`);
    const employeeData = await executeWithNetworkRetry(async () => {
      // Assurons-nous d'utiliser le bon chemin pour récupérer l'employé
      const data = await getDocumentById(COLLECTIONS.HR.EMPLOYEES, employeeId);
      console.log("Données de l'employé récupérées:", data ? "Trouvé" : "Non trouvé");
      return data;
    });
    
    const exists = !!employeeData;
    console.log(`Employé ${employeeId} existe: ${exists}`);
    return exists;
  } catch (error) {
    console.error(`Erreur lors de la vérification de l'employé ${employeeId}:`, error);
    return false;
  }
};

// Get all documents for an employee
export const getEmployeeDocuments = async (employeeId: string): Promise<EmployeeDocument[]> => {
  try {
    console.log(`Récupération des documents pour l'employé ${employeeId}...`);
    
    if (!employeeId) {
      console.error("ID employé manquant lors de la récupération des documents");
      return [];
    }
    
    const employeeData = await executeWithNetworkRetry(async () => {
      const data = await getDocumentById(COLLECTIONS.HR.EMPLOYEES, employeeId);
      console.log("Données employé récupérées pour documents:", data ? "Trouvé" : "Non trouvé");
      return data;
    });
    
    if (!employeeData) {
      console.log(`Employé ${employeeId} non trouvé lors de la récupération des documents`);
      return [];
    }
    
    // Make sure to handle missing documents array
    const documents = (employeeData as any).documents || [];
    console.log(`${documents.length} documents trouvés pour l'employé ${employeeId}`);
    
    return documents as EmployeeDocument[];
  } catch (error) {
    console.error(`Erreur lors de la récupération des documents pour l'employé ${employeeId}:`, error);
    return [];
  }
};

// Add a new document to an employee
export const addEmployeeDocument = async (employeeId: string, document: EmployeeDocument): Promise<boolean> => {
  try {
    console.log(`Tentative d'ajout d'un document pour l'employé ${employeeId}...`, document);
    
    if (!employeeId) {
      console.error('Erreur: ID employé manquant pour l\'ajout du document');
      toast.error("ID employé manquant");
      return false;
    }
    
    // Vérifier d'abord si l'employé existe
    console.log("Vérification de l'existence de l'employé avant d'ajouter un document...");
    const employeeExists = await checkEmployeeExists(employeeId);
    
    if (!employeeExists) {
      console.error(`Erreur: Employé ${employeeId} introuvable dans la base de données`);
      toast.error("Employé non trouvé dans la base de données");
      return false;
    }
    
    console.log(`Employé ${employeeId} trouvé, récupération des données...`);
    
    // 1. Récupérer les données actuelles de l'employé
    const employeeData = await executeWithNetworkRetry(async () => {
      const data = await getDocumentById(COLLECTIONS.HR.EMPLOYEES, employeeId);
      console.log("Données de l'employé pour mise à jour:", data ? "Trouvé" : "Non trouvé");
      return data;
    });
    
    // Vérification supplémentaire (au cas où l'employé aurait été supprimé entre-temps)
    if (!employeeData) {
      console.error(`Employé ${employeeId} non trouvé lors de l'ajout du document`);
      toast.error("Employé non trouvé");
      return false;
    }
    
    // 2. Ajouter l'ID de l'employé au document s'il n'est pas déjà présent
    const documentWithEmployeeId = {
      ...document,
      employeeId: document.employeeId || employeeId,
      id: document.id || `doc_${Date.now()}`
    };
    
    console.log(`Document préparé avec ID: ${documentWithEmployeeId.id}`);
    
    // 3. Ajouter le document à la collection hr_documents
    await executeWithNetworkRetry(async () => {
      console.log("Ajout du document à la collection de documents...");
      return await addDocument(COLLECTIONS.HR.DOCUMENTS, documentWithEmployeeId);
    });
    
    // 4. Mettre à jour l'employé avec le nouveau document
    const documents = Array.isArray((employeeData as any).documents) ? (employeeData as any).documents : [];
    const updatedDocuments = [...documents, documentWithEmployeeId];
    
    console.log(`Mise à jour de l'employé avec ${updatedDocuments.length} documents`);
    
    const success = await executeWithNetworkRetry(async () => {
      console.log(`Mise à jour du document employé ${employeeId} avec les nouveaux documents...`);
      return await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, {
        documents: updatedDocuments
      });
    });
    
    if (success) {
      console.log("Document ajouté avec succès");
      toast.success("Document ajouté avec succès");
      return true;
    } else {
      console.error("Erreur lors de la mise à jour du document employé");
      toast.error("Erreur lors de l'ajout du document");
      return false;
    }
  } catch (error) {
    console.error(`Erreur lors de l'ajout du document pour l'employé ${employeeId}:`, error);
    toast.error("Erreur lors de l'ajout du document");
    return false;
  }
};

// Remove a document from an employee
export const removeEmployeeDocument = async (employeeId: string, documentId: string): Promise<boolean> => {
  try {
    console.log(`Suppression du document ${documentId} pour l'employé ${employeeId}...`);
    
    const employeeData = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.HR.EMPLOYEES, employeeId);
    });
    
    if (!employeeData) {
      console.log(`Employé ${employeeId} non trouvé`);
      toast.error("Employé non trouvé");
      return false;
    }
    
    // Ensure documents array exists
    const documents = (employeeData as any).documents || [];
    
    // Filter out the document to remove
    const updatedDocuments = documents.filter((doc: EmployeeDocument) => doc.id !== documentId);
    
    // Update the employee record without the removed document
    const success = await executeWithNetworkRetry(async () => {
      return await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, {
        documents: updatedDocuments
      });
    });
    
    if (success) {
      toast.success("Document supprimé avec succès");
      return true;
    } else {
      toast.error("Erreur lors de la suppression du document");
      return false;
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression du document pour l'employé ${employeeId}:`, error);
    toast.error("Erreur lors de la suppression du document");
    return false;
  }
};

// Get document types from settings
export const getDocumentTypes = async (): Promise<string[]> => {
  try {
    console.log("Récupération des types de documents...");
    
    const settingsDoc = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.HR.DOCUMENTS, "settings");
    });
    
    if (!settingsDoc) {
      console.log("Paramètres des documents non trouvés");
      // Valeurs par défaut
      return ["Contrat", "Avenant", "Attestation", "Diplôme", "CV", "Pièce d'identité", "Autre"];
    }
    
    const types = (settingsDoc as any).types || [];
    return types;
  } catch (error) {
    console.error("Erreur lors de la récupération des types de documents:", error);
    // Valeurs par défaut en cas d'erreur
    return ["Contrat", "Avenant", "Attestation", "Diplôme", "CV", "Pièce d'identité", "Autre"];
  }
};
