
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  enableMultiTabIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD3ZQYPtVHk4w63bCvOX0b8RVJyybWyOqU",
  authDomain: "neotech-platform.firebaseapp.com",
  projectId: "neotech-platform",
  storageBucket: "neotech-platform.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services avec des paramètres de cache améliorés
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Use emulators in development if needed
// This helps with testing when Firebase backend is unavailable
if (import.meta.env.DEV) {
  try {
    // Connect to Firebase emulators if they are running locally
    // Uncomment these lines when you have emulators set up
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectStorageEmulator(storage, 'localhost', 9199);
    
    console.log("Firebase initialization complete");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

// Add offline persistence with error handling and retry logic
const enablePersistence = async (retries = 3, delay = 1000) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Enable unlimited cache size and multi-tab persistence
      await enableMultiTabIndexedDbPersistence(db);
      console.log("Firestore offline multi-tab persistence enabled");
      return;
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn("Multiple tabs open, persistence only enabled in one tab");
        return;
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn("Offline persistence not supported in this browser");
        return;
      } else {
        console.error(`Error enabling offline persistence (attempt ${attempt + 1}/${retries}):`, err);
        
        if (attempt < retries - 1) {
          // Add exponential backoff
          const backoffDelay = delay * Math.pow(2, attempt);
          console.log(`Retrying in ${backoffDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        } else {
          console.error("Failed to enable persistence after multiple attempts");
        }
      }
    }
  }
};

// Try to enable persistence with retries
enablePersistence();

export default app;
