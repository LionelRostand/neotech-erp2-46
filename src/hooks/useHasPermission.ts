
import { useState, useEffect } from 'react';
import { usePermissions } from './usePermissions';

/**
 * Hook to check if the user has a specific permission
 * @param moduleId The module ID to check
 * @param actionType The type of action
 * @returns Boolean indicating if the user has permission
 */
export const useHasPermission = (moduleId: string, actionType: string) => {
  const { isAdmin, checkPermission, loading } = usePermissions();
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    const checkUserPermission = async () => {
      if (isAdmin) {
        setHasPermission(true);
        return;
      }
      
      const result = await checkPermission(moduleId, actionType);
      setHasPermission(result);
    };
    
    checkUserPermission();
  }, [moduleId, actionType, isAdmin, checkPermission]);
  
  return !loading && hasPermission;
};

export default useHasPermission;
