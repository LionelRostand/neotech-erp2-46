
import React from 'react';
import { Employee, Evaluation } from '@/types/employee';
import { Star, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StatusBadge } from '@/components/ui/status-badge';

interface EvaluationsTabProps {
  employee: Employee;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ employee }) => {
  // Make sure evaluations is always an array
  const evaluations = Array.isArray(employee.evaluations) ? employee.evaluations : [];

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const renderStars = (rating: number, maxRating: number = 5) => {
    return (
      <div className="flex">
        {[...Array(maxRating)].map((_, i) => (
          <Star 
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Évaluations</h3>
      
      {evaluations.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune évaluation</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucune évaluation n'a été enregistrée pour cet employé.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {evaluations.map((evaluation, index) => (
            <div key={index} className="p-6 border rounded-lg bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">{evaluation.title || 'Évaluation périodique'}</h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(evaluation.date)} • Par {evaluation.evaluatorName || evaluation.evaluator || 'Non spécifié'}
                  </p>
                </div>
                {evaluation.status && (
                  <StatusBadge status={
                    evaluation.status === 'Complétée' ? 'success' : 
                    evaluation.status === 'Planifiée' ? 'warning' : 
                    evaluation.status === 'Annulée' ? 'danger' : 'default'
                  }>
                    {evaluation.status}
                  </StatusBadge>
                )}
              </div>
              
              {(evaluation.rating !== undefined || evaluation.score !== undefined) && (
                <div className="mt-4">
                  {evaluation.rating !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Note:</span>
                      {renderStars(evaluation.rating)}
                    </div>
                  )}
                  {evaluation.score !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Score:</span>
                      <span>{evaluation.score}/{evaluation.maxScore || 100}</span>
                    </div>
                  )}
                </div>
              )}
              
              {evaluation.comments && (
                <div className="mt-4 border-t pt-4">
                  <h5 className="font-medium mb-2">Commentaires</h5>
                  <p className="text-sm text-gray-600">{evaluation.comments}</p>
                </div>
              )}
              
              {(evaluation.strengths && evaluation.strengths.length > 0) && (
                <div className="mt-4">
                  <h5 className="font-medium mb-1">Points forts</h5>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {evaluation.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(evaluation.improvements && evaluation.improvements.length > 0) && (
                <div className="mt-4">
                  <h5 className="font-medium mb-1">Axes d'amélioration</h5>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {evaluation.improvements.map((improvement, i) => (
                      <li key={i}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvaluationsTab;
