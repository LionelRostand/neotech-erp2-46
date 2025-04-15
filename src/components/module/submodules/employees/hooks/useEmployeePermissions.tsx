
import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/hooks/useAuth';

export const useEmployeePermissions = (moduleId?: string, employeeId?: string) => {
  const { permissions, isAdmin, checkPermission } = usePermissions(moduleId);
  const { userData } = useAuth();
  const [canView, setCanView] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      setLoading(true);
      try {
        // Vérifier si c'est le profil de l'utilisateur connecté
        if (userData && employeeId) {
          setIsOwnProfile(userData.id === employeeId);
        }

        // Si c'est un admin, il a tous les droits
        if (isAdmin) {
          setCanView(true);
          setCanEdit(true);
          setCanDelete(true);
          setLoading(false);
          return;
        }

        // Si c'est son propre profil, l'utilisateur peut le voir
        if (isOwnProfile) {
          setCanView(true);
          const canEditOwn = await checkPermission(moduleId || 'employees-profiles', 'edit');
          setCanEdit(canEditOwn);
          setCanDelete(false); // Un utilisateur ne peut pas supprimer son propre profil
          setLoading(false);
          return;
        }

        // Sinon, on vérifie les permissions
        if (moduleId) {
          const viewPermission = await checkPermission(moduleId, 'view');
          const editPermission = await checkPermission(moduleId, 'edit');
          const deletePermission = await checkPermission(moduleId, 'delete');

          setCanView(viewPermission);
          setCanEdit(editPermission);
          setCanDelete(deletePermission);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [moduleId, employeeId, isAdmin, userData, checkPermission]);

  return {
    canView,
    canEdit,
    canDelete,
    isOwnProfile,
    isAdmin,
    loading
  };
};
