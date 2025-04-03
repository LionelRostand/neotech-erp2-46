
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

/**
 * Hook pour accéder aux données des absences
 */
export const useAbsenceData = () => {
  const { absenceRequests, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les absences avec les noms des employés
  const formattedAbsenceRequests = useMemo(() => {
    if (!absenceRequests || absenceRequests.length === 0) return [];
    if (!employees || employees.length === 0) return absenceRequests;
    
    return absenceRequests.map(absence => {
      const employee = employees.find(emp => emp.id === absence.employeeId);
      
      return {
        ...absence,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        // Calculer la durée en jours
        durationDays: calculateDuration(absence.startDate, absence.endDate),
      };
    });
  }, [absenceRequests, employees]);
  
  // Fonction pour calculer la durée entre deux dates en jours
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 car inclusif
  };
  
  return {
    absenceRequests: formattedAbsenceRequests,
    isLoading,
    error
  };
};
