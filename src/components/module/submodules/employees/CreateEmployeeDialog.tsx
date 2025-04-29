
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmployeeForm from './EmployeeForm';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { Employee } from '@/types/employee';
import { EmployeeFormValues } from './form/employeeFormSchema';
import { formValuesToEmployee } from './utils/formAdapter';
import { toast } from 'sonner';

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (employee: Employee) => void;
}

const CreateEmployeeDialog: React.FC<CreateEmployeeDialogProps> = ({
  open,
  onOpenChange,
  onCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createEmployee } = useEmployeeActions();

  const handleSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Form data submitted:", data);
      
      // Convert form values to employee data
      const employeeData = formValuesToEmployee(data);
      
      // Create the new employee
      const newEmployee = await createEmployee(employeeData);
      
      if (newEmployee) {
        toast.success(`L'employé ${data.firstName} ${data.lastName} a été créé avec succès`);
        onCreated(newEmployee);
        onOpenChange(false);
      } else {
        throw new Error("Failed to create employee");
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error(`Erreur lors de la création de l'employé: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel employé</DialogTitle>
          <DialogDescription>
            Complétez les informations de l'employé ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-y-auto pr-4">
          <EmployeeForm
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
