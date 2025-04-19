
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
    [orderBy('date', 'desc')]
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

  // Fetch nurses
  const {
    data: nurses,
    isLoading: isNursesLoading,
    error: nursesError
  } = useCollectionData<Staff>(
    COLLECTIONS.HEALTH.NURSES,
    [orderBy('lastName')]
  );

  // Fetch insurance
  const { 
    data: insurance, 
    isLoading: isInsuranceLoading, 
    error: insuranceError 
  } = useCollectionData<Insurance>(
    COLLECTIONS.HEALTH.INSURANCE
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
    isNursesLoading ||
    isPharmacyLoading ||
    isRoomsLoading ||
    isHospitalizationsLoading ||
    isBillingLoading;

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
    nursesError ||
    pharmacyError ||
    roomsError ||
    hospitalizationsError ||
    billingError;

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
    nurses,
    pharmacy,
    rooms,
    hospitalizations,
    billing,
    isLoading,
    error
  };
};
