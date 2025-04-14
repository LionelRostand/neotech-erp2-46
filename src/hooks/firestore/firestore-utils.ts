
// Re-export all firestore utilities from their respective files
export * from './common-utils';
export * from './read-operations';
export * from './create-operations';
export * from './update-operations';
export * from './delete-operations';
// Export network operations without the executeWithNetworkRetry that's already exported
export { 
  isOnline,
  checkFirestoreConnection,
  restoreFirestoreConnectivity,
  handleOfflineOperations
} from './network-operations';
export * from './network-handler';
export { COLLECTIONS } from '@/lib/firebase-collections';

import { handleOfflineOperations } from './network-operations';

// Initialize offline handling when this module is imported
// This will add listeners for online/offline events
handleOfflineOperations();
