
import React from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from '@/types/employee';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { getDepartmentName } from '../utils/departmentUtils';

// Import des onglets
import InformationsTab from '../tabs/InformationsTab';
import DocumentsTab from '../tabs/DocumentsTab';
import CompetencesTab from '../tabs/CompetencesTab';
import HorairesTab from '../tabs/HorairesTab';
import CongesTab from '../tabs/CongesTab';
import EvaluationsTab from '../tabs/EvaluationsTab';

interface EmployeeViewDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

const EmployeeViewDialog: React.FC<EmployeeViewDialogProps> = ({
  employee,
  open,
  onOpenChange,
  onEdit
}) => {
  // Get employees and departments data to find manager details and department name
  const { employees, departments } = useEmployeeData();
  
  if (!employee) return null;
  
  // Find manager information if managerId exists
  const managerInfo = employee.managerId 
    ? employees.find(emp => emp.id === employee.managerId)
    : null;
    
  // Display manager name if found, otherwise show default message
  const managerDisplay = managerInfo 
    ? `${managerInfo.firstName} ${managerInfo.lastName}`
    : employee.manager || "Aucun manager";
    
  // Get formatted department name
  const departmentDisplay = getDepartmentName(
    employee.department || employee.departmentId, 
    departments
  );

  // Prepare employee with all needed data for tabs
  const enhancedEmployee = {
    ...employee,
    departmentName: departmentDisplay,
    managerName: managerDisplay,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="font-bold">
              {employee.firstName} {employee.lastName}
            </span>
          </DialogTitle>
          <DialogDescription>
            {employee.position || "Poste non spécifié"} - {departmentDisplay}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="informations" className="mt-4">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="compétences">Compétences</TabsTrigger>
            <TabsTrigger value="horaires">Horaires</TabsTrigger>
            <TabsTrigger value="congés">Congés</TabsTrigger>
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informations">
            <InformationsTab employee={enhancedEmployee} />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsTab employee={enhancedEmployee} />
          </TabsContent>
          
          <TabsContent value="compétences">
            <CompetencesTab employee={enhancedEmployee} />
          </TabsContent>
          
          <TabsContent value="horaires">
            <HorairesTab employee={enhancedEmployee} />
          </TabsContent>
          
          <TabsContent value="congés">
            <CongesTab employee={enhancedEmployee} />
          </TabsContent>
          
          <TabsContent value="evaluations">
            <EvaluationsTab employee={enhancedEmployee} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button onClick={onEdit}>
            Modifier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeViewDialog;
