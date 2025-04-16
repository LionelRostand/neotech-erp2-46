
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Employee } from '@/types/employee';
import InformationsTab from './tabs/InformationsTab';
import HorairesTab from './tabs/HorairesTab';
import CompetencesTab from './tabs/CompetencesTab';
import CongesTab from './tabs/CongesTab';
import EvaluationsTab from './tabs/EvaluationsTab';
import DocumentsTab from './tabs/DocumentsTab';
import { useEmployeePermissions } from './hooks/useEmployeePermissions';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeData } from '@/hooks/useEmployeeData';

const EmployeeProfileView: React.FC<{ employee?: Employee; isLoading?: boolean }> = ({ 
  employee,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('informations');
  const { employees } = useEmployeeData();

  const mockEmployee: Employee = {
    id: "EMP001",
    firstName: "Martin",
    lastName: "Dupont",
    email: "martin.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    department: "Marketing",
    departmentId: "MKT",
    position: "Chef de Projet Digital",
    photo: "",
    photoURL: "",
    hireDate: "15/03/2021",
    startDate: "15/03/2021",
    status: "active",
    address: {
      street: "15 Rue des Lilas",
      city: "Paris",
      postalCode: "75011",
      country: "France"
    },
    contract: "CDI",
    manager: "Sophie Martin",
    managerId: "EMP003",
    socialSecurityNumber: "",
    birthDate: "01/01/1990",
    documents: [],
    company: "",
    role: "Employé",
    title: "Chef de Projet Digital",
    professionalEmail: "martin.dupont@example.com",
    skills: [],
    education: [],
    workSchedule: {
      monday: "09:00 - 18:00",
      tuesday: "09:00 - 18:00",
      wednesday: "09:00 - 18:00",
      thursday: "09:00 - 18:00",
      friday: "09:00 - 17:00",
    },
    payslips: []
  };

  const displayedEmployee = employee || mockEmployee;
  
  // Trouver le manager de l'employé s'il en a un
  const findManager = () => {
    if (!displayedEmployee.managerId || !employees || employees.length === 0) return null;
    
    const manager = employees.find(emp => emp.id === displayedEmployee.managerId);
    console.log("Manager trouvé:", manager || "Aucun");
    return manager;
  };
  
  const employeeManager = findManager();
  
  // Si on a trouvé un manager dans les données des employés, mettre à jour le champ manager
  const employeeWithManagerInfo = {
    ...displayedEmployee,
    manager: employeeManager ? `${employeeManager.firstName} ${employeeManager.lastName}` : displayedEmployee.manager,
  };
  
  const employeeId = displayedEmployee?.id;
  
  const { canView, canEdit, isOwnProfile, loading } = useEmployeePermissions('employees-profiles', employeeId);

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!canView && !isOwnProfile) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Accès limité</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md">
              Vous n'avez pas les permissions nécessaires pour consulter ce profil.
            </p>
            <Button variant="outline" onClick={() => navigate('/modules/employees/profiles')}>
              Retour à la liste
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full mr-4 bg-gray-200 overflow-hidden">
                {employeeWithManagerInfo.photoURL ? (
                  <img 
                    src={employeeWithManagerInfo.photoURL} 
                    alt={`${employeeWithManagerInfo.firstName} ${employeeWithManagerInfo.lastName}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl">
                    {employeeWithManagerInfo.firstName[0]}{employeeWithManagerInfo.lastName[0]}
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {employeeWithManagerInfo.firstName} {employeeWithManagerInfo.lastName}
                </CardTitle>
                <p className="text-gray-500">{employeeWithManagerInfo.position}</p>
              </div>
            </div>
            {(canEdit || isOwnProfile) && (
              <Button 
                variant={isEditing ? "default" : "outline"} 
                onClick={isEditing ? handleFinishEditing : handleStartEditing}
              >
                {isEditing ? "Terminer" : "Modifier"}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
          <TabsTrigger value="competences">Compétences</TabsTrigger>
          <TabsTrigger value="conges">Congés</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-250px)] min-h-[600px] w-full pr-4 overflow-y-auto">
          <TabsContent value="informations">
            <InformationsTab employee={employeeWithManagerInfo} isEditing={isEditing} onFinishEditing={handleFinishEditing} />
          </TabsContent>
          <TabsContent value="horaires">
            <HorairesTab employee={employeeWithManagerInfo} isEditing={isEditing} onFinishEditing={handleFinishEditing} />
          </TabsContent>
          <TabsContent value="competences">
            <CompetencesTab employee={employeeWithManagerInfo} onEmployeeUpdated={() => {}} isEditing={isEditing} onFinishEditing={handleFinishEditing} />
          </TabsContent>
          <TabsContent value="conges">
            <CongesTab employee={employeeWithManagerInfo} isEditing={isEditing} onFinishEditing={handleFinishEditing} />
          </TabsContent>
          <TabsContent value="evaluations">
            <EvaluationsTab employee={employeeWithManagerInfo} isEditing={isEditing} onFinishEditing={handleFinishEditing} />
          </TabsContent>
          <TabsContent value="documents">
            <DocumentsTab employee={employeeWithManagerInfo} isEditing={isEditing} onFinishEditing={handleFinishEditing} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default EmployeeProfileView;
