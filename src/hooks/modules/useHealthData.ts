
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

  // Check if any data is still loading
  const isLoading = 
    isPatientsLoading || 
    isDoctorsLoading || 
    isAppointmentsLoading || 
    isConsultationsLoading || 
    isInsuranceLoading || 
    isStaffLoading;

  // Combine all possible errors
  const error = 
    patientsError || 
    doctorsError || 
    appointmentsError || 
    consultationsError || 
    insuranceError ||
    staffError;

  return {
    patients,
    doctors,
    appointments,
    consultations,
    insurance,
    staff,
    isLoading,
    error
  };
};
