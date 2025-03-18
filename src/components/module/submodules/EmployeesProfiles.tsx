
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import { employees } from '@/data/employees';
import EmployeesList from './employees/EmployeesList';
import EmployeeDetails from './employees/EmployeeDetails';

const EmployeesProfiles: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className="space-y-6">
      {selectedEmployee ? (
        <>
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedEmployee(null)}
              className="mr-2"
            >
              <span className="mr-2">←</span> Retour à la liste
            </Button>
          </div>
          <EmployeeDetails employee={selectedEmployee} />
        </>
      ) : (
        <EmployeesList
          employees={employees}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onViewEmployee={handleViewEmployee}
        />
      )}
    </div>
  );
};

export default EmployeesProfiles;
