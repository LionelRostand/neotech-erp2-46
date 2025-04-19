
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import type { Staff } from '@/components/module/submodules/health/types/health-types';

export const useStaffData = () => {
  // Fetch nurses
  const {
    data: nurses,
    isLoading: isNursesLoading,
    error: nursesError
  } = useCollectionData<Staff>(
    COLLECTIONS.HEALTH.NURSES,
    [orderBy('lastName')]
  );

  // Fetch staff
  const { 
    data: staff, 
    isLoading: isStaffLoading, 
    error: staffError 
  } = useCollectionData<Staff>(
    COLLECTIONS.HEALTH.STAFF,
    [orderBy('lastName')]
  );

  const isLoading = isNursesLoading || isStaffLoading;
  const error = nursesError || staffError;

  return {
    nurses,
    staff,
    isLoading,
    error
  };
};
