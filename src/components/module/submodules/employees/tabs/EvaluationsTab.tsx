
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { useEvaluationsData } from '@/hooks/useEvaluationsData';
import { Star, Award, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EvaluationsTabProps {
  employee: Employee;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ employee }) => {
  // Fetch all evaluations using the same hook used in the Evaluations submenu
  const { evaluations, isLoading } = useEvaluationsData();
  
  // Filter evaluations for this specific employee
  const employeeEvaluations = useMemo(() => {
    if (!evaluations || evaluations.length === 0) {
      return employee.evaluations || [];
    }
    
    // Get evaluations from both sources
    const fromEvaluationsCollection = evaluations.filter(evaluation => 
      evaluation.employeeId === employee.id
    );
    
    const fromEmployeeRecord = employee.evaluations || [];
    
    // Combine and deduplicate the evaluations
    const allEvaluations = [...fromEvaluationsCollection, ...fromEmployeeRecord];
    const uniqueEvaluations = allEvaluations.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    
    // Sort evaluations by date (newest first)
    return uniqueEvaluations.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [evaluations, employee]);
  
  // Helper to render evaluation status badge
  const renderStatusBadge = (status) => {
    if (!status) return null;
    
    let variant;
    switch(status) {
      case 'Complétée':
        variant = 'success';
        break;
      case 'Planifiée':
        variant = 'default';
        break;
      case 'Annulée':
        variant = 'destructive';
        break;
      default:
        variant = 'secondary';
    }
    
    return (
      <Badge variant={variant} className="ml-2">
        {status}
      </Badge>
    );
  };
  
  // Helper to render evaluation score as stars
  const renderScore = (score, maxScore = 5) => {
    if (score === undefined) return null;
    
    const normalizedScore = maxScore ? (score / maxScore) * 5 : score;
    return (
      <div className="flex items-center mt-2">
        <span className="text-sm font-medium mr-2">Score:</span>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star}
              className={`h-4 w-4 ${star <= normalizedScore ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2 text-sm">
            {score}/{maxScore || 5}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <Award className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-medium">Évaluations</h3>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-md p-4 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="w-3/4">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mt-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
              </div>
            ))}
          </div>
        ) : employeeEvaluations.length > 0 ? (
          <div className="space-y-4">
            {employeeEvaluations.map((evaluation, index) => (
              <div key={evaluation.id || index} className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium flex items-center">
                      {evaluation.title || `Évaluation du ${new Date(evaluation.date).toLocaleDateString('fr-FR')}`}
                      {renderStatusBadge(evaluation.status)}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {evaluation.evaluatorName ? `Évaluateur: ${evaluation.evaluatorName}` : 'Évaluation interne'}
                    </p>
                  </div>
                </div>
                
                {renderScore(evaluation.score, evaluation.maxScore)}
                
                {evaluation.comments && (
                  <div className="mt-3">
                    <p className="text-sm font-medium flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      Commentaires:
                    </p>
                    <p className="text-sm mt-1 text-muted-foreground">{evaluation.comments}</p>
                  </div>
                )}
                
                {evaluation.strengths && evaluation.strengths.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium">Points forts:</p>
                    <ul className="list-disc list-inside text-sm mt-1 text-muted-foreground">
                      {evaluation.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {evaluation.improvements && evaluation.improvements.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium">Axes d'amélioration:</p>
                    <ul className="list-disc list-inside text-sm mt-1 text-muted-foreground">
                      {evaluation.improvements.map((improvement, i) => (
                        <li key={i}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucune évaluation enregistrée pour cet employé.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EvaluationsTab;
