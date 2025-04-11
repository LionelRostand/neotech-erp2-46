
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  getAuth,
  fetchSignInMethodsForEmail
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, UserPermission } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { toast } from "sonner";

// Vérifier si un email existe déjà dans Firebase Auth et/ou Firestore
export const checkEmailExists = async (email: string): Promise<{ exists: boolean, source?: string, error?: string }> => {
  try {
    console.log(`Vérification de l'existence de l'email ${email}`);
    
    // 1. Vérifier dans Firebase Auth
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods && signInMethods.length > 0) {
      console.log(`Email ${email} existe déjà dans Firebase Auth`);
      return { exists: true, source: 'auth' };
    }
    
    // 2. Vérifier dans Firestore
    const emailQuery = query(
      collection(db, COLLECTIONS.USERS), 
      where("email", "==", email)
    );
    const existingUsers = await getDocs(emailQuery);
    
    if (!existingUsers.empty) {
      console.log(`Email ${email} existe déjà dans Firestore`);
      return { exists: true, source: 'firestore' };
    }
    
    console.log(`Email ${email} est disponible`);
    return { exists: false };
  } catch (error: any) {
    console.error("Erreur lors de la vérification de l'email:", error);
    return { exists: false, error: error.message };
  }
};

// Créer un nouvel utilisateur dans Firebase Authentication et Firestore
export const createUser = async (userData: User, password: string): Promise<User | null> => {
  try {
    console.log(`Tentative de création d'utilisateur pour ${userData.email}`);
    
    // Vérifier si l'utilisateur existe déjà
    const emailCheck = await checkEmailExists(userData.email);
    
    if (emailCheck.exists) {
      console.error(`Un utilisateur avec l'email ${userData.email} existe déjà (${emailCheck.source})`);
      toast.error(`Un utilisateur avec cet email existe déjà`);
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
      status: userData.status || 'active'
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
    
    // Afficher des messages d'erreur plus spécifiques
    if (error.code === 'auth/email-already-in-use') {
      toast.error("Cet email est déjà utilisé par un autre compte");
    } else if (error.code === 'auth/invalid-email') {
      toast.error("Format d'email invalide");
    } else if (error.code === 'auth/weak-password') {
      toast.error("Le mot de passe est trop faible");
    } else {
      toast.error(`Erreur: ${error.message}`);
    }
    
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
export const createEmployeeWithAccount = async (employeeData: any, professionalEmail: string): Promise<{success: boolean, employee?: any, user?: User, error?: string}> => {
  try {
    console.log(`Tentative de création d'employé et de compte utilisateur pour ${professionalEmail}`);
    
    // Vérifier si l'email existe déjà
    const emailCheck = await checkEmailExists(professionalEmail);
    
    if (emailCheck.exists) {
      const errorMsg = `L'email ${professionalEmail} est déjà utilisé (${emailCheck.source})`;
      console.error(errorMsg);
      toast.error("Cet email professionnel est déjà utilisé");
      return { success: false, error: errorMsg };
    }
    
    // Générer un mot de passe temporaire aléatoire
    const tempPassword = Math.random().toString(36).slice(-8);

    // Créer l'utilisateur dans Firebase Auth
    const userData: User = {
      id: '', // This will be replaced with the Firebase Auth UID
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
      return { success: false, error: "Échec de la création du compte utilisateur" };
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

  } catch (error: any) {
    console.error("Erreur lors de la création de l'employé avec compte:", error);
    
    // Messages d'erreur spécifiques
    if (error.code === 'auth/email-already-in-use') {
      toast.error("Cet email est déjà utilisé par un autre compte");
      return { success: false, error: "Email déjà utilisé" };
    } else {
      toast.error(`Erreur: ${error.message || "Erreur inconnue"}`);
      return { success: false, error: error.message || "Erreur inconnue" };
    }
  }
};
