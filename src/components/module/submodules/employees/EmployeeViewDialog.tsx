
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { X, Edit, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from '@/components/ui/status-badge';
import { Employee } from '@/types/employee';
import InformationsTab from './tabs/InformationsTab';
import InformationsTabEdit from './tabs/InformationsTabEdit';
import CompetencesTab from './tabs/CompetencesTab';
import CompetencesTabEdit from './tabs/CompetencesTabEdit';
import DocumentsTab from './tabs/DocumentsTab';
import HorairesTab from './tabs/HorairesTab';
import HorairesTabEdit from './tabs/HorairesTabEdit';
import CongesTab from './tabs/CongesTab';
import CongesTabEdit from './tabs/CongesTabEdit';
import EvaluationsTab from './tabs/EvaluationsTab';
import EvaluationsTabEdit from './tabs/EvaluationsTabEdit';

interface EmployeeViewDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: Partial<Employee>) => void;
}

const EmployeeViewDialog: React.FC<EmployeeViewDialogProps> = ({
  employee,
  open,
  onOpenChange,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState("informations");
  const [editMode, setEditMode] = useState(false);

  if (!employee) {
    return null;
  }

  // Ensure we have string values for display
  const firstName = typeof employee.firstName === 'object' ? JSON.stringify(employee.firstName) : String(employee.firstName || '');
  const lastName = typeof employee.lastName === 'object' ? JSON.stringify(employee.lastName) : String(employee.lastName || '');
  const position = typeof employee.position === 'object' ? JSON.stringify(employee.position) : String(employee.position || '');
  const status = typeof employee.status === 'object' ? JSON.stringify(employee.status) : String(employee.status || '');
  
  // Extract initials for avatar fallback
  const firstInitial = firstName?.[0] || '';
  const lastInitial = lastName?.[0] || '';

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = (data: Partial<Employee>) => {
    onUpdate({
      id: employee.id,
      ...data
    });
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between relative pb-2 border-b">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
              {employee.photoURL ? (
                <img
                  src={employee.photoURL}
                  alt={`${firstName} ${lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-300">
                  <span className="text-xl font-medium uppercase">
                    {firstInitial}{lastInitial}
                  </span>
                </div>
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {firstName} {lastName}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={status} />
                <span className="text-gray-600">{position}</span>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 space-x-2">
            {!editMode && (
              <Button 
                onClick={handleEdit}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
            )}
            <Button 
              onClick={() => onOpenChange(false)}
              variant="outline"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            className="absolute right-0 top-10"
            variant="outline"
          >
            Exporter PDF
          </Button>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="competences">Compétences</TabsTrigger>
            <TabsTrigger value="horaires">Horaires</TabsTrigger>
            <TabsTrigger value="conges">Congés</TabsTrigger>
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          </TabsList>

          <TabsContent value="informations" className="mt-4">
            {editMode ? (
              <InformationsTabEdit 
                employee={employee} 
                onSave={handleSave} 
                onCancel={handleCancel} 
              />
            ) : (
              <InformationsTab employee={employee} />
            )}
          </TabsContent>
          
          <TabsContent value="documents" className="mt-4">
            <DocumentsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="competences" className="mt-4">
            {editMode ? (
              <CompetencesTabEdit 
                employee={employee} 
                onSave={handleSave} 
                onCancel={handleCancel} 
              />
            ) : (
              <CompetencesTab employee={employee} />
            )}
          </TabsContent>
          
          <TabsContent value="horaires" className="mt-4">
            {editMode ? (
              <HorairesTabEdit 
                employee={employee} 
                onSave={handleSave} 
                onCancel={handleCancel} 
              />
            ) : (
              <HorairesTab employee={employee} />
            )}
          </TabsContent>
          
          <TabsContent value="conges" className="mt-4">
            {editMode ? (
              <CongesTabEdit 
                employee={employee} 
                onSave={handleSave} 
                onCancel={handleCancel} 
              />
            ) : (
              <CongesTab employee={employee} />
            )}
          </TabsContent>
          
          <TabsContent value="evaluations" className="mt-4">
            {editMode ? (
              <EvaluationsTabEdit 
                employee={employee} 
                onSave={handleSave} 
                onCancel={handleCancel} 
              />
            ) : (
              <EvaluationsTab employee={employee} />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeViewDialog;
