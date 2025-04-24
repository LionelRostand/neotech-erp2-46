
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint, DocumentData, QuerySnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

/**
 * Custom hook to fetch data from a Firestore collection with real-time updates
 * @param collectionPath Path to the Firestore collection
 * @param queryConstraints Optional query constraints (where, orderBy, limit, etc.)
 * @returns Object containing data, loading state, and error if any
 */
export const useCollectionData = (
  collectionPath: string,
  queryConstraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Validate collection path first
    if (!collectionPath || collectionPath.trim() === '') {
      const errorMsg = 'Collection path cannot be empty';
      console.error(`Error: ${errorMsg}`);
      setError(new Error(errorMsg));
      setIsLoading(false);
      toast.error(errorMsg);
      return () => {}; // Return empty cleanup function
    }

    // For development/testing, you can use a timeout to simulate network latency
    const timeoutId = setTimeout(() => {
      try {
        console.log(`Fetching data from collection: ${collectionPath}`);
        
        // Create a reference to the collection
        const collectionRef = collection(db, collectionPath);
        
        // Create a query with the provided constraints
        const q = query(collectionRef, ...queryConstraints);
        
        // Set up a real-time listener
        const unsubscribe = onSnapshot(
          q,
          (snapshot: QuerySnapshot<DocumentData>) => {
            const documents = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setData(documents);
            setIsLoading(false);
            console.log(`Received ${documents.length} documents from ${collectionPath}`);
          },
          (err: Error) => {
            console.error(`Error fetching from ${collectionPath}:`, err);
            setError(err);
            setIsLoading(false);
            toast.error(`Erreur de chargement: ${err.message}`);
          }
        );
        
        // Clean up subscription on unmount
        return () => {
          console.log(`Unsubscribing from collection: ${collectionPath}`);
          unsubscribe();
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error occurred');
        console.error(`Error setting up listener for ${collectionPath}:`, error);
        setError(error);
        setIsLoading(false);
        toast.error(`Erreur: ${error.message}`);
        return () => {}; // Return empty cleanup function on error
      }
    }, 500); // Simulate a small delay for loading states to be visible
    
    return () => clearTimeout(timeoutId);
  }, [collectionPath, JSON.stringify(queryConstraints)]);

  return { data, isLoading, error };
};
