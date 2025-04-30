
import React from 'react';
import { Employee, Evaluation } from '@/types/employee';
import { Star, AlertCircle } from 'lucide-react';

interface EvaluationsTabProps {
  employee: Employee;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ employee }) => {
  // Make sure evaluations is always an array
  const evaluations = Array.isArray(employee.evaluations) ? employee.evaluations : [];

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return dateString;
    }
  };

  // Helper to ensure values are strings and not objects
  const ensureString = (value: any) => {
    if (value === undefined || value === null) return '';
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  };

  // Helper to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const safeRating = typeof rating === 'number' ? rating : 0;
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i}
          className={`h-4 w-4 ${i < safeRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Évaluations</h3>
      
      {evaluations.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune évaluation</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucune évaluation n'a été enregistrée pour cet employé.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {evaluations.map((evaluation, index) => {
            const title = ensureString(evaluation.title);
            const evaluator = ensureString(evaluation.evaluator);
            const date = ensureString(evaluation.date);
            const comments = ensureString(evaluation.comments);
            const rating = typeof evaluation.rating === 'number' ? evaluation.rating : 0;
            
            return (
              <div key={evaluation.id || index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">{title}</h4>
                  <div className="flex">
                    {renderStars(rating)}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  Evaluateur: {evaluator} | Date: {formatDate(date)}
                </div>
                
                <div className="text-sm border-t pt-3">
                  {comments}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EvaluationsTab;
