import React from 'react';
import { Employee } from '@/types/employee';
import { Calendar } from 'lucide-react';

interface PresencesTabProps {
  employee: Employee;
}

const PresencesTab: React.FC<PresencesTabProps> = ({ employee }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Registre des présences</h3>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md flex items-center">
        <Calendar className="h-5 w-5 text-blue-500 mr-3" />
        <p className="text-blue-700">
          Les données de présence seront disponibles depuis le module Présences.
        </p>
      </div>
      
      <div className="border rounded-md shadow-sm p-1">
        {/* Ici sera intégré le registre des présences lorsque le module sera développé */}
        <div className="text-center p-8 text-gray-500">
          <p>Les données de présence ne sont pas encore disponibles pour cet employé.</p>
        </div>
      </div>
    </div>
  );
};

export default PresencesTab;
