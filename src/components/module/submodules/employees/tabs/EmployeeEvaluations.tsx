
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';

interface EmployeeEvaluationsProps {
  employeeId: string;
}

const EmployeeEvaluations: React.FC<EmployeeEvaluationsProps> = ({ employeeId }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <ClipboardCheck className="h-10 w-10 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune évaluation</h3>
          <p className="text-sm text-gray-500">
            Il n'y a actuellement aucune évaluation enregistrée pour cet employé.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeEvaluations;
