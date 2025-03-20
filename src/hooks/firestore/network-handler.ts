
import { 
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const enableFirestoreNetwork = async () => {
  try {
    await enableNetwork(db);
    return true;
  } catch (err) {
    console.error('Failed to enable Firestore network:', err);
    return false;
  }
};

export const disableFirestoreNetwork = async () => {
  try {
    await disableNetwork(db);
    return true;
  } catch (err) {
    console.error('Failed to disable Firestore network:', err);
    return false;
  }
};

export const handleNetworkError = async (err: any, retryOperation: () => Promise<any>) => {
  if (err.code === 'unavailable' || err.code === 'failed-precondition') {
    const reconnected = await enableFirestoreNetwork();
    if (reconnected) {
      // Retry the operation
      return retryOperation();
    }
  }
  throw err;
};
