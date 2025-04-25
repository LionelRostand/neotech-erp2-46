
import { collection, getDocs, query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

/**
 * Utility function to fetch data from any Firestore collection
 * with improved error handling and default values
 * @param collectionPath Path to the collection
 * @param constraints Query constraints
 * @returns Promise with the collection data
 */
export async function fetchCollectionData<T>(
  collectionPath: string, 
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    // Check for empty or invalid collection path
    if (!collectionPath || collectionPath.trim() === '') {
      const errorMessage = 'Empty collection path provided';
      console.error(errorMessage);
      toast.error(`Erreur: ${errorMessage}`);
      return [] as T[];
    }
    
    console.log(`Fetching from collection path: ${collectionPath}`);
    
    // Verify database connection
    if (!db) {
      console.error('Firestore instance is not initialized');
      toast.error('La base de données n\'est pas initialisée');
      return [] as T[];
    }
    
    try {
      const collectionRef = collection(db, collectionPath);
      const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
      
      console.log(`Executing query on collection: ${collectionPath}`);
      const querySnapshot = await getDocs(q);
      
      console.log(`Received ${querySnapshot.docs.length} documents from ${collectionPath}`);
      
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as T[];
    } catch (dbErr: any) {
      console.error(`Database error fetching data from ${collectionPath}:`, dbErr);
      
      // Provide more specific error message based on error type
      if (dbErr.code === 'permission-denied') {
        toast.error('Erreur: Permissions insuffisantes pour accéder aux données');
      } else if (dbErr.code === 'unavailable') {
        toast.error('Erreur: La base de données est temporairement indisponible');
      } else {
        toast.error(`Erreur de base de données: ${dbErr.message}`);
      }
      
      return [] as T[];
    }
  } catch (err: any) {
    console.error(`Error fetching data from ${collectionPath}:`, err);
    toast.error(`Erreur lors du chargement des données: ${err.message}`);
    return [] as T[];
  }
}
