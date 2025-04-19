
import { useCollectionData } from '../useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';

/**
 * Hook to fetch data for the Health module
 */
export const useHealthData = () => {
  // Fetch patients
  const { 
    data: patients, 
    isLoading: isPatientsLoading, 
    error: patientsError 
  } = useCollectionData(
    COLLECTIONS.HEALTH.PATIENTS,
    [orderBy('lastName')]
  );

  // Fetch doctors
  const { 
    data: doctors, 
    isLoading: isDoctorsLoading, 
    error: doctorsError 
  } = useCollectionData(
    COLLECTIONS.HEALTH.DOCTORS,
    [orderBy('lastName')]
  );

  // Fetch appointments
  const { 
    data: appointments, 
    isLoading: isAppointmentsLoading, 
    error: appointmentsError 
  } = useCollectionData(
    COLLECTIONS.HEALTH.APPOINTMENTS,
    [orderBy('date')]
  );

  // Fetch consultations
  const { 
    data: consultations, 
    isLoading: isConsultationsLoading, 
    error: consultationsError 
  } = useCollectionData(
    COLLECTIONS.HEALTH.CONSULTATIONS,
    [orderBy('date', 'desc')]
  );

  // Fetch prescriptions
  const {
    data: prescriptions,
    isLoading: isPrescriptionsLoading,
    error: prescriptionsError
  } = useCollectionData(
    COLLECTIONS.HEALTH.PRESCRIPTIONS,
    [orderBy('date', 'desc')]
  );

  // Fetch medical records
  const {
    data: medicalRecords,
    isLoading: isMedicalRecordsLoading,
    error: medicalRecordsError
  } = useCollectionData(
    COLLECTIONS.HEALTH.MEDICAL_RECORDS,
    []
  );

  // Fetch laboratory
  const {
    data: laboratoryTests,
    isLoading: isLaboratoryLoading,
    error: laboratoryError
  } = useCollectionData(
    COLLECTIONS.HEALTH.LABORATORY,
    [orderBy('date', 'desc')]
  );

  // Fetch insurance
  const { 
    data: insurance, 
    isLoading: isInsuranceLoading, 
    error: insuranceError 
  } = useCollectionData(
    COLLECTIONS.HEALTH.INSURANCE,
    []
  );

  // Fetch staff
  const { 
    data: staff, 
    isLoading: isStaffLoading, 
    error: staffError 
  } = useCollectionData(
    COLLECTIONS.HEALTH.STAFF,
    [orderBy('lastName')]
  );

  // Fetch billing
  const {
    data: billing,
    isLoading: isBillingLoading,
    error: billingError
  } = useCollectionData(
    COLLECTIONS.HEALTH.BILLING,
    [orderBy('date', 'desc')]
  );

  // Fetch inventory
  const {
    data: inventory,
    isLoading: isInventoryLoading,
    error: inventoryError
  } = useCollectionData(
    COLLECTIONS.HEALTH.INVENTORY,
    []
  );

  // Fetch settings
  const {
    data: settings,
    isLoading: isSettingsLoading,
    error: settingsError
  } = useCollectionData(
    COLLECTIONS.HEALTH.SETTINGS,
    []
  );

  // Fetch permissions
  const {
    data: permissions,
    isLoading: isPermissionsLoading,
    error: permissionsError
  } = useCollectionData(
    COLLECTIONS.HEALTH.PERMISSIONS,
    []
  );

  // Check if any data is still loading
  const isLoading = 
    isPatientsLoading || 
    isDoctorsLoading || 
    isAppointmentsLoading || 
    isConsultationsLoading || 
    isPrescriptionsLoading ||
    isMedicalRecordsLoading ||
    isLaboratoryLoading ||
    isInsuranceLoading || 
    isStaffLoading ||
    isBillingLoading ||
    isInventoryLoading ||
    isSettingsLoading ||
    isPermissionsLoading;

  // Combine all possible errors
  const error = 
    patientsError || 
    doctorsError || 
    appointmentsError || 
    consultationsError || 
    prescriptionsError ||
    medicalRecordsError ||
    laboratoryError ||
    insuranceError ||
    staffError ||
    billingError ||
    inventoryError ||
    settingsError ||
    permissionsError;

  return {
    patients,
    doctors,
    appointments,
    consultations,
    prescriptions,
    medicalRecords,
    laboratoryTests,
    insurance,
    staff,
    billing,
    inventory,
    settings,
    permissions,
    isLoading,
    error
  };
};
