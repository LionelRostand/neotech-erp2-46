
import { User } from '@/types/user';
import { toast } from 'sonner';
import { 
  signInWithEmailAndPassword, 
  signOut,
  getAuth
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { COLLECTIONS } from '@/lib/firebase-collections';

// Service d'authentification avec Firebase
export const authService = {
  // Fonction pour se connecter avec Firebase Auth
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      // Connexion avec Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;
      
      // Récupérer les données utilisateur depuis Firestore
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Transformer les données Firestore en objet User
        const userData = userDoc.data();
        const user: User = {
          id: uid,
          email: userCredential.user.email || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          role: userData.role || "user",
          // Autres propriétés selon votre modèle User
        };
        
        // Mettre à jour la date de dernière connexion
        await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
        
        // Stocker les données utilisateur dans le localStorage
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        // L'utilisateur existe dans Auth mais pas dans Firestore
        toast.error("Compte utilisateur incomplet. Contactez l'administrateur.");
        await signOut(auth);
        return null;
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      // Gérer les erreurs spécifiques de Firebase Auth
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Identifiants incorrects');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Trop de tentatives. Veuillez réessayer plus tard');
      } else {
        throw new Error(error.message || 'Erreur de connexion');
      }
    }
  },
  
  // Fonction pour se déconnecter
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  },
  
  // Fonction pour récupérer l'utilisateur actuel depuis le localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (e) {
        return null;
      }
    }
    return null;
  },
  
  // Vérifier si l'utilisateur est authentifié
  isAuthenticated: (): boolean => {
    return auth.currentUser !== null || localStorage.getItem('user') !== null;
  }
};
