
import { deleteDoc } from 'firebase/firestore';
import { getDocRef } from './common-utils';
import { toast } from 'sonner';

// Supprimer un document
export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    console.log(`Suppression du document ${id} de la collection ${collectionName}`);
    const docRef = getDocRef(collectionName, id);
    await deleteDoc(docRef);
    console.log(`Document ${id} supprimé avec succès`);
    toast.success(`Document supprimé avec succès`);
    return { success: true, id };
  } catch (error) {
    console.error(`Erreur lors de la suppression du document ${id}:`, error);
    
    // Check if this is a network error
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    if (errorMessage.includes('offline') || errorMessage.includes('unavailable') || errorMessage.includes('backend')) {
      toast.success('Document marqué pour suppression en mode hors ligne. Les modifications seront synchronisées plus tard.');
      return { success: true, id, _offlineDeleted: true };
    } else {
      toast.error(`Erreur lors de la suppression: ${errorMessage}`);
      throw error;
    }
  }
};
