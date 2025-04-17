
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmployeeForm from './EmployeeForm';
import { EmployeeFormValues } from './form/employeeFormSchema';
import { toast } from 'sonner';
import { useAddEmployee } from '@/hooks/useAddEmployee';
import { Employee } from '@/types/employee';

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

const CreateEmployeeDialog: React.FC<CreateEmployeeDialogProps> = ({ 
  open, 
  onOpenChange,
  onCreated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addEmployee } = useAddEmployee();

  const handleSubmit = async (data: EmployeeFormValues) => {
    try {
      setIsSubmitting(true);

      // Convertir les données du formulaire en données d'employé
      const employeeData: Partial<Employee> = {
        ...data,
        // S'assurer que les champs spécifiques sont correctement définis
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addEmployee(employeeData);
      
      toast.success('Employé créé avec succès');
      onOpenChange(false);
      onCreated();
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      toast.error("Erreur lors de la création de l'employé");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvel employé</DialogTitle>
        </DialogHeader>
        
        <EmployeeForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
