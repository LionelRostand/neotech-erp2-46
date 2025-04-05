
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import { SubModule } from '@/data/types/modules';

const EmployeesAlerts: React.FC = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <DefaultSubmoduleContent 
          submodule={{
            id: "employees-alerts",
            name: "Alertes",
            href: "/modules/employees/alerts",
            icon: null
          }} 
        />
      </CardContent>
    </Card>
  );
};

export default EmployeesAlerts;
