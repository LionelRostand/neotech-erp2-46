
import { useState, useEffect } from 'react';

export interface Absence {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeePhoto?: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'En attente' | 'Validé' | 'Refusé';
  reason?: string;
  department?: string;
  approvedBy?: string;
  approverName?: string;
  approvalDate?: string;
}

// Mock data for absences
const mockAbsences: Absence[] = [
  {
    id: '1',
    employeeId: 'emp-001',
    employeeName: 'Jean Dupont',
    employeePhoto: '',
    type: 'Maladie',
    startDate: '10/04/2025',
    endDate: '15/04/2025',
    days: 6,
    status: 'En attente',
    reason: 'Grippe saisonnière',
    department: 'Marketing'
  },
  {
    id: '2',
    employeeId: 'emp-002',
    employeeName: 'Marie Martin',
    employeePhoto: '',
    type: 'Congé sans solde',
    startDate: '20/05/2025',
    endDate: '25/05/2025',
    days: 6,
    status: 'Validé',
    reason: 'Voyage personnel',
    department: 'Finance',
    approvedBy: 'manager-001',
    approverName: 'Pierre Legrand',
    approvalDate: '15/04/2025'
  },
  {
    id: '3',
    employeeId: 'emp-003',
    employeeName: 'Sophie Petit',
    employeePhoto: '',
    type: 'Familial',
    startDate: '05/06/2025',
    endDate: '07/06/2025',
    days: 3,
    status: 'Refusé',
    reason: 'Mariage',
    department: 'RH',
    approvedBy: 'manager-002',
    approverName: 'Jacques Moreau',
    approvalDate: '28/05/2025'
  }
];

/**
 * Hook to access absence data
 */
export const useAbsencesData = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAbsences(mockAbsences);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate absence statistics
  const stats = {
    pending: absences.filter(absence => absence.status === 'En attente').length,
    validated: absences.filter(absence => absence.status === 'Validé').length,
    rejected: absences.filter(absence => absence.status === 'Refusé').length,
    total: absences.length
  };
  
  return {
    absences,
    stats,
    isLoading,
    error
  };
};
