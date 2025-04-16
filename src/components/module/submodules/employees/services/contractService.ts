import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { collection, doc, getDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Document } from '@/types/employee';
import { saveEmployeeDocument } from './documentService';

// Function to add a contract as a document
export const saveContractAsDocument = async (employeeId: string, contractData: any): Promise<Document | null> => {
  try {
    // Check if employee exists
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeDoc = await getDoc(employeeRef);
    
    if (!employeeDoc.exists()) {
      console.error(`Employee with ID ${employeeId} not found`);
      return null;
    }
    
    // Create document object from contract
    const document: Document = {
      id: `contract_${contractData.id || Date.now()}`,
      name: `Contrat de travail - ${contractData.type || 'CDI'}`,
      type: 'Contrat de travail',
      date: contractData.startDate || new Date().toISOString(),
      employeeId: employeeId,
      fileType: 'application/pdf',
      fileSize: 0,
    };
    
    // Use the documentService to add the document
    const addedDocument = await saveEmployeeDocument(employeeId, document);
    console.log('Contract saved as document:', addedDocument);
    
    return addedDocument;
  } catch (error) {
    console.error('Error saving contract as document:', error);
    return null;
  }
};

// Other contract service functions would go here...
