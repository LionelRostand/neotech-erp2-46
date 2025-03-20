
import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from './use-firestore';
import { toast } from 'sonner';
import { restoreFirestoreConnectivity } from './firestore/network-operations';

/**
 * Ce hook enveloppe le hook useFirestore pour éviter les rechargements infinis
 * en contrôlant l'état du chargement des données.
 */
export const useSafeFirestore = (collectionName: string) => {
  const firestore = useFirestore(collectionName);
  const [dataFetched, setDataFetched] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  
  // Effect to handle initial network errors
  useEffect(() => {
    if (networkError) {
      const tryReconnect = async () => {
        const success = await restoreFirestoreConnectivity();
        if (success) {
          setNetworkError(false);
          setDataFetched(false); // Allow refetch
        }
      };
      
      tryReconnect();
    }
  }, [networkError]);
  
  // Wrapper pour getAll qui évite les appels répétés
  const getSafeAll = useCallback(async (options?: any) => {
    if (dataFetched && !networkError) {
      // Retourner une promesse résolue avec une valeur vide si les données ont déjà été récupérées
      return Promise.resolve([]);
    }
    
    try {
      const result = await firestore.getAll(options);
      setDataFetched(true);
      setNetworkError(false);
      return result;
    } catch (error: any) {
      setDataFetched(true); // Même en cas d'erreur, on considère que la tentative a été faite
      
      if (error.message?.includes('network') || 
          error.message?.includes('offline') || 
          error.code === 'unavailable') {
        setNetworkError(true);
        toast.error("Problème de connexion réseau. Les données pourraient ne pas être à jour.");
      }
      
      throw error;
    }
  }, [firestore, dataFetched, networkError]);
  
  // Fonction pour réinitialiser l'état de chargement
  const resetFetchState = useCallback(() => {
    setDataFetched(false);
    setNetworkError(false);
  }, []);
  
  // Force a reconnection and refetch
  const reconnectAndRefetch = useCallback(async () => {
    const success = await restoreFirestoreConnectivity();
    if (success) {
      resetFetchState();
      return true;
    }
    return false;
  }, [resetFetchState]);
  
  return {
    ...firestore,
    getAll: getSafeAll,
    resetFetchState,
    reconnectAndRefetch,
    dataFetched,
    networkError
  };
};
