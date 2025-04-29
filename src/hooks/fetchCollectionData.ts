
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
  collectionPath: string, 
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    // Check for empty collection path and handle gracefully
    if (!collectionPath || collectionPath.trim() === '') {
      console.error('Error: Collection path cannot be empty');
      toast.error(`Erreur lors du chargement des données: Collection path cannot be empty`);
      return [];
    }
    
    console.log(`Fetching from collection path: ${collectionPath}`);
    
    const collectionRef = collection(db, collectionPath);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
    
    try {
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot) {
        console.warn(`No snapshot returned from ${collectionPath}`);
        return [];
      }
      
      const results = querySnapshot.docs
        .filter(doc => doc != null) // Filter out null/undefined docs
        .map(doc => {
          return { 
            id: doc.id, 
            ...doc.data() 
          };
        }) as T[];
      
      return Array.isArray(results) ? results : [];
    } catch (fetchErr) {
      console.error(`Error in getDocs for ${collectionPath}:`, fetchErr);
      return [];
    }
  } catch (err: any) {
    console.error(`Error fetching data from ${collectionPath}:`, err);
    toast.error(`Erreur lors du chargement des données: ${err.message}`);
    return [];
  }
}
