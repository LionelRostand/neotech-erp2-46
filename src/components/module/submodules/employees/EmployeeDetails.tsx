
import React, { useState } from 'react';
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
  onExportPdf: () => void;
  onEdit: () => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ 
  employee, 
  onExportPdf,
  onEdit
}) => {
  const [activeTab, setActiveTab] = useState('infos');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEditTab = () => {
    if (activeTab === 'infos') {
      onEdit();
    } else if (activeTab === 'conges') {
      setIsEditing(true);
    } else if (activeTab === 'evaluations') {
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-6">
      <EmployeeProfileHeader employee={employee} />

      <Tabs defaultValue="infos" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          <CongesTab 
            employee={employee} 
            isEditing={isEditing && activeTab === 'conges'} 
            onFinishEditing={() => setIsEditing(false)} 
          />
        </TabsContent>
        
        <TabsContent value="evaluations">
          <EvaluationsTab 
            employee={employee} 
            isEditing={isEditing && activeTab === 'evaluations'} 
            onFinishEditing={() => setIsEditing(false)} 
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onExportPdf}>Exporter PDF</Button>
        <Button variant="outline" onClick={handleEditTab}>Modifier</Button>
      </div>
    </div>
  );
};

export default EmployeeDetails;
