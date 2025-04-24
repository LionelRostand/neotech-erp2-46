
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import type { 
  MedicalRecord, 
  Laboratory, 
  Prescription 
} from '@/components/module/submodules/health/types/health-types';

export const useMedicalData = () => {
  // Fetch prescriptions
  const {
    data: prescriptions,
    isLoading: isPrescriptionsLoading,
    error: prescriptionsError
  } = useCollectionData<Prescription>(
    COLLECTIONS.HEALTH.PRESCRIPTIONS,
    [orderBy('date', 'desc')]
  );

  // Fetch medical records
  const {
    data: medicalRecords,
    isLoading: isMedicalRecordsLoading,
    error: medicalRecordsError
  } = useCollectionData<MedicalRecord>(
    COLLECTIONS.HEALTH.MEDICAL_RECORDS
  );

  // Fetch laboratory
  const {
    data: laboratoryTests,
    isLoading: isLaboratoryLoading,
    error: laboratoryError
  } = useCollectionData<Laboratory>(
    COLLECTIONS.HEALTH.LABORATORY,
    [orderBy('date', 'desc')]
  );

  const isLoading = isPrescriptionsLoading || isMedicalRecordsLoading || isLaboratoryLoading;
  const error = prescriptionsError || medicalRecordsError || laboratoryError;

  return {
    prescriptions,
    medicalRecords,
    laboratoryTests,
    isLoading,
    error
  };
};
