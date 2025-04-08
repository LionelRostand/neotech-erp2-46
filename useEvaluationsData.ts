
import { useMemo, useState, useCallback } from 'react';
import { useHrModuleData } from './useHrModuleData';

export interface Evaluation {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeePhoto?: string;
  evaluatorId?: string;
  evaluatorName?: string;
  date: string;
  score?: number;
  maxScore?: number;
  status: 'Planifiée' | 'Complétée' | 'Annulée';
  comments?: string;
  department?: string;
  goals?: string[];
  strengths?: string[];
  improvements?: string[];
}

/**
 * Hook to access evaluation data directly from Firebase
 */
export const useEvaluationsData = () => {
  const hrModuleData = useHrModuleData();
  const { evaluations, employees } = hrModuleData;
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Function to force a refresh of the data
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    // Note: refreshHrData doesn't exist in useHrModuleData
    // This will be handled separately
  }, []);
  
  // Enrich evaluations with employee names
  const formattedEvaluations = useMemo(() => {
    if (!evaluations || evaluations.length === 0) return [];
    
    return evaluations.map(evaluation => {
      // Find the evaluated employee
      const employee = employees?.find(emp => emp.id === evaluation.employeeId);
      
      // Find the evaluator
      const evaluator = evaluation.evaluatorId && employees
        ? employees.find(emp => emp.id === evaluation.evaluatorId)
        : undefined;
      
      return {
        id: evaluation.id,
        employeeId: evaluation.employeeId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        evaluatorId: evaluation.evaluatorId,
        evaluatorName: evaluator 
          ? `${evaluator.firstName} ${evaluator.lastName}` 
          : evaluation.evaluatorName || 'Non assigné',
        date: formatDate(evaluation.date),
        score: evaluation.score,
        maxScore: evaluation.maxScore || 100,
        status: evaluation.status || 'Planifiée',
        comments: evaluation.comments,
        department: employee?.department || 'Non spécifié',
        goals: evaluation.goals,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
      } as Evaluation;
    });
  }, [evaluations, employees, refreshTrigger]);
  
  // Function to format dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur de formatage de date:', dateStr, error);
      return dateStr;
    }
  };

  // Get statistics about evaluations
  const evaluationStats = useMemo(() => {
    const planned = formattedEvaluations.filter(evaluation => evaluation.status === 'Planifiée').length;
    const completed = formattedEvaluations.filter(evaluation => evaluation.status === 'Complétée').length;
    const cancelled = formattedEvaluations.filter(evaluation => evaluation.status === 'Annulée').length;
    const total = formattedEvaluations.length;
    
    return { planned, completed, cancelled, total };
  }, [formattedEvaluations]);
  
  return {
    evaluations: formattedEvaluations,
    stats: evaluationStats,
    isLoading: hrModuleData.isLoading,
    error: hrModuleData.error,
    refreshData
  };
};
