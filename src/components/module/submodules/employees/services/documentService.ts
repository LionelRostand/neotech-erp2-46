
import { Employee } from '@/types/employee';
import { getDocumentById, getAllDocuments } from '@/hooks/firestore/read-operations';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { deleteDocument, deleteStorageFile } from '@/hooks/firestore/delete-operations';
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
  fileType?: string;
  fileSize?: number;
  filePath?: string;
}

// Get all documents for an employee
export const getEmployeeDocuments = async (employeeId: string): Promise<EmployeeDocument[]> => {
  try {
    console.log(`Récupération des documents pour l'employé ${employeeId}...`);
    
    const employeeData = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.HR.EMPLOYEES, employeeId);
    });
    
    if (!employeeData) {
      console.log(`Employé ${employeeId} non trouvé`);
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
    console.log(`Ajout d'un document pour l'employé ${employeeId}...`);
    
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
    
    // Add new document with a unique ID if not provided
    if (!document.id) {
      document.id = `doc_${Date.now()}`;
    }
    
    // Update the employee record with the new document
    const success = await executeWithNetworkRetry(async () => {
      return await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, {
        documents: [...documents, document]
      });
    });
    
    if (success) {
      toast.success("Document ajouté avec succès");
      return true;
    } else {
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
    
    // Find the document to remove
    const documentToRemove = documents.find((doc: EmployeeDocument) => doc.id === documentId);
    if (!documentToRemove) {
      toast.error("Document non trouvé");
      return false;
    }
    
    // Delete file from storage if filePath exists
    if (documentToRemove.filePath) {
      try {
        await deleteStorageFile(documentToRemove.filePath);
      } catch (error) {
        console.error(`Erreur lors de la suppression du fichier dans le storage:`, error);
        // Continue even if file deletion fails
      }
    }
    
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
      return ["Contrat", "Avenant", "Formation", "Pièce d'identité", "Autre"];
    }
    
    const types = (settingsDoc as any).types || [];
    return types;
  } catch (error) {
    console.error("Erreur lors de la récupération des types de documents:", error);
    return ["Contrat", "Avenant", "Formation", "Pièce d'identité", "Autre"];
  }
};
