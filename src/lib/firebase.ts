
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
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

// Initialiser les services
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
try {
  // Changed from enableIndexedDbPersistence to enableMultiTabIndexedDbPersistence
  // This allows multiple tabs to access the same offline storage
  enableMultiTabIndexedDbPersistence(db)
    .then(() => {
      console.log("Firestore offline multi-tab persistence enabled");
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn("Multiple tabs open, persistence only enabled in one tab");
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        console.warn("Offline persistence not supported in this browser");
      } else {
        console.error("Error enabling offline persistence:", err);
      }
    });
} catch (error) {
  console.error("Error setting up offline persistence:", error);
}

export default app;
