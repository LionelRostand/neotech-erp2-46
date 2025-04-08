import { 
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, UserPermission } from "@/types/user";
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
    console.log("Tentative de connexion avec:", email);
    
    // Utiliser directement la fonction mock de auth
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    
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

// Envoyer un email de réinitialisation de mot de passe
export const sendPasswordEmail = async (email: string): Promise<boolean> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log(`Email de réinitialisation envoyé à ${email}`);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error);
    return false;
  }
};

// Créer un employé avec compte utilisateur
export const createEmployeeWithAccount = async (employeeData: any, professionalEmail: string): Promise<{success: boolean, employee?: any, user?: User}> => {
  try {
    // Générer un mot de passe temporaire aléatoire
    const tempPassword = Math.random().toString(36).slice(-8);

    // Créer l'utilisateur dans Firebase Auth
    const userData: User = {
      email: professionalEmail,
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      role: 'user',
      department: employeeData.department || '',
      position: employeeData.position || '',
      status: 'pending'
    };

    // Créer l'utilisateur
    const newUser = await createUser(userData, tempPassword);
    
    if (!newUser) {
      console.error("Échec de la création du compte utilisateur");
      return { success: false };
    }
    
    // Envoyer l'email de réinitialisation de mot de passe
    const emailSent = await sendPasswordEmail(professionalEmail);
    
    if (!emailSent) {
      console.warn("L'utilisateur a été créé mais l'email n'a pas pu être envoyé");
    }
    
    // Retourner les données de l'employé et de l'utilisateur créés
    return { 
      success: true, 
      employee: employeeData,
      user: newUser
    };

  } catch (error) {
    console.error("Erreur lors de la création de l'employé avec compte:", error);
    return { success: false };
  }
};
