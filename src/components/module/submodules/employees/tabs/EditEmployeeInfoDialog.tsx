
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import EditEmployeeInfoForm from './EditEmployeeInfoForm';
import { Employee } from '@/types/employee';

interface EditEmployeeInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onSuccess: () => void;
}

const EditEmployeeInfoDialog: React.FC<EditEmployeeInfoDialogProps> = ({ 
  isOpen, 
  onClose, 
  employee,
  onSuccess
}) => {
  // Ensure we have a valid employee object
  if (!employee || !employee.id) {
    return null;
  }

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier les informations de {employee.firstName} {employee.lastName}</DialogTitle>
        </DialogHeader>
        
        <EditEmployeeInfoForm 
          employee={employee} 
          onSuccess={handleSuccess} 
          onCancel={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeInfoDialog;
