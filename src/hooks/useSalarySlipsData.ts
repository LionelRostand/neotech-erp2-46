
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

/**
 * Hook pour accéder aux données des fiches de paie
 */
export const useSalarySlipsData = () => {
  const { payslips, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les fiches de paie avec les noms des employés
  const formattedPayslips = useMemo(() => {
    if (!payslips || payslips.length === 0) return [];
    if (!employees || employees.length === 0) return payslips;
    
    return payslips.map(payslip => {
      const employee = employees.find(emp => emp.id === payslip.employeeId);
      
      return {
        ...payslip,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        // Formater la date pour l'affichage
        period: formatPayslipPeriod(payslip.date),
      };
    });
  }, [payslips, employees]);
  
  // Fonction pour formater la période de la fiche de paie
  const formatPayslipPeriod = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('fr-FR', { month: 'long' });
    const year = date.getFullYear();
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  };
  
  return {
    payslips: formattedPayslips,
    isLoading,
    error
  };
};
