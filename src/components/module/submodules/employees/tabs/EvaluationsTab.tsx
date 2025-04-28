
import React from 'react';
import { Employee, Evaluation } from '@/types/employee';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EvaluationsTabProps {
  employee: Employee;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ employee }) => {
  const evaluations = employee.evaluations || [];

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const getEvaluationTypeName = (type: string) => {
    switch (type) {
      case 'performance':
        return 'Performance';
      case 'skills':
        return 'Compétences';
      case 'objectives':
        return 'Objectifs';
      default:
        return type;
    }
  };

  const renderStarRating = (score: string) => {
    const scoreNum = parseInt(score);
    const maxStars = 5;
    
    return (
      <div className="flex">
        {Array.from({ length: maxStars }).map((_, i) => (
          <svg
            key={i}
            className={`h-5 w-5 ${i < scoreNum ? 'text-yellow-400' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Sort evaluations by date, most recent first
  const sortedEvaluations = [...evaluations].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Évaluations</h3>
      
      {sortedEvaluations.length === 0 ? (
        <p className="text-gray-500">Aucune évaluation enregistrée</p>
      ) : (
        <div className="space-y-4">
          {sortedEvaluations.map(evaluation => (
            <div key={evaluation.id} className="border rounded-md p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                <h4 className="font-medium">{getEvaluationTypeName(evaluation.type)} - {formatDate(evaluation.date)}</h4>
                {renderStarRating(evaluation.score)}
              </div>
              
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Évaluateur:</span> {evaluation.evaluator}
                </p>
                {evaluation.comments && (
                  <div>
                    <p className="text-gray-500">Commentaires:</p>
                    <p className="mt-1 whitespace-pre-wrap">{evaluation.comments}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvaluationsTab;
