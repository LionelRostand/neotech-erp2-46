
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import { SubModule } from '@/data/types/modules';

const EmployeesTrainings: React.FC = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <DefaultSubmoduleContent 
          submodule={{
            id: "employees-trainings",
            name: "Formations",
            href: "/modules/employees/trainings",
            icon: null
          }} 
        />
      </CardContent>
    </Card>
  );
};

export default EmployeesTrainings;
