
// Firebase lite implementation for development
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { toast } from 'sonner';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDKgLJI-y03tTsGhRmUzY7Q31zzfwVzazA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "neotech-7c574.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "neotech-7c574",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "neotech-7c574.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "375585071827",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:375585071827:web:3c8d4a02a50a5321086a26"
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully with project:', firebaseConfig.projectId);
} catch (error) {
  console.error('Firebase initialization error:', error);
  toast.error('Erreur d\'initialisation de Firebase');
}

// Initialize Firebase services with error handling
let firestore;
try {
  firestore = getFirestore(app);
  console.log('Firestore initialized successfully');
  
  // Enable offline persistence
  enableIndexedDbPersistence(firestore)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence');
      }
    });
} catch (err) {
  console.error('Firestore initialization error:', err);
  toast.error('Erreur de connexion à la base de données');
}

// Use development environment variables
const isDevMode = import.meta.env.DEV;
const useEmulator = import.meta.env.VITE_EMULATOR === 'true';

// Enable emulators if configured
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

if (isDevMode && useEmulator) {
  try {
    connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
    console.log('Connected to Auth emulator');
  } catch (err) {
    console.warn('Failed to connect to Auth emulator:', err);
  }
}

// Check Firestore connection
export const checkFirestoreConnection = async () => {
  try {
    // Create a test collection reference
    const testCollection = firestore.collection('connection_test');
    // Attempt a small read operation to verify connection
    await testCollection.limit(1).get();
    console.log('Firestore connection verified');
    return true;
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return false;
  }
};

const auth = firebaseAuth;
const db = firestore;

// Export the initialized services
export { auth, db };
