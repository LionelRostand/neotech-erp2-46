
/**
 * Function to execute a firestore operation with network retry
 * @param operation The operation to execute
 * @param maxRetries Maximum number of retries (default: 3)
 * @param delay Delay between retries in ms (default: 1000)
 * @returns The result of the operation
 */
export const executeWithNetworkRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      console.error(`Erreur réseau (tentative ${attempt}/${maxRetries}):`, error);
      lastError = error;
      
      // Check if it's a network error that we should retry
      const isNetworkError = 
        error.code === 'unavailable' || 
        error.code === 'deadline-exceeded' ||
        error.message?.includes('network') ||
        error.message?.includes('timeout') ||
        error.name === 'AbortError';
      
      if (!isNetworkError || attempt === maxRetries) {
        // If not a network error or last attempt, throw the error
        throw error;
      }
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  // This should never be reached due to the throw in the loop
  throw lastError;
};
