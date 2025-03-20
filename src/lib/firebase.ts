
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
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

// Add offline persistence to allow app to work offline
import { enableIndexedDbPersistence } from "firebase/firestore";

// Enable offline persistence
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Firestore offline persistence enabled");
    })
    .catch((err) => {
      console.error("Error enabling offline persistence:", err);
    });
} catch (error) {
  console.error("Error setting up offline persistence:", error);
}

export default app;
