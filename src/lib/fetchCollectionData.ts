
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
    // Safety check - if no valid collectionPath, return empty array
    if (!collectionPath || typeof collectionPath !== 'string') {
      console.error('Invalid collection path provided');
      return [];
    }
    
    const collectionRef = collection(db, collectionPath);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
    const querySnapshot = await getDocs(q);
    
    const result = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as T[];
    
    // Ensure we always return an array
    return Array.isArray(result) ? result : [];
    
  } catch (err: any) {
    console.error(`Error fetching data from ${collectionPath}:`, err);
    toast.error(`Erreur lors du chargement des données: ${err.message}`);
    // Return empty array on error instead of throwing
    return [];
  }
}
