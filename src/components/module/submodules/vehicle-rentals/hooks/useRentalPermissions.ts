
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { RentalUserPermission } from '../types/settings-types';
import { toast } from 'sonner';

export const useRentalPermissions = () => {
  const queryClient = useQueryClient();

  const { data: permissions, isLoading } = useQuery({
    queryKey: ['rental-permissions'],
    queryFn: async () => {
      const permissionsRef = collection(db, 'rental-permissions');
      const snapshot = await getDocs(permissionsRef);
      return snapshot.docs.map(doc => ({ 
        ...doc.data(),
        id: doc.id 
      })) as RentalUserPermission[];
    }
  });

  const { mutate: updatePermission } = useMutation({
    mutationFn: async (params: { 
      userId: string, 
      permissionType: keyof RentalUserPermission['permissions'], 
      value: boolean 
    }) => {
      const { userId, permissionType, value } = params;
      const permissionRef = doc(db, 'rental-permissions', userId);
      
      const currentPermissions = permissions?.find(p => p.userId === userId)?.permissions || {
        view: false,
        create: false,
        edit: false,
        delete: false
      };

      await setDoc(permissionRef, {
        userId,
        permissions: {
          ...currentPermissions,
          [permissionType]: value
        }
      }, { merge: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rental-permissions'] });
      toast.success('Permissions mises à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour des permissions');
    }
  });

  return {
    permissions,
    isLoading,
    updatePermission: (userId: string, permissionType: keyof RentalUserPermission['permissions'], value: boolean) => {
      updatePermission({ userId, permissionType, value });
    }
  };
};
