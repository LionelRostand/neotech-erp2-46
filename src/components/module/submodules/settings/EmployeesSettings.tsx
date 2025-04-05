
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import { SubModule } from '@/data/types/modules';

const EmployeesSettings: React.FC = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <DefaultSubmoduleContent 
          submodule={{
            id: "employees-settings",
            name: "Paramètres",
            href: "/modules/employees/settings",
            icon: null
          }} 
        />
      </CardContent>
    </Card>
  );
};

export default EmployeesSettings;
