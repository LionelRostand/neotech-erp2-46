import { initializeApp } from 'firebase/app';
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, collection, doc, setDoc, getDoc, updateDoc, 
  serverTimestamp, onSnapshot, query, orderBy, limit, 
  getDocs as firestoreGetDocs, addDoc as firestoreAddDoc, 
  CollectionReference, DocumentData, Query
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { COLLECTIONS } from './firebase-collections';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDKgLJI-y03tTsGhRmUzY7Q31zzfwVzazA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "neotech-7c574.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "neotech-7c574",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "neotech-7c574.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "375585071827",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:375585071827:web:3c8d4a02a50a5321086a26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Google Auth Provider
const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: "select_account"
});

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    
    // Check if the user exists in the users collection
    const userRef = doc(db, COLLECTIONS.USERS, user.uid);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      // If the user doesn't exist, create a new document
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp()
      });
    }
    
    return user;
  } catch (error: any) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Function to sign out
const userSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Function to update user data
const updateUser = async (userId: string, data: any) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, data);
  } catch (error: any) {
    console.error("Error updating user", error);
    throw error;
  }
};

// Function to upload a file to Firebase Storage
const uploadFile = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return snapshot;
  } catch (error: any) {
    console.error("Error uploading file", error);
    throw error;
  }
};

// Function to get the download URL of a file in Firebase Storage
const getFileDownloadURL = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error: any) {
    console.error("Error getting download URL", error);
    throw error;
  }
};

// Listen for authentication state changes
const listenForAuthChanges = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Function to check Firestore connection status
const checkFirestoreConnection = async (): Promise<boolean> => {
  try {
    // Try to fetch a small document to check connectivity
    const testRef = doc(db, "connection_test", "test_doc");
    await getDoc(testRef);
    return true;
  } catch (error: any) {
    console.error("Error checking Firestore connection:", error);
    return false;
  }
};

// Function to add a document to a collection
const addDocument = async (collectionName: string, data: any) => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await firestoreAddDoc(collectionRef, data);
    console.log(`Document added to ${collectionName} with ID: ${docRef.id}`);
    return { id: docRef.id, ...data };
  } catch (error: any) {
    console.error(`Error adding document to ${collectionName}`, error);
    throw error;
  }
};

// Function to set a document in a collection with a specific ID
const setDocument = async (collectionName: string, documentId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, data);
    console.log(`Document set in ${collectionName} with ID: ${documentId}`);
    return { id: documentId, ...data };
  } catch (error: any) {
    console.error(`Error setting document in ${collectionName} with ID: ${documentId}`, error);
    throw error;
  }
};

// Function to get a document by ID from a collection
const getDocument = async (collectionName: string, documentId: string) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error: any) {
    console.error("Error getting document:", error);
    throw error;
  }
};

// Function to listen for changes to a specific document
const listenForDocumentChanges = (collectionName: string, documentId: string, callback: (data: any) => void) => {
  const docRef = doc(db, collectionName, documentId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
};

// Function to fetch a limited number of documents from a collection, ordered by a specific field
const getLimitedDocuments = async (collectionPath: string, field: string, order: 'asc' | 'desc', limitCount: number) => {
  try {
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, orderBy(field, order), limit(limitCount));
    const querySnapshot = await firestoreGetDocs(q);
    
    const documents: any[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error: any) {
    console.error("Error getting limited documents:", error);
    throw error;
  }
};

const getDocs = async (collectionPath: string) => {
    try {
        const collectionRef = collection(db, collectionPath);
        const querySnapshot = await firestoreGetDocs(collectionRef);
        const documents: any[] = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        return documents
    } catch (error: any) {
        console.error("Error getting documents:", error);
        throw error;
    }
}

export { 
  app,
  auth,
  db,
  storage,
  signInWithGoogle,
  userSignOut,
  updateUser,
  uploadFile,
  getFileDownloadURL,
  listenForAuthChanges,
  addDocument,
  setDocument,
  getDocument,
  listenForDocumentChanges,
  getLimitedDocuments,
  getDocs,
  checkFirestoreConnection
};
