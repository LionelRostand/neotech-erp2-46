
import React from 'react';
import { Employee } from '@/types/employee';

interface EvaluationsTabProps {
  employee: Employee;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ employee }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Évaluations de {employee.firstName} {employee.lastName}</h2>
      
      <div className="bg-muted p-6 rounded-md text-center">
        <p className="text-muted-foreground">
          Les données d'évaluations seront disponibles prochainement.
        </p>
      </div>
    </div>
  );
};

export default EvaluationsTab;
