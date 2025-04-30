
import { useMemo } from 'react';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
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
  // Utiliser useFirebaseCollection pour récupérer les données de contrats et d'employés
  const { data: contractsData = [], isLoading: contractsLoading, error: contractsError } = useFirebaseCollection<any>(COLLECTIONS.HR.CONTRACTS);
  const { data: employeesData = [], isLoading: employeesLoading } = useFirebaseCollection<any>(COLLECTIONS.HR.EMPLOYEES);
  
  // Ensure we have valid arrays
  const contracts = Array.isArray(contractsData) ? contractsData : [];
  const employees = Array.isArray(employeesData) ? employeesData : [];
  
  // Log sizes for debugging
  console.log(`useContractsData: Found ${contracts.length} contracts and ${employees.length} employees`);
  
  // Enrichir les contrats avec les noms des employés
  const formattedContracts = useMemo(() => {
    if (!contracts || contracts.length === 0) {
      console.log('useContractsData: No contracts found');
      return [];
    }
    
    return contracts
      .filter(contract => contract !== null && contract !== undefined)
      .map(contract => {
        // Trouver l'employé associé à ce contrat
        const employee = employees?.find(emp => emp && emp.id === contract.employeeId);
        
        // Déterminer le statut du contrat
        const now = new Date();
        const startDate = contract.startDate ? new Date(contract.startDate) : now;
        let status: 'Actif' | 'À venir' | 'Expiré' = 'Actif';
        
        if (startDate > now) {
          status = 'À venir';
        } else if (contract.endDate) {
          const endDate = new Date(contract.endDate);
          if (endDate < now) {
            status = 'Expiré';
          }
        }
        
        return {
          id: contract.id || '',
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
        } as Contract;
      });
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
    isLoading: contractsLoading || employeesLoading,
    error: contractsError
  };
};
