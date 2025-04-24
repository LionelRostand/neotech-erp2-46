
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

/**
 * Custom hook to fetch data from a Firestore collection with real-time updates
 * @param collectionPath Path to the Firestore collection
 * @param queryConstraints Optional query constraints (where, orderBy, limit, etc.)
 * @returns Object containing data, loading state, and error if any
 */
export const useCollectionData = (
  collectionPath: string | null | undefined,
  queryConstraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Validate collection path first - early return if invalid
    if (!collectionPath || typeof collectionPath !== 'string' || collectionPath.trim() === '') {
      console.error('Invalid collection path:', collectionPath);
      setError(new Error('Collection path cannot be empty'));
      setIsLoading(false);
      setData([]); // Return empty data array
      return () => {}; // Return empty cleanup function
    }

    const validPath = collectionPath.trim();
    console.log(`Setting up listener for collection: ${validPath}`);
    
    try {
      // Create a reference to the collection
      const collectionRef = collection(db, validPath);
      
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
          console.log(`Received ${documents.length} documents from ${validPath}`);
        },
        (err: Error) => {
          console.error(`Error fetching from ${validPath}:`, err);
          setError(err);
          setIsLoading(false);
          setData([]); // Return empty data array on error
        }
      );
      
      // Clean up subscription on unmount
      return () => {
        console.log(`Unsubscribing from collection: ${validPath}`);
        unsubscribe();
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      console.error(`Error setting up listener for ${validPath}:`, error);
      setError(error);
      setIsLoading(false);
      setData([]); // Return empty data array on error
      return () => {}; // Return empty cleanup function
    }
  }, [collectionPath, JSON.stringify(queryConstraints)]);

  return { data, isLoading, error };
};

/**
 * Custom hook to fetch data from a Firestore collection with real-time updates
 * @param collectionPath Path to the Firestore collection
 * @param queryConstraints Optional query constraints
 * @returns Object containing data, loading state, and error if any
 */
export const useFirebaseCollection = <T extends Record<string, any>>(
  collectionPath: string | null | undefined,
  queryConstraints: QueryConstraint[] = []
) => {
  // Ensure collection path has a valid fallback value
  const safeCollectionPath = collectionPath && typeof collectionPath === 'string' && collectionPath.trim() !== '' 
    ? collectionPath.trim() 
    : null;
    
  // Use the base collection data hook with proper validation
  const { data, isLoading, error } = useCollectionData(safeCollectionPath, queryConstraints);

  // Provide more debug information on error
  useEffect(() => {
    if (error) {
      console.error(`Firebase collection error for "${safeCollectionPath}":`, error);
    }
  }, [safeCollectionPath, error]);

  // Return type-safe version of the data
  return {
    data: data as T[],
    isLoading,
    error,
    refetch: () => {
      console.log("Refetch requested for", safeCollectionPath);
      // Real-time listeners don't need manual refetching but we can add functionality here if needed
    }
  };
};
