
// Firebase lite implementation for development
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { toast } from 'sonner';

// Firebase configuration - this would normally come from environment variables
// For development purposes, we're using a placeholder config
const firebaseConfig = {
  apiKey: "AIzaSyA-fake-key-for-development-only",
  authDomain: "example-app-dev.firebaseapp.com",
  projectId: "example-app-dev",
  storageBucket: "example-app-dev.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6a7b8c9d0e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

// Use development environment variables
const isDevMode = import.meta.env.DEV;
const useEmulator = import.meta.env.VITE_EMULATOR === 'true';

// Setup Firebase Auth
const firebaseAuth = getAuth(app);

// Only try to connect to emulators if explicitly enabled
if (isDevMode && useEmulator) {
  try {
    console.log('Connecting to Firestore emulator on localhost:8080');
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    console.log('Connecting to Auth emulator on localhost:9099');
    connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
  } catch (err) {
    console.warn('Failed to connect to Firebase emulators:', err);
  }
}

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(firestore)
    .then(() => {
      console.log('Firestore persistence enabled');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence failed - multiple tabs open');
        toast.warning('Attention: Mode hors ligne limité car plusieurs onglets sont ouverts');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence not supported on this browser');
        toast.warning('Attention: Mode hors ligne non supporté sur ce navigateur');
      }
    });
}

// Mock authentication with improved error handling for development
const auth = {
  ...firebaseAuth,
  currentUser: null,
  onAuthStateChanged: (callback) => {
    try {
      callback(null);
    } catch (error) {
      console.error("Error in auth state change handler:", error);
    }
    return () => {};
  },
  signInWithEmailAndPassword: async () => {
    console.log("Mock: Sign in with email and password");
    return { user: null };
  },
  createUserWithEmailAndPassword: async () => {
    console.log("Mock: Create user with email and password");
    return { user: null };
  },
  signOut: async () => {
    console.log("Mock: Sign out");
  },
};

// Export the initialized services
export { auth, firestore as db };
