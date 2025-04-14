
import { 
  doc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

/**
 * Delete a document from Firestore
 * @param collectionName The collection to delete from
 * @param documentId The document ID to delete
 */
export const deleteDocument = async (collectionName: string, documentId: string) => {
  try {
    console.log(`Deleting document ${documentId} from collection ${collectionName}`);
    
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    
    console.log(`Document ${documentId} successfully deleted from ${collectionName}`);
    return true;
  } catch (error: any) {
    console.error(`Error deleting document ${documentId} from ${collectionName}:`, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    toast.error(`Erreur lors de la suppression: ${errorMessage}`);
    throw error;
  }
};
