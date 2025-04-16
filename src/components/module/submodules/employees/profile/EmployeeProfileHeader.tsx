
import React from 'react';
import { Employee } from '@/types/employee';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface EmployeeProfileHeaderProps {
  employee: Employee;
}

const EmployeeProfileHeader = ({ employee }: EmployeeProfileHeaderProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full mr-4 bg-gray-200 overflow-hidden">
              {employee.photoURL ? (
                <img 
                  src={employee.photoURL} 
                  alt={`${employee.firstName} ${employee.lastName}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl">
                  {employee.firstName[0]}{employee.lastName[0]}
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-2xl">
                {employee.firstName} {employee.lastName}
              </CardTitle>
              <p className="text-gray-500">{employee.position}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-4 w-4 mr-2" />
            <span>ID: {employee.shortId || employee.id}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default EmployeeProfileHeader;
