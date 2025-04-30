
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

  // Department operations - Import the service functions
  const {
    handleSaveDepartment: saveDepartmentService,
    handleUpdateDepartment: updateDepartmentService,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments: saveEmployeeAssignmentsService
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

  // Save new department - wrapper function for service
  const handleSaveDepartment = useCallback(async () => {
    const success = await saveDepartmentService(formData, selectedEmployees);
    if (success) {
      setIsAddDialogOpen(false);
      resetForm();
      refetch();
    }
  }, [formData, selectedEmployees, saveDepartmentService, setIsAddDialogOpen, resetForm, refetch]);

  // Update department - wrapper function for service
  const handleUpdateDepartment = useCallback(async () => {
    if (!currentDepartment) return;
    const success = await updateDepartmentService(formData, selectedEmployees, currentDepartment);
    if (success) {
      setIsEditDialogOpen(false);
      refetch();
    }
  }, [currentDepartment, formData, selectedEmployees, updateDepartmentService, setIsEditDialogOpen, refetch]);

  // Save employee assignments - wrapper function for service
  const handleSaveEmployeeAssignments = useCallback(async () => {
    if (!currentDepartment) return;
    const success = await saveEmployeeAssignmentsService(currentDepartment, selectedEmployees);
    if (success) {
      setIsManageEmployeesDialogOpen(false);
      refetch();
    }
  }, [currentDepartment, selectedEmployees, saveEmployeeAssignmentsService, setIsManageEmployeesDialogOpen, refetch]);

  // Get department employees
  const getDepartmentEmployees = useCallback((departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (!department || !department.employeeIds) return [];
    
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
