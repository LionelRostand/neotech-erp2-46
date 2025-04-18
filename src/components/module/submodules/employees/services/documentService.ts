
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, getDoc, Timestamp, deleteDoc } from 'firebase/firestore';
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
