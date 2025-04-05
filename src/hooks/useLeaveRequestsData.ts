
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

/**
 * Hook pour accéder aux données des demandes de congés
 */
export const useLeaveRequestsData = (refreshTrigger?: number) => {
  const { leaveRequests, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les demandes de congés avec les noms des employés
  const formattedLeaveRequests = useMemo(() => {
    if (!leaveRequests || leaveRequests.length === 0) return [];
    if (!employees || employees.length === 0) return leaveRequests;
    
    return leaveRequests.map(request => {
      const employee = employees.find(emp => emp.id === request.employeeId);
      const approver = request.approverId
        ? employees.find(emp => emp.id === request.approverId)
        : null;
      
      return {
        ...request,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        approverName: approver ? `${approver.firstName} ${approver.lastName}` : '',
        // Calculer la durée en jours
        durationDays: calculateDuration(request.startDate, request.endDate),
      };
    });
  }, [leaveRequests, employees, refreshTrigger]);
  
  // Fonction pour calculer la durée entre deux dates en jours
  const calculateDuration = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 car inclusif
    } catch (error) {
      console.error('Erreur lors du calcul de la durée:', error);
      return 1;
    }
  };
  
  return {
    leaveRequests: formattedLeaveRequests,
    isLoading,
    error
  };
};
