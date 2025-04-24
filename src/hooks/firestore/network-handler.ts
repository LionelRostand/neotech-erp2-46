
/**
 * Utility function to execute a Firestore operation with network retry logic
 */
export const executeWithNetworkRetry = async <T>(operation: () => Promise<T>, maxRetries = 2): Promise<T> => {
  let retries = 0;
  
  while (true) {
    try {
      return await operation();
    } catch (error: any) {
      console.warn(`Firestore operation failed (attempt ${retries + 1}/${maxRetries + 1}):`, error);
      
      // If we've reached max retries or this isn't a network error, rethrow
      if (retries >= maxRetries || !isNetworkError(error)) {
        throw error;
      }
      
      // Exponential backoff: 500ms, 1500ms, 3500ms, etc.
      const delay = 500 * Math.pow(2, retries);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
};

/**
 * Check if an error is likely a network-related error
 */
const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  // Check if it's a specific Firebase network error
  if (error.code && typeof error.code === 'string') {
    return [
      'unavailable', 
      'network-request-failed', 
      'deadline-exceeded',
      'cancelled'
    ].some(code => error.code.includes(code));
  }
  
  // Check for common network error messages
  if (error.message && typeof error.message === 'string') {
    return /network|timeout|connection|offline|unavailable/i.test(error.message);
  }
  
  return false;
};
