
import { collection, getDocs, query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

/**
 * Utility function to fetch data from any Firestore collection
 * @param collectionPath Path to the collection
 * @param constraints Query constraints
 * @returns Promise with the collection data
 */
export async function fetchCollectionData<T>(
  collectionPath: string | null | undefined, 
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    // Check for empty or invalid collection path
    if (!collectionPath || typeof collectionPath !== 'string' || collectionPath.trim() === '') {
      console.error('Error: Collection path cannot be empty or invalid', { path: collectionPath });
      return [];
    }
    
    const path = collectionPath.trim();
    console.log(`Fetching from collection path: ${path}`);
    
    const collectionRef = collection(db, path);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
    const querySnapshot = await getDocs(q);
    
    const result = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as T[];
    
    console.log(`Fetched ${result.length} documents from ${path}`);
    return result;
  } catch (err: any) {
    console.error(`Error fetching data from ${collectionPath}:`, err);
    return [];
  }
}
