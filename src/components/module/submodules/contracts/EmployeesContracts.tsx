
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import { SubModule } from '@/data/types/modules';

const EmployeesContracts: React.FC = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <DefaultSubmoduleContent 
          submodule={{
            id: "employees-contracts",
            name: "Contrats",
            href: "/modules/employees/contracts",
            icon: null
          }} 
        />
      </CardContent>
    </Card>
  );
};

export default EmployeesContracts;
