
import { db } from '@/lib/firebase';

// Function to handle network connectivity
export const reconnectToFirestore = async (enableNetworkFn: Function) => {
  try {
    await enableNetworkFn(db);
    console.log('Reconnected to Firestore');
    return true;
  } catch (err) {
    console.error('Failed to reconnect to Firestore:', err);
    return false;
  }
};
