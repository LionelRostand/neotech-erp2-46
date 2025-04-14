
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
  title?: string;
  rating?: number;
  fromEmployeeRecord?: boolean;
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
  }, []);
  
  // Helper function to safely format dates
  const formatSafeDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    try {
      // Validate the date string first
      const timestamp = Date.parse(dateStr);
      if (isNaN(timestamp)) {
        console.warn('Invalid date value:', dateStr);
        return '';
      }
      
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date object created from:', dateStr);
        return '';
      }
      
      // Return the original date string for consistent formatting elsewhere
      return dateStr;
    } catch (error) {
      console.error('Erreur de formatage de date:', dateStr, error);
      return '';
    }
  };
  
  // Collect all evaluations from both main evaluations collection and employee's embedded evaluations
  const allEvaluations = useMemo(() => {
    console.log("useEvaluationsData: Processing evaluations");
    const mainEvaluations = evaluations || [];
    const employeeEvaluations = [];
    
    // Extract evaluations from employee records
    if (employees && employees.length > 0) {
      employees.forEach(employee => {
        if (employee.evaluations && Array.isArray(employee.evaluations)) {
          console.log(`Found ${employee.evaluations.length} evaluations for employee: ${employee.firstName} ${employee.lastName}`);
          employee.evaluations.forEach(evaluation => {
            // Add employee info to the evaluation
            const validDate = evaluation.date ? formatSafeDate(evaluation.date) : new Date().toISOString();
            employeeEvaluations.push({
              ...evaluation,
              employeeId: employee.id,
              // Generate an ID if none exists
              id: evaluation.id || `emp-eval-${employee.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              // Ensure the evaluation has a date
              date: validDate,
              // Flag to indicate this came from an employee record
              fromEmployeeRecord: true
            });
          });
        }
      });
    }
    
    console.log(`Found ${mainEvaluations.length} main evaluations and ${employeeEvaluations.length} from employee records`);
    
    // Combine both sources
    return [...mainEvaluations, ...employeeEvaluations];
  }, [evaluations, employees, refreshTrigger]);
  
  // Enrich evaluations with employee names
  const formattedEvaluations = useMemo(() => {
    if (!allEvaluations || allEvaluations.length === 0) return [];
    
    return allEvaluations.map(evaluation => {
      // Find the evaluated employee
      const employee = employees?.find(emp => emp.id === evaluation.employeeId);
      
      // Find the evaluator
      const evaluator = evaluation.evaluatorId && employees
        ? employees.find(emp => emp.id === evaluation.evaluatorId)
        : undefined;
      
      // Ensure date is valid before formatting
      let validDate = evaluation.date;
      if (!validDate || (validDate && isNaN(Date.parse(validDate)))) {
        console.warn(`Invalid evaluation date detected: ${validDate}, using current date instead`);
        validDate = new Date().toISOString();
      }
      
      // Include both types of evaluation data (legacy and new format)
      return {
        id: evaluation.id,
        employeeId: evaluation.employeeId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        evaluatorId: evaluation.evaluatorId,
        evaluatorName: evaluator 
          ? `${evaluator.firstName} ${evaluator.lastName}` 
          : evaluation.evaluatorName || 'Non assigné',
        date: validDate,
        score: evaluation.score,
        maxScore: evaluation.maxScore || 100,
        status: evaluation.status || 'Planifiée',
        comments: evaluation.comments,
        department: employee?.department || 'Non spécifié',
        goals: evaluation.goals,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        // Support for employee evaluation type from the employee profile
        title: evaluation.title,
        rating: evaluation.rating,
        fromEmployeeRecord: evaluation.fromEmployeeRecord || false
      } as Evaluation;
    });
  }, [allEvaluations, employees, refreshTrigger]);
  
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
