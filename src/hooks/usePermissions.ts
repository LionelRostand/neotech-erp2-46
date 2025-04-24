
import { useState, useEffect } from 'react';

// Define types for module permissions
interface ModulePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export?: boolean;
  modify?: boolean;
}

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
        'applications': ['view', 'modify'],
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
    // Safety check for empty moduleId or actionType
    if (!moduleId || !actionType) {
      console.warn(`checkPermission: moduleId "${moduleId}" or actionType "${actionType}" is empty`);
      return false;
    }
    
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

export default usePermissions;
