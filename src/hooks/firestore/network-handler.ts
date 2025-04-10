
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
