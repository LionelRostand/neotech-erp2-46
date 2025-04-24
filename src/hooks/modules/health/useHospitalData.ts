
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import type { Inventory } from '@/components/module/submodules/health/types/health-types';

export const useHospitalData = () => {
  // Fetch pharmacy
  const {
    data: pharmacy,
    isLoading: isPharmacyLoading,
    error: pharmacyError
  } = useCollectionData<Inventory>(
    COLLECTIONS.HEALTH.PHARMACY
  );

  // Fetch rooms
  const {
    data: rooms,
    isLoading: isRoomsLoading,
    error: roomsError
  } = useCollectionData(
    COLLECTIONS.HEALTH.ROOMS
  );

  // Fetch hospitalizations
  const {
    data: hospitalizations,
    isLoading: isHospitalizationsLoading,
    error: hospitalizationsError
  } = useCollectionData(
    COLLECTIONS.HEALTH.HOSPITALIZATIONS,
    [orderBy('admissionDate', 'desc')]
  );

  const isLoading = isPharmacyLoading || isRoomsLoading || isHospitalizationsLoading;
  const error = pharmacyError || roomsError || hospitalizationsError;

  return {
    pharmacy,
    rooms,
    hospitalizations,
    isLoading,
    error
  };
};
