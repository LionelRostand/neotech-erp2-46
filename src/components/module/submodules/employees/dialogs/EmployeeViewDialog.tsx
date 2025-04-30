
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import EmployeeStatusBadge from '../EmployeeStatusBadge';

// Import tabs
import InformationsTab from '../tabs/InformationsTab';
import DocumentsTab from '../tabs/DocumentsTab';
import CompetencesTab from '../tabs/CompetencesTab';
import HorairesTab from '../tabs/HorairesTab';
import CongesTab from '../tabs/CongesTab';
import EvaluationsTab from '../tabs/EvaluationsTab';
import PresencesTab from '../tabs/PresencesTab';

interface EmployeeViewDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
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
  
  // Get company name
  const companyName = typeof employee.company === 'object' && employee.company?.name 
    ? employee.company.name 
    : typeof employee.company === 'string' ? employee.company : "Entreprise non spécifiée";

  // Prepare employee with all needed data for tabs
  const enhancedEmployee = {
    ...employee,
    departmentName: departmentDisplay,
    managerName: managerDisplay,
    companyName: companyName
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border">
              {employee.photoURL || employee.photo ? (
                <AvatarImage 
                  src={employee.photoURL || employee.photo} 
                  alt={`${employee.firstName} ${employee.lastName}`} 
                />
              ) : (
                <AvatarFallback>
                  {employee.firstName?.[0]}{employee.lastName?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                {employee.firstName} {employee.lastName}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {employee.position || "Poste non spécifié"} • {companyName}
              </DialogDescription>
              <div className="mt-2">
                <EmployeeStatusBadge status={employee.status || 'active'} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="informations" className="mt-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="presences">Présences</TabsTrigger>
            <TabsTrigger value="conges">Congés</TabsTrigger>
            <TabsTrigger value="competences">Compétences</TabsTrigger>
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informations">
            <InformationsTab employee={enhancedEmployee} />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsTab employee={enhancedEmployee} />
          </TabsContent>
          
          <TabsContent value="presences">
            <PresencesTab employee={enhancedEmployee} />
          </TabsContent>
          
          <TabsContent value="conges">
            <CongesTab employee={enhancedEmployee} />
          </TabsContent>
          
          <TabsContent value="competences">
            <CompetencesTab employee={enhancedEmployee} />
          </TabsContent>
          
          <TabsContent value="evaluations">
            <EvaluationsTab employee={enhancedEmployee} />
          </TabsContent>
        </Tabs>

        {onEdit && (
          <div className="flex justify-end mt-4">
            <Button onClick={onEdit}>
              Modifier
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeViewDialog;
