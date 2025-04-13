
import { 
  DocumentData,
  updateDoc,
  setDoc
} from 'firebase/firestore';
import { getDocRef, formatDocumentWithTimestamps } from './common-utils';
import { toast } from 'sonner';

// Update an existing document
export const updateDocument = async (collectionName: string, id: string, data: DocumentData) => {
  try {
    console.log(`Updating document ${id} in collection ${collectionName}`);
    console.log('Update data:', data);
    
    const docRef = getDocRef(collectionName, id);
    const updatedData = formatDocumentWithTimestamps(data);
    
    // Make sure ID is not included in the update data
    // as Firebase doesn't need it and it could cause problems
    const { id: _, ...dataWithoutId } = updatedData;
    
    try {
      // Try to update first
      await updateDoc(docRef, dataWithoutId);
      console.log(`Document ${id} updated successfully with updateDoc`);
    } catch (updateError: any) {
      // If the document doesn't exist, set it instead
      if (updateError.code === 'not-found') {
        console.log(`Document ${id} not found, creating instead of updating`);
        // For setDoc, we want to include the ID
        await setDoc(docRef, updatedData);
        console.log(`Document ${id} created with setDoc`);
      } else {
        // If it's another error, propagate it
        console.error(`Error in updateDoc: ${updateError.message}`, updateError);
        throw updateError;
      }
    }
    
    console.log(`Document ${id} updated successfully`);
    return { id, ...updatedData };
  } catch (error: any) {
    console.error(`Error updating document ${id}:`, error);
    
    // Check if this is a network error
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    if (errorMessage.includes('offline') || errorMessage.includes('unavailable') || errorMessage.includes('backend')) {
      toast.success('Document mis à jour en mode hors ligne. Les modifications seront synchronisées plus tard.');
      return { id, ...data, _offlineUpdated: true };
    } else {
      toast.error(`Erreur lors de la mise à jour: ${errorMessage}`);
      throw error;
    }
  }
};

// Create or update a document with a specific ID
export const setDocument = async (collectionName: string, id: string, data: DocumentData) => {
  try {
    console.log(`Setting document ${id} in collection ${collectionName}`);
    console.log('Document data:', data);
    
    const docRef = getDocRef(collectionName, id);
    const updatedData = formatDocumentWithTimestamps(data);
    
    // Use merge: true to merge data instead of replacing the entire document
    await setDoc(docRef, updatedData, { merge: true });
    console.log(`Document ${id} set successfully`);
    return { id, ...updatedData };
  } catch (error: any) {
    console.error(`Error setting document ${id}:`, error);
    
    // Check if this is a network error
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    if (errorMessage.includes('offline') || errorMessage.includes('unavailable') || errorMessage.includes('backend')) {
      toast.success('Document enregistré en mode hors ligne. Les modifications seront synchronisées plus tard.');
      return { id, ...data, _offlineUpdated: true };
    } else {
      toast.error(`Erreur lors de la sauvegarde: ${errorMessage}`);
      throw error;
    }
  }
};
