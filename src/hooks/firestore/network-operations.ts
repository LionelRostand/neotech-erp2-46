
import { enableFirestoreNetwork, reconnectToFirestore } from './network-handler';
import { toast } from 'sonner';

/**
 * Attempts to restore Firestore connectivity
 * @returns {Promise<boolean>} True if connectivity was restored
 */
export const restoreFirestoreConnectivity = async (): Promise<boolean> => {
  try {
    // First try simple network enable
    const simpleReconnect = await enableFirestoreNetwork();
    if (simpleReconnect) {
      console.log('Connectivity to Firestore restored');
      return true;
    }
    
    // If simple reconnect fails, try the exponential backoff strategy
    return await reconnectToFirestore();
  } catch (err) {
    console.error('Failed to restore Firestore connectivity:', err);
    toast.error("Échec de la connexion à la base de données");
    return false;
  }
};

/**
 * Handles offline operations and data persistence
 * This could be expanded with more functionality as needed
 */
export const handleOfflineOperations = () => {
  // Subscribe to online/offline status changes
  window.addEventListener('online', async () => {
    console.log('Browser is online, attempting to reconnect to Firestore...');
    const success = await restoreFirestoreConnectivity();
    if (success) {
      toast.success('Connexion internet rétablie, synchronisation des données en cours...');
    }
  });
  
  window.addEventListener('offline', () => {
    console.log('Browser is offline, Firestore will use cached data if available');
    toast.warning('Connexion internet perdue, passage en mode hors-ligne');
  });
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', restoreFirestoreConnectivity);
    window.removeEventListener('offline', () => {});
  };
};
