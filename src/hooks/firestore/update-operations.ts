
import { 
  DocumentData,
  updateDoc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { getDocRef, formatDocumentWithTimestamps } from './common-utils';
import { toast } from 'sonner';

// Update an existing document
export const updateDocument = async (collectionName: string, id: string, data: DocumentData) => {
  try {
    console.log(`Updating document ${id} in collection ${collectionName}`);
    console.log('Update data:', data);
    
    const docRef = getDocRef(collectionName, id);
    
    // Vérifier d'abord si le document existe
    const docSnapshot = await getDoc(docRef);
    const exists = docSnapshot.exists();
    
    // Nettoyer les données pour éliminer les valeurs undefined
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    console.log('Données nettoyées avant mise à jour:', cleanedData);
    
    // Préparer les données avec les timestamps
    const updatedData = formatDocumentWithTimestamps(cleanedData);
    
    // Make sure ID is not included in the update data
    // as Firebase doesn't need it and it could cause problems
    const { id: _, ...dataWithoutId } = updatedData;
    
    if (exists) {
      // Document exists, update it
      console.log(`Document ${id} exists, updating with updateDoc`);
      await updateDoc(docRef, dataWithoutId);
      console.log(`Document ${id} updated successfully with updateDoc`);
    } else {
      // Document doesn't exist, create it with setDoc
      console.log(`Document ${id} does not exist, creating with setDoc`);
      await setDoc(docRef, updatedData);
      console.log(`Document ${id} created with setDoc`);
    }
    
    console.log(`Document ${id} processed successfully`);
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
    
    // Nettoyer les données pour éliminer les valeurs undefined
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    console.log('Données nettoyées avant setDocument:', cleanedData);
    
    const docRef = getDocRef(collectionName, id);
    const updatedData = formatDocumentWithTimestamps(cleanedData);
    
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
