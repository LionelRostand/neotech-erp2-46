
import React from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HorairesTab from './tabs/HorairesTab';
import AbsencesTab from './tabs/AbsencesTab';
import DocumentsTab from './tabs/DocumentsTab';
import EvaluationsTab from './tabs/EvaluationsTab';
import FormationsTab from './tabs/FormationsTab';

interface EmployeeProfileViewProps {
  employee: Employee;
  isLoading?: boolean;
  onEmployeeUpdated?: () => void;
}

const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({ 
  employee, 
  isLoading = false,
  onEmployeeUpdated
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Profil de {employee.firstName} {employee.lastName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="informations" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="horaires">Horaires</TabsTrigger>
            <TabsTrigger value="absences">Absences</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informations" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Informations personnelles</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Nom:</span> {employee.lastName}</p>
                  <p><span className="font-medium">Prénom:</span> {employee.firstName}</p>
                  <p><span className="font-medium">Email:</span> {employee.email}</p>
                  <p><span className="font-medium">Téléphone:</span> {employee.phone || 'Non renseigné'}</p>
                  <p><span className="font-medium">Date de naissance:</span> {employee.birthDate || 'Non renseigné'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Informations professionnelles</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Poste:</span> {employee.position}</p>
                  <p><span className="font-medium">Département:</span> {employee.department}</p>
                  <p><span className="font-medium">Date d'embauche:</span> {employee.hireDate}</p>
                  <p><span className="font-medium">Statut:</span> {employee.status}</p>
                  <p><span className="font-medium">Contrat:</span> {employee.contract || 'Non renseigné'}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="horaires">
            <HorairesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="absences">
            <AbsencesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="evaluations">
            <EvaluationsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="formations">
            <FormationsTab employee={employee} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfileView;
