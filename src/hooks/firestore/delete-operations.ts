
import { 
  deleteDoc
} from 'firebase/firestore';
import { getDocRef } from './common-utils';
import { toast } from 'sonner';

/**
 * Delete a document from a collection
 * @param collectionName Collection path
 * @param id Document ID
 * @returns True if successful
 */
export const deleteDocument = async (collectionName: string, id: string): Promise<boolean> => {
  try {
    console.log(`Deleting document ${id} from collection ${collectionName}`);
    
    const docRef = getDocRef(collectionName, id);
    await deleteDoc(docRef);
    
    console.log(`Document ${id} deleted successfully`);
    toast.success('Document supprimé avec succès');
    return true;
  } catch (error) {
    console.error(`Error deleting document ${id}:`, error);
    toast.error('Erreur lors de la suppression du document');
    return false;
  }
};
