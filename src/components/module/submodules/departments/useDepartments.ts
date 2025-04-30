
import { useState, useEffect, useCallback } from 'react';
import { Department } from './types';
import { useDepartmentForm } from './hooks/useDepartmentForm';
import { useDepartmentOperations } from './hooks/useDepartmentOperations';
import { useDepartmentDialogs } from './hooks/useDepartmentDialogs';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';

export const useDepartments = () => {
  const { employees, isLoading: isLoadingEmployees } = useEmployeeData();
  const { departments: fetchedDepartments, isLoading: isLoadingDepartments, refetch } = useFirebaseDepartments();

  const [departments, setDepartments] = useState<Department[]>(fetchedDepartments || []);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // State for dialogs
  const {
    isAddDialogOpen,
    isEditDialogOpen,
    isManageEmployeesDialogOpen,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsManageEmployeesDialogOpen,
  } = useDepartmentDialogs();

  // Form state
  const {
    formData,
    activeTab,
    selectedEmployees,
    resetForm,
    initFormWithDepartment,
    setActiveTab,
    handleInputChange,
    handleManagerChange,
    handleCompanyChange,
    handleColorChange,
    handleEmployeeSelection,
    setSelectedEmployees
  } = useDepartmentForm(departments);

  // Department operations
  const {
    handleSaveDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments
  } = useDepartmentOperations();

  // Effect to update departments when fetched data changes
  useEffect(() => {
    if (fetchedDepartments) {
      setDepartments(fetchedDepartments);
    }
    setLoading(isLoadingDepartments || isLoadingEmployees);
  }, [fetchedDepartments, isLoadingDepartments, isLoadingEmployees]);

  // Handle add department dialog
  const handleAddDepartment = useCallback(() => {
    resetForm();
    setIsAddDialogOpen(true);
  }, [resetForm, setIsAddDialogOpen]);

  // Handle edit department dialog
  const handleEditDepartment = useCallback((department: Department) => {
    setCurrentDepartment(department);
    initFormWithDepartment(department);
    setIsEditDialogOpen(true);
  }, [initFormWithDepartment, setIsEditDialogOpen]);

  // Handle manage employees dialog
  const handleManageEmployees = useCallback((department: Department) => {
    setCurrentDepartment(department);
    setSelectedEmployees(department.employeeIds || []);
    setIsManageEmployeesDialogOpen(true);
  }, [setIsManageEmployeesDialogOpen, setSelectedEmployees]);

  // Save new department
  const handleSaveDepartment = useCallback(async () => {
    const success = await handleSaveDepartment(formData, selectedEmployees);
    if (success) {
      setIsAddDialogOpen(false);
      resetForm();
      refetch();
    }
  }, [formData, selectedEmployees, handleSaveDepartment, setIsAddDialogOpen, resetForm, refetch]);

  // Update department
  const handleUpdateDepartment = useCallback(async () => {
    if (!currentDepartment) return;
    const success = await handleUpdateDepartment(formData, selectedEmployees, currentDepartment);
    if (success) {
      setIsEditDialogOpen(false);
      refetch();
    }
  }, [currentDepartment, formData, selectedEmployees, handleUpdateDepartment, setIsEditDialogOpen, refetch]);

  // Save employee assignments
  const handleSaveEmployeeAssignments = useCallback(async () => {
    if (!currentDepartment) return;
    const success = await handleSaveEmployeeAssignments(currentDepartment, selectedEmployees);
    if (success) {
      setIsManageEmployeesDialogOpen(false);
      refetch();
    }
  }, [currentDepartment, selectedEmployees, handleSaveEmployeeAssignments, setIsManageEmployeesDialogOpen, refetch]);

  // Get department employees
  const getDepartmentEmployees = useCallback((departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (!department || !department.employeeIds) return [];
    
    return employees.filter(employee => 
      department.employeeIds.includes(employee.id)
    );
  }, [departments, employees]);

  return {
    departments,
    loading,
    isAddDialogOpen,
    isEditDialogOpen,
    isManageEmployeesDialogOpen,
    formData,
    currentDepartment,
    activeTab,
    selectedEmployees,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsManageEmployeesDialogOpen,
    setActiveTab,
    handleInputChange,
    handleManagerChange,
    handleCompanyChange,
    handleColorChange,
    handleAddDepartment,
    handleEditDepartment,
    handleManageEmployees,
    handleEmployeeSelection,
    handleSaveDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments,
    getDepartmentEmployees
  };
};
