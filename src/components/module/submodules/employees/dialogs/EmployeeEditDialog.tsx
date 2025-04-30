
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Employee } from '@/types/employee';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { toast } from 'sonner';
import InformationsTabEdit from '../tabs/InformationsTabEdit';

interface EmployeeEditDialogProps {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployeeEditDialog: React.FC<EmployeeEditDialogProps> = ({
  employee,
  open,
  onOpenChange
}) => {
  const { updateEmployee } = useEmployeeActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSave = async (data: Partial<Employee>) => {
    if (!employee.id) {
      toast.error("ID d'employé manquant");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateEmployee({
        id: employee.id,
        ...data
      });
      
      onOpenChange(false);
      toast.success("Employé mis à jour avec succès");
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Erreur lors de la mise à jour de l'employé");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'employé</DialogTitle>
        </DialogHeader>
        
        <InformationsTabEdit 
          employee={employee} 
          onSave={handleSave} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEditDialog;
