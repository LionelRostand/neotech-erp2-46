
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

/**
 * Add a document to a collection
 * @param collectionPath The collection path
 * @param data The document data
 * @returns A promise that resolves with the document reference
 */
export const addDocument = async (collectionPath: string, data: any) => {
  return await addDoc(collection(db, collectionPath), data);
};

/**
 * Add a document to the trainings collection
 * @param data The training data
 * @returns A promise that resolves with the document reference
 */
export const addTrainingDocument = async (data: any) => {
  return await addDocument(COLLECTIONS.HR.TRAININGS, data);
};

/**
 * Set a document in a collection with a specific ID
 * @param collectionPath The collection path
 * @param id The document ID
 * @param data The document data
 * @returns A promise that resolves when the operation is complete
 */
export const setDocument = async (collectionPath: string, id: string, data: any) => {
  return await setDoc(doc(db, collectionPath, id), data);
};
