
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

/**
 * Check if an error is a network-related error
 * @param error The error to check
 * @returns True if it's a network error
 */
export const isNetworkError = (error: any): boolean => {
  return !!(
    error.code === 'unavailable' || 
    error.code === 'deadline-exceeded' ||
    error.message?.includes('network') ||
    error.message?.includes('timeout') ||
    error.message?.includes('disconnected') ||
    error.message?.includes('offline') ||
    error.name === 'AbortError'
  );
};

/**
 * Check if an error is a rate limit error
 * @param error The error to check
 * @returns True if it's a rate limit error
 */
export const isRateLimitError = (error: any): boolean => {
  return !!(
    error.code === 'resource-exhausted' ||
    error.message?.includes('quota') ||
    error.message?.includes('rate limit') ||
    error.message?.includes('too many requests')
  );
};

/**
 * Attempt to reconnect to Firestore
 * @returns Promise resolved with true if successful
 */
export const reconnectToFirestore = async (): Promise<boolean> => {
  try {
    console.log('Attempting to reconnect to Firestore...');
    // In a real implementation, this would try to reconnect to Firestore
    // For now, we'll just simulate a successful reconnection
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  } catch (error) {
    console.error('Failed to reconnect to Firestore:', error);
    return false;
  }
};
