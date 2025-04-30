
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
import { Employee } from '@/types/employee';
import { EmployeeFormValues } from './form/employeeFormSchema';
import { formValuesToEmployee } from './utils/formAdapter';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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

  const handleSubmit = async (data: EmployeeFormValues) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    try {
      const employeeData = formValuesToEmployee(data);
      
      // Remove the id field if it's undefined to avoid Firestore errors
      if (employeeData.id === undefined) {
        delete employeeData.id;
      }
      
      // Make sure all arrays are properly initialized to avoid "length" errors
      if (!employeeData.skills || !Array.isArray(employeeData.skills)) {
        employeeData.skills = [];
      }
      
      if (!employeeData.documents || !Array.isArray(employeeData.documents)) {
        employeeData.documents = [];
      }
      
      if (!employeeData.evaluations || !Array.isArray(employeeData.evaluations)) {
        employeeData.evaluations = [];
      }
      
      if (!employeeData.absences || !Array.isArray(employeeData.absences)) {
        employeeData.absences = [];
      }

      // Ensure company field is properly set
      if (employeeData.company === 'no_company') {
        employeeData.company = '';
      }

      // Ensure department field is properly set
      if (employeeData.department === 'no_department') {
        employeeData.department = '';
      }
      
      // Direct Firestore operation without using a listener service
      const docRef = await addDoc(collection(db, COLLECTIONS.HR.EMPLOYEES), employeeData);
      
      const newEmployee = {
        id: docRef.id,
        ...employeeData
      } as Employee;
      
      toast.success(`L'employé ${data.firstName} ${data.lastName} a été créé avec succès`);
      onCreated(newEmployee);
      onOpenChange(false);
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
