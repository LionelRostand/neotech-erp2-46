
import { 
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const addDocument = async (collectionName: string, data: any) => {
  try {
    console.log(`Adding document to ${collectionName} with data:`, data);
    
    // Create a new document reference with an auto-generated ID
    const collectionRef = collection(db, collectionName);
    
    // Add a timestamp for createdAt if it doesn't exist
    const documentData = {
      ...data,
      createdAt: data.createdAt || serverTimestamp()
    };
    
    const docRef = await addDoc(collectionRef, documentData);
    console.log(`Document added to ${collectionName} with ID:`, docRef.id);
    
    return {
      id: docRef.id,
      ...documentData
    };
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

export const setDocument = async (collectionName: string, documentId: string, data: any) => {
  try {
    console.log(`Setting document in ${collectionName} with ID ${documentId}:`, data);
    
    // Create a reference to the document
    const docRef = doc(db, collectionName, documentId);
    
    // Add timestamps
    const documentData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    // Add createdAt if it's a new document (doesn't exist in data)
    if (!data.createdAt) {
      documentData.createdAt = serverTimestamp();
    }
    
    await setDoc(docRef, documentData);
    console.log(`Document set in ${collectionName} with ID:`, documentId);
    
    return {
      id: documentId,
      ...documentData
    };
  } catch (error) {
    console.error(`Error setting document in ${collectionName} with ID ${documentId}:`, error);
    throw error;
  }
};

// Add a specialized function for creating training documents
export const addTrainingDocument = async (trainingData: any) => {
  return addDocument(COLLECTIONS.HR.TRAININGS, trainingData);
};
