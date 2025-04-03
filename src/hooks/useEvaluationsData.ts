
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

/**
 * Hook pour accéder aux données des évaluations
 */
export const useEvaluationsData = () => {
  const { evaluations, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les évaluations avec les noms des employés
  const formattedEvaluations = useMemo(() => {
    if (!evaluations || evaluations.length === 0) return [];
    if (!employees || employees.length === 0) return evaluations;
    
    return evaluations.map(evaluation => {
      const employee = employees.find(emp => emp.id === evaluation.employeeId);
      const evaluator = employees.find(emp => emp.id === evaluation.evaluatorId);
      
      return {
        ...evaluation,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        evaluatorName: evaluator ? `${evaluator.firstName} ${evaluator.lastName}` : 'Évaluateur inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
      };
    });
  }, [evaluations, employees]);
  
  return {
    evaluations: formattedEvaluations,
    isLoading,
    error
  };
};
