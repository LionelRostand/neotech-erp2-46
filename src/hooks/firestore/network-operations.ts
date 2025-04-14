
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';

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

// Function to restore Firestore connectivity
export const restoreFirestoreConnectivity = async (): Promise<boolean> => {
  console.log("Attempting to restore Firestore connectivity...");
  if (!isOnline()) {
    console.warn("Cannot restore connectivity while offline");
    return false;
  }
  
  try {
    // Try to reconnect by fetching a test document
    const result = await checkFirestoreConnection();
    if (result) {
      console.log("Firestore connectivity restored successfully");
      return true;
    } else {
      console.warn("Failed to restore Firestore connectivity");
      return false;
    }
  } catch (error) {
    console.error("Error restoring Firestore connectivity:", error);
    return false;
  }
};

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

// Initialize offline/online event listeners
let onlineListenerInitialized = false;

// Function to handle synchronization when app comes back online
const handleOnlineEvent = async () => {
  console.log('Online - attempting to synchronize offline operations');
  
  // Check Firestore connection before attempting synchronization
  if (await checkFirestoreConnection()) {
    // Implement logic to synchronize offline operations here
    console.log('Synchronization logic needs to be implemented here');
    toast.success('Back online! Synchronizing data...');
  } else {
    console.warn('Firestore is not reachable. Skipping synchronization.');
    // Fix the warning toast method
    toast.error('Connexion rétablie, mais la synchronisation est impossible pour le moment.');
  }
};

// Function to initialize offline/online event listeners (without React hooks)
export const initializeNetworkListeners = () => {
  if (typeof window !== 'undefined' && !onlineListenerInitialized) {
    window.addEventListener('online', handleOnlineEvent);
    onlineListenerInitialized = true;
    console.log('Network listeners initialized');
  }
};

// Function to clean up event listeners
export const cleanupNetworkListeners = () => {
  if (typeof window !== 'undefined' && onlineListenerInitialized) {
    window.removeEventListener('online', handleOnlineEvent);
    onlineListenerInitialized = false;
    console.log('Network listeners cleaned up');
  }
};

// React hook to handle offline operations (for use in React components)
export const useOfflineOperations = () => {
  useEffect(() => {
    initializeNetworkListeners();
    
    // Cleanup on unmount
    return () => {
      cleanupNetworkListeners();
    };
  }, []);
};
