
import { useState } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';
import { garageModule } from '@/data/modules/garage';
import { updateUserPermissions } from '@/components/module/submodules/employees/services/permissionService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Type pour représenter les permissions d'un utilisateur sur le module garage
export interface GarageUserPermission {
  userId: string;
  userName: string;
  email: string;
  permissions: {
    [submoduleId: string]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}

export const useGaragePermissions = () => {
  const { permissions: globalPermissions, isAdmin, loading } = usePermissions('garage');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fonction pour mettre à jour les permissions d'un utilisateur
  const updatePermission = async (
    userId: string, 
    submoduleId: string, 
    action: 'view' | 'create' | 'edit' | 'delete', 
    value: boolean
  ) => {
    try {
      setIsUpdating(true);
      console.log(`Mise à jour des permissions pour l'utilisateur ${userId}, module ${submoduleId}, action ${action}: ${value}`);
      
      // Construire le chemin pour la mise à jour
      const permissionPath = `permissions.garage-${submoduleId}.${action}`;
      
      // Mise à jour dans Firestore
      const userPermRef = doc(db, COLLECTIONS.USER_PERMISSIONS, userId);
      await updateDoc(userPermRef, {
        [permissionPath]: value
      });
      
      toast.success('Permissions mises à jour');
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des permissions:', error);
      toast.error("Erreur lors de la mise à jour des permissions");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Fonction pour définir plusieurs permissions à la fois
  const setUserPermissions = async (userId: string, permissions: any) => {
    try {
      setIsUpdating(true);
      await updateUserPermissions(userId, { permissions });
      toast.success('Permissions enregistrées avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des permissions:', error);
      toast.error("Erreur lors de la sauvegarde des permissions");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    globalPermissions,
    isAdmin,
    loading,
    isUpdating,
    updatePermission,
    setUserPermissions,
    garageSubmodules: garageModule.submodules
  };
};
