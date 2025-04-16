
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Add a document to a collection with an auto-generated ID
 * @param collectionPath Collection path
 * @param data Document data
 * @returns The document ID
 */
export const addDocument = async (collectionPath: string, data: any) => {
  try {
    const collectionRef = collection(db, collectionPath);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

/**
 * Add a document to a collection with a specific ID
 * @param collectionPath Collection path
 * @param id Document ID
 * @param data Document data
 */
export const addDocumentWithId = async (collectionPath: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionPath, id);
    await setDoc(docRef, data);
    return id;
  } catch (error) {
    console.error('Error adding document with ID:', error);
    throw error;
  }
};

/**
 * Add multiple documents to a collection
 * @param collectionPath Collection path
 * @param dataArray Array of document data
 * @returns Array of document IDs
 */
export const addMultipleDocuments = async (collectionPath: string, dataArray: any[]) => {
  try {
    const ids = [];
    for (const data of dataArray) {
      const id = await addDocument(collectionPath, data);
      ids.push(id);
    }
    return ids;
  } catch (error) {
    console.error('Error adding multiple documents:', error);
    throw error;
  }
};
