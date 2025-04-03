
import { useCollectionData } from './useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import { Employee } from '@/types/employee';

/**
 * Hook centralisé pour récupérer toutes les données liées au module Employés/RH
 */
export const useHrModuleData = () => {
  // Récupération des employés
  const { 
    data: employees, 
    isLoading: isEmployeesLoading, 
    error: employeesError 
  } = useCollectionData<Employee>(
    COLLECTIONS.HR.EMPLOYEES,
    [orderBy('lastName')]
  );

  // Récupération des fiches de paie
  const { 
    data: payslips, 
    isLoading: isPayslipsLoading, 
    error: payslipsError 
  } = useCollectionData(
    COLLECTIONS.HR.PAYSLIPS,
    [orderBy('date', 'desc')]
  );

  // Récupération des demandes de congés
  const { 
    data: leaveRequests, 
    isLoading: isLeaveRequestsLoading, 
    error: leaveRequestsError 
  } = useCollectionData(
    COLLECTIONS.HR.LEAVE_REQUESTS,
    [orderBy('startDate')]
  );

  // Récupération des contrats
  const { 
    data: contracts, 
    isLoading: isContractsLoading, 
    error: contractsError 
  } = useCollectionData(
    COLLECTIONS.HR.CONTRACTS,
    [orderBy('startDate', 'desc')]
  );

  // Récupération des départements
  const { 
    data: departments, 
    isLoading: isDepartmentsLoading, 
    error: departmentsError 
  } = useCollectionData(
    COLLECTIONS.HR.DEPARTMENTS,
    [orderBy('name')]
  );

  // Récupération des évaluations
  const { 
    data: evaluations, 
    isLoading: isEvaluationsLoading, 
    error: evaluationsError 
  } = useCollectionData(
    COLLECTIONS.HR.EVALUATIONS,
    [orderBy('date', 'desc')]
  );

  // Récupération des formations
  const { 
    data: trainings, 
    isLoading: isTrainingsLoading, 
    error: trainingsError 
  } = useCollectionData(
    COLLECTIONS.HR.TRAININGS,
    [orderBy('startDate')]
  );

  // Vérifier si des données sont en cours de chargement
  const isLoading = 
    isEmployeesLoading || 
    isPayslipsLoading || 
    isLeaveRequestsLoading || 
    isContractsLoading || 
    isDepartmentsLoading ||
    isEvaluationsLoading ||
    isTrainingsLoading;

  // Combiner toutes les erreurs potentielles
  const error = 
    employeesError || 
    payslipsError || 
    leaveRequestsError || 
    contractsError || 
    departmentsError ||
    evaluationsError ||
    trainingsError;

  return {
    employees,
    payslips,
    leaveRequests,
    contracts,
    departments,
    evaluations,
    trainings,
    isLoading,
    error
  };
};
