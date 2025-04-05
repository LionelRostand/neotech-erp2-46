
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import { SubModule } from '@/data/types/modules';

const EmployeesReports: React.FC = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <DefaultSubmoduleContent 
          submodule={{
            id: "employees-reports",
            name: "Rapports",
            href: "/modules/employees/reports",
            icon: null
          }} 
        />
      </CardContent>
    </Card>
  );
};

export default EmployeesReports;
