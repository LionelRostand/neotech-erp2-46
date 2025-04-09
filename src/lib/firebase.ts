
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

// Enable offline persistence for Firestore (for demo/development)
try {
  enableIndexedDbPersistence(firestore)
    .then(() => {
      console.log('Firestore offline persistence enabled');
    })
    .catch((err) => {
      console.warn('Failed to enable Firestore offline persistence:', err);
    });
} catch (err) {
  console.warn('Error setting up Firestore persistence:', err);
}

// Use Firestore emulator if in development and EMULATOR is true
// In Vite, environment variables are accessed via import.meta.env instead of process.env
const isDevMode = import.meta.env.DEV;
const useEmulator = import.meta.env.VITE_EMULATOR === 'true';

if (isDevMode && useEmulator) {
  try {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    console.log('Connected to Firestore emulator');
  } catch (err) {
    console.warn('Failed to connect to Firestore emulator:', err);
  }
}

// Initialize Auth
const firebaseAuth = getAuth(app);

// Use Auth emulator if in development and EMULATOR is true
if (isDevMode && useEmulator) {
  try {
    connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
    console.log('Connected to Auth emulator');
  } catch (err) {
    console.warn('Failed to connect to Auth emulator:', err);
  }
}

// Mock authentication for development
const auth: Auth = {
  ...firebaseAuth,
  currentUser: { uid: 'mock-user-id', email: 'demo@example.com' } as any,
  onAuthStateChanged: (callback: any) => {
    callback({ uid: 'mock-user-id', email: 'demo@example.com' });
    return () => {};
  },
  signInWithEmailAndPassword: async () => ({ 
    user: { uid: 'mock-user-id', email: 'demo@example.com' } 
  } as any),
  createUserWithEmailAndPassword: async () => ({
    user: { uid: 'mock-user-id', email: 'demo@example.com' }
  } as any),
  signOut: async () => {},
} as Auth;

// Improve error handling for Firestore operations
const handleFirestoreError = (error: any) => {
  console.error('Firestore operation failed:', error);
  
  if (error.code === 'unavailable' || error.code === 'failed-precondition') {
    toast.error('La connexion à la base de données a échoué. L\'application fonctionne en mode hors ligne.');
  } else {
    toast.error(`Erreur de base de données: ${error.message}`);
  }
};

// Export the initialized services
export { auth, firestore as db, handleFirestoreError };
