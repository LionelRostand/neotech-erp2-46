
import React from 'react';
import { Employee, Evaluation } from '@/types/employee';
import { Star, Calendar, User, BarChart } from 'lucide-react';

interface EvaluationsTabProps {
  employee: Employee;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ employee }) => {
  // Use evaluations from employee data or default to empty array
  const evaluations = employee.evaluations || [];
  
  if (evaluations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <p>Aucune évaluation disponible pour cet employé</p>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Get type display text
  const getTypeDisplay = (type: string) => {
    switch(type) {
      case 'performance': return 'Évaluation de performance';
      case 'skills': return 'Évaluation des compétences';
      case 'objectives': return 'Objectifs';
      default: return type;
    }
  };
  
  // Get score color
  const getScoreColor = (score: string) => {
    const numericScore = typeof score === 'number' ? score : parseFloat(score);
    if (Number.isNaN(numericScore)) return 'text-gray-700';
    
    if (numericScore >= 4) return 'text-green-600';
    if (numericScore >= 3) return 'text-blue-600';
    if (numericScore >= 2) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Render star rating
  const renderStarRating = (score: string) => {
    const numericScore = typeof score === 'number' ? score : parseFloat(score);
    if (Number.isNaN(numericScore)) return null;
    
    const maxStars = 5;
    const roundedScore = Math.round(numericScore * 2) / 2; // Round to nearest 0.5
    
    return (
      <div className="flex items-center">
        {[...Array(maxStars)].map((_, i) => {
          // Full star if i+1 <= rounded score
          // Half star if i < rounded score < i+1
          // Empty star if i+1 > rounded score
          const isFull = i + 1 <= roundedScore;
          const isHalf = !isFull && i + 0.5 <= roundedScore;
          
          return (
            <Star
              key={i}
              className={`h-4 w-4 ${
                isFull ? 'text-yellow-400 fill-yellow-400' : 
                isHalf ? 'text-yellow-400 fill-yellow-400 half-star' : 
                'text-gray-300 fill-gray-300'
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Évaluations</h3>
      
      <div className="space-y-6">
        {evaluations.map((evaluation, index) => (
          <div key={evaluation.id || index} className="border rounded-lg p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div>
                <h4 className="text-lg font-medium">{getTypeDisplay(evaluation.type)}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(evaluation.date)}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {evaluation.evaluator}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <BarChart className="h-5 w-5 text-gray-500" />
                <div className={`font-bold text-lg ${getScoreColor(evaluation.score)}`}>
                  {evaluation.score}/5
                </div>
                {renderStarRating(evaluation.score)}
              </div>
            </div>
            
            {evaluation.comments && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{evaluation.comments}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationsTab;
