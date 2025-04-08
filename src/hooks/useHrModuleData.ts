
import { useEffect, useState } from 'react';
import { useHrData } from './modules/useHrData';
import { toast } from 'sonner';

/**
 * Hook centralisant l'accès aux données du module HR (Employés)
 */
export const useHrModuleData = () => {
  const {
    employees,
    departments,
    contracts,
    leaveRequests,
    payslips,
    attendance,
    absenceRequests,
    hrDocuments,
    timeSheets,
    evaluations,
    trainings,
    hrReports,
    hrAlerts,
    isLoading,
    error
  } = useHrData();

  useEffect(() => {
    if (error) {
      console.error('Erreur lors du chargement des données RH:', error);
      toast.error('Erreur lors du chargement des données. Veuillez réessayer.');
    }
  }, [error]);

  return {
    employees: employees || [],
    departments: departments || [],
    contracts: contracts || [],
    leaveRequests: leaveRequests || [],
    payslips: payslips || [],
    attendance: attendance || [],
    absenceRequests: absenceRequests || [],
    hrDocuments: hrDocuments || [],
    timeSheets: timeSheets || [],
    evaluations: evaluations || [],
    trainings: trainings || [],
    hrReports: hrReports || [],
    hrAlerts: hrAlerts || [],
    isLoading,
    error
  };
};
