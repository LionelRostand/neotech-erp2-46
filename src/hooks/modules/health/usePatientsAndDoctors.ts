
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import type { Patient, Doctor } from '@/components/module/submodules/health/types/health-types';

export const usePatientsAndDoctors = () => {
  // Fetch patients
  const { 
    data: patients, 
    isLoading: isPatientsLoading, 
    error: patientsError 
  } = useCollectionData<Patient>(
    COLLECTIONS.HEALTH.PATIENTS,
    [orderBy('lastName')]
  );

  // Fetch doctors
  const { 
    data: doctors, 
    isLoading: isDoctorsLoading, 
    error: doctorsError 
  } = useCollectionData<Doctor>(
    COLLECTIONS.HEALTH.DOCTORS,
    [orderBy('lastName')]
  );

  const isLoading = isPatientsLoading || isDoctorsLoading;
  const error = patientsError || doctorsError;

  return {
    patients,
    doctors,
    isLoading,
    error
  };
};
