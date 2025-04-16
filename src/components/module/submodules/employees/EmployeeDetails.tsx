
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee } from '@/types/employee';
import InformationsTab from './tabs/InformationsTab';
import HorairesTab from './tabs/HorairesTab';
import CompetencesTab from './tabs/CompetencesTab';
import CongesTab from './tabs/CongesTab';
import DocumentsTab from './tabs/DocumentsTab';
import EvaluationsTab from './tabs/EvaluationsTab';
import { useEmployeePermissions } from './hooks/useEmployeePermissions';
import { FileText, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import EmployeeProfileHeader from './profile/EmployeeProfileHeader';
import EmployeeProfileActions from './profile/EmployeeProfileActions';

interface EmployeeDetailsProps {
  employee?: Employee;
  isLoading?: boolean;
  onExportPdf?: () => void;
  onEdit?: () => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ 
  employee,
  isLoading = false,
  onExportPdf,
  onEdit
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('informations');
  const [isEditing, setIsEditing] = useState(false);

  const { canView, canEdit, isOwnProfile } = useEmployeePermissions('employees-profiles', employee?.id);

  const handleStartEditing = () => {
    setIsEditing(true);
    toast.info(`Mode édition activé pour l'onglet ${getTabName(activeTab)}`);
    if (onEdit) {
      onEdit();
    }
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
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Vous n'avez pas les permissions nécessaires pour consulter ce profil.
          </p>
          <button 
            className="text-primary hover:underline"
            onClick={() => navigate('/modules/employees/profiles')}
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="space-y-6">
      <EmployeeProfileHeader employee={employee} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="horaires">Horaires et présence</TabsTrigger>
          <TabsTrigger value="competences">Compétences</TabsTrigger>
          <TabsTrigger value="conges">Congés</TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="evaluations" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Évaluations</span>
          </TabsTrigger>
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

        <TabsContent value="documents">
          <DocumentsTab 
            employee={employee}
            isEditing={isEditing && activeTab === 'documents'}
            onFinishEditing={handleFinishEditing}
          />
        </TabsContent>

        <TabsContent value="evaluations">
          <EvaluationsTab
            employee={employee}
            isEditing={isEditing && activeTab === 'evaluations'}
            onFinishEditing={handleFinishEditing}
          />
        </TabsContent>
      </Tabs>

      {(canEdit || isOwnProfile) && (
        <EmployeeProfileActions 
          isEditing={isEditing}
          onExportPdf={onExportPdf}
          onEdit={handleStartEditing}
          onFinishEditing={handleFinishEditing}
        />
      )}
    </div>
  );
};

export default EmployeeDetails;
