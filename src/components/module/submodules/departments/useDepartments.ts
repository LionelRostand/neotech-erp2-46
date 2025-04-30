
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Department } from './types';
import { useDepartmentForm } from './hooks/useDepartmentForm';
import { useDepartmentOperations } from './hooks/useDepartmentOperations';
import { useDepartmentDialogs } from './hooks/useDepartmentDialogs';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';

export const useDepartments = () => {
  const { employees, isLoading: isLoadingEmployees } = useEmployeeData();
  const { departments: fetchedDepartments, isLoading: isLoadingDepartments, refetch } = useFirebaseDepartments();

  // Use useMemo to prevent unnecessary state updates and re-renders
  const departments = useMemo(() => fetchedDepartments || [], [fetchedDepartments]);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const loading = useMemo(() => isLoadingDepartments || isLoadingEmployees, [isLoadingDepartments, isLoadingEmployees]);

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

  // Department operations - rename imported functions to avoid name conflicts
  const {
    handleSaveDepartment: saveDepartmentOperation,
    handleUpdateDepartment: updateDepartmentOperation,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments: saveEmployeeAssignmentsOperation
  } = useDepartmentOperations();

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

  // Save new department - renamed to avoid conflict
  const handleSaveDepartment = useCallback(async () => {
    const success = await saveDepartmentOperation(formData, selectedEmployees);
    if (success) {
      setIsAddDialogOpen(false);
      resetForm();
      refetch();
    }
  }, [formData, selectedEmployees, saveDepartmentOperation, setIsAddDialogOpen, resetForm, refetch]);

  // Update department - renamed to avoid conflict
  const handleUpdateDepartment = useCallback(async () => {
    if (!currentDepartment) return;
    const success = await updateDepartmentOperation(formData, selectedEmployees, currentDepartment);
    if (success) {
      setIsEditDialogOpen(false);
      refetch();
    }
  }, [currentDepartment, formData, selectedEmployees, updateDepartmentOperation, setIsEditDialogOpen, refetch]);

  // Save employee assignments - renamed to avoid conflict
  const handleSaveEmployeeAssignments = useCallback(async () => {
    if (!currentDepartment) return;
    const success = await saveEmployeeAssignmentsOperation(currentDepartment, selectedEmployees);
    if (success) {
      setIsManageEmployeesDialogOpen(false);
      refetch();
    }
  }, [currentDepartment, selectedEmployees, saveEmployeeAssignmentsOperation, setIsManageEmployeesDialogOpen, refetch]);

  // Get department employees - memoized to prevent unnecessary recalculations
  const getDepartmentEmployees = useCallback((departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (!department || !department.employeeIds || !Array.isArray(department.employeeIds)) return [];
    
    return employees.filter(employee => 
      department.employeeIds && Array.isArray(department.employeeIds) && 
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
