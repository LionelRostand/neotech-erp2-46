
import React from 'react';
import { Employee } from '@/types/employee';

interface EvaluationsTabProps {
  employee: Employee;
}

export const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ employee }) => {
  const evaluations = employee.evaluations || [];
  
  if (evaluations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <p>Aucune évaluation disponible pour cet employé</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {evaluations.map((evaluation, index) => (
        <div 
          key={evaluation.id || index} 
          className="p-4 border rounded-lg"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{evaluation.type === 'performance' ? 'Évaluation des performances' :
                                          evaluation.type === 'skills' ? 'Évaluation des compétences' :
                                          'Évaluation des objectifs'}</h4>
              <p className="text-sm text-gray-600">
                {new Date(evaluation.date).toLocaleDateString('fr-FR')} par {evaluation.evaluator}
              </p>
            </div>
            <div className="px-2 py-1 bg-gray-100 rounded">
              Note: {evaluation.score}
            </div>
          </div>
          
          {evaluation.comments && (
            <div className="mt-3 border-t pt-3">
              <p className="text-gray-700">{evaluation.comments}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
