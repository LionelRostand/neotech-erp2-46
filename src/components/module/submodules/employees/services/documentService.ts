
import { getAllDocuments, getDocumentById } from '@/hooks/firestore/read-operations';
import { addDocument } from '@/hooks/firestore/create-operations';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';
import { Employee } from '@/types/employee';

// Type for document retrieved from Firestore
interface EmployeeDocument {
  id: string;
  employeeId: string;
  documentType: string;
  name: string;
  date: string;
  type: string;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Type for settings document
interface DocumentSettings {
  id: string;
  types: Array<{ id: string, name: string }>;
}

// Récupérer tous les documents d'un employé
export const getEmployeeDocuments = async (employeeId: string) => {
  try {
    console.log(`Récupération des documents pour l'employé ${employeeId} depuis Firestore...`);
    
    // Récupérer l'employé pour obtenir ses références de documents
    const employee = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.EMPLOYEES, employeeId);
    }) as Employee | { id: string; };
    
    if (!employee || !(employee as Employee).documents) {
      console.log(`Aucun document trouvé pour l'employé ${employeeId}`);
      return [];
    }
    
    // Si l'employé a des documents intégrés, les retourner directement
    if (Array.isArray((employee as Employee).documents)) {
      console.log(`${(employee as Employee).documents.length} documents récupérés pour l'employé ${employeeId}`);
      return (employee as Employee).documents;
    }
    
    // Si les documents sont des références à la collection DOCUMENTS
    const documentIds = Array.isArray((employee as Employee).documents) ? (employee as Employee).documents : [];
    
    // Récupérer les documents depuis la collection DOCUMENTS
    const documents = [];
    for (const docId of documentIds) {
      const doc = await executeWithNetworkRetry(async () => {
        return await getDocumentById(COLLECTIONS.DOCUMENTS, docId);
      });
      
      if (doc) {
        documents.push(doc);
      }
    }
    
    console.log(`${documents.length} documents récupérés pour l'employé ${employeeId}`);
    return documents;
  } catch (error) {
    console.error(`Erreur lors de la récupération des documents pour l'employé ${employeeId}:`, error);
    toast.error("Erreur lors du chargement des documents");
    return [];
  }
};

// Ajouter un document pour un employé
export const addDocumentToEmployee = async (employeeId: string, documentData: any) => {
  try {
    console.log(`Ajout d'un document pour l'employé ${employeeId} dans Firestore...`);
    
    // Ajouter le document à la collection DOCUMENTS
    const document = await executeWithNetworkRetry(async () => {
      return await addDocument(COLLECTIONS.DOCUMENTS, {
        ...documentData,
        employeeId,
        documentType: 'employee_document'
      });
    }) as EmployeeDocument;
    
    // Récupérer l'employé pour mettre à jour sa liste de documents
    const employee = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.EMPLOYEES, employeeId);
    }) as Employee | { id: string; };
    
    if (!employee) {
      console.error(`Employé ${employeeId} non trouvé`);
      toast.error("Employé non trouvé");
      return null;
    }
    
    // Mettre à jour l'employé avec la référence du nouveau document
    const documents = (employee as Employee).documents || [];
    documents.push(document.id);
    
    await executeWithNetworkRetry(async () => {
      return await updateDocument(COLLECTIONS.EMPLOYEES, employeeId, { documents });
    });
    
    console.log('Document ajouté avec succès:', document);
    toast.success("Document ajouté avec succès");
    return document;
  } catch (error) {
    console.error("Erreur lors de l'ajout du document:", error);
    toast.error("Erreur lors de l'ajout du document");
    return null;
  }
};

// Supprimer un document d'un employé
export const deleteEmployeeDocument = async (employeeId: string, documentId: string) => {
  try {
    console.log(`Suppression du document ${documentId} pour l'employé ${employeeId} dans Firestore...`);
    
    // Supprimer le document de la collection DOCUMENTS
    await executeWithNetworkRetry(async () => {
      return await deleteDocument(COLLECTIONS.DOCUMENTS, documentId);
    });
    
    // Récupérer l'employé pour mettre à jour sa liste de documents
    const employee = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.EMPLOYEES, employeeId);
    }) as Employee | { id: string; };
    
    if (employee && (employee as Employee).documents) {
      // Mettre à jour l'employé en retirant la référence au document supprimé
      const documents = Array.isArray((employee as Employee).documents) 
        ? (employee as Employee).documents.filter(id => id !== documentId) 
        : [];
      
      await executeWithNetworkRetry(async () => {
        return await updateDocument(COLLECTIONS.EMPLOYEES, employeeId, { documents });
      });
    }
    
    console.log('Document supprimé avec succès');
    toast.success("Document supprimé avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du document:", error);
    toast.error("Erreur lors de la suppression du document");
    return false;
  }
};

// Récupérer tous les types de documents disponibles
export const getDocumentTypes = async () => {
  try {
    console.log('Récupération des types de documents depuis Firestore...');
    
    // On pourrait stocker les types de documents dans une collection dédiée
    // ou dans un document de la collection SETTINGS
    const settings = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.SETTINGS, 'documentTypes');
    }) as DocumentSettings | { id: string; };
    
    if (settings && (settings as DocumentSettings).types) {
      return (settings as DocumentSettings).types;
    }
    
    // Types par défaut si non trouvés dans la base de données
    return [
      { id: 'contract', name: 'Contrat' },
      { id: 'amendment', name: 'Avenant' },
      { id: 'certificate', name: 'Attestation' },
      { id: 'training', name: 'Formation' },
      { id: 'id', name: 'Pièce d\'identité' },
      { id: 'other', name: 'Autre' }
    ];
  } catch (error) {
    console.error("Erreur lors de la récupération des types de documents:", error);
    return [
      { id: 'contract', name: 'Contrat' },
      { id: 'amendment', name: 'Avenant' },
      { id: 'certificate', name: 'Attestation' },
      { id: 'training', name: 'Formation' },
      { id: 'id', name: 'Pièce d\'identité' },
      { id: 'other', name: 'Autre' }
    ];
  }
};
