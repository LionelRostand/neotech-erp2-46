
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from '@/components/ui/status-badge';
import { Employee } from '@/types/employee';
import InformationsTab from './tabs/InformationsTab';
import InformationsTabEdit from './tabs/InformationsTabEdit';
import CompetencesTab from './tabs/CompetencesTab';
import CompetencesTabEdit from './tabs/CompetencesTabEdit';
import DocumentsTab from './tabs/DocumentsTab';
import DocumentsTabEdit from './tabs/DocumentsTabEdit';
import HorairesTab from './tabs/HorairesTab';
import HorairesTabEdit from './tabs/HorairesTabEdit';
import EvaluationsTab from './tabs/EvaluationsTab';
import EvaluationsTabEdit from './tabs/EvaluationsTabEdit';
import AbsencesTab from './tabs/AbsencesTab';
import AbsencesTabEdit from './tabs/AbsencesTabEdit';
import { Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

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
  const [activeTab, setActiveTab] = useState('informations');
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleTabChange = (value: string) => {
    // Check for unsaved changes before changing tabs
    if (editingTab && unsavedChanges) {
      if (window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous quitter sans sauvegarder ?')) {
        setEditingTab(null);
        setUnsavedChanges(false);
        setActiveTab(value);
      }
    } else {
      setActiveTab(value);
    }
  };

  const handleEnterEditMode = (tab: string) => {
    setEditingTab(tab);
    setUnsavedChanges(false);
  };

  const handleCancelEdit = () => {
    if (unsavedChanges && !window.confirm('Annuler les modifications ?')) {
      return;
    }
    setEditingTab(null);
    setUnsavedChanges(false);
  };

  const handleSaveChanges = (data: Partial<Employee>) => {
    if (!employee) return;
    
    onUpdate({
      ...data,
      id: employee.id
    });
    
    toast.success('Modifications enregistrées');
    setEditingTab(null);
    setUnsavedChanges(false);
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            {employee.photoUrl ? (
              <img 
                src={employee.photoUrl} 
                alt={`${employee.firstName} ${employee.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-500">
                  {employee.firstName?.[0]}{employee.lastName?.[0]}
                </span>
              </div>
            )}
            <div>
              <DialogTitle className="text-xl">
                {employee.firstName} {employee.lastName}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-500">{employee.position}</span>
                <StatusBadge status={employee.status} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="informations">Informations</TabsTrigger>
              <TabsTrigger value="competences">Compétences</TabsTrigger>
              <TabsTrigger value="horaires">Horaires</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
              <TabsTrigger value="absences">Absences</TabsTrigger>
            </TabsList>

            {!editingTab ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEnterEditMode(activeTab)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 mr-1" />
                  Annuler
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4">
            <TabsContent value="informations" className="m-0">
              {editingTab === 'informations' ? (
                <InformationsTabEdit 
                  employee={employee} 
                  onSave={(data) => handleSaveChanges(data)}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <InformationsTab employee={employee} />
              )}
            </TabsContent>
            
            <TabsContent value="competences" className="m-0">
              {editingTab === 'competences' ? (
                <CompetencesTabEdit 
                  employee={employee} 
                  onSave={(data) => handleSaveChanges(data)}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <CompetencesTab employee={employee} />
              )}
            </TabsContent>
            
            <TabsContent value="horaires" className="m-0">
              {editingTab === 'horaires' ? (
                <HorairesTabEdit 
                  employee={employee} 
                  onSave={(data) => handleSaveChanges(data)}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <HorairesTab employee={employee} />
              )}
            </TabsContent>
            
            <TabsContent value="documents" className="m-0">
              {editingTab === 'documents' ? (
                <DocumentsTabEdit 
                  employee={employee} 
                  onSave={(data) => handleSaveChanges(data)}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <DocumentsTab employee={employee} />
              )}
            </TabsContent>
            
            <TabsContent value="evaluations" className="m-0">
              {editingTab === 'evaluations' ? (
                <EvaluationsTabEdit 
                  employee={employee} 
                  onSave={(data) => handleSaveChanges(data)}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <EvaluationsTab employee={employee} />
              )}
            </TabsContent>
            
            <TabsContent value="absences" className="m-0">
              {editingTab === 'absences' ? (
                <AbsencesTabEdit 
                  employee={employee} 
                  onSave={(data) => handleSaveChanges(data)}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <AbsencesTab employee={employee} />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeViewDialog;
