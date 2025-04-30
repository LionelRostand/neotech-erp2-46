
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Employee } from '@/types/employee';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InformationsTab } from './tabs/InformationsTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { PresencesTab } from './tabs/PresencesTab';
import { CongesTab } from './tabs/CongesTab';
import { CompetencesTab } from './tabs/CompetencesTab';
import { EvaluationsTab } from './tabs/EvaluationsTab';

interface ViewEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
}

const ViewEmployeeDialog: React.FC<ViewEmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee
}) => {
  const [activeTab, setActiveTab] = useState("informations");
  
  // Formatter le statut pour affichage
  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'active':
      case 'Actif':
        return 'Actif';
      case 'inactive':
      case 'Inactif':
        return 'Inactif';
      case 'onLeave':
      case 'En congé':
        return 'En congé';
      case 'Suspendu':
        return 'Suspendu';
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {employee.photoURL || employee.photo ? (
              <img
                src={employee.photoURL || employee.photo}
                alt={`${employee.firstName} ${employee.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-xl">
                {employee.firstName?.[0]}{employee.lastName?.[0]}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{employee.firstName} {employee.lastName}</h2>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span>{employee.position}</span>
              {employee.company && <span>• {typeof employee.company === 'string' ? employee.company : employee.company.name}</span>}
              <div className="ml-auto">
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  employee.status === 'active' || employee.status === 'Actif' 
                    ? 'bg-green-100 text-green-800'
                    : employee.status === 'onLeave' || employee.status === 'En congé'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusDisplay(employee.status)}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="presences">Présences</TabsTrigger>
            <TabsTrigger value="conges">Congés</TabsTrigger>
            <TabsTrigger value="competences">Compétences</TabsTrigger>
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informations" className="pt-4">
            <InformationsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="documents" className="pt-4">
            <DocumentsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="presences" className="pt-4">
            <PresencesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="conges" className="pt-4">
            <CongesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="competences" className="pt-4">
            <CompetencesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="evaluations" className="pt-4">
            <EvaluationsTab employee={employee} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEmployeeDialog;
