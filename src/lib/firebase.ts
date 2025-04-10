
// Firebase configuration for NEOTECH-ERP
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { toast } from 'sonner';

// Configuration Firebase
// Pour un projet réel, remplacez ces valeurs par les vôtres
// obtenues dans la console Firebase: https://console.firebase.google.com
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBTD7MmllYBrHnhPt6PnCQ-Iteb8iZDrOg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "neotech-erp-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "neotech-erp-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "neotech-erp-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "634343387498",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:634343387498:web:b1234567890123456789a"
};

// Initialiser Firebase
console.log('Initialisation de Firebase...');
const app = initializeApp(firebaseConfig);

// Initialiser Firestore (base de données)
const db = getFirestore(app);

// Activer la persistance hors ligne pour Firestore
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('Persistence hors ligne Firestore activée avec succès');
    })
    .catch((err) => {
      console.warn('Échec de l\'activation de la persistence hors ligne Firestore:', err);
      
      if (err.code === 'failed-precondition') {
        toast.warning('La persistence hors ligne requiert un seul onglet ouvert à la fois');
      } else if (err.code === 'unimplemented') {
        toast.warning('Votre navigateur ne prend pas en charge la persistence hors ligne');
      }
    });
} catch (err) {
  console.warn('Erreur lors de la configuration de la persistence Firestore:', err);
}

// Initialiser Authentication
const auth = getAuth(app);

// Initialiser Storage
const storage = getStorage(app);

// Détecter le mode développement et la configuration des émulateurs
const isDevMode = import.meta.env.DEV;
const useEmulator = import.meta.env.VITE_EMULATOR === 'true';

// Activer les émulateurs Firebase en mode développement si configuré
if (isDevMode && useEmulator) {
  try {
    // Connecter l'émulateur Firestore
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Connecté à l\'émulateur Firestore');
    
    // Connecter l'émulateur Auth
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.log('Connecté à l\'émulateur Auth');
    
    // Connecter l'émulateur Storage
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('Connecté à l\'émulateur Storage');
  } catch (err) {
    console.warn('Échec de la connexion aux émulateurs Firebase:', err);
  }
}

// Exporter les services initialisés
export { db, auth, storage, app };

// Fonction pour vérifier l'état de la connexion à Firestore
export const checkFirestoreConnection = async (): Promise<boolean> => {
  try {
    // Tentative de connexion à Firestore
    const testCollection = 'connection_test';
    const testDoc = `test_${Date.now()}`;
    
    // Importer de manière dynamique pour éviter les problèmes de référence circulaire
    const { addDocument, deleteDocument } = await import('@/hooks/firestore/firestore-utils');
    
    // Essayer d'ajouter et supprimer un document
    const added = await addDocument(testCollection, { timestamp: new Date().toISOString() });
    if (added?.id) {
      await deleteDocument(testCollection, added.id);
      console.log('Connexion à Firestore vérifiée avec succès');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Échec de la vérification de connexion à Firestore:', error);
    return false;
  }
};
