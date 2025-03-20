
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
  const [retryAttempts, setRetryAttempts] = useState(0);
  const MAX_RETRY_ATTEMPTS = 3;
  
  // Effect to handle initial network errors
  useEffect(() => {
    if (networkError) {
      const tryReconnect = async () => {
        const success = await restoreFirestoreConnectivity();
        if (success) {
          setNetworkError(false);
          setDataFetched(false); // Allow refetch
          setRetryAttempts(0);
        }
      };
      
      tryReconnect();
    }
  }, [networkError]);
  
  // Wrapper pour getAll qui évite les appels répétés
  const getSafeAll = useCallback(async (options?: any) => {
    // Réinitialiser si trop de tentatives ont échoué
    if (retryAttempts >= MAX_RETRY_ATTEMPTS) {
      setRetryAttempts(0);
      setDataFetched(false);
    }
    
    if (dataFetched && !networkError) {
      // Retourner une promesse résolue avec une valeur vide si les données ont déjà été récupérées
      return Promise.resolve([]);
    }
    
    try {
      console.log(`Fetching data from ${collectionName} collection...`);
      const result = await firestore.getAll(options);
      setDataFetched(true);
      setNetworkError(false);
      setRetryAttempts(0);
      return result;
    } catch (error: any) {
      console.error(`Error fetching data from ${collectionName}:`, error);
      setDataFetched(true); // Même en cas d'erreur, on considère que la tentative a été faite
      
      if (error.message?.includes('network') || 
          error.message?.includes('offline') ||
          error.message?.includes('QUIC_PROTOCOL_ERROR') ||
          error.code === 'unavailable') {
        setNetworkError(true);
        setRetryAttempts(prev => prev + 1);
        toast.error("Problème de connexion réseau. Les données pourraient ne pas être à jour.");
      }
      
      throw error;
    }
  }, [firestore, dataFetched, networkError, collectionName, retryAttempts]);
  
  // Fonction pour réinitialiser l'état de chargement
  const resetFetchState = useCallback(() => {
    setDataFetched(false);
    setNetworkError(false);
    setRetryAttempts(0);
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
    networkError,
    retryAttempts
  };
};
