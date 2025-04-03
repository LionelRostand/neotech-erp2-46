
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

/**
 * Hook pour accéder aux données de présence
 */
export const useAttendanceData = () => {
  const { attendance, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les données de présence avec les noms des employés
  const formattedAttendance = useMemo(() => {
    if (!attendance || attendance.length === 0) return [];
    if (!employees || employees.length === 0) return attendance;
    
    return attendance.map(record => {
      const employee = employees.find(emp => emp.id === record.employeeId);
      
      return {
        ...record,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        // Formater la date pour l'affichage
        formattedDate: formatDate(record.date),
      };
    });
  }, [attendance, employees]);
  
  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  return {
    attendance: formattedAttendance,
    isLoading,
    error
  };
};
