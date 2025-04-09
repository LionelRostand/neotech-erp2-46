
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
    
    await updateDoc(docRef, updatedData);
    console.log(`Document ${id} updated successfully`);
    toast.success('Document mis à jour avec succès');
    return { id, ...updatedData };
  } catch (error) {
    console.error(`Error updating document ${id}:`, error);
    toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    throw error;
  }
};

// Create or update a document with a specific ID
export const setDocument = async (collectionName: string, id: string, data: DocumentData) => {
  try {
    console.log(`Setting document ${id} in collection ${collectionName}`);
    console.log('Document data:', data);
    
    const docRef = getDocRef(collectionName, id);
    const updatedData = formatDocumentWithTimestamps(data);
    
    await setDoc(docRef, updatedData, { merge: true });
    console.log(`Document ${id} set successfully`);
    toast.success('Document créé/mis à jour avec succès');
    return { id, ...updatedData };
  } catch (error) {
    console.error(`Error setting document ${id}:`, error);
    toast.error(`Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    throw error;
  }
};
