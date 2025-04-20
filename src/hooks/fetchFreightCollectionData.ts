
import { collection, getDocs, query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const fetchFreightCollection = async <T>(
  collectionName: keyof typeof COLLECTIONS.FREIGHT,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const collectionPath = COLLECTIONS.FREIGHT[collectionName];
    console.log(`Fetching from freight collection: ${collectionPath}`);
    
    if (!collectionPath) {
      console.error(`Invalid collection name: ${collectionName}`);
      return [];
    }
    
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (err: any) {
    console.error(`Error fetching freight collection ${collectionName}:`, err);
    throw err;
  }
};

export { fetchFreightCollection as fetchFreightCollectionData };

