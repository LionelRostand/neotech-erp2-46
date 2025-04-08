
// Firebase lite implementation for development
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

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
const firebaseAuth = getAuth(app);

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

// Export the initialized services
export { auth, firestore as db };
