
import { doc, updateDoc, increment, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

/**
 * Update an existing document in a collection
 * @param collectionName Name of the collection
 * @param documentId ID of the document to update
 * @param data Data to update
 * @returns Promise with update result
 */
export const updateDocument = async (collectionName: string, documentId: string, data: any) => {
  if (!collectionName || !documentId) {
    console.error("Collection name or document ID is missing", { collectionName, documentId });
    throw new Error("Collection name and document ID are required");
  }
  
  try {
    console.log(`Updating document ${documentId} in collection ${collectionName}`);
    
    const docRef = doc(db, collectionName, documentId);
    
    // Always add updatedAt timestamp
    data.updatedAt = serverTimestamp();
    
    await updateDoc(docRef, data);
    
    console.log(`Document with ID ${documentId} updated in ${collectionName}`);
    return true;
  } catch (error: any) {
    console.error(`Error updating document in ${collectionName}:`, error);
    
    // Check if this is a network error
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    if (errorMessage.includes('offline') || errorMessage.includes('unavailable') || errorMessage.includes('backend')) {
      toast.error('Impossible de mettre à jour le document en mode hors ligne');
    } else {
      toast.error(`Erreur lors de la mise à jour: ${errorMessage}`);
    }
    
    throw error;
  }
};

/**
 * Increment a numeric field in a document
 * @param collectionName Name of the collection
 * @param documentId ID of the document to update
 * @param field Field to increment
 * @param value Amount to increment by (default: 1)
 * @returns Promise with update result
 */
export const incrementField = async (collectionName: string, documentId: string, field: string, value = 1) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      [field]: increment(value),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Error incrementing field ${field} in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Add an element to an array field in a document
 * @param collectionName Name of the collection
 * @param documentId ID of the document to update
 * @param field Array field to update
 * @param element Element to add to the array
 * @returns Promise with update result
 */
export const addToArray = async (collectionName: string, documentId: string, field: string, element: any) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      [field]: arrayUnion(element),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Error adding to array field ${field} in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Remove an element from an array field in a document
 * @param collectionName Name of the collection
 * @param documentId ID of the document to update
 * @param field Array field to update
 * @param element Element to remove from the array
 * @returns Promise with update result
 */
export const removeFromArray = async (collectionName: string, documentId: string, field: string, element: any) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      [field]: arrayRemove(element),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Error removing from array field ${field} in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update a training document in the HR trainings collection
 * @param trainingId ID of the training to update
 * @param data Data to update
 * @returns Promise with update result
 */
export const updateTrainingDocument = async (trainingId: string, data: any) => {
  if (!trainingId) {
    throw new Error("Training ID is required");
  }
  
  try {
    return await updateDocument("hr_trainings", trainingId, data);
  } catch (error) {
    console.error('Error updating training document:', error);
    throw error;
  }
};
