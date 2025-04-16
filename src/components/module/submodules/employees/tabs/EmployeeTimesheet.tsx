
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface EmployeeTimesheetProps {
  employeeId: string;
}

const EmployeeTimesheet: React.FC<EmployeeTimesheetProps> = ({ employeeId }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Clock className="h-10 w-10 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun relevé d'heures</h3>
          <p className="text-sm text-gray-500">
            Il n'y a actuellement aucun relevé d'heures enregistré pour cet employé.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeTimesheet;
