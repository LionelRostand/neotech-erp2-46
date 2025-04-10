
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { isNetworkError } from './firestore/network-handler';

/**
 * Hook générique pour récupérer des données depuis une collection Firebase avec mise à jour en temps réel
 * @param collectionPath Chemin de la collection Firestore (ex: COLLECTIONS.COMPANIES)
 * @param queryConstraints Contraintes optionnelles pour la requête
 */
export function useFirebaseCollection<T>(
  collectionPath: string,
  queryConstraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fonction pour charger les données une seule fois en cas de problème avec le listener
  const fetchDataOnce = useCallback(async () => {
    try {
      console.log(`Récupération unique depuis ${collectionPath}...`);
      
      const collectionRef = collection(db, collectionPath);
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      const fetchedData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as T[];
      
      console.log(`${fetchedData.length} documents récupérés depuis ${collectionPath}`);
      setData(fetchedData);
      return fetchedData;
    } catch (err) {
      console.error(`Échec de la récupération depuis ${collectionPath}:`, err);
      throw err;
    }
  }, [collectionPath, queryConstraints]);

  // Fonction pour rafraîchir manuellement les données
  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchDataOnce();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDataOnce]);

  useEffect(() => {
    setIsLoading(true);
    
    try {
      console.log(`Configuration du listener pour ${collectionPath}...`);
      
      // Utiliser onSnapshot pour obtenir des mises à jour en temps réel
      const collectionRef = collection(db, collectionPath);
      const q = query(collectionRef, ...queryConstraints);
      
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const fetchedData = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          })) as T[];
          
          console.log(`Mise à jour en temps réel: ${fetchedData.length} documents depuis ${collectionPath}`);
          setData(fetchedData);
          setIsLoading(false);
        },
        (err) => {
          console.error(`Erreur lors du chargement depuis ${collectionPath}:`, err);
          
          if (isNetworkError(err)) {
            toast.error(`Impossible de charger les données: Mode hors ligne`);
          } else {
            toast.error(`Erreur lors du chargement des données: ${err.message}`);
          }
          
          setError(err instanceof Error ? err : new Error('Erreur inconnue'));
          setIsLoading(false);
          
          // En cas d'erreur, essayer de charger les données une seule fois
          fetchDataOnce().catch(e => console.error('Erreur lors de la récupération de secours:', e));
        }
      );
      
      // Nettoyage lors du démontage du composant
      return () => unsubscribe();
    } catch (err: any) {
      console.error(`Erreur lors de la configuration du listener pour ${collectionPath}:`, err);
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      setIsLoading(false);
      
      // En cas d'erreur, essayer de charger les données une seule fois
      fetchDataOnce().catch(e => console.error('Erreur lors de la récupération de secours:', e));
    }
  }, [collectionPath, queryConstraints, fetchDataOnce]);

  return { data, isLoading, error, refetch };
}
