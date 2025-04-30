
import React from 'react';
import { Employee } from '@/types/employee';
import { FileSignature, Star, Calendar, User } from 'lucide-react';

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
  
  // Helper pour obtenir la couleur en fonction du score
  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 4) return "text-green-600 bg-green-100";
    if (numScore >= 3) return "text-blue-600 bg-blue-100";
    if (numScore >= 2) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };
  
  return (
    <div className="space-y-4">
      {evaluations.map((evaluation, index) => (
        <div 
          key={evaluation.id || index} 
          className="p-4 border rounded-lg"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold">{evaluation.type === 'performance' ? 'Évaluation des performances' :
                                          evaluation.type === 'skills' ? 'Évaluation des compétences' :
                                          'Évaluation des objectifs'}</h4>
            </div>
            <div className={`px-3 py-1 rounded-full ${getScoreColor(evaluation.score)}`}>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>{evaluation.score}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(evaluation.date).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>Évaluateur: {evaluation.evaluator}</span>
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
