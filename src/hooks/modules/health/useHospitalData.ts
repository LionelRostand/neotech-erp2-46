
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import type { PharmacyItem, Room, Hospitalization } from '@/components/module/submodules/health/types/health-types';

export const useHospitalData = () => {
  // Fetch pharmacy items
  const { 
    data: pharmacy, 
    isLoading: isPharmacyLoading, 
    error: pharmacyError 
  } = useCollectionData<PharmacyItem>(
    COLLECTIONS.HEALTH.PHARMACY,
    [orderBy('name')]
  );

  // Fetch rooms
  const { 
    data: rooms, 
    isLoading: isRoomsLoading, 
    error: roomsError 
  } = useCollectionData<Room>(
    COLLECTIONS.HEALTH.ROOMS,
    [orderBy('number')]
  );

  // Fetch hospitalizations
  const { 
    data: hospitalizations, 
    isLoading: isHospitalizationsLoading, 
    error: hospitalizationsError 
  } = useCollectionData<Hospitalization>(
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
