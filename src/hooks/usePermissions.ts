
import { useState, useEffect } from 'react';

/**
 * Hook to provide permission management functionality
 * Returns information about user permissions and methods to check them
 */
export const usePermissions = () => {
  const [isAdmin, setIsAdmin] = useState(true); // For development purposes, default to admin
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  
  useEffect(() => {
    // In a real app, we would fetch user permissions from a backend
    // For now, we'll simulate this with a timeout
    setLoading(true);
    const timer = setTimeout(() => {
      // Simulate loaded permissions
      setPermissions({
        'garage-inventory': ['view', 'create', 'edit', 'delete'],
        'garage-invoices': ['view', 'create', 'edit', 'delete'],
        'garage-repairs': ['view', 'create', 'edit', 'delete'],
      });
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  /**
   * Check if the user has permission for a specific action on a module
   * @param moduleId The module ID to check
   * @param actionType The type of action
   * @returns Boolean indicating if the user has permission
   */
  const checkPermission = async (moduleId: string, actionType: string): Promise<boolean> => {
    // Admin has all permissions
    if (isAdmin) return true;
    
    // Check specific permission
    const modulePermissions = permissions[moduleId];
    if (!modulePermissions) return false;
    
    return modulePermissions.includes(actionType);
  };
  
  return {
    isAdmin,
    loading,
    permissions,
    checkPermission,
  };
};

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
