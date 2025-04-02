
import { useState, useEffect } from 'react';
import { collection, getDocs, query, QueryConstraint, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

/**
 * Custom hook to fetch data from a Firestore collection with proper typing
 * @param collectionPath The path to the Firestore collection
 * @param constraints Any query constraints to apply
 * @param transform Optional function to transform the raw data
 */
export function useCollectionData<T = DocumentData>(
  collectionPath: string,
  constraints: QueryConstraint[] = [],
  transform?: (data: DocumentData) => T
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const collectionRef = collection(db, collectionPath);
        const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
        const querySnapshot = await getDocs(q);
        
        let fetchedData: T[] = [];
        
        if (transform) {
          fetchedData = querySnapshot.docs.map(doc => transform({ id: doc.id, ...doc.data() }));
        } else {
          fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
        }
        
        setData(fetchedData);
        setError(null);
      } catch (err: any) {
        console.error(`Error fetching data from ${collectionPath}:`, err);
        setError(err);
        toast.error(`Erreur lors du chargement des données: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [collectionPath, JSON.stringify(constraints)]);

  return { data, isLoading, error };
}
