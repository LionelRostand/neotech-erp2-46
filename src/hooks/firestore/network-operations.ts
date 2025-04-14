import { db } from '@/lib/firebase';
import { toast } from 'sonner';

// Function to check if we have an internet connection
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' && navigator.onLine === true;
};

// Function to check if Firestore is reachable
export const checkFirestoreConnection = async (): Promise<boolean> => {
  if (!isOnline()) return false;
  
  try {
    // Try to fetch a small test document
    const testRef = doc(db, "connection_test", "test_doc");
    await getDoc(testRef);
    return true;
  } catch (error) {
    console.error("Firestore connection check failed:", error);
    return false;
  }
};

// Import needed Firestore functions
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';

// Function to execute a Firestore operation with network retry logic
export const executeWithNetworkRetry = async <T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    if (isOnline()) {
      try {
        return await operation();
      } catch (error: any) {
        console.error(`Operation failed (attempt ${retries + 1}):`, error);
        
        // Check if the error is a network-related error
        if (error.message.includes('offline') || error.message.includes('unavailable')) {
          retries++;
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
        } else {
          // If it's not a network error, re-throw the error
          throw error;
        }
      }
    } else {
      // If offline, reject with an error
      throw new Error('No internet connection');
    }
  }
  
  // If all retries failed, reject with an error
  throw new Error('Operation failed after multiple retries due to network issues');
};

// Function to handle offline operations by storing them locally and retrying when online
export const handleOfflineOperations = () => {
  useEffect(() => {
    const handleOnline = async () => {
      console.log('Online - attempting to synchronize offline operations');
      
      // Check Firestore connection before attempting synchronization
      if (await checkFirestoreConnection()) {
        // Implement logic to synchronize offline operations here
        // This might involve reading from local storage and writing to Firestore
        console.log('Synchronization logic needs to be implemented here');
        toast.success('Back online! Synchronizing data...');
      } else {
        console.warn('Firestore is not reachable. Skipping synchronization.');
        toast.warn('Connexion rétablie, mais la synchronisation est impossible pour le moment.');
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);
};
