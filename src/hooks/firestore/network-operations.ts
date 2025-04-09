
import { 
  doc, setDoc, deleteDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { reconnectToFirestore } from './network-handler';

// Store operations to be processed when back online
const offlineOperations: {
  type: 'create' | 'update' | 'delete';
  collectionPath: string;
  id: string;
  data?: any;
}[] = [];

// Add an operation to the queue
export const addOfflineOperation = (type: 'create' | 'update' | 'delete', collectionPath: string, id: string, data?: any) => {
  console.log(`Adding offline operation: ${type} for ${collectionPath}/${id}`);
  offlineOperations.push({ type, collectionPath, id, data });
  
  // Store in localStorage for persistence
  try {
    localStorage.setItem('offlineOperations', JSON.stringify(offlineOperations));
  } catch (error) {
    console.error('Error storing offline operations in localStorage', error);
  }
};

// Process all offline operations when back online
export const processOfflineOperations = async () => {
  if (offlineOperations.length === 0) {
    console.log('No offline operations to process');
    return;
  }
  
  console.log(`Processing ${offlineOperations.length} offline operations`);
  
  // Process in order
  for (const operation of [...offlineOperations]) {
    try {
      const { type, collectionPath, id, data } = operation;
      const docRef = doc(db, collectionPath, id);
      
      if (type === 'create' || type === 'update') {
        await setDoc(docRef, data, { merge: true });
        console.log(`Successfully processed offline ${type} for ${collectionPath}/${id}`);
      } else if (type === 'delete') {
        await deleteDoc(docRef);
        console.log(`Successfully processed offline delete for ${collectionPath}/${id}`);
      }
      
      // Remove from queue after successful processing
      const index = offlineOperations.indexOf(operation);
      if (index > -1) {
        offlineOperations.splice(index, 1);
      }
    } catch (error) {
      console.error('Error processing offline operation', operation, error);
      // Keep the operation in the queue to retry later
    }
  }
  
  // Update localStorage
  try {
    localStorage.setItem('offlineOperations', JSON.stringify(offlineOperations));
  } catch (error) {
    console.error('Error updating offline operations in localStorage', error);
  }
};

// Load offline operations from localStorage on startup
export const loadOfflineOperations = () => {
  try {
    const stored = localStorage.getItem('offlineOperations');
    if (stored) {
      const loaded = JSON.parse(stored);
      if (Array.isArray(loaded)) {
        // Replace the array contents
        offlineOperations.length = 0;
        loaded.forEach(op => offlineOperations.push(op));
        console.log(`Loaded ${offlineOperations.length} offline operations from localStorage`);
      }
    }
  } catch (error) {
    console.error('Error loading offline operations from localStorage', error);
  }
};

// Setup online event listeners to process operations
export const handleOfflineOperations = () => {
  // Load saved operations
  loadOfflineOperations();
  
  // Process operations when back online
  window.addEventListener('online', () => {
    console.log('Back online, processing offline operations...');
    processOfflineOperations().catch(error => {
      console.error('Error processing offline operations', error);
    });
  });
  
  // Check if we're online and process immediately
  if (navigator.onLine) {
    processOfflineOperations().catch(error => {
      console.error('Error processing offline operations', error);
    });
  }
};

/**
 * Attempts to restore connectivity to Firestore
 * @returns Promise<boolean> - true if successfully restored connection
 */
export const restoreFirestoreConnectivity = async (): Promise<boolean> => {
  console.log('Attempting to restore Firestore connectivity...');
  try {
    const success = await reconnectToFirestore();
    
    if (success) {
      console.log('Firestore connectivity restored successfully');
      // Process any pending operations
      await processOfflineOperations();
    } else {
      console.log('Failed to restore Firestore connectivity');
    }
    
    return success;
  } catch (error) {
    console.error('Error while restoring Firestore connectivity:', error);
    return false;
  }
};
