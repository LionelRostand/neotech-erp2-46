
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, query, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

export interface ModulePermissions {
  view: boolean;
  edit: boolean;
  create: boolean;
  delete: boolean;
  export?: boolean;
  modify?: boolean;
}

export interface UserPermissions {
  userId: string;
  isAdmin: boolean;
  permissions: {
    [moduleId: string]: ModulePermissions;
  };
}

// Get permissions for a specific user
export const getUserPermissions = async (userId: string): Promise<UserPermissions | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.PERMISSIONS, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as UserPermissions;
      return { ...data, userId };
    } else {
      // If no permissions doc exists, create default permissions (readonly)
      const defaultPermissions: UserPermissions = {
        userId,
        isAdmin: false,
        permissions: {
          // Default permissions for major modules
          'employees': { view: true, edit: false, create: false, delete: false },
          'accounting': { view: true, edit: false, create: false, delete: false },
          'documents': { view: true, edit: false, create: false, delete: false },
          
          // Detailed permissions for employee submodules
          'employees-profiles': { view: true, edit: false, create: false, delete: false },
          'employees-badges': { view: true, edit: false, create: false, delete: false },
          'employees-departments': { view: true, edit: false, create: false, delete: false },
          'employees-leaves': { view: true, edit: false, create: false, delete: false },
        }
      };

      await setDoc(docRef, defaultPermissions);
      return defaultPermissions;
    }
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return null;
  }
};

// Check if a user has a specific permission for a module
export const checkUserPermission = async (
  userId: string,
  moduleId: string,
  action: 'view' | 'create' | 'edit' | 'delete' | 'export' | 'modify'
): Promise<boolean> => {
  try {
    const permissions = await getUserPermissions(userId);
    
    // If user is admin, they have all permissions
    if (permissions?.isAdmin) return true;
    
    // Check specific permission
    return !!permissions?.permissions?.[moduleId]?.[action];
  } catch (error) {
    console.error('Error checking user permission:', error);
    return false;
  }
};

// Update permissions for a user
export const updateUserPermissions = async (
  userId: string,
  moduleId: string,
  permissions: Partial<ModulePermissions>
): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.PERMISSIONS, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data() as UserPermissions;
      
      // Update the specific module permissions
      await updateDoc(docRef, {
        [`permissions.${moduleId}`]: {
          ...(userData.permissions[moduleId] || { view: false, edit: false, create: false, delete: false }),
          ...permissions
        }
      });
      
      return true;
    } else {
      // Create new permissions document with the specified module permissions
      const newPermissions: UserPermissions = {
        userId,
        isAdmin: false,
        permissions: {
          [moduleId]: {
            view: permissions.view || false,
            edit: permissions.edit || false,
            create: permissions.create || false,
            delete: permissions.delete || false,
            export: permissions.export || false,
            modify: permissions.modify || false,
          }
        }
      };
      
      await setDoc(docRef, newPermissions);
      return true;
    }
  } catch (error) {
    console.error('Error updating user permissions:', error);
    return false;
  }
};

// Make user an admin or remove admin status
export const setUserAdmin = async (userId: string, isAdmin: boolean): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.PERMISSIONS, userId);
    await updateDoc(docRef, { isAdmin });
    return true;
  } catch (error) {
    console.error('Error setting user admin status:', error);
    return false;
  }
};

// Delete user permissions
export const deleteUserPermissions = async (userId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.PERMISSIONS, userId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting user permissions:', error);
    return false;
  }
};

// Get all user permissions (for admin view)
export const getAllUserPermissions = async (): Promise<UserPermissions[]> => {
  try {
    const permissionsRef = collection(db, COLLECTIONS.HR.PERMISSIONS);
    const q = query(permissionsRef);
    const querySnapshot = await getDocs(q);
    
    const allPermissions: UserPermissions[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as UserPermissions;
      allPermissions.push({
        ...data,
        userId: doc.id,
      });
    });
    
    return allPermissions;
  } catch (error) {
    console.error('Error fetching all user permissions:', error);
    return [];
  }
};
