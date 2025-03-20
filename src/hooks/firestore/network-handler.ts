
import { 
  enableNetwork,
  disableNetwork,
  waitForPendingWrites
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

// Connection state
let isReconnecting = false;
let reconnectionAttempts = 0;
const MAX_RECONNECTION_ATTEMPTS = 5;
const RECONNECTION_DELAY = 2000; // 2 seconds

/**
 * Enable Firestore network connection
 */
export const enableFirestoreNetwork = async () => {
  try {
    await enableNetwork(db);
    reconnectionAttempts = 0;
    isReconnecting = false;
    return true;
  } catch (err) {
    console.error('Failed to enable Firestore network:', err);
    return false;
  }
};

/**
 * Disable Firestore network connection
 */
export const disableFirestoreNetwork = async () => {
  try {
    // Wait for any pending writes to complete before disabling network
    await waitForPendingWrites(db);
    await disableNetwork(db);
    return true;
  } catch (err) {
    console.error('Failed to disable Firestore network:', err);
    return false;
  }
};

/**
 * Attempt to reconnect to Firestore with exponential backoff
 */
export const reconnectToFirestore = async (): Promise<boolean> => {
  if (isReconnecting) return false;
  
  isReconnecting = true;
  
  if (reconnectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
    toast.error("Impossible de se connecter à la base de données après plusieurs tentatives. Veuillez vérifier votre connexion internet.");
    isReconnecting = false;
    return false;
  }
  
  // Calculate backoff delay
  const delay = RECONNECTION_DELAY * Math.pow(2, reconnectionAttempts);
  
  console.log(`Tentative de reconnexion (${reconnectionAttempts + 1}/${MAX_RECONNECTION_ATTEMPTS}) dans ${delay/1000} secondes...`);
  
  return new Promise(resolve => {
    setTimeout(async () => {
      try {
        const success = await enableFirestoreNetwork();
        if (success) {
          console.log('Reconnexion à Firestore réussie');
          toast.success('Connexion à la base de données rétablie');
          isReconnecting = false;
          reconnectionAttempts = 0;
          resolve(true);
        } else {
          reconnectionAttempts++;
          isReconnecting = false;
          resolve(await reconnectToFirestore());
        }
      } catch (error) {
        reconnectionAttempts++;
        isReconnecting = false;
        resolve(await reconnectToFirestore());
      }
    }, delay);
  });
};

/**
 * Handle network errors and attempt to retry operations
 */
export const handleNetworkError = async (err: any, retryOperation: () => Promise<any>) => {
  // QUIC protocol errors, unavailable, or failed-precondition errors are typically network related
  const isNetworkError = 
    err.code === 'unavailable' || 
    err.code === 'failed-precondition' ||
    err.message?.includes('QUIC_PROTOCOL_ERROR') ||
    err.message?.includes('network error') ||
    err.message?.includes('Network Error') ||
    err.message?.includes('Client is offline');
  
  if (isNetworkError) {
    toast.error("Problème de connexion à la base de données. Tentative de reconnexion...");
    
    const reconnected = await reconnectToFirestore();
    if (reconnected) {
      // Retry the operation
      return retryOperation();
    } else {
      throw new Error("Impossible de se connecter à la base de données. Veuillez vérifier votre connexion internet.");
    }
  }
  
  // For other types of errors, just rethrow
  throw err;
};

/**
 * Execute an operation with network error handling
 */
export const executeWithNetworkRetry = async <T>(
  operation: () => Promise<T>, 
  maxRetries = 3
): Promise<T> => {
  let attempts = 0;
  
  const executeOperation = async (): Promise<T> => {
    try {
      return await operation();
    } catch (error: any) {
      attempts++;
      
      if (attempts <= maxRetries) {
        try {
          return await handleNetworkError(error, executeOperation);
        } catch (retryError) {
          throw retryError;
        }
      } else {
        console.error(`Operation failed after ${maxRetries} retry attempts:`, error);
        throw error;
      }
    }
  };
  
  return executeOperation();
};
