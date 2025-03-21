
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
 * Check if an error is a network-related error
 */
export const isNetworkError = (err: any): boolean => {
  if (!err) return false;
  
  // Extract the error message for easier checks
  const errorMessage = (err.message || '').toLowerCase();
  const errorCode = err.code || '';
  
  return (
    errorCode === 'unavailable' || 
    errorCode === 'failed-precondition' ||
    errorMessage.includes('quic_protocol_error') ||
    errorMessage.includes('network error') ||
    errorMessage.includes('network_io_suspended') ||
    errorMessage.includes('the server responded with a status of 400') ||
    errorMessage.includes('client is offline')
  );
};

/**
 * Handle network errors and attempt to retry operations
 */
export const handleNetworkError = async (err: any, retryOperation: () => Promise<any>) => {
  if (isNetworkError(err)) {
    console.log('Network error detected:', err.message || err);
    toast.error("Problème de connexion à la base de données. Tentative de reconnexion...");
    
    // For errors indicating suspended I/O or bad requests, let's add a small delay
    // before attempting reconnection to allow the network to stabilize
    if (err.message?.includes('NETWORK_IO_SUSPENDED') || 
        err.message?.includes('status of 400')) {
      console.log('Special handling for NETWORK_IO_SUSPENDED or 400 error');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    const reconnected = await reconnectToFirestore();
    if (reconnected) {
      // Retry the operation
      console.log('Reconnected successfully, retrying operation');
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
      console.error(`Operation failed (attempt ${attempts}/${maxRetries}):`, error);
      
      // Add delay for network issues to allow potential recovery
      if (isNetworkError(error)) {
        console.log('Network error detected, adding delay before retry');
        // Force a small delay before retry
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
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
