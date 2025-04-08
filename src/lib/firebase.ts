
// Firebase lite implementation for development
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, Auth, UserCredential, AuthError } from 'firebase/auth';

// Firebase configuration - updated with new credentials
const firebaseConfig = {
  apiKey: "AIzaSyD3ZQYPtVHk4w63bCvOX0b8RVJyybWyOqU",
  authDomain: "neotech-erp.firebaseapp.com",
  projectId: "neotech-erp",
  storageBucket: "neotech-erp.firebasestorage.app",
  messagingSenderId: "803661896660",
  appId: "1:803661896660:web:94f17531b963627cbd5441"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const firestore = getFirestore(app);
const firebaseAuth = getAuth(app);

// Custom implementation for signInWithEmailAndPassword
const mockSignInWithEmailAndPassword = async (auth: Auth, email: string, password: string): Promise<UserCredential> => {
  // For development, check the hardcoded credentials
  if (email === 'admin@neotech-consulting.com' && password === 'AaronEnzo2511@') {
    return {
      user: {
        uid: 'admin-user-id',
        email: 'admin@neotech-consulting.com',
        displayName: 'Admin User',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => Promise.resolve(),
        getIdToken: async () => 'mock-token',
        getIdTokenResult: async () => ({ token: 'mock-token', claims: {}, expirationTime: '', issuedAtTime: '', authTime: '', signInProvider: null, signInSecondFactor: null }),
        reload: async () => Promise.resolve(),
        toJSON: () => ({}),
        phoneNumber: null,
        photoURL: null,
        providerId: 'password',
      }
    } as UserCredential;
  }
  
  // Simulate wrong password error
  const error = new Error('auth/wrong-password') as AuthError;
  error.code = 'auth/wrong-password';
  throw error;
};

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
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
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
