
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import { SubModule } from '@/data/types/modules';

const EmployeesDocuments: React.FC = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <DefaultSubmoduleContent 
          submodule={{
            id: "employees-documents",
            name: "Documents RH",
            href: "/modules/employees/documents",
            icon: null
          }} 
        />
      </CardContent>
    </Card>
  );
};

export default EmployeesDocuments;
