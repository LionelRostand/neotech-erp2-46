
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';

interface EvaluationsTabProps {
  employee: Employee;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ employee }) => {
  const evaluations = employee.evaluations || [];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-6">Évaluations</h3>
        
        {evaluations.length > 0 ? (
          <div className="space-y-4">
            {evaluations.map((evaluation, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{evaluation.title || `Évaluation du ${evaluation.date}`}</h4>
                    <p className="text-sm text-muted-foreground">Date: {evaluation.date}</p>
                  </div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                    {evaluation.status || 'Complétée'}
                  </div>
                </div>
                
                {evaluation.comments && (
                  <div className="mt-3">
                    <p className="text-sm font-medium">Commentaires:</p>
                    <p className="text-sm mt-1">{evaluation.comments}</p>
                  </div>
                )}
                
                {evaluation.score !== undefined && (
                  <div className="mt-3 flex items-center">
                    <p className="text-sm font-medium mr-2">Score: </p>
                    <p className="text-sm">{evaluation.score}/{evaluation.maxScore || 5}</p>
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
