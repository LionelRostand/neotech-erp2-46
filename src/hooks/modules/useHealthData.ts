
import { usePatientsAndDoctors } from './health/usePatientsAndDoctors';
import { useAppointmentsAndConsultations } from './health/useAppointmentsAndConsultations';
import { useMedicalData } from './health/useMedicalData';
import { useHospitalData } from './health/useHospitalData';
import { useStaffData } from './health/useStaffData';
import { useFinancialData } from './health/useFinancialData';

/**
 * Hook to fetch data for the Health module
 */
export const useHealthData = () => {
  const { 
    patients, 
    doctors, 
    isLoading: isPatientsAndDoctorsLoading,
    error: patientsAndDoctorsError 
  } = usePatientsAndDoctors();

  const {
    appointments,
    consultations,
    isLoading: isAppointmentsLoading,
    error: appointmentsError
  } = useAppointmentsAndConsultations();

  const {
    prescriptions,
    medicalRecords,
    laboratoryTests,
    isLoading: isMedicalDataLoading,
    error: medicalDataError
  } = useMedicalData();

  const {
    pharmacy,
    rooms,
    hospitalizations,
    isLoading: isHospitalDataLoading,
    error: hospitalDataError
  } = useHospitalData();

  const {
    nurses,
    staff,
    isLoading: isStaffDataLoading,
    error: staffDataError
  } = useStaffData();

  const {
    insurance,
    billing,
    isLoading: isFinancialDataLoading,
    error: financialDataError
  } = useFinancialData();

  const isLoading = 
    isPatientsAndDoctorsLoading ||
    isAppointmentsLoading ||
    isMedicalDataLoading ||
    isHospitalDataLoading ||
    isStaffDataLoading ||
    isFinancialDataLoading;

  const error = 
    patientsAndDoctorsError ||
    appointmentsError ||
    medicalDataError ||
    hospitalDataError ||
    staffDataError ||
    financialDataError;

  return {
    // People
    patients: patients || [],
    doctors: doctors || [],
    nurses: nurses || [],
    staff: staff || [],

    // Appointments and consultations
    appointments: appointments || [],
    consultations: consultations || [],

    // Medical data
    prescriptions: prescriptions || [],
    medicalRecords: medicalRecords || [],
    laboratoryTests: laboratoryTests || [],

    // Hospital resources
    pharmacy: pharmacy || [],
    rooms: rooms || [],
    hospitalizations: hospitalizations || [],

    // Financial
    insurance: insurance || [],
    billing: billing || [],

    // Status
    isLoading,
    error
  };
};
