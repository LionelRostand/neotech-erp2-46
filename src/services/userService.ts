
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, UserPermission } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { COLLECTIONS } from "@/lib/firebase-collections";

// Créer un nouvel utilisateur dans Firebase Authentication et Firestore
export const createUser = async (userData: User, password: string): Promise<User | null> => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const emailQuery = query(
      collection(db, COLLECTIONS.USERS), 
      where("email", "==", userData.email)
    );
    const existingUsers = await getDocs(emailQuery);
    
    if (!existingUsers.empty) {
      console.error("Un utilisateur avec cet email existe déjà");
      return null;
    }

    // Créer l'utilisateur dans Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const { uid } = userCredential.user;
    
    // Mettre à jour le profil dans Authentication
    await updateProfile(userCredential.user, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });
    
    // Préparer les données pour Firestore
    const userToSave: User = {
      ...userData,
      id: uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };
    
    // Sauvegarder dans Firestore
    await setDoc(doc(db, COLLECTIONS.USERS, uid), userToSave);
    
    // Créer les permissions par défaut
    const defaultPermissions: UserPermission = {
      userId: uid,
      modules: {
        // Permissions de base pour un utilisateur standard
        employees: { read: true, create: false, update: false, delete: false },
        companies: { read: true, create: false, update: false, delete: false },
        documents: { read: true, create: true, update: true, delete: false }
      }
    };
    
    // Si c'est un admin, donner toutes les permissions
    if (userData.role === 'admin') {
      const modulesList = [
        'employees', 'companies', 'accounting', 'projects', 'crm', 
        'restaurants', 'garages', 'transport', 'health', 'vehicleRentals',
        'freight', 'documents', 'messages', 'websites', 'ecommerce', 
        'academy', 'events', 'library'
      ];
      
      modulesList.forEach(module => {
        defaultPermissions.modules[module] = { 
          read: true, create: true, update: true, delete: true,
          admin: true // Permission spéciale admin
        };
      });
    }
    
    // Sauvegarder les permissions
    await setDoc(doc(db, COLLECTIONS.USER_PERMISSIONS, uid), defaultPermissions);
    
    console.log("Utilisateur créé avec succès");
    return userToSave;
    
  } catch (error: any) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return null;
  }
};

// Connexion utilisateur
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Mettre à jour lastLogin dans Firestore
    const userRef = doc(db, COLLECTIONS.USERS, userCredential.user.uid);
    await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
    
    // Récupérer les données complètes de l'utilisateur
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return { 
        id: userCredential.user.uid, 
        ...userDoc.data() as Omit<User, 'id'> 
      };
    }
    
    return null;
  } catch (error: any) {
    console.error("Erreur de connexion:", error);
    throw error;
  }
};

// Déconnexion
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    return false;
  }
};

// Récupérer un utilisateur par ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() as Omit<User, 'id'> };
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
};

// Récupérer tous les utilisateurs
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    return usersSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() as Omit<User, 'id'> 
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return [];
  }
};
