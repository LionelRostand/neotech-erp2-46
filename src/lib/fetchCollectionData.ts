
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
    console.log(`Fetching data from collection: ${collectionPath}`);
    
    // Check for empty collection path and handle gracefully
    if (!collectionPath || collectionPath.trim() === '') {
      console.error('Error: Collection path cannot be empty');
      toast.error(`Erreur lors du chargement des données: Collection path cannot be empty`);
      return [];
    }
    
    const collectionRef = collection(db, collectionPath);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
    const querySnapshot = await getDocs(q);
    
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];

    console.log(`Fetched ${documents.length} documents from ${collectionPath}`);
    
    // If no data returned and it's a garage collection, return default data
    if (documents.length === 0 && collectionPath.includes('garage-')) {
      console.log(`No data found in ${collectionPath}, returning default data`);
      return getDefaultData<T>(collectionPath);
    }
    
    return documents;
  } catch (err: any) {
    console.error(`Error fetching data from ${collectionPath}:`, err);
    toast.error(`Erreur lors du chargement des données: ${err.message}`);
    
    // Return default data for garage collections in case of error
    if (collectionPath.includes('garage-')) {
      console.log(`Error in ${collectionPath}, returning default data`);
      return getDefaultData<T>(collectionPath);
    }
    
    return [];
  }
}

/**
 * Provides default test data for garage collections
 */
function getDefaultData<T>(collectionPath: string): T[] {
  // Default mechanics data
  if (collectionPath === 'garage-mechanics') {
    return [
      {
        id: 'mechanic1',
        firstName: 'Pierre',
        lastName: 'Dubois',
        email: 'pierre.dubois@garage.com',
        phone: '0612345678',
        specialization: ['Mécanique générale', 'Diagnostic'],
        status: 'available',
        hireDate: '2024-01-15'
      },
      {
        id: 'mechanic2',
        firstName: 'Sophie',
        lastName: 'Martin',
        email: 'sophie.martin@garage.com',
        phone: '0687654321',
        specialization: ['Électronique', 'Climatisation'],
        status: 'in_service',
        hireDate: '2023-06-10'
      },
      {
        id: 'mechanic3',
        firstName: 'Luc',
        lastName: 'Lambert',
        email: 'luc.lambert@garage.com',
        phone: '0633445566',
        specialization: ['Carrosserie', 'Peinture'],
        status: 'available',
        hireDate: '2022-11-20'
      }
    ] as unknown as T[];
  }
  
  // Default data for other collections
  // Return empty array for unknown collections
  return [] as T[];
}
