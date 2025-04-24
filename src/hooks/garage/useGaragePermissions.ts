
import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export interface GarageUserPermission {
  userId: string;
  userName: string;
  email: string;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export const useGaragePermissions = () => {
  const [users, setUsers] = useState<GarageUserPermission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Simulation de chargement des utilisateurs
        // TODO: Implémenter la vraie logique de chargement depuis Firestore
        setUsers([
          {
            userId: '1',
            userName: 'John Doe',
            email: 'john@example.com',
            permissions: {
              view: true,
              create: true,
              edit: true,
              delete: false
            }
          },
          // Ajoutez d'autres utilisateurs ici
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updatePermission = async (userId: string, moduleId: string, action: 'view' | 'create' | 'edit' | 'delete', value: boolean) => {
    try {
      console.log(`Mise à jour des permissions pour l'utilisateur ${userId}, module ${moduleId}, action ${action}: ${value}`);
      
      // Construire le chemin pour la mise à jour
      const permissionPath = `permissions.${moduleId}.${action}`;
      
      // Mise à jour dans Firestore
      const userPermRef = doc(db, COLLECTIONS.USER_PERMISSIONS, userId);
      await updateDoc(userPermRef, {
        [permissionPath]: value
      });
      
      // Mise à jour de l'état local
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.userId === userId
            ? {
                ...user,
                permissions: {
                  ...user.permissions,
                  [action]: value
                }
              }
            : user
        )
      );
      
      toast.success('Permissions mises à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des permissions:', error);
      toast.error('Erreur lors de la mise à jour des permissions');
    }
  };

  return {
    users,
    loading,
    updatePermission
  };
};
