
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Employee } from '@/types/employee';
import EmployeeProfileHeader from './EmployeeProfileHeader';
import InformationsTab from './tabs/InformationsTab';
import DocumentsTab from './tabs/DocumentsTab';
import CompetencesTab from './tabs/CompetencesTab';
import HorairesTab from './tabs/HorairesTab';
import CongesTab from './tabs/CongesTab';
import EvaluationsTab from './tabs/EvaluationsTab';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';

interface EmployeeViewDialogProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (employee: Partial<Employee>) => void;
}

const EmployeeViewDialog: React.FC<EmployeeViewDialogProps> = ({ 
  employee, 
  open, 
  onOpenChange,
  onUpdate 
}) => {
  const [activeTab, setActiveTab] = useState("informations");
  // Fetch departments to get department names
  const { departments } = useAvailableDepartments();
  
  // Prepare employee data with full department name
  const enhancedEmployee = React.useMemo(() => {
    // Find the department from departments list if it exists
    const employeeDepartment = departments?.find(dept => 
      dept.id === employee.department || 
      dept.id === employee.departmentId
    );
    
    return {
      ...employee,
      departmentName: employeeDepartment?.name || employee.department || 'Département non spécifié'
    };
  }, [employee, departments]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Fiche employé</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <EmployeeProfileHeader 
            employee={enhancedEmployee} 
            onEmployeeUpdate={onUpdate} 
          />
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeViewDialog;
