
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Employee } from '@/types/employee';
import EmployeeForm from '../EmployeeForm';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { toast } from 'sonner';

interface EmployeeEditDialogProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (updatedEmployee: Partial<Employee>) => Promise<void>;
}

const EmployeeEditDialog: React.FC<EmployeeEditDialogProps> = ({
  employee,
  open,
  onOpenChange,
  onSubmit
}) => {
  const { updateEmployee, isUpdating } = useEmployeeActions();
  
  const handleSubmit = async (data: Partial<Employee>) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await updateEmployee({
          ...data,
          id: employee.id
        });
      }
      onOpenChange(false);
      toast.success("Employé mis à jour avec succès");
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Erreur lors de la mise à jour de l'employé");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'employé</DialogTitle>
        </DialogHeader>
        
        <EmployeeForm 
          defaultValues={employee}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEditDialog;
