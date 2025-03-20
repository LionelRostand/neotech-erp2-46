
import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from './use-firestore';

/**
 * Ce hook enveloppe le hook useFirestore pour éviter les rechargements infinis
 * en contrôlant l'état du chargement des données.
 */
export const useSafeFirestore = (collectionName: string) => {
  const firestore = useFirestore(collectionName);
  const [dataFetched, setDataFetched] = useState(false);
  
  // Wrapper pour getAll qui évite les appels répétés
  const getSafeAll = useCallback(async (options?: any) => {
    if (dataFetched) {
      // Retourner une promesse résolue avec une valeur vide si les données ont déjà été récupérées
      return Promise.resolve([]);
    }
    
    try {
      const result = await firestore.getAll(options);
      setDataFetched(true);
      return result;
    } catch (error) {
      setDataFetched(true); // Même en cas d'erreur, on considère que la tentative a été faite
      throw error;
    }
  }, [firestore, dataFetched]);
  
  // Fonction pour réinitialiser l'état de chargement
  const resetFetchState = useCallback(() => {
    setDataFetched(false);
  }, []);
  
  return {
    ...firestore,
    getAll: getSafeAll,
    resetFetchState,
    dataFetched
  };
};
