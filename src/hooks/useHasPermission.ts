
import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

/**
 * Hook to check if the current user has permission for a specific module and action
 * @param moduleId The module ID to check permissions for
 * @param actionType The type of action (view, create, edit, delete)
 * @returns Boolean indicating if user has permission
 */
export const useHasPermission = (
  moduleId: string,
  actionType: 'view' | 'create' | 'edit' | 'delete' | 'export' | 'modify'
) => {
  const [hasPermission, setHasPermission] = useState(false);
  const { isAdmin, checkPermission, loading } = usePermissions();

  useEffect(() => {
    const checkAccess = async () => {
      if (isAdmin) {
        setHasPermission(true);
        return;
      }

      try {
        const access = await checkPermission(moduleId, actionType);
        setHasPermission(access);
      } catch (error) {
        console.error(`Error checking permission for ${moduleId}.${actionType}:`, error);
        setHasPermission(false);
      }
    };

    if (!loading) {
      checkAccess();
    }
  }, [moduleId, actionType, checkPermission, isAdmin, loading]);

  return hasPermission;
};
