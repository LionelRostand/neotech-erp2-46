
// Firebase lite implementation for development
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
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

// Initialize Firebase services
const firestore = getFirestore(app);

// Use development environment variables
const isDevMode = import.meta.env.DEV;
const useEmulator = import.meta.env.VITE_EMULATOR === 'true';

// Enable emulators if configured
if (isDevMode && useEmulator) {
  try {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
  } catch (err) {
    console.warn('Failed to connect to Firestore emulator:', err);
  }
}

const firebaseAuth = getAuth(app);

if (isDevMode && useEmulator) {
  try {
    connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
  } catch (err) {
    console.warn('Failed to connect to Auth emulator:', err);
  }
}

// Mock authentication for development
const auth: Auth = {
  ...firebaseAuth,
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    callback(null);
    return () => {};
  },
  signInWithEmailAndPassword: async () => ({ user: null } as any),
  createUserWithEmailAndPassword: async () => ({ user: null } as any),
  signOut: async () => {},
} as Auth;

// Subscribe to global unhandled promise rejection errors
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const error = event.reason;
    if (error && error.code && typeof error.code === 'string' && error.code.includes('firestore')) {
      console.error('Firebase Error:', error);
      toast.error('Firebase error: ' + (error.message || 'Unknown error'));
    }
  });
}

// Export the initialized services
export { auth, firestore as db };
