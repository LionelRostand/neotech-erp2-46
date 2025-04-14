import { 
  getDocs, 
  getDoc, 
  query, 
  where, 
  collection,
  doc,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getCollectionRef, getDocRef } from './common-utils';

/**
 * Get a document by ID from a collection
 * @param collectionName The collection to get from
 * @param documentId The document ID to get
 */
export const getDocumentById = async (collectionName: string, documentId: string) => {
  try {
    const docRef = getDocRef(collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() as DocumentData };
    } else {
      console.log(`No document found with ID ${documentId} in collection ${collectionName}`);
      return null;
    }
  } catch (error) {
    console.error(`Error getting document ${documentId} from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get all documents from a collection
 * @param collectionName The collection to get from
 */
export const getAllDocuments = async (collectionName: string) => {
  try {
    const collectionRef = getCollectionRef(collectionName);
    const querySnapshot = await getDocs(collectionRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as DocumentData
    }));
  } catch (error) {
    console.error(`Error getting all documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get documents from a collection with query constraints
 * @param collectionName The collection to get from
 * @param constraints Array of query constraints
 */
export const getDocumentsWithConstraints = async (collectionName: string, constraints: QueryConstraint[]) => {
  try {
    const collectionRef = getCollectionRef(collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as DocumentData
    }));
  } catch (error) {
    console.error(`Error getting documents from ${collectionName} with constraints:`, error);
    throw error;
  }
};
