
import { useHrModuleData } from './useHrModuleData';
import { useMemo } from 'react';

export const useEmployeeContract = (employeeId: string) => {
  const { contracts } = useHrModuleData();
  
  const employeeContract = useMemo(() => {
    if (!contracts || !employeeId) return null;
    
    // Récupérer le contrat actif le plus récent de l'employé
    const activeContracts = contracts
      .filter(contract => 
        contract.employeeId === employeeId && 
        contract.status === 'Actif'
      )
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    
    return activeContracts[0] || null;
  }, [contracts, employeeId]);

  return {
    contract: employeeContract,
    salary: employeeContract?.salary || 0
  };
};
