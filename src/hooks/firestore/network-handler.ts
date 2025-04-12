
import { FirebaseError } from 'firebase/app';
import { toast } from 'sonner';

/**
 * Utility to execute a Firestore operation with network retry logic
 * @param operation The async operation to execute
 * @param maxRetries Maximum number of retries (default: 3)
 * @returns Promise with the operation result
 */
export const executeWithNetworkRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let retries = 0;
  
  const execute = async (): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      retries++;
      console.error(`Erreur lors de la tentative ${retries}/${maxRetries}:`, error);
      
      // Handle specific Firebase errors
      if (error instanceof FirebaseError) {
        // Handle permission errors
        if (error.code === 'permission-denied') {
          console.warn('Erreur de permission détectée, abandonnement des tentatives');
          toast.error(`Erreur de permission Firebase: ${error.message}. Vérifiez les règles de sécurité.`);
          throw error;
        }
        
        // Handle network errors
        if (error.code === 'unavailable' || error.code === 'network-request-failed') {
          if (retries < maxRetries) {
            const delay = Math.min(Math.pow(2, retries) * 1000, 10000);
            console.log(`Nouvelle tentative dans ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return execute();
          }
        }
      }
      
      // For other errors or after max retries
      if (retries < maxRetries) {
        const delay = Math.min(Math.pow(2, retries) * 1000, 10000);
        console.log(`Nouvelle tentative dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return execute();
      }
      
      // If we've reached max retries, throw the error
      throw error;
    }
  };
  
  return execute();
};

/**
 * Helper function to check if the error is due to being offline
 * @param error The error to check
 * @returns boolean indicating if it's an offline error
 */
export const isOfflineError = (error: any): boolean => {
  if (error instanceof FirebaseError) {
    return error.code === 'unavailable' || 
           error.code === 'network-request-failed' ||
           error.message.includes('offline') ||
           error.message.includes('network');
  }
  
  return false;
};

/**
 * Helper function to check if the error is a network-related error
 * @param error The error to check
 * @returns boolean indicating if it's a network error
 */
export const isNetworkError = (error: any): boolean => {
  if (error instanceof FirebaseError) {
    return error.code === 'unavailable' || 
           error.code === 'network-request-failed' ||
           error.message.includes('network') ||
           error.message.includes('offline') ||
           error.message.includes('unavailable') ||
           error.message.includes('connection');
  }
  
  // Check for generic network errors
  return error?.message?.includes('network') ||
         error?.message?.includes('connection') ||
         error?.name === 'NetworkError' ||
         error?.name === 'AbortError';
};

/**
 * Helper function to check if the error is due to rate limiting
 * @param error The error to check
 * @returns boolean indicating if it's a rate limit error
 */
export const isRateLimitError = (error: any): boolean => {
  if (error instanceof FirebaseError) {
    return error.code === 'resource-exhausted' ||
           error.message.includes('quota') ||
           error.message.includes('rate limit') ||
           error.message.includes('too many requests');
  }
  
  return error?.message?.includes('rate limit') ||
         error?.message?.includes('too many requests') ||
         error?.message?.includes('quota');
};

/**
 * Attempts to reconnect to Firestore
 * @returns Promise that resolves to true if reconnection was successful, false otherwise
 */
export const reconnectToFirestore = async (): Promise<boolean> => {
  console.log('Tentative de reconnexion à Firestore...');
  try {
    // Import dynamically to avoid circular dependencies
    const { checkFirestoreConnection } = await import('@/lib/firebase');
    
    // Try to reconnect
    const isConnected = await checkFirestoreConnection();
    
    if (isConnected) {
      console.log('Reconnexion à Firestore réussie');
      return true;
    } else {
      console.log('Échec de la reconnexion à Firestore');
      return false;
    }
  } catch (error) {
    console.error('Erreur lors de la tentative de reconnexion:', error);
    return false;
  }
};
