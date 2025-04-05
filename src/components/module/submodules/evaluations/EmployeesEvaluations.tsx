
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import { SubModule } from '@/data/types/modules';

const EmployeesEvaluations: React.FC = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <DefaultSubmoduleContent 
          submodule={{
            id: "employees-evaluations",
            name: "Évaluations",
            href: "/modules/employees/evaluations",
            icon: null
          }} 
        />
      </CardContent>
    </Card>
  );
};

export default EmployeesEvaluations;
