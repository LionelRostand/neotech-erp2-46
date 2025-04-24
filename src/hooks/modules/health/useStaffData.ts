
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import type { Nurse, Staff } from '@/components/module/submodules/health/types/health-types';

export const useStaffData = () => {
  // Fetch nurses
  const { 
    data: nurses, 
    isLoading: isNursesLoading, 
    error: nursesError 
  } = useCollectionData<Nurse>(
    COLLECTIONS.HEALTH.NURSES,
    [orderBy('lastName')]
  );

  // Fetch general staff
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
