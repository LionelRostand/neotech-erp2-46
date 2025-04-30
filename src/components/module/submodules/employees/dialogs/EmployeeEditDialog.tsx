
import React, { useState, useEffect } from 'react';
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
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { getDepartmentName } from '../utils/departmentUtils';

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
  const { employees, departments } = useEmployeeData();

  // Prepare employee data with manager information
  const prepareEmployeeData = () => {
    if (!employee) return null;
    
    // Get department name
    const departmentName = getDepartmentName(
      employee.department || employee.departmentId,
      departments
    );
    
    // If employee has managerId, find the manager to include full name
    if (employee.managerId) {
      const managerInfo = employees.find(emp => emp.id === employee.managerId);
      if (managerInfo) {
        return {
          ...employee,
          department: employee.department || employee.departmentId, // Keep the department ID
          departmentName, // Add the properly formatted department name
          manager: `${managerInfo.firstName} ${managerInfo.lastName}`
        };
      }
    }
    
    return {
      ...employee,
      department: employee.department || employee.departmentId, // Keep the department ID
      departmentName // Add the properly formatted department name
    };
  };
  
  const preparedEmployee = prepareEmployeeData();

  const handleSubmit = async (data: Partial<Employee>) => {
    if (!employee || !employee.id) {
      toast.error("ID d'employé manquant");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateEmployee({
        ...data,
        id: employee.id
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

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Ne rien rendre si l'employé est null
  if (!preparedEmployee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Modifier l'employé: {preparedEmployee.firstName} {preparedEmployee.lastName}
          </DialogTitle>
        </DialogHeader>
        
        <EmployeeForm 
          defaultValues={preparedEmployee}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeEditDialog;
