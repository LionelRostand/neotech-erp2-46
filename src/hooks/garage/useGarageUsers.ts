
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

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
      setLoading(true);
      try {
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
        toast.error("Erreur lors du chargement des utilisateurs");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateUserPermissions = async (userId: string, permissions: any) => {
    try {
      const permissionsRef = doc(db, COLLECTIONS.USER_PERMISSIONS, userId);
      await updateDoc(permissionsRef, { permissions });
      
      // Mettre à jour l'état local
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, permissions }
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
