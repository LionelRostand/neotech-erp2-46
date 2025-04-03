
import { useMemo } from 'react';
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
 * Hook pour accéder aux données des évaluations directement depuis Firebase
 */
export const useEvaluationsData = () => {
  const { evaluations, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les évaluations avec les noms des employés
  const formattedEvaluations = useMemo(() => {
    if (!evaluations || evaluations.length === 0) return [];
    
    return evaluations.map(evaluation => {
      // Trouver l'employé évalué
      const employee = employees?.find(emp => emp.id === evaluation.employeeId);
      
      // Trouver l'évaluateur
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
  }, [evaluations, employees]);
  
  // Fonction pour formater les dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur de formatage de date:', dateStr, error);
      return dateStr;
    }
  };

  // Obtenir des statistiques sur les évaluations
  const evaluationStats = useMemo(() => {
    const planned = formattedEvaluations.filter(eval => eval.status === 'Planifiée').length;
    const completed = formattedEvaluations.filter(eval => eval.status === 'Complétée').length;
    const cancelled = formattedEvaluations.filter(eval => eval.status === 'Annulée').length;
    const total = formattedEvaluations.length;
    
    return { planned, completed, cancelled, total };
  }, [formattedEvaluations]);
  
  return {
    evaluations: formattedEvaluations,
    stats: evaluationStats,
    isLoading,
    error
  };
};
