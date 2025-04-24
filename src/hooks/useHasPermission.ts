
import { useState, useEffect } from 'react';
import { usePermissions } from './usePermissions';

/**
 * Hook to check if the user has a specific permission
 * @param moduleId The module ID to check
 * @param actionType The type of action
 * @returns Boolean indicating if the user has permission
 */
export const useHasPermission = (moduleId: string, actionType: string) => {
  const { isAdmin, checkPermission, loading: permissionsLoading } = usePermissions();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Don't proceed if moduleId or actionType are empty
    if (!moduleId || !actionType) {
      console.warn(`useHasPermission: moduleId "${moduleId}" or actionType "${actionType}" is empty`);
      setHasPermission(false);
      setLoading(false);
      return;
    }

    // Wait for permissions to load first
    if (permissionsLoading) {
      return;
    }

    const checkUserPermission = async () => {
      try {
        // Admin always has permission
        if (isAdmin) {
          setHasPermission(true);
          return;
        }
        
        // Check specific permission for non-admin
        const result = await checkPermission(moduleId, actionType);
        setHasPermission(result);
      } catch (error) {
        console.error(`Error checking permission for ${moduleId}.${actionType}:`, error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserPermission();
  }, [moduleId, actionType, isAdmin, checkPermission, permissionsLoading]);
  
  return { hasPermission, loading };
};

export default useHasPermission;
