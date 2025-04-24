
/**
 * Utility function to execute a callback with retry logic for network operations
 * @param callback The callback to execute
 * @param maxRetries Maximum number of retry attempts
 * @returns Promise with the result of the callback
 */
export const executeWithNetworkRetry = async <T>(
  callback: () => Promise<T>,
  maxRetries = 3
): Promise<T> => {
  let attempts = 0;
  
  while (attempts < maxRetries) {
    try {
      return await callback();
    } catch (error: any) {
      attempts++;
      
      // If it's a network error and we haven't hit max retries yet
      const isNetworkError = error.code === 'failed-precondition' || 
                             error.code === 'unavailable' ||
                             error.message?.includes('network');
      
      if (isNetworkError && attempts < maxRetries) {
        console.log(`Retry attempt ${attempts} after network error:`, error);
        // Wait for increasing time before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        continue;
      }
      
      // For other errors or if max retries reached, rethrow
      throw error;
    }
  }
  
  throw new Error(`Failed after ${maxRetries} retry attempts`);
};
