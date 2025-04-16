
import React from 'react';
import { Employee } from '@/types/employee';

interface FormationsTabProps {
  employee: Employee;
}

const FormationsTab: React.FC<FormationsTabProps> = ({ employee }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Formations de {employee.firstName} {employee.lastName}</h2>
      
      <div className="bg-muted p-6 rounded-md text-center">
        <p className="text-muted-foreground">
          Les données de formations seront disponibles prochainement.
        </p>
      </div>
    </div>
  );
};

export default FormationsTab;
