
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import EmployeeProfileHeader from './EmployeeProfileHeader';
import InformationsTab from './tabs/InformationsTab';
import DocumentsTab from './tabs/DocumentsTab';
import CompetencesTab from './tabs/CompetencesTab';
import HorairesTab from './tabs/HorairesTab';
import CongesTab from './tabs/CongesTab';
import EvaluationsTab from './tabs/EvaluationsTab';

interface EmployeeDetailsProps {
  employee: Employee;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee }) => {
  return (
    <div className="space-y-6">
      <EmployeeProfileHeader employee={employee} />

      <Tabs defaultValue="infos" className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-6 mb-6">
          <TabsTrigger value="infos">Informations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="competences">Compétences</TabsTrigger>
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
          <TabsTrigger value="conges">Congés</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="infos">
          <InformationsTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentsTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="competences">
          <CompetencesTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="horaires">
          <HorairesTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="conges">
          <CongesTab />
        </TabsContent>
        
        <TabsContent value="evaluations">
          <EvaluationsTab />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline">Exporter PDF</Button>
        <Button variant="outline">Modifier</Button>
      </div>
    </div>
  );
};

export default EmployeeDetails;
