
import { 
  enableFirestoreNetwork, 
  disableFirestoreNetwork, 
  reconnectToFirestore, 
  isNetworkError 
} from './network-handler';
import { toast } from 'sonner';

/**
 * Attempts to restore Firestore connectivity
 * @returns {Promise<boolean>} True if connectivity was restored
 */
export const restoreFirestoreConnectivity = async (): Promise<boolean> => {
  try {
    // First try disabling to clear any problematic connections
    await disableFirestoreNetwork();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Then try simple network enable
    const simpleReconnect = await enableFirestoreNetwork();
    if (simpleReconnect) {
      console.log('Connectivity to Firestore restored');
      return true;
    }
    
    // If simple reconnect fails, try the exponential backoff strategy
    return await reconnectToFirestore();
  } catch (err) {
    console.error('Failed to restore Firestore connectivity:', err);
    toast.error("Échec de la connexion à la base de données. L'application fonctionne en mode démo.");
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
  
  // Special handler for 400 errors which commonly occur in development environments
  window.addEventListener('unhandledrejection', async (event) => {
    const error = event.reason;
    
    // Look for specific 400 errors with Firestore
    if (error && error.message && 
        (error.message.includes('400') || error.code === 400) && 
        (error.message.includes('firestore') || error.message.includes('googleapis'))) {
      
      console.log('Caught Firestore 400 error:', error);
      event.preventDefault();
      
      toast.error('Erreur 400 détectée lors d\'une opération Firestore. Tentative de reconnexion...');
      
      // Try to restore connectivity
      const reconnected = await restoreFirestoreConnectivity();
      if (reconnected) {
        toast.success('Connexion à Firestore rétablie');
      } else {
        toast.error('Impossible de se connecter à Firestore. L\'application fonctionne en mode démo.');
      }
    }
  });
  
  // Add network error event listener to Firebase global error events
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    if (type === 'error') {
      const wrappedListener = function(event: any) {
        // Check if it's a Firestore error
        if ((event.filename?.includes('firestore') || 
             event.message?.includes('firestore') ||
             event.message?.includes('googleapis')) && 
            event.error && 
            isNetworkError(event.error)) {
          console.log('Caught Firestore error event:', event);
          // Suppress default error and trigger reconnect
          event.preventDefault();
          restoreFirestoreConnectivity();
          return false;
        }
        return listener.call(this, event);
      };
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', async () => {});
    window.removeEventListener('offline', () => {});
    window.removeEventListener('error', () => {});
    window.removeEventListener('unhandledrejection', async () => {});
    // Reset the addEventListener (though this won't remove already attached listeners)
    window.addEventListener = originalAddEventListener;
  };
};

/**
 * Register unhandled Firebase error listener
 * This provides a global safety net for Firebase errors
 */
export const registerFirebaseErrorHandler = () => {
  // Listen for unhandled promise rejections that might be Firebase related
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // Check if it's a Firestore network error
    if (error && (error.name?.includes('FirebaseError') || 
         error.message?.includes('firestore') ||
         error.message?.includes('googleapis'))) {
      
      console.log('Caught unhandled Firestore rejection:', error);
      
      if (isNetworkError(error) || (error.code && error.code === 400)) {
        // Prevent default error handling
        event.preventDefault();
        
        // Show toast notification
        toast.error("Problème de connexion avec la base de données. L'application fonctionne en mode démo.");
        
        // Attempt reconnection
        restoreFirestoreConnectivity();
      }
    }
  });
};

// Initialize global error handler when this module is imported
registerFirebaseErrorHandler();
