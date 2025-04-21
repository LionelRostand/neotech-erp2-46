
import { collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Adds a new document to a collection with an auto-generated ID
 * @param collectionPath Path to the collection
 * @param data Document data
 * @returns Promise with the document reference
 */
export const addDocument = async (collectionPath: string, data: any) => {
  try {
    const collectionRef = collection(db, collectionPath);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: data.createdAt || serverTimestamp(),
      updatedAt: data.updatedAt || serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`Error adding document to ${collectionPath}:`, error);
    throw error;
  }
};

/**
 * Creates a new document with a specified ID
 * @param collectionPath Path to the collection
 * @param docId Document ID
 * @param data Document data
 * @returns Promise
 */
export const createDocument = async (collectionPath: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionPath, docId);
    await setDoc(docRef, {
      ...data,
      createdAt: data.createdAt || serverTimestamp(),
      updatedAt: data.updatedAt || serverTimestamp()
    });
    return { id: docId, ...data };
  } catch (error) {
    console.error(`Error creating document in ${collectionPath}:`, error);
    throw error;
  }
};
