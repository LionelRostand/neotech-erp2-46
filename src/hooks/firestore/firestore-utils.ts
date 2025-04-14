
// Re-export all firestore utilities from their respective files
export * from './common-utils';
export * from './read-operations';
// Export create operations without setDocument to avoid ambiguity
import { addDocument, addTrainingDocument } from './create-operations';
export { addDocument, addTrainingDocument };
// Re-export setDocument explicitly
export { setDocument } from './create-operations';
// Export everything else
export * from './update-operations';
export * from './delete-operations';
// Export network operations 
export { 
  isOnline,
  checkFirestoreConnection,
  restoreFirestoreConnectivity,
  initializeNetworkListeners,
  useOfflineOperations
} from './network-operations';
export * from './network-handler';
export { COLLECTIONS } from '@/lib/firebase-collections';

// Initialize network listeners when this module is imported
import { initializeNetworkListeners } from './network-operations';

// Only initialize if we're in a browser environment
if (typeof window !== 'undefined') {
  initializeNetworkListeners();
}
