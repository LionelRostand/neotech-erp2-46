import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import InformationsTab from './tabs/InformationsTab';
import HorairesTab from './tabs/HorairesTab';
import CompetencesTab from './tabs/CompetencesTab';
import CongesTab from './tabs/CongesTab';
import { useEmployeePermissions } from './hooks/useEmployeePermissions';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface EmployeeDetailsProps {
  employee?: Employee;
  isLoading?: boolean;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ 
  employee,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('informations');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState<Employee | undefined>(employee);

  const { canView, canEdit, isOwnProfile } = useEmployeePermissions('employees-profiles', employee?.id);

  const handleStartEditing = () => {
    setIsEditing(true);
    toast.info(`Mode édition activé pour l'onglet ${getTabName(activeTab)}`);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
    toast.success(`Modifications enregistrées pour l'onglet ${getTabName(activeTab)}`);
  };

  const getTabName = (tabId: string): string => {
    switch (tabId) {
      case 'informations': return 'Informations';
      case 'horaires': return 'Horaires et présence';
      case 'competences': return 'Compétences';
      case 'conges': return 'Congés';
      default: return tabId;
    }
  };

  if (isLoading) {
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

  if (!employee) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
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
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="horaires">Horaires et présence</TabsTrigger>
          <TabsTrigger value="competences">Compétences</TabsTrigger>
          <TabsTrigger value="conges">Congés</TabsTrigger>
        </TabsList>

        <TabsContent value="informations">
          <InformationsTab 
            employee={employee} 
            isEditing={isEditing && activeTab === 'informations'}
            onFinishEditing={handleFinishEditing}
          />
        </TabsContent>

        <TabsContent value="horaires">
          <HorairesTab 
            employee={employee} 
            isEditing={isEditing && activeTab === 'horaires'}
            onFinishEditing={handleFinishEditing}
          />
        </TabsContent>

        <TabsContent value="competences">
          <CompetencesTab 
            employee={employee}
            onEmployeeUpdated={() => {}}
            isEditing={isEditing && activeTab === 'competences'}
            onFinishEditing={handleFinishEditing}
          />
        </TabsContent>

        <TabsContent value="conges">
          <CongesTab 
            employee={employee} 
            isEditing={isEditing && activeTab === 'conges'}
            onFinishEditing={handleFinishEditing}
          />
        </TabsContent>
      </Tabs>

      {(canEdit || isOwnProfile) && (
        <div className="flex justify-end gap-3 mt-6">
          <Button variant={isEditing ? "default" : "outline"} onClick={isEditing ? handleFinishEditing : handleStartEditing}>
            {isEditing ? "Terminer" : "Modifier"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
