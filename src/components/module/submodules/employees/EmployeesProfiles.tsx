
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee } from '@/types/employee';
import EmployeeProfileHeader from './components/EmployeeProfileHeader';
import InformationsTab from './tabs/InformationsTab';
import CompetencesTab from './tabs/CompetencesTab';
import HorairesTab from './tabs/HorairesTab';
import CongesTab from './tabs/CongesTab';
import AbsencesTab from './tabs/AbsencesTab';
import EvaluationsTab from './tabs/EvaluationsTab';
import EmployeesTable from './components/EmployeesTable';

interface EmployeesProfilesProps {
  employees: Employee[];
  isLoading?: boolean;
}

const EmployeesProfiles: React.FC<EmployeesProfilesProps> = ({ employees, isLoading = false }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState('informations');

  // Handler for when an employee is selected from the table
  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    // Reset to the informations tab when a new employee is selected
    setActiveTab('informations');
  };

  // Handler for refreshing data after updates
  const handleEmployeeUpdate = () => {
    // This would typically refetch the employee data
    console.log('Employee updated, refreshing data...');
    // For now we'll just log, in a real app we might refetch the employee list
  };

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Employee list (responsive: full width on mobile, 1/3 width on desktop) */}
        <div className="lg:col-span-1 border rounded-md overflow-hidden bg-white">
          <EmployeesTable 
            employees={employees} 
            onEmployeeClick={handleEmployeeClick} 
            isLoading={isLoading}
          />
        </div>

        {/* Employee details (responsive: full width on mobile, 2/3 width on desktop) */}
        <div className="lg:col-span-2">
          {selectedEmployee ? (
            <div className="bg-white border rounded-md overflow-hidden h-full flex flex-col">
              <EmployeeProfileHeader employee={selectedEmployee} />
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
                <TabsList className="px-6 pt-2 bg-transparent justify-start border-b">
                  <TabsTrigger value="informations">Informations</TabsTrigger>
                  <TabsTrigger value="competences">Compétences</TabsTrigger>
                  <TabsTrigger value="horaires">Horaires</TabsTrigger>
                  <TabsTrigger value="conges">Congés</TabsTrigger>
                  <TabsTrigger value="absences">Absences</TabsTrigger>
                  <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
                </TabsList>
                
                <div className="flex-grow overflow-auto">
                  <TabsContent value="informations" className="m-0">
                    <InformationsTab employee={selectedEmployee} onEmployeeUpdate={handleEmployeeUpdate} />
                  </TabsContent>
                  
                  <TabsContent value="competences" className="m-0">
                    <CompetencesTab employee={selectedEmployee} onEmployeeUpdate={handleEmployeeUpdate} />
                  </TabsContent>
                  
                  <TabsContent value="horaires" className="m-0">
                    <HorairesTab employee={selectedEmployee} />
                  </TabsContent>
                  
                  <TabsContent value="conges" className="m-0">
                    <CongesTab employee={selectedEmployee} />
                  </TabsContent>
                  
                  <TabsContent value="absences" className="m-0">
                    <AbsencesTab employee={selectedEmployee} />
                  </TabsContent>
                  
                  <TabsContent value="evaluations" className="m-0">
                    <EvaluationsTab employee={selectedEmployee} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          ) : (
            <div className="border rounded-md p-8 bg-white h-full flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Aucun employé sélectionné</h3>
                <p className="text-gray-500">Veuillez sélectionner un employé dans la liste pour afficher ses informations.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesProfiles;
