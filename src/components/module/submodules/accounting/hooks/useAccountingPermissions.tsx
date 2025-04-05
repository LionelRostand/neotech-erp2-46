
import { useState, useEffect, useCallback } from 'react';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useCollectionData } from '@/hooks/useCollectionData';
import { toast } from 'sonner';

export interface AccountingPermission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  permissionType: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  lastModified: string;
}

export interface AccountingUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const ACCOUNTING_PERMISSIONS = {
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
  EXPENSES: 'expenses',
  CLIENTS: 'clients',
  SUPPLIERS: 'suppliers',
  REPORTS: 'reports',
  TAXES: 'taxes',
  SETTINGS: 'settings',
  TRANSACTIONS: 'transactions',
  PERMISSIONS: 'permissions'
};

export const useAccountingPermissions = () => {
  const [users, setUsers] = useState<AccountingUser[]>([]);
  const [userPermissions, setUserPermissions] = useState<AccountingPermission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Fetch all permissions from the database
  const { data: permissions, isLoading, error } = useCollectionData<AccountingPermission>(
    COLLECTIONS.ACCOUNTING.PERMISSIONS
  );

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real application, this would call an API to get the users
        // For now, we'll use mock data based on the permissions
        if (permissions) {
          const uniqueUsers = permissions.reduce((acc: AccountingUser[], permission) => {
            if (!acc.some(user => user.id === permission.userId)) {
              acc.push({
                id: permission.userId,
                name: permission.userName,
                email: permission.userEmail,
                role: permission.userRole
              });
            }
            return acc;
          }, []);
          
          setUsers(uniqueUsers);
          setUserPermissions(permissions);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        toast.error('Failed to load users');
      }
    };

    if (permissions && !isLoading) {
      fetchUsers();
    }
  }, [permissions, isLoading]);

  // Update a single permission
  const updatePermission = useCallback((permissionId: string, field: string, value: boolean) => {
    setUserPermissions(prev => 
      prev.map(permission => 
        permission.id === permissionId 
          ? { ...permission, [field]: value, lastModified: new Date().toISOString() } 
          : permission
      )
    );
  }, []);

  // Set all permissions of a specific type for a user
  const setAllPermissionsOfType = useCallback((userId: string, permissionType: string, value: boolean) => {
    setUserPermissions(prev => 
      prev.map(permission => 
        permission.userId === userId && permission.permissionType === permissionType
          ? { 
              ...permission, 
              canView: value, 
              canCreate: value, 
              canEdit: value, 
              canDelete: value,
              lastModified: new Date().toISOString()
            } 
          : permission
      )
    );
  }, []);

  // Save permissions to the database
  const savePermissions = useCallback(async (): Promise<void> => {
    setSaving(true);
    try {
      // In a real application, this would save to the database
      // For now, we'll just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Permissions saved successfully');
      return Promise.resolve();
    } catch (err) {
      console.error('Error saving permissions:', err);
      toast.error('Failed to save permissions');
      return Promise.reject(err);
    } finally {
      setSaving(false);
    }
  }, [userPermissions]);

  // Filter users based on search term
  const filterUsers = useCallback(() => {
    if (!searchTerm) return users;
    
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const filteredUsers = filterUsers();

  return {
    permissions: userPermissions,
    isLoading,
    error,
    users,
    userPermissions,
    loading: isLoading,
    saving,
    searchTerm,
    setSearchTerm,
    updatePermission,
    setAllPermissionsOfType,
    savePermissions,
    filteredUsers
  };
};
