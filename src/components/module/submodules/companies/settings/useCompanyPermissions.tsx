import { useState, useEffect, useCallback } from 'react';
import { CompanyUserPermission, CompanyPermission } from '../../companies/types';
import { toast } from 'sonner';

const useCompanyPermissions = () => {
  const [permissions, setPermissions] = useState<CompanyUserPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch company permissions
  const fetchCompanyPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock data for now - this would typically come from an API
      const mockPermissions: CompanyUserPermission[] = [
        {
          userId: '1',
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          userRole: 'Admin',
          permissions: [
            {
              id: '1',
              name: 'Companies',
              description: 'Access to companies module',
              value: true,
              moduleId: 'companies',
              canView: true,
              canCreate: true,
              canEdit: true,
              canDelete: true
            },
            // ... other permissions
          ]
        },
        // ... other users
      ];
      
      setPermissions(mockPermissions);
    } catch (error) {
      console.error('Error fetching company permissions:', error);
      toast.error('Error loading permissions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user permissions
  const saveUserPermissions = useCallback(async (userPermission: CompanyUserPermission) => {
    try {
      // In a real app, this would be an API call
      console.log('Saving permissions for user:', userPermission);
      
      // Update local state
      setPermissions(prev => 
        prev.map(p => 
          p.userId === userPermission.userId ? userPermission : p
        )
      );
      
      toast.success('Permissions updated successfully');
      return true;
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to update permissions');
      return false;
    }
  }, []);

  // Add a new user with permissions
  const addUserPermissions = useCallback(async (userData: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: string;
    permissions: CompanyPermission[];
  }) => {
    try {
      // In a real app, this would be an API call
      const newUserPermission: CompanyUserPermission = {
        userId: userData.userId,
        userName: userData.userName,
        userEmail: userData.userEmail,
        userRole: userData.userRole,
        permissions: userData.permissions
      };
      
      // Update local state
      setPermissions(prev => [...prev, newUserPermission]);
      
      toast.success('User added successfully');
      return true;
    } catch (error) {
      console.error('Error adding user permissions:', error);
      toast.error('Failed to add user');
      return false;
    }
  }, []);

  // Remove user permissions
  const removeUserPermissions = useCallback(async (userId: string) => {
    try {
      // In a real app, this would be an API call
      
      // Update local state
      setPermissions(prev => prev.filter(p => p.userId !== userId));
      
      toast.success('User removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing user permissions:', error);
      toast.error('Failed to remove user');
      return false;
    }
  }, []);

  // Load permissions on mount
  useEffect(() => {
    fetchCompanyPermissions();
  }, [fetchCompanyPermissions]);

  return {
    permissions,
    isLoading,
    saveUserPermissions,
    addUserPermissions,
    removeUserPermissions,
    refreshPermissions: fetchCompanyPermissions
  };
};

export default useCompanyPermissions;
