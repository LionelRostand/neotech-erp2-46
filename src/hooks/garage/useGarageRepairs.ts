
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Repair } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageRepairs = () => {
  // Ensure we have a valid collection path
  const collectionPath = COLLECTIONS.GARAGE?.REPAIRS || 'garage_repairs';
  
  const { data: repairs, isLoading, error, refetch } = useFirebaseCollection<Repair>(collectionPath);

  // Add debug logging
  console.log('useGarageRepairs - collection path:', collectionPath);
  console.log('useGarageRepairs - repairs:', repairs);
  console.log('useGarageRepairs - loading:', isLoading);
  if (error) console.error('useGarageRepairs - error:', error);

  return {
    repairs: repairs || [],
    loading: isLoading,
    error,
    refetch
  };
};
