
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
        // Check if user is admin or has admin@neotech-consulting.com email
        const isAdminUser = isAdmin || userData?.email === 'admin@neotech-consulting.com';

        // Check if it's the user's own profile
        if (userData && employeeId) {
          setIsOwnProfile(userData.id === employeeId);
        }

        // If admin user, grant all permissions
        if (isAdminUser) {
          setCanView(true);
          setCanEdit(true);
          setCanDelete(true);
          setLoading(false);
          return;
        }

        // If it's own profile, user can view it
        if (isOwnProfile) {
          setCanView(true);
          const canEditOwn = await checkPermission(moduleId || 'employees-profiles', 'edit');
          setCanEdit(canEditOwn);
          setCanDelete(false);
          setLoading(false);
          return;
        }

        // Check regular permissions for non-admin users
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
    isAdmin: isAdmin || userData?.email === 'admin@neotech-consulting.com',
    loading
  };
};
