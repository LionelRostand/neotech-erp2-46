
import { useState, useEffect } from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';

interface AccountingPermission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  canCreate: boolean;
  canEdit: boolean;
  canView: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AccountingUserPermission {
  userId: string;
  permissions: Array<{
    moduleId: string;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }>;
}

export const useAccountingPermissions = () => {
  const [permissions, setPermissions] = useState<AccountingPermission[]>([]);
  const [users, setUsers] = useState<{ id: string; displayName: string; email: string; role?: string; }[]>([]);
  const [userPermissions, setUserPermissions] = useState<AccountingUserPermission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  // Use the correct path - add the PERMISSIONS field if it doesn't exist
  const collectionPath = COLLECTIONS.ACCOUNTING.PERMISSIONS || 'accounting-permissions';
  
  const { 
    data: permissionsData, 
    isLoading, 
    error 
  } = useCollectionData(
    collectionPath,
    [orderBy('userName')]
  );

  // Load users
  useEffect(() => {
    // This would normally be a Firebase query to get all users
    // For now, we'll use mock data
    setUsers([
      { id: 'user1', displayName: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { id: 'user2', displayName: 'Jane Smith', email: 'jane@example.com', role: 'Manager' },
      { id: 'user3', displayName: 'Alice Johnson', email: 'alice@example.com', role: 'User' },
    ]);
  }, []);

  useEffect(() => {
    if (permissionsData) {
      setPermissions(permissionsData as AccountingPermission[]);
      
      // Transform permissions data into userPermissions format
      const groupedByUser: Record<string, AccountingUserPermission> = {};
      
      permissionsData.forEach((perm: AccountingPermission) => {
        if (!groupedByUser[perm.userId]) {
          groupedByUser[perm.userId] = {
            userId: perm.userId,
            permissions: []
          };
        }
        
        groupedByUser[perm.userId].permissions.push({
          moduleId: perm.id,
          canView: perm.canView,
          canCreate: perm.canCreate,
          canEdit: perm.canEdit,
          canDelete: perm.canDelete
        });
      });
      
      setUserPermissions(Object.values(groupedByUser));
    }
  }, [permissionsData]);

  // Update a specific permission
  const updatePermission = (userId: string, moduleId: string, permissionType: keyof Omit<AccountingPermission, 'moduleId'>, value: boolean) => {
    setUserPermissions(prev => 
      prev.map(user => {
        if (user.userId === userId) {
          return {
            ...user,
            permissions: user.permissions.map(perm => {
              if (perm.moduleId === moduleId) {
                return { ...perm, [permissionType]: value };
              }
              return perm;
            })
          };
        }
        return user;
      })
    );
  };

  // Set all permissions of a specific type for a user
  const setAllPermissionsOfType = (userId: string, permissionType: keyof Omit<AccountingPermission, 'moduleId'>, value: boolean) => {
    setUserPermissions(prev => 
      prev.map(user => {
        if (user.userId === userId) {
          return {
            ...user,
            permissions: user.permissions.map(perm => {
              return { ...perm, [permissionType]: value };
            })
          };
        }
        return user;
      })
    );
  };

  // Save permissions to database
  const savePermissions = async () => {
    setSaving(true);
    
    try {
      // This would normally make Firebase calls to update permissions
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Permissions saved:', userPermissions);
      setSaving(false);
      return true;
    } catch (err) {
      console.error('Error saving permissions:', err);
      setSaving(false);
      return false;
    }
  };

  return {
    permissions,
    users,
    userPermissions,
    loading: isLoading,
    isLoading,
    saving,
    error,
    searchTerm,
    setSearchTerm,
    updatePermission,
    setAllPermissionsOfType,
    savePermissions
  };
};
