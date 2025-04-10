
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
  const [rateLimited, setRateLimited] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [retryTimeout, setRetryTimeout] = useState<NodeJS.Timeout | null>(null);
  const MAX_RETRY_ATTEMPTS = 3;
  
  // Helper functions to determine error types
  const isNetworkError = (error: any): boolean => {
    return !!(
      error.code === 'unavailable' || 
      error.code === 'deadline-exceeded' ||
      error.message?.includes('network') ||
      error.message?.includes('timeout') ||
      error.name === 'AbortError'
    );
  };
  
  const isRateLimitError = (error: any): boolean => {
    return !!(
      error.code === 'resource-exhausted' ||
      error.message?.includes('quota') ||
      error.message?.includes('rate limit')
    );
  };
  
  // Clean up any pending timers when unmounting
  useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryTimeout]);
  
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
      
      setRetryTimeout(timer);
      
      return () => clearTimeout(timer);
    }
  }, [networkError, collectionName]);
  
  // Effect to handle rate limit errors
  useEffect(() => {
    if (rateLimited) {
      console.log(`Collection ${collectionName} is rate limited, will retry after delay`);
      
      // Set a timer for rate limit backoff
      const timer = setTimeout(() => {
        console.log(`Rate limit backoff complete for ${collectionName}, allowing new requests`);
        setRateLimited(false);
        setDataFetched(false); // Allow refetch
      }, 3000 + Math.random() * 2000); // Random delay between 3-5 seconds
      
      setRetryTimeout(timer);
      
      return () => clearTimeout(timer);
    }
  }, [rateLimited, collectionName]);
  
  // Reset fetch state if collection changes
  useEffect(() => {
    setDataFetched(false);
    setNetworkError(false);
    setRateLimited(false);
    setRetryAttempts(0);
    
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      setRetryTimeout(null);
    }
  }, [collectionName, retryTimeout]);
  
  // Wrapper pour getAll qui évite les appels répétés
  const getSafeAll = useCallback(async (options?: any) => {
    // Don't attempt if we're currently rate limited
    if (rateLimited) {
      console.log(`Collection ${collectionName} is rate limited, skipping fetch`);
      return Promise.resolve([]);
    }
    
    // Réinitialiser si trop de tentatives ont échoué
    if (retryAttempts >= MAX_RETRY_ATTEMPTS) {
      console.log(`Resetting after ${MAX_RETRY_ATTEMPTS} failed attempts for ${collectionName}`);
      setRetryAttempts(0);
      setDataFetched(false);
      setNetworkError(false);
      setRateLimited(false);
    }
    
    if (dataFetched && !networkError && !rateLimited) {
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
      setRateLimited(false);
      setRetryAttempts(0);
      return result;
    } catch (error: any) {
      console.error(`Error fetching data from ${collectionName}:`, error);
      
      // Check for rate limit errors
      if (isRateLimitError(error)) {
        console.log(`Rate limit detected for ${collectionName}`);
        setRateLimited(true);
        toast.error("Trop de requêtes. Veuillez patienter quelques instants...");
        return [];
      }
      
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
  }, [firestore, dataFetched, networkError, rateLimited, collectionName, retryAttempts, isNetworkError, isRateLimitError]);
  
  // Fonction pour réinitialiser l'état de chargement
  const resetFetchState = useCallback(() => {
    console.log(`Resetting fetch state for ${collectionName}`);
    setDataFetched(false);
    setNetworkError(false);
    setRateLimited(false);
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
    rateLimited,
    retryAttempts
  };
};
