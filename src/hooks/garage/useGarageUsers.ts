
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export interface GarageUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  permissions?: {
    [moduleId: string]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}

export const useGarageUsers = () => {
  const [users, setUsers] = useState<GarageUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersRef = collection(db, COLLECTIONS.USERS);
        const snapshot = await getDocs(usersRef);
        
        const usersData = await Promise.all(snapshot.docs.map(async (userDoc) => {
          const userData = userDoc.data();
          const userId = userDoc.id;
          
          // Récupérer les permissions de l'utilisateur
          const permissionsRef = doc(db, COLLECTIONS.USER_PERMISSIONS, userId);
          const permissionsSnap = await getDoc(permissionsRef);
          const permissions = permissionsSnap.exists() ? permissionsSnap.data().permissions || {} : {};
          
          return {
            id: userId,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            role: userData.role || 'Utilisateur',
            permissions
          };
        }));
        
        setUsers(usersData);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateUserPermissions = async (userId: string, moduleId: string, permissions: { [key: string]: boolean }) => {
    try {
      const permissionPath = `permissions.garage-${moduleId}`;
      const userPermRef = doc(db, COLLECTIONS.USER_PERMISSIONS, userId);
      
      await updateDoc(userPermRef, {
        [permissionPath]: permissions
      });
      
      // Mise à jour de l'état local
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId
          ? {
              ...user,
              permissions: {
                ...user.permissions,
                [moduleId]: {
                  ...user.permissions?.[moduleId],
                  ...permissions
                }
              }
            }
          : user
      ));
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des permissions:", error);
      throw error;
    }
  };

  return { users, loading, updateUserPermissions };
};
