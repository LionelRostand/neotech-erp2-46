
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface EmployeeDocumentsProps {
  employeeId: string;
}

const EmployeeDocuments: React.FC<EmployeeDocumentsProps> = ({ employeeId }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FileText className="h-10 w-10 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun document</h3>
          <p className="text-sm text-gray-500">
            Il n'y a actuellement aucun document associé à cet employé.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeDocuments;
