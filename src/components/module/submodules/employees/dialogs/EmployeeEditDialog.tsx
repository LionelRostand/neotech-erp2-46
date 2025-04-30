
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
import EmployeeForm from '../EmployeeForm';

interface EmployeeEditDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EmployeeEditDialog: React.FC<EmployeeEditDialogProps> = ({
  employee,
  open,
  onOpenChange,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateEmployee } = useEmployeeActions();

  const handleSubmit = async (data: any) => {
    if (!employee || !employee.id) {
      toast.error("ID d'employé manquant");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateEmployee({
        ...data,
        id: employee.id,
      });

      toast.success("Employé mis à jour avec succès");
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ne rien rendre si l'employé est null
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Modifier l'employé: {employee.firstName} {employee.lastName}
          </DialogTitle>
        </DialogHeader>
        
        <EmployeeForm 
          defaultValues={employee}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEditDialog;
