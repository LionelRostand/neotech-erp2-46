
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { Employee } from '@/types/employee';
import InformationsTab from './tabs/InformationsTab';
import CompetencesTab from './tabs/CompetencesTab';
import DocumentsTab from './tabs/DocumentsTab';
import HorairesTab from './tabs/HorairesTab';
import CongesTab from './tabs/CongesTab';
import EvaluationsTab from './tabs/EvaluationsTab';

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

  if (!employee) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between relative pb-2 border-b">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
              {employee.photoURL ? (
                <img
                  src={employee.photoURL}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-300">
                  <span className="text-xl font-medium uppercase">
                    {employee.firstName?.[0]}{employee.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {employee.firstName} {employee.lastName}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={employee.status} />
                <span className="text-gray-600">{employee.position}</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => onOpenChange(false)}
            variant="outline"
            size="sm"
            className="absolute right-0 top-0"
          >
            <X className="h-4 w-4" />
          </Button>
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
            <InformationsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="documents" className="mt-4">
            <DocumentsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="competences" className="mt-4">
            <CompetencesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="horaires" className="mt-4">
            <HorairesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="conges" className="mt-4">
            <CongesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="evaluations" className="mt-4">
            <EvaluationsTab employee={employee} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeViewDialog;
