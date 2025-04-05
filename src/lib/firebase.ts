
// Firebase lite implementation for development
import { getFirestore } from 'firebase/firestore';

// Mock firebase auth and firestore for development
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    callback(null);
    return () => {};
  },
  signInWithEmailAndPassword: async () => ({ user: null }),
  createUserWithEmailAndPassword: async () => ({ user: null }),
  signOut: async () => {},
};

export const db = getFirestore();

// Add any other mock methods needed
