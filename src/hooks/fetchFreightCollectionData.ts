
import { collection, getDocs, query, QueryConstraint, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { isNetworkError, reconnectToFirestore } from './firestore/network-handler';

/**
 * Utility function to fetch data from any Freight Firestore collection
 * @param collectionName Collection name (without the prefix)
 * @param constraints Query constraints
 * @returns Promise with the collection data
 */
export async function fetchFreightCollectionData<T>(
  collectionName: keyof typeof COLLECTIONS.FREIGHT, 
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const collectionPath = COLLECTIONS.FREIGHT[collectionName];
    console.log(`Fetching from collection path: ${collectionPath}`);
    
    // Handle paths with slashes - convert "freight/shipments" to appropriate Firestore path
    const parts = collectionPath.split('/');
    let collectionRef;
    
    if (parts.length === 2) {
      // For paths like "freight/shipments", we need to use the pattern:
      // collection(db, 'freight', 'freight', 'shipments')
      // This creates a reference to a subcollection 'shipments' within document 'freight' in collection 'freight'
      const docRef = doc(db, parts[0], parts[0]);
      collectionRef = collection(docRef, parts[1]);
      console.log(`Using subcollection reference: ${parts[0]}/${parts[0]}/${parts[1]}`);
    } else {
      // Regular collection path
      collectionRef = collection(db, collectionPath);
    }
    
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
    const querySnapshot = await getDocs(q);
    
    console.log(`Fetched ${querySnapshot.docs.length} documents from ${collectionName}`);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure data is an object before spreading
      return {
        id: doc.id,
        ...(typeof data === 'object' && data !== null ? data : {})
      } as T;
    });
  } catch (err: any) {
    console.error(`Error fetching data from ${collectionName}:`, err);
    
    // Check if this is a network error and handle accordingly
    if (isNetworkError(err)) {
      console.log('Network error detected, attempting to recover...');
      toast.error(`Erreur de connexion: L'application est hors ligne. Tentative de reconnexion...`);
      
      // Try to reconnect
      const reconnected = await reconnectToFirestore();
      if (reconnected) {
        toast.success('Connexion rétablie. Veuillez réessayer.');
      } else {
        toast.error('Impossible de se reconnecter. Vérifiez votre connexion internet.');
      }
      
      // Return empty array for offline mode
      return [] as T[];
    }
    
    toast.error(`Erreur lors du chargement des données: ${err.message}`);
    throw err;
  }
}

/**
 * Utility function to check if a collection exists
 * @param collectionName Collection name (without the prefix)
 * @returns Promise with boolean indicating if collection exists and has documents
 */
export async function checkFreightCollectionExists(
  collectionName: keyof typeof COLLECTIONS.FREIGHT
): Promise<boolean> {
  try {
    const collectionPath = COLLECTIONS.FREIGHT[collectionName];
    
    // Handle paths with slashes
    const parts = collectionPath.split('/');
    let collectionRef;
    
    if (parts.length === 2) {
      // For paths like "freight/shipments", we need to use the pattern:
      // collection(db, 'freight', 'freight', 'shipments')
      const docRef = doc(db, parts[0], parts[0]);
      collectionRef = collection(docRef, parts[1]);
    } else {
      // Regular collection path
      collectionRef = collection(db, collectionPath);
    }
    
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (err: any) {
    console.error(`Error checking if collection ${collectionName} exists:`, err);
    
    // For network errors, assume the collection exists (to prevent false negatives)
    if (isNetworkError(err)) {
      return true; 
    }
    
    return false;
  }
}
