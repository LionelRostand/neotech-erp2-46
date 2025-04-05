
import { 
  DocumentData,
  addDoc
} from 'firebase/firestore';
import { getCollectionRef, formatDocumentWithTimestamps } from './common-utils';

/**
 * Add a new document to a collection
 * @param collectionName Collection path
 * @param data Document data
 * @returns Created document with ID
 */
export const addDocument = async (collectionName: string, data: DocumentData) => {
  try {
    console.log(`Adding document to collection ${collectionName}:`, data);
    const collectionRef = getCollectionRef(collectionName);
    const formattedData = formatDocumentWithTimestamps(data);
    
    const docRef = await addDoc(collectionRef, formattedData);
    console.log(`Document added with ID: ${docRef.id}`);
    return { id: docRef.id, ...formattedData };
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};
