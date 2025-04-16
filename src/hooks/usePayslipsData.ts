
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { PaySlip } from '@/types/payslip';

/**
 * Hook to access payslip data
 */
export const usePayslipsData = () => {
  const { payslips, employees, isLoading, error } = useHrModuleData();
  
  // Process payslips with employee information
  const processedPayslips = useMemo(() => {
    if (!payslips || !Array.isArray(payslips)) return [];
    
    return payslips.map(payslip => {
      // Find employee for this payslip
      const employee = employees?.find(emp => emp.id === payslip.employeeId);
      
      return {
        ...payslip,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        // Add fileData as a correctly typed property to fix the url error
        fileData: payslip.fileData || null,
      };
    });
  }, [payslips, employees]);
  
  return {
    payslips: processedPayslips,
    isLoading,
    error
  };
};
