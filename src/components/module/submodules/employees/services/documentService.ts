
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, getDoc, Timestamp, deleteDoc, getDocs } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

/**
 * Add a document to an employee's profile
 */
export const addEmployeeDocument = async (employeeId: string, documentData: any) => {
  try {
    // First, add the document to the HR documents collection
    const hrDocumentsRef = collection(db, COLLECTIONS.HR.DOCUMENTS);
    const docRef = await addDoc(hrDocumentsRef, {
      ...documentData,
      employeeId,
      uploadDate: new Date().toISOString(),
      createdAt: Timestamp.now()
    });
    
    // Get the employee document
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeSnap = await getDoc(employeeRef);
    
    if (!employeeSnap.exists()) {
      throw new Error("Employee not found");
    }
    
    const employeeData = employeeSnap.data();
    const currentDocuments = employeeData.documents || [];
    
    // Create document object to add to employee
    const documentToAdd = {
      ...documentData,
      documentId: docRef.id,
      date: documentData.date || new Date().toISOString()
    };
    
    // Add document to employee's documents array
    await updateDoc(employeeRef, {
      documents: [...currentDocuments, documentToAdd]
    });
    
    return {
      success: true,
      documentId: docRef.id
    };
  } catch (error) {
    console.error("Error adding document to employee:", error);
    toast.error("Erreur lors de l'ajout du document");
    throw error;
  }
};

/**
 * Delete a document from an employee's profile
 */
export const deleteEmployeeDocument = async (employeeId: string, documentId: string) => {
  try {
    // First, delete from HR documents collection
    try {
      const docRef = doc(db, COLLECTIONS.HR.DOCUMENTS, documentId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn("Document might not exist in HR documents collection:", e);
    }
    
    // Get the employee document
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeSnap = await getDoc(employeeRef);
    
    if (!employeeSnap.exists()) {
      throw new Error("Employee not found");
    }
    
    const employeeData = employeeSnap.data();
    let currentDocuments = employeeData.documents || [];
    
    // Filter out the document to delete
    currentDocuments = currentDocuments.filter(
      (doc: any) => doc.documentId !== documentId
    );
    
    // Update employee's documents array
    await updateDoc(employeeRef, {
      documents: currentDocuments
    });
    
    return {
      success: true
    };
  } catch (error) {
    console.error("Error deleting document from employee:", error);
    toast.error("Erreur lors de la suppression du document");
    throw error;
  }
};

/**
 * Get all documents for an employee
 */
export const getEmployeeDocuments = async (employeeId: string) => {
  try {
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeSnap = await getDoc(employeeRef);
    
    if (!employeeSnap.exists()) {
      throw new Error("Employee not found");
    }
    
    const employeeData = employeeSnap.data();
    return employeeData.documents || [];
  } catch (error) {
    console.error("Error getting employee documents:", error);
    return [];
  }
};

/**
 * Get all document types from the database
 */
export const getDocumentTypes = async (): Promise<string[]> => {
  try {
    // Default document types if no custom types are found
    const defaultTypes = [
      'CV',
      'Contrat de travail',
      'Fiche de paie',
      'Diplôme',
      'Pièce d\'identité',
      'Attestation',
      'Certificat',
      'Autre'
    ];
    
    try {
      // Try to get custom document types from settings
      const settingsRef = doc(db, COLLECTIONS.HR.SETTINGS, 'documentTypes');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        if (data.types && Array.isArray(data.types) && data.types.length > 0) {
          return data.types;
        }
      }
      
      // If custom types don't exist, analyze existing documents to get types
      const docsRef = collection(db, COLLECTIONS.HR.DOCUMENTS);
      const snapshot = await getDocs(docsRef);
      
      if (!snapshot.empty) {
        const types = new Set<string>();
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.type && typeof data.type === 'string') {
            types.add(data.type);
          }
        });
        
        // Combine existing types with default types
        const allTypes = [...Array.from(types), ...defaultTypes];
        // Remove duplicates
        return Array.from(new Set(allTypes));
      }
    } catch (error) {
      console.warn("Error fetching custom document types:", error);
    }
    
    // Return default types if everything else fails
    return defaultTypes;
  } catch (error) {
    console.error("Error getting document types:", error);
    return [
      'CV',
      'Contrat',
      'Fiche de paie',
      'Autre'
    ];
  }
};
