
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint, DocumentData, QuerySnapshot, collectionGroup } from 'firebase/firestore';
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
        
        // Check if the collection path contains a slash to determine if we should use collectionGroup
        const useCollectionGroup = collectionPath.includes('/');
        
        let q;
        
        if (useCollectionGroup) {
          // Parse the path and create a document reference
          const pathSegments = collectionPath.split('/');
          if (pathSegments.length === 2) {
            // This is a subcollection path like 'crm/clients'
            // We need to create a collection reference
            const parentCollection = collection(db, pathSegments[0]);
            const subCollection = collection(parentCollection, pathSegments[1]);
            q = query(subCollection, ...queryConstraints);
          } else {
            // Invalid path or more complex path structure, fallback to direct collection
            console.warn(`Complex path detected: ${collectionPath}, using direct collection reference.`);
            const collectionRef = collection(db, collectionPath);
            q = query(collectionRef, ...queryConstraints);
          }
        } else {
          // Simple collection path
          const collectionRef = collection(db, collectionPath);
          q = query(collectionRef, ...queryConstraints);
        }
        
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
