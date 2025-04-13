
import { useState, useCallback } from 'react';
import { Department } from '../types';

export const useDepartmentDialogs = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  
  const handleAddDepartment = useCallback(() => {
    setIsAddDialogOpen(true);
  }, []);
  
  const handleEditDepartment = useCallback((department: Department) => {
    setCurrentDepartment(department);
    setIsEditDialogOpen(true);
  }, []);
  
  const handleManageEmployees = useCallback((department: Department) => {
    setCurrentDepartment(department);
    setIsManageEmployeesDialogOpen(true);
  }, []);
  
  return {
    isAddDialogOpen,
    isEditDialogOpen,
    isManageEmployeesDialogOpen,
    currentDepartment,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsManageEmployeesDialogOpen,
    handleAddDepartment,
    handleEditDepartment,
    handleManageEmployees
  };
};
