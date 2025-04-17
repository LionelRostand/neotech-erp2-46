
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

/**
 * Add a document to a collection
 * @param collectionPath The collection path
 * @param data The document data
 * @returns A promise that resolves with the document reference
 */
export const addDocument = async (collectionPath: string, data: any) => {
  try {
    console.log(`Adding document to collection: ${collectionPath}`, data);
    const collectionRef = collection(db, collectionPath);
    const docRef = await addDoc(collectionRef, data);
    console.log(`Document added successfully with ID: ${docRef.id}`);
    
    // Return the document with its ID
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`Error adding document to ${collectionPath}:`, error);
    toast.error(`Erreur lors de l'ajout du document: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    throw error;
  }
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
  try {
    console.log(`Setting document in collection: ${collectionPath} with ID: ${id}`, data);
    const docRef = doc(db, collectionPath, id);
    await setDoc(docRef, data);
    console.log(`Document set successfully with ID: ${id}`);
    return { id, ...data };
  } catch (error) {
    console.error(`Error setting document in ${collectionPath} with ID ${id}:`, error);
    toast.error(`Erreur lors de la définition du document: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    throw error;
  }
};
