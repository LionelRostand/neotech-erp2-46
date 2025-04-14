
import { 
  DocumentData,
  addDoc,
  collection
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDocumentWithTimestamps } from './common-utils';
import { toast } from 'sonner';

// Add a new document to a collection with an auto-generated ID
export const addDocument = async (collectionName: string, data: DocumentData) => {
  try {
    console.log(`Adding document to collection ${collectionName}`);
    console.log('Document data:', data);
    
    const collectionRef = collection(db, collectionName);
    const documentData = formatDocumentWithTimestamps(data);
    
    const docRef = await addDoc(collectionRef, documentData);
    console.log(`Document with ID ${docRef.id} added to ${collectionName}`);
    return { id: docRef.id, ...documentData };
  } catch (error: any) {
    console.error(`Error adding document to ${collectionName}:`, error);
    
    // Check if this is a network error
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    if (errorMessage.includes('offline') || errorMessage.includes('unavailable') || errorMessage.includes('backend')) {
      toast.success('Document enregistré en mode hors ligne. Les modifications seront synchronisées plus tard.');
      return { ...data, _offlineCreated: true };
    } else {
      toast.error(`Erreur lors de la création: ${errorMessage}`);
      throw error;
    }
  }
};
