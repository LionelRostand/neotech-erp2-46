
import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from './use-firestore';
import { toast } from 'sonner';
import { restoreFirestoreConnectivity } from './firestore/network-operations';
import { isNetworkError } from './firestore/network-handler';

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
        console.log(`Trying to reconnect to Firestore for collection ${collectionName}`);
        const success = await restoreFirestoreConnectivity();
        if (success) {
          console.log(`Reconnection successful for ${collectionName}, resetting fetch state`);
          setNetworkError(false);
          setDataFetched(false); // Allow refetch
          setRetryAttempts(0);
        } else {
          console.log(`Reconnection failed for ${collectionName}`);
        }
      };
      
      tryReconnect();
      
      // Set a timer to retry reconnection if it takes too long
      const timer = setTimeout(() => {
        if (networkError) {
          console.log('Reconnection is taking too long, forcing retry');
          setNetworkError(false);
          setDataFetched(false);
        }
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timer);
    }
  }, [networkError, collectionName]);
  
  // Reset fetch state if collection changes
  useEffect(() => {
    setDataFetched(false);
    setNetworkError(false);
    setRetryAttempts(0);
  }, [collectionName]);
  
  // Wrapper pour getAll qui évite les appels répétés
  const getSafeAll = useCallback(async (options?: any) => {
    // Réinitialiser si trop de tentatives ont échoué
    if (retryAttempts >= MAX_RETRY_ATTEMPTS) {
      console.log(`Resetting after ${MAX_RETRY_ATTEMPTS} failed attempts for ${collectionName}`);
      setRetryAttempts(0);
      setDataFetched(false);
      setNetworkError(false);
    }
    
    if (dataFetched && !networkError) {
      // Retourner une promesse résolue avec une valeur vide si les données ont déjà été récupérées
      console.log(`Data already fetched for ${collectionName}, skipping fetch`);
      return Promise.resolve([]);
    }
    
    try {
      console.log(`Fetching data from ${collectionName} collection...`);
      const result = await firestore.getAll(options);
      console.log(`Successfully fetched data from ${collectionName}`, result);
      setDataFetched(true);
      setNetworkError(false);
      setRetryAttempts(0);
      return result;
    } catch (error: any) {
      console.error(`Error fetching data from ${collectionName}:`, error);
      
      // Check for network errors
      if (isNetworkError(error)) {
        console.log(`Network error detected for ${collectionName}`);
        setNetworkError(true);
        setRetryAttempts(prev => prev + 1);
        
        if (error.message?.includes('NETWORK_IO_SUSPENDED')) {
          toast.error("La connexion réseau est suspendue. Tentative de reconnexion...");
        } else if (error.message?.includes('status of 400')) {
          toast.error("Erreur de requête. Les données pourraient ne pas être à jour.");
        } else {
          toast.error("Problème de connexion réseau. Les données pourraient ne pas être à jour.");
        }
      }
      
      setDataFetched(true); // Même en cas d'erreur, on considère que la tentative a été faite
      throw error;
    }
  }, [firestore, dataFetched, networkError, collectionName, retryAttempts]);
  
  // Fonction pour réinitialiser l'état de chargement
  const resetFetchState = useCallback(() => {
    console.log(`Resetting fetch state for ${collectionName}`);
    setDataFetched(false);
    setNetworkError(false);
    setRetryAttempts(0);
  }, [collectionName]);
  
  // Force a reconnection and refetch
  const reconnectAndRefetch = useCallback(async () => {
    console.log(`Manually reconnecting for ${collectionName}`);
    const success = await restoreFirestoreConnectivity();
    if (success) {
      resetFetchState();
      return true;
    }
    return false;
  }, [resetFetchState, collectionName]);
  
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
