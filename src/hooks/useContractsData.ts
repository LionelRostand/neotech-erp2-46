
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { formatDate } from '@/lib/formatters';

export interface Contract {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeePhoto?: string;
  type: string;
  startDate: string;
  endDate?: string;
  status: 'Actif' | 'À venir' | 'Expiré';
  position: string;
  salary?: number;
  department?: string;
}

/**
 * Hook pour accéder aux données des contrats directement depuis Firebase
 */
export const useContractsData = () => {
  const { contracts, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les contrats avec les noms des employés
  const formattedContracts = useMemo(() => {
    if (!contracts || contracts.length === 0) {
      console.log("useContractsData: No contracts found");
      return [];
    }
    
    console.log("useContractsData: Processing contracts", contracts.length);
    
    const processedContracts = contracts
      .filter(contract => contract !== null && contract !== undefined)
      .map(contract => {
        try {
          // Trouver l'employé associé à ce contrat
          const employee = employees?.find(emp => emp && emp.id === contract.employeeId);
          
          // Déterminer le statut du contrat
          const now = new Date();
          let startDate;
          try {
            startDate = contract.startDate ? new Date(contract.startDate) : now;
          } catch (e) {
            console.error("Invalid start date", contract.startDate);
            startDate = now;
          }
          
          let status: 'Actif' | 'À venir' | 'Expiré' = 'Actif';
          
          if (startDate > now) {
            status = 'À venir';
          } else if (contract.endDate) {
            try {
              const endDate = new Date(contract.endDate);
              if (endDate < now) {
                status = 'Expiré';
              }
            } catch (e) {
              console.error("Invalid end date", contract.endDate);
            }
          }
          
          // Créer l'objet contrat enrichi
          const formattedContract = {
            id: contract.id || `contract-${Date.now()}`,
            employeeId: contract.employeeId || '',
            employeeName: employee ? `${employee.firstName || ''} ${employee.lastName || ''}`.trim() : 'Employé inconnu',
            employeePhoto: employee?.photoURL || employee?.photo || '',
            type: contract.type || 'CDI',
            startDate: formatDate(contract.startDate || new Date()),
            endDate: contract.endDate ? formatDate(contract.endDate) : undefined,
            status,
            position: contract.position || 'Non spécifié',
            salary: contract.salary,
            department: employee?.department || contract.department || 'Non spécifié',
          };
          
          return formattedContract;
        } catch (error) {
          console.error("Error processing contract", error, contract);
          // Return a minimal valid contract object in case of error
          return {
            id: contract.id || `error-${Date.now()}`,
            employeeId: contract.employeeId || '',
            type: 'Non spécifié',
            startDate: 'Date inconnue',
            status: 'Actif' as const,
            position: 'Non spécifié'
          };
        }
      });
      
    console.log("useContractsData: Processed contracts", processedContracts.length);
    return processedContracts;
  }, [contracts, employees]);

  // Obtenir des statistiques sur les contrats
  const contractStats = useMemo(() => {
    if (!formattedContracts || !Array.isArray(formattedContracts)) {
      return { active: 0, upcoming: 0, expired: 0, total: 0 };
    }
    
    const active = formattedContracts.filter(contract => contract.status === 'Actif').length;
    const upcoming = formattedContracts.filter(contract => contract.status === 'À venir').length;
    const expired = formattedContracts.filter(contract => contract.status === 'Expiré').length;
    const total = formattedContracts.length;
    
    return { active, upcoming, expired, total };
  }, [formattedContracts]);
  
  return {
    contracts: formattedContracts,
    stats: contractStats,
    isLoading,
    error
  };
};
