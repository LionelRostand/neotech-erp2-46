
import { useCollectionData } from '../useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import type { 
  Patient, 
  Doctor, 
  Appointment, 
  Consultation, 
  Prescription,
  MedicalRecord,
  Staff,
  Laboratory,
  Insurance,
  Invoice,
  Inventory,
  HealthSettings,
  HealthPermission
} from '@/components/module/submodules/health/types/health-types';

/**
 * Hook to fetch data for the Health module
 */
export const useHealthData = () => {
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

  // Fetch appointments
  const { 
    data: appointments, 
    isLoading: isAppointmentsLoading, 
    error: appointmentsError 
  } = useCollectionData<Appointment>(
    COLLECTIONS.HEALTH.APPOINTMENTS,
    [orderBy('date')]
  );

  // Fetch consultations
  const { 
    data: consultations, 
    isLoading: isConsultationsLoading, 
    error: consultationsError 
  } = useCollectionData<Consultation>(
    COLLECTIONS.HEALTH.CONSULTATIONS,
    [orderBy('date', 'desc')]
  );

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
    []
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

  // Fetch insurance
  const { 
    data: insurance, 
    isLoading: isInsuranceLoading, 
    error: insuranceError 
  } = useCollectionData<Insurance>(
    COLLECTIONS.HEALTH.INSURANCE,
    []
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

  // Fetch billing
  const {
    data: billing,
    isLoading: isBillingLoading,
    error: billingError
  } = useCollectionData<Invoice>(
    COLLECTIONS.HEALTH.BILLING,
    [orderBy('date', 'desc')]
  );

  // Fetch inventory
  const {
    data: inventory,
    isLoading: isInventoryLoading,
    error: inventoryError
  } = useCollectionData<Inventory>(
    COLLECTIONS.HEALTH.INVENTORY,
    []
  );

  // Fetch settings
  const {
    data: settings,
    isLoading: isSettingsLoading,
    error: settingsError
  } = useCollectionData<HealthSettings>(
    COLLECTIONS.HEALTH.SETTINGS,
    []
  );

  // Fetch permissions
  const {
    data: permissions,
    isLoading: isPermissionsLoading,
    error: permissionsError
  } = useCollectionData<HealthPermission>(
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
