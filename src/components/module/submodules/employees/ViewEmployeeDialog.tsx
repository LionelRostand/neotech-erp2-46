
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active':
      case 'Actif':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
      case 'Inactif':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'onLeave':
      case 'En congé':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Suspendu':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <Avatar className="h-16 w-16 border">
            {employee.photoURL || employee.photo ? (
              <AvatarImage
                src={employee.photoURL || employee.photo}
                alt={`${employee.firstName} ${employee.lastName}`}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {employee.firstName?.[0]}{employee.lastName?.[0]}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{employee.firstName} {employee.lastName}</h2>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span>{employee.position}</span>
              {employee.department && <span>• {employee.department}</span>}
              <div className="ml-auto">
                <Badge variant="outline" className={`${getStatusColor(employee.status)}`}>
                  {getStatusDisplay(employee.status)}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full overflow-x-auto flex">
            <TabsTrigger value="informations" className="flex-1">Informations</TabsTrigger>
            <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
            <TabsTrigger value="presences" className="flex-1">Présences</TabsTrigger>
            <TabsTrigger value="conges" className="flex-1">Congés</TabsTrigger>
            <TabsTrigger value="competences" className="flex-1">Compétences</TabsTrigger>
            <TabsTrigger value="evaluations" className="flex-1">Évaluations</TabsTrigger>
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
