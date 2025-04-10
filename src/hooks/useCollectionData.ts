
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint, DocumentData, QuerySnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { isNetworkError, reconnectToFirestore } from './firestore/network-handler';

interface UseCollectionDataOptions {
  fallbackData?: any[];
}

/**
 * Custom hook to fetch data from a Firestore collection with real-time updates
 * @param collectionPath Path to the Firestore collection
 * @param queryConstraints Optional query constraints (where, orderBy, limit, etc.)
 * @param options Additional options like fallback data for permission errors
 * @returns Object containing data, loading state, and error if any
 */
export const useCollectionData = (
  collectionPath: string,
  queryConstraints: QueryConstraint[] = [],
  options: UseCollectionDataOptions = {}
) => {
  const { fallbackData = [] } = options;
  const [data, setData] = useState<any[]>(fallbackData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    // For development/testing, you can use a timeout to simulate network latency
    const timeoutId = setTimeout(() => {
      try {
        console.log(`Fetching data from collection: ${collectionPath}`);
        
        // Handle collection paths with slashes
        const getCollectionRef = (path: string) => {
          if (path.includes('/')) {
            // Split the path into segments
            const segments = path.split('/');
            
            // For paths like 'freight/shipments', use the pattern:
            // collection(db, 'freight', 'freight', 'shipments')
            // where first 'freight' is the collection and second 'freight' is a document ID
            if (segments.length === 2) {
              const parentCollection = segments[0];
              const subcollection = segments[1];
              
              // Create a reference to the document in the parent collection
              const docRef = doc(db, parentCollection, parentCollection);
              // Then create a reference to the subcollection in that document
              const collRef = collection(docRef, subcollection);
              
              console.log(`Creating reference for ${parentCollection}/${parentCollection}/${subcollection}`);
              return collRef;
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
            setIsOffline(false);
            setUsedFallback(false);
            console.log(`Received ${documents.length} documents from ${collectionPath}`);
          },
          async (err: Error) => {
            console.error(`Error fetching from ${collectionPath}:`, err);
            
            // Check if it's a permissions error
            const isPermissionError = err.message?.includes('permission-denied') || 
                                      err.message?.includes('Missing or insufficient permissions');
            
            if (isPermissionError && fallbackData && fallbackData.length > 0) {
              console.log(`Using fallback data for ${collectionPath} due to permission error`);
              setData(fallbackData);
              setUsedFallback(true);
              setIsLoading(false);
              // We don't show an error toast for permissions when fallback data is available
            }
            else if (isNetworkError(err)) {
              console.log('Network error detected in useCollectionData, app is offline');
              setIsOffline(true);
              
              if (fallbackData && fallbackData.length > 0) {
                setData(fallbackData);
                setUsedFallback(true);
              }
              
              toast.error('Votre appareil semble être hors ligne. Certaines fonctionnalités peuvent être limitées.');
              
              // Try to reconnect
              const reconnected = await reconnectToFirestore();
              if (reconnected) {
                toast.success('Connexion rétablie. Les données vont se recharger automatiquement.');
              }
            } else {
              // For other types of errors, show the error
              setError(err);
            }
            
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
        
        // Use fallback data if available
        if (fallbackData && fallbackData.length > 0) {
          console.log(`Using fallback data for ${collectionPath} due to setup error`);
          setData(fallbackData);
          setUsedFallback(true);
        } else {
          setError(error);
        }
        
        setIsLoading(false);
      }
    }, 500); // Simulate a small delay for loading states to be visible
    
    return () => clearTimeout(timeoutId);
  }, [collectionPath, JSON.stringify(queryConstraints), JSON.stringify(fallbackData)]);

  return { data, isLoading, error, isOffline, usedFallback };
};
