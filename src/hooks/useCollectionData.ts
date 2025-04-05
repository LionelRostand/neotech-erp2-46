
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
    // For development/testing, you can use a timeout to simulate network latency
    const timeoutId = setTimeout(() => {
      try {
        console.log(`Fetching data from collection: ${collectionPath}`);
        
        // Handle collection paths with slashes by splitting and using the correct method
        const createCollectionRef = (path: string) => {
          // Check if the path contains a slash
          if (path.includes('/')) {
            // Split the path into segments
            const segments = path.split('/');
            let collRef = collection(db, segments[0]);
            
            // For paths like 'crm/clients', use the document then collection pattern
            if (segments.length === 2) {
              // We need a static document ID to represent the parent document
              const parentDocId = segments[0]; // Use first segment as doc ID
              return collection(db, segments[0], parentDocId, segments[1]);
            }
            
            return collRef;
          } else {
            // Simple collection path
            return collection(db, path);
          }
        };
        
        // Create a reference to the collection
        const collectionRef = createCollectionRef(collectionPath);
        
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
      }
    }, 500); // Simulate a small delay for loading states to be visible
    
    return () => clearTimeout(timeoutId);
  }, [collectionPath, JSON.stringify(queryConstraints)]);

  return { data, isLoading, error };
};
