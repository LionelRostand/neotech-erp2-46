
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Employee } from '@/types/employee';
import EmployeeForm from './EmployeeForm';

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (employee: Partial<Employee>) => void;
}

const CreateEmployeeDialog: React.FC<CreateEmployeeDialogProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const handleSubmit = (employee: Partial<Employee>) => {
    onSubmit(employee);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvel Employé</DialogTitle>
        </DialogHeader>
        
        <EmployeeForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
