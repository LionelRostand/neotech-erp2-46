
import React from 'react';
import { Card } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { useEvaluationsData } from '@/hooks/useEvaluationsData';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, Save } from 'lucide-react';

interface EvaluationsTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ 
  employee,
  isEditing = false,
  onFinishEditing 
}) => {
  const { evaluations, isLoading } = useEvaluationsData();
  const employeeEvaluations = evaluations.filter(evaluation => 
    evaluation.employeeId === employee.id
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="h-8 bg-gray-200 rounded-md animate-pulse w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-md animate-pulse"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!employeeEvaluations.length) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucune évaluation n'a été trouvée pour cet employé</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Évaluations</h3>
        {isEditing && (
          <Button 
            size="sm" 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle évaluation
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        {employeeEvaluations.map((evaluation) => (
          <div 
            key={evaluation.id}
            className="p-4 border rounded-lg space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">
                  {evaluation.title || `Évaluation du ${evaluation.date}`}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Par: {evaluation.evaluatorName || 'Non assigné'}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                evaluation.status === 'Complétée' 
                  ? 'bg-green-100 text-green-700' 
                  : evaluation.status === 'Planifiée'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {evaluation.status}
              </span>
            </div>

            {evaluation.score !== undefined && evaluation.maxScore && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score global</span>
                  <span>{Math.round((evaluation.score / evaluation.maxScore) * 100)}%</span>
                </div>
                <Progress 
                  value={(evaluation.score / evaluation.maxScore) * 100} 
                  className="h-2"
                />
              </div>
            )}

            {evaluation.comments && (
              <p className="text-sm text-gray-600 mt-2">
                {evaluation.comments}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EvaluationsTab;
