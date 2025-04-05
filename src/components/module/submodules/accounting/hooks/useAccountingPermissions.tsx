
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

export const useAccountingPermissions = () => {
  const [permissions, setPermissions] = useState<AccountingPermission[]>([]);

  // Use the correct path - add the PERMISSIONS field if it doesn't exist
  const collectionPath = COLLECTIONS.ACCOUNTING.PERMISSIONS || 'accounting/permissions';
  
  const { 
    data: permissionsData, 
    isLoading, 
    error 
  } = useCollectionData(
    collectionPath,
    [orderBy('userName')]
  );

  useEffect(() => {
    if (permissionsData) {
      setPermissions(permissionsData as AccountingPermission[]);
    }
  }, [permissionsData]);

  return {
    permissions,
    isLoading,
    error
  };
};
