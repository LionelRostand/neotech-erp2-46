
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

/**
 * Hook pour accéder aux données des contrats
 */
export const useContractsData = () => {
  const { contracts, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les contrats avec les noms des employés
  const formattedContracts = useMemo(() => {
    if (!contracts || contracts.length === 0) return [];
    if (!employees || employees.length === 0) return contracts;
    
    return contracts.map(contract => {
      const employee = employees.find(emp => emp.id === contract.employeeId);
      
      return {
        ...contract,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        // Calculer le statut du contrat (actif, expiré, à venir)
        status: getContractStatus(contract.startDate, contract.endDate)
      };
    });
  }, [contracts, employees]);
  
  // Fonction pour déterminer le statut d'un contrat en fonction des dates
  const getContractStatus = (startDate: string, endDate?: string) => {
    const now = new Date();
    const start = new Date(startDate);
    
    if (start > now) return 'À venir';
    
    if (!endDate) return 'Actif'; // CDI ou contrat sans date de fin
    
    const end = new Date(endDate);
    if (end < now) return 'Expiré';
    return 'Actif';
  };
  
  return {
    contracts: formattedContracts,
    isLoading,
    error
  };
};
