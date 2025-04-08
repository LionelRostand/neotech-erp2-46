
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
    console.log(`Fetching from collection path: ${collectionPath}`);
    
    // Handle paths with slashes - convert "freight/shipments" to appropriate Firestore path
    const parts = collectionPath.split('/');
    let collectionRef;
    
    if (parts.length === 2) {
      // For paths like "freight/shipments", we need to use the pattern:
      // collection(db, 'freight', 'freight', 'shipments')
      collectionRef = collection(db, parts[0], parts[0], parts[1]);
      console.log(`Using subcollection reference: ${parts[0]}/${parts[0]}/${parts[1]}`);
    } else {
      // Regular collection path
      collectionRef = collection(db, collectionPath);
    }
    
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
    const querySnapshot = await getDocs(q);
    
    console.log(`Fetched ${querySnapshot.docs.length} documents from ${collectionPath}`);
    
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as T[];
  } catch (err: any) {
    console.error(`Error fetching data from ${collectionPath}:`, err);
    toast.error(`Erreur lors du chargement des données: ${err.message}`);
    throw err;
  }
}
