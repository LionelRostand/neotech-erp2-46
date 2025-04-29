
import { COLLECTIONS } from './firebase-collections';
import { collection, doc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Add a document to a collection with auto-generated ID
 * @param collectionPath Firestore collection path
 * @param data Document data
 * @returns The document ID
 */
export const addDocument = async (collectionPath: string, data: any) => {
  try {
    const colRef = collection(db, collectionPath);
    const id = data.id || `${Date.now()}-${uuidv4().substring(0, 8)}`;
    
    // Use setDoc with a specific ID instead of addDoc for better control
    await setDoc(doc(colRef, id), {
      ...data,
      id,
      createdAt: data.createdAt || new Date().toISOString()
    });
    
    return id;
  } catch (error) {
    console.error(`Error adding document to ${collectionPath}:`, error);
    throw error;
  }
};

/**
 * Update a document in a collection
 * @param collectionPath Firestore collection path
 * @param docId Document ID
 * @param data Updated data
 */
export const updateDocument = async (collectionPath: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionPath, docId);
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    return docId;
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionPath}:`, error);
    throw error;
  }
};

/**
 * Delete a document from a collection
 * @param collectionPath Firestore collection path
 * @param docId Document ID
 */
export const deleteDocument = async (collectionPath: string, docId: string) => {
  try {
    const docRef = doc(db, collectionPath, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document ${docId} from ${collectionPath}:`, error);
    throw error;
  }
};
