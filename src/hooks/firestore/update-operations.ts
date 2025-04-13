
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
    
    // Assurez-vous que l'ID n'est pas inclus dans les données de mise à jour
    // car Firebase ne le nécessite pas et pourrait causer des problèmes
    const { id: _, ...dataWithoutId } = updatedData;
    
    try {
      // Essayer d'abord de mettre à jour
      await updateDoc(docRef, dataWithoutId);
    } catch (updateError) {
      // Si le document n'existe pas, le créer à la place
      if (updateError.code === 'not-found') {
        console.log(`Document ${id} not found, creating instead of updating`);
        await setDoc(docRef, updatedData);
      } else {
        // Si c'est une autre erreur, la propager
        throw updateError;
      }
    }
    
    console.log(`Document ${id} updated successfully`);
    toast.success('Document mis à jour avec succès');
    return { id, ...updatedData };
  } catch (error) {
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
    
    await setDoc(docRef, updatedData, { merge: true });
    console.log(`Document ${id} set successfully`);
    toast.success('Document créé/mis à jour avec succès');
    return { id, ...updatedData };
  } catch (error) {
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
