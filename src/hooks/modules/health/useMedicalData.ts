
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import type { Prescription, MedicalRecord, LaboratoryTest } from '@/components/module/submodules/health/types/health-types';

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
    COLLECTIONS.HEALTH.MEDICAL_RECORDS,
    [orderBy('date', 'desc')]
  );

  // Fetch laboratory tests
  const { 
    data: laboratoryTests, 
    isLoading: isLabTestsLoading, 
    error: labTestsError 
  } = useCollectionData<LaboratoryTest>(
    COLLECTIONS.HEALTH.LABORATORY,
    [orderBy('date', 'desc')]
  );

  const isLoading = isPrescriptionsLoading || isMedicalRecordsLoading || isLabTestsLoading;
  const error = prescriptionsError || medicalRecordsError || labTestsError;

  return {
    prescriptions,
    medicalRecords,
    laboratoryTests,
    isLoading,
    error
  };
};
