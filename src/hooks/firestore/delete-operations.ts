
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
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du document ${id}:`, error);
    toast.error(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    throw error;
  }
};
