
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint, DocumentData, QuerySnapshot, doc } from 'firebase/firestore';
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
    // Validate collection path first
    if (!collectionPath || collectionPath.trim() === '') {
      console.error('Error: Collection path cannot be empty');
      setError(new Error('Collection path cannot be empty'));
      setIsLoading(false);
      return () => {}; // Return empty cleanup function
    }

    // For development/testing, you can use a timeout to simulate network latency
    const timeoutId = setTimeout(() => {
      try {
        console.log(`Fetching data from collection: ${collectionPath}`);
        
        // Handle collection paths with slashes
        const getCollectionRef = (path: string) => {
          if (path.includes('/')) {
            // Split the path into segments
            const segments = path.split('/');
            
            // For paths like 'crm/clients', use the pattern:
            // collection(db, 'crm', 'crm', 'clients')
            // where first 'crm' is the collection and second 'crm' is a document ID
            if (segments.length === 2) {
              const parentCollection = segments[0];
              const subcollection = segments[1];
              const parentDocId = parentCollection; // Use the collection name as the document ID
              
              console.log(`Creating reference for ${parentCollection}/${parentDocId}/${subcollection}`);
              return collection(db, parentCollection, parentDocId, subcollection);
            }
            
            return collection(db, path);
          } else {
            // Simple collection path
            return collection(db, path);
          }
        };
        
        // Create a reference to the collection
        const collectionRef = getCollectionRef(collectionPath);
        
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
        return () => {}; // Return empty cleanup function on error
      }
    }, 500); // Simulate a small delay for loading states to be visible
    
    return () => clearTimeout(timeoutId);
  }, [collectionPath, JSON.stringify(queryConstraints)]);

  return { data, isLoading, error };
};
