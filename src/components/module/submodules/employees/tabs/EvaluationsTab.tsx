
import React from 'react';
import { Employee, Evaluation } from '@/types/employee';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Star, PlusCircle, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EvaluationsTabProps {
  employee: Employee;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ employee }) => {
  const evaluations = employee.evaluations || [];
  
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'PP', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };
  
  const getEvaluationTypeLabel = (type: string): string => {
    switch(type) {
      case 'performance':
        return 'Évaluation de performance';
      case 'skills':
        return 'Évaluation des compétences';
      case 'objectives':
        return 'Évaluation des objectifs';
      default:
        return type;
    }
  };
  
  const renderStars = (score: string) => {
    // Convert score to a number between 1 and 5
    const numericScore = typeof score === 'string' 
      ? parseInt(score.replace(/[^\d]/g, ''), 10) / 2
      : parseFloat(score);
      
    const normalizedScore = Math.min(5, Math.max(1, numericScore || 3));
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star}
            className={`h-4 w-4 ${star <= normalizedScore ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Évaluations</h3>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Nouvelle évaluation
        </Button>
      </div>
      
      {evaluations.length > 0 ? (
        <div className="space-y-4">
          {evaluations.map((evaluation) => (
            <div key={evaluation.id} className="border rounded-md p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <h4 className="font-medium text-gray-900">{getEvaluationTypeLabel(evaluation.type)}</h4>
                <span className="text-sm text-gray-500">{formatDate(evaluation.date)}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Évaluateur: {evaluation.evaluator}</p>
                  {evaluation.comments && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{evaluation.comments}</p>
                  )}
                </div>
                <div className="ml-4">
                  {renderStars(evaluation.score)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <ClipboardList className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <h3 className="text-gray-500 font-medium">Aucune évaluation</h3>
          <p className="text-gray-400 text-sm mt-1">Les évaluations de l'employé apparaîtront ici.</p>
        </div>
      )}
    </div>
  );
};

export default EvaluationsTab;
