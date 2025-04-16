
import { useHrModuleData } from './useHrModuleData';
import { useMemo } from 'react';

export const useEmployeeContract = (employeeId: string) => {
  const { contracts, employees } = useHrModuleData();
  
  const result = useMemo(() => {
    if (!contracts || !employeeId) return { contract: null, salary: 0 };
    
    // Find the employee
    const employee = employees?.find(emp => emp.id === employeeId);
    
    // Get salary from employee record (may be undefined)
    // Since 'salary' property might not exist on the Employee type directly
    // We need to access it safely
    const employeeSalary = employee && 'salary' in employee ? (employee.salary as number) : 0;
    
    // Récupérer le contrat actif le plus récent de l'employé
    const activeContracts = contracts
      .filter(contract => 
        contract.employeeId === employeeId && 
        contract.status === 'Actif'
      )
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    
    const contract = activeContracts[0] || null;
    
    // Use contract salary if available, otherwise fall back to employee salary
    const salary = contract?.salary || employeeSalary;
    
    return { contract, salary };
  }, [contracts, employeeId, employees]);

  return result;
};
