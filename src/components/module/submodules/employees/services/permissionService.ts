
import { getDocumentById } from '@/hooks/firestore/read-operations';
import { updateDocument, setDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';

// Structure des permissions
export interface ModulePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  modify?: boolean; // Pour la compatibilité avec certaines structures existantes
}

export interface UserPermissions {
  userId: string;
  permissions: {
    employees?: ModulePermissions;
    companies?: ModulePermissions;
    salaries?: ModulePermissions;
    documents?: ModulePermissions;
    departments?: ModulePermissions;
    attendance?: ModulePermissions;
    [key: string]: ModulePermissions | undefined;
  };
  roles?: string[];
  isAdmin?: boolean;
}

// Récupérer les permissions d'un utilisateur
export const getUserPermissions = async (userId: string): Promise<UserPermissions | null> => {
  try {
    console.log(`Récupération des permissions pour l'utilisateur ${userId} depuis Firestore...`);
    
    const permissionsDoc = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.USER_PERMISSIONS, userId);
    });
    
    if (!permissionsDoc) {
      console.log(`Aucune permission trouvée pour l'utilisateur ${userId}`);
      return null;
    }
    
    // Convert the document to UserPermissions type, ensuring it has the required properties
    const permissions = {
      userId,
      permissions: (permissionsDoc as any).permissions || {},
      roles: (permissionsDoc as any).roles || [],
      isAdmin: (permissionsDoc as any).isAdmin || false
    } as UserPermissions;
    
    console.log(`Permissions récupérées pour l'utilisateur ${userId}:`, permissions);
    return permissions;
  } catch (error) {
    console.error(`Erreur lors de la récupération des permissions pour l'utilisateur ${userId}:`, error);
    return null;
  }
};

// Mettre à jour les permissions d'un utilisateur
export const updateUserPermissions = async (userId: string, permissions: Partial<UserPermissions>): Promise<boolean> => {
  try {
    console.log(`Mise à jour des permissions pour l'utilisateur ${userId} dans Firestore...`);
    
    await executeWithNetworkRetry(async () => {
      // Vérifier si le document existe déjà
      const existingPermissions = await getDocumentById(COLLECTIONS.USER_PERMISSIONS, userId);
      
      if (existingPermissions) {
        // Mise à jour du document existant
        return await updateDocument(COLLECTIONS.USER_PERMISSIONS, userId, permissions);
      } else {
        // Création d'un nouveau document avec l'ID spécifié
        return await setDocument(COLLECTIONS.USER_PERMISSIONS, userId, {
          userId,
          ...permissions
        });
      }
    });
    
    console.log(`Permissions mises à jour avec succès pour l'utilisateur ${userId}`);
    toast.success("Permissions mises à jour avec succès");
    return true;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour des permissions pour l'utilisateur ${userId}:`, error);
    toast.error("Erreur lors de la mise à jour des permissions");
    return false;
  }
};

// Vérifier si un utilisateur a une permission spécifique
export const checkUserPermission = async (
  userId: string, 
  module: string, 
  action: 'view' | 'create' | 'edit' | 'delete' | 'export' | 'modify'
): Promise<boolean> => {
  try {
    const userPermissions = await getUserPermissions(userId);
    
    // Si l'utilisateur est administrateur, il a toutes les permissions
    if (userPermissions?.isAdmin) {
      return true;
    }
    
    // Vérifier la permission spécifique
    const modulePermissions = userPermissions?.permissions?.[module];
    if (modulePermissions) {
      return !!modulePermissions[action];
    }
    
    return false;
  } catch (error) {
    console.error(`Erreur lors de la vérification des permissions pour l'utilisateur ${userId}:`, error);
    return false;
  }
};

// Initialiser les permissions par défaut pour un nouvel utilisateur
export const initializeDefaultPermissions = async (userId: string, isAdmin: boolean = false): Promise<boolean> => {
  const defaultPermissions: UserPermissions = {
    userId,
    permissions: {
      // Permissions par défaut pour les différents modules
      employees: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: false
      },
      companies: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: false
      },
      salaries: {
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false,
        modify: false
      },
      documents: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: false
      }
    },
    isAdmin
  };
  
  return await updateUserPermissions(userId, defaultPermissions);
};
