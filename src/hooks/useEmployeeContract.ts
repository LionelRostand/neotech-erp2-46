
import { useHrModuleData } from './useHrModuleData';
import { useMemo } from 'react';

export const useEmployeeContract = (employeeId: string) => {
  const { contracts, employees } = useHrModuleData();
  
  const result = useMemo(() => {
    if (!contracts || !employeeId) return { contract: null, salary: 0 };
    
    // Trouver l'employé pour obtenir son salaire (si disponible)
    const employee = employees?.find(emp => emp.id === employeeId);
    const employeeSalary = employee?.salary || 0;
    
    // Récupérer le contrat actif le plus récent de l'employé
    const activeContracts = contracts
      .filter(contract => 
        contract.employeeId === employeeId && 
        contract.status === 'Actif'
      )
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    
    const contract = activeContracts[0] || null;
    
    // Utiliser le salaire du contrat s'il est disponible, sinon celui de l'employé
    const salary = contract?.salaryAmount || contract?.salary || employeeSalary;
    
    console.log(`Contrat pour employé ${employeeId}: `, contract);
    console.log(`Salaire trouvé: ${salary} (contrat: ${contract?.salaryAmount || contract?.salary}, employé: ${employeeSalary})`);
    
    return { contract, salary };
  }, [contracts, employeeId, employees]);

  return result;
};
