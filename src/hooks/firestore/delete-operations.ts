
import { 
  doc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Delete a document from a collection
export const deleteDocument = async (collectionName: string, documentId: string) => {
  try {
    console.log(`Deleting document ${documentId} from collection ${collectionName}`);
    
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    
    console.log(`Document with ID ${documentId} deleted from ${collectionName}`);
    return true;
  } catch (error: any) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    
    // Check if this is a network error
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    if (errorMessage.includes('offline') || errorMessage.includes('unavailable') || errorMessage.includes('backend')) {
      toast.error('Impossible de supprimer le document en mode hors ligne');
    } else {
      toast.error(`Erreur lors de la suppression: ${errorMessage}`);
    }
    
    throw error;
  }
};

// Export other delete operations if needed
export { deleteDocument as deleteOperation };

// Add a specialized function for deleting training documents
export const deleteTrainingDocument = async (trainingId: string) => {
  return deleteDocument(COLLECTIONS.HR.TRAININGS, trainingId);
};
