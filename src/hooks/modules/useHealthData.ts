
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
    patients,
    doctors,
    nurses,
    staff,

    // Appointments and consultations
    appointments,
    consultations,

    // Medical data
    prescriptions,
    medicalRecords,
    laboratoryTests,

    // Hospital resources
    pharmacy,
    rooms,
    hospitalizations,

    // Financial
    insurance,
    billing,

    // Status
    isLoading,
    error
  };
};
