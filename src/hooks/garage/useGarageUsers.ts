
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
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
        // Récupérer tous les utilisateurs
        const usersRef = collection(db, COLLECTIONS.USERS);
        const snapshot = await getDocs(usersRef);
        
        const usersData: GarageUser[] = [];
        
        // Pour chaque utilisateur, récupérer également ses permissions
        for (const userDoc of snapshot.docs) {
          const userData = userDoc.data();
          const userId = userDoc.id;
          
          // Récupérer les permissions de l'utilisateur
          let userPermissions = {};
          try {
            const permissionsRef = doc(db, COLLECTIONS.USER_PERMISSIONS, userId);
            const permissionsSnap = await getDoc(permissionsRef);
            
            if (permissionsSnap.exists()) {
              userPermissions = permissionsSnap.data().permissions || {};
            }
          } catch (error) {
            console.error(`Erreur lors de la récupération des permissions pour l'utilisateur ${userId}:`, error);
          }
          
          usersData.push({
            id: userId,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            role: userData.role || 'Utilisateur',
            permissions: userPermissions
          });
        }
        
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

  return { users, loading };
};
