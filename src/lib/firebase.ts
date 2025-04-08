
// Firebase lite implementation for development
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration - updated with new credentials
const firebaseConfig = {
  apiKey: "AIzaSyA-neotech-key-for-development-only",
  authDomain: "neotech-erp.firebaseapp.com",
  projectId: "neotech-erp",
  storageBucket: "neotech-erp.appspot.com",
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
    // Default to admin user for development
    const mockUser = {
      uid: 'admin-user-id',
      email: 'admin@neotech-consulting.com',
      displayName: 'Admin User'
    };
    callback(mockUser);
    return () => {};
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    // For development, check the hardcoded credentials
    if (email === 'admin@neotech-consulting.com' && password === 'AaronEnzo2511@') {
      return {
        user: {
          uid: 'admin-user-id',
          email: 'admin@neotech-consulting.com',
          displayName: 'Admin User'
        }
      };
    }
    throw new Error('auth/wrong-password');
  },
  createUserWithEmailAndPassword: async () => ({ user: null } as any),
  signOut: async () => {},
} as Auth;

// Export the initialized services
export { auth, firestore as db };

// Create a mock version of Firebase Admin SDK for development
// This should ONLY be used in development, never in production
export const mockFirebaseAdmin = {
  auth: () => ({
    getUser: async (uid: string) => {
      // Mock user data
      return {
        uid,
        email: 'admin@neotech-consulting.com',
        displayName: 'Admin User',
        customClaims: { admin: true }
      };
    },
    setCustomUserClaims: async (uid: string, claims: any) => {
      console.log(`Setting custom claims for ${uid}:`, claims);
      // In a real scenario, this would update the user's claims
      return true;
    },
    createUser: async (userData: any) => {
      console.log('Creating user:', userData);
      return { uid: 'new-user-id', ...userData };
    }
  }),
  firestore: () => ({
    collection: (path: string) => ({
      doc: (id: string) => ({
        get: async () => ({
          exists: true,
          data: () => ({ id, name: 'Mock Document' }),
          id
        }),
        set: async (data: any) => {
          console.log(`Setting document ${id} in ${path}:`, data);
          return true;
        },
        update: async (data: any) => {
          console.log(`Updating document ${id} in ${path}:`, data);
          return true;
        },
        delete: async () => {
          console.log(`Deleting document ${id} in ${path}`);
          return true;
        }
      }),
      add: async (data: any) => {
        console.log(`Adding document to ${path}:`, data);
        return { id: 'new-doc-id' };
      }
    })
  })
};

// IMPORTANT: Comment the following in production or when connecting to the real Firebase Admin SDK
// This is just an example of how you might use the mock Admin SDK in development
export const adminAuth = mockFirebaseAdmin.auth();
export const adminFirestore = mockFirebaseAdmin.firestore();
