
import { collection, getDocs, query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

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
    const collectionRef = collection(db, collectionPath);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
    const querySnapshot = await getDocs(q);
    
    console.log(`Fetched ${querySnapshot.docs.length} documents from ${collectionName}`);
    
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as T[];
  } catch (err: any) {
    console.error(`Error fetching data from ${collectionName}:`, err);
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
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (err: any) {
    console.error(`Error checking if collection ${collectionName} exists:`, err);
    return false;
  }
}
