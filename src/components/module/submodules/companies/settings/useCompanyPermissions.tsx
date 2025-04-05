
import { useState, useEffect } from 'react';
import { CompanyPermission, CompanyUserPermission } from '../types/company-settings-types';
import { companiesModule } from '@/data/modules/companies';

const useCompanyPermissions = () => {
  const [permissions, setPermissions] = useState<CompanyUserPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock loading of permissions
    const loadPermissions = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock permissions based on the companies module submodules
        const mockPermissions: CompanyUserPermission[] = [
          {
            userId: '1',
            userName: 'John Doe',
            userEmail: 'john.doe@example.com',
            userRole: 'Admin',
            permissions: generatePermissionsForUser('1', true)
          },
          {
            userId: '2',
            userName: 'Jane Smith',
            userEmail: 'jane.smith@example.com',
            userRole: 'Manager',
            permissions: generatePermissionsForUser('2')
          },
          {
            userId: '3',
            userName: 'Bob Johnson',
            userEmail: 'bob.johnson@example.com',
            userRole: 'User',
            permissions: generatePermissionsForUser('3', false, true)
          }
        ];
        
        setPermissions(mockPermissions);
      } catch (error) {
        console.error('Error loading permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPermissions();
  }, []);

  // Generate mock permissions for a user based on the companies module submodules
  const generatePermissionsForUser = (userId: string, isAdmin = false, readOnly = false): CompanyPermission[] => {
    return companiesModule.submodules.map(submodule => ({
      id: `perm-${userId}-${submodule.id}`,
      name: submodule.name,
      description: `Permissions pour ${submodule.name}`,
      value: true,
      moduleId: submodule.id,
      canView: true,
      canCreate: isAdmin ? true : !readOnly,
      canEdit: isAdmin ? true : !readOnly,
      canDelete: isAdmin
    }));
  };

  const saveUserPermissions = async (updatedPermissions: CompanyUserPermission[]) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPermissions(updatedPermissions);
      console.log('Permissions saved:', updatedPermissions);
      return true;
    } catch (error) {
      console.error('Error saving permissions:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addUserPermissions = async (userId: string, userName: string, userEmail: string, userRole: string) => {
    const newUserPerm: CompanyUserPermission = {
      userId,
      userName,
      userEmail,
      userRole,
      permissions: generatePermissionsForUser(userId)
    };
    
    setPermissions(prev => [...prev, newUserPerm]);
    return newUserPerm;
  };

  const removeUserPermissions = async (userId: string) => {
    setPermissions(prev => prev.filter(p => p.userId !== userId));
    return true;
  };

  return {
    permissions,
    isLoading,
    saveUserPermissions,
    addUserPermissions,
    removeUserPermissions
  };
};

export default useCompanyPermissions;
