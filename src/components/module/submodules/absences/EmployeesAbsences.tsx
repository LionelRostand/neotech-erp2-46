
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import { SubModule } from '@/data/types/modules';

const EmployeesAbsences: React.FC = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <DefaultSubmoduleContent 
          submodule={{
            id: "employees-absences",
            name: "Absences",
            href: "/modules/employees/absences",
            icon: null
          }} 
        />
      </CardContent>
    </Card>
  );
};

export default EmployeesAbsences;
