
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
  // Get employees data to find manager details
  const { employees } = useEmployeeData();
  
  if (!employee) return null;
  
  // Find manager information if managerId exists
  const managerInfo = employee.managerId 
    ? employees.find(emp => emp.id === employee.managerId)
    : null;
    
  // Display manager name if found, otherwise show default message
  const managerDisplay = managerInfo 
    ? `${managerInfo.firstName} ${managerInfo.lastName}`
    : employee.manager || "Aucun manager";

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
            {employee.position || "Poste non spécifié"} - {employee.department || "Département non spécifié"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="informations" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="emploi">Emploi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">ID</h3>
                <p className="text-sm font-mono">{employee.id?.substring(0, 10)}...</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date d'embauche</h3>
                <p>{employee.hireDate || "Non spécifié"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date de naissance</h3>
                <p>{employee.birthDate || "Non spécifié"}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Statut</h3>
              <p className="mt-1 capitalize">{employee.status || "Actif"}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{employee.email || "Non spécifié"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                <p>{employee.phone || "Non spécifié"}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
              <p className="mt-1">
                {typeof employee.address === 'string' 
                  ? employee.address || "Non spécifiée"
                  : employee.address
                    ? `${employee.address.street || ""}, ${employee.address.city || ""}, ${employee.address.postalCode || ""}`
                    : "Non spécifiée"}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="emploi" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Position</h3>
                <p>{employee.position || "Non spécifié"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Département</h3>
                <p>{employee.department || "Non spécifié"}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Manager</h3>
              <p className="mt-1">{managerDisplay}</p>
            </div>
            {employee.skills && employee.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Compétences</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {employee.skills.map((skill, index) => (
                    <div key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {typeof skill === 'string' ? skill : skill.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
