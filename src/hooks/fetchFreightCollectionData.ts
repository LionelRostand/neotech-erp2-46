
import { collection, getDocs, query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export const fetchFreightCollection = async <T>(
  collectionName: keyof typeof COLLECTIONS.FREIGHT,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const collectionPath = COLLECTIONS.FREIGHT[collectionName];
    console.log(`Fetching from freight collection: ${collectionPath}`);
    
    if (!collectionPath || collectionPath.trim() === '') {
      console.error(`Invalid or empty collection name: ${collectionName}`);
      toast.error(`Erreur: Collection non disponible (${collectionName})`);
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
    toast.error(`Erreur lors du chargement des données: ${err.message}`);
    return [];
  }
};

export { fetchFreightCollection as fetchFreightCollectionData };
