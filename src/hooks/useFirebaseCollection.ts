
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

/**
 * Hook personnalisé pour récupérer des données d'une collection Firestore avec mises à jour en temps réel
 * @param collectionPath Chemin vers la collection Firestore
 * @param queryConstraints Contraintes de requête optionnelles (where, orderBy, limit, etc.)
 * @returns Objet contenant les données, l'état de chargement et les erreurs éventuelles
 */
export const useFirebaseCollection = <T>(
  collectionPath: string,
  queryConstraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    // Check for empty collection path and exit the effect with appropriate error
    if (!collectionPath || collectionPath.trim() === '') {
      console.error('Collection path cannot be empty');
      setError(new Error('Collection path cannot be empty'));
      setIsLoading(false);
      toast.error('Erreur: Chemin de collection invalide ou vide');
      return () => {}; // Return empty cleanup function
    }
    
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
          })) as T[];
          
          setData(documents);
          setIsLoading(false);
          console.log(`Received ${documents.length} documents from ${collectionPath}`);
        },
        (err: Error) => {
          console.error(`Error fetching from ${collectionPath}:`, err);
          setError(err);
          setIsLoading(false);
          toast.error(`Erreur lors du chargement des données: ${err.message}`);
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
      toast.error(`Erreur lors du chargement des données: ${error.message}`);
      return () => {}; // Return empty cleanup function
    }
  }, [collectionPath, JSON.stringify(queryConstraints), refetchTrigger]);

  // Function to trigger a refetch
  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { data: data || [], isLoading, error, refetch };
};
