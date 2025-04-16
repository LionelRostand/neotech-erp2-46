
import { useEffect, useMemo } from 'react';
import { Department } from './types';
import { getDepartmentEmployees, notifyDepartmentUpdates } from './utils/departmentUtils';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { useDepartmentForm } from './hooks/useDepartmentForm';
import { useDepartmentDialogs } from './hooks/useDepartmentDialogs';
import { useDepartmentOperations } from './hooks/useDepartmentOperations';
import { useEmployeeData } from '@/hooks/useEmployeeData';

export const useDepartments = () => {
  // Fetch departments directly from Firestore
  const { departments: fetchedDepartments = [], isLoading: loading, error, refetch } = useFirebaseDepartments();
  
  // Get all available employees
  const { employees: allEmployees } = useEmployeeData();
  
  // Enrich departments with manager names if missing
  const departments = useMemo(() => {
    if (!fetchedDepartments || !allEmployees || allEmployees.length === 0) {
      return fetchedDepartments;
    }
    
    return fetchedDepartments.map(department => {
      // If managerName is already set and not null, keep it
      if (department.managerName) {
        return department;
      }
      
      // If managerId is set, find the manager and set the name
      if (department.managerId) {
        const manager = allEmployees.find(emp => emp.id === department.managerId);
        if (manager) {
          return {
            ...department,
            managerName: `${manager.firstName} ${manager.lastName}`
          };
        }
      }
      
      return department;
    });
  }, [fetchedDepartments, allEmployees]);
  
  // Custom hooks for form, dialogs, and operations
  const form = useDepartmentForm(departments);
  const dialogs = useDepartmentDialogs();
  const operations = useDepartmentOperations();
  
  // Reset form when departments change - but only once on initial load
  useEffect(() => {
    // Only reset form on initial load or when departments array changes length
    if (departments && departments.length > 0) {
      form.resetForm(departments);
    }
  }, []);
  
  // Notify other components when departments are updated
  useEffect(() => {
    if (departments && departments.length > 0) {
      notifyDepartmentUpdates(departments);
    }
  }, [departments]);
  
  // Handle operations with dialog state updates
  const handleAddDepartment = () => {
    form.resetForm(departments);
    dialogs.handleAddDepartment();
  };
  
  const handleEditDepartment = (department: Department) => {
    form.initFormWithDepartment(department);
    dialogs.handleEditDepartment(department);
  };
  
  const handleViewDepartment = (department: Department) => {
    dialogs.setCurrentDepartment(department);
    dialogs.setIsViewDialogOpen(true);
  };
  
  const handleManageEmployees = (department: Department) => {
    form.setSelectedEmployees(department.employeeIds || []);
    dialogs.handleManageEmployees(department);
  };
  
  const handleSaveDepartment = async () => {
    const success = await operations.handleSaveDepartment(
      form.formData, 
      form.selectedEmployees
    );
    if (success) {
      dialogs.setIsAddDialogOpen(false);
      refetch();
    }
  };
  
  const handleUpdateDepartment = async () => {
    const success = await operations.handleUpdateDepartment(
      form.formData, 
      form.selectedEmployees, 
      dialogs.currentDepartment
    );
    if (success) {
      dialogs.setIsEditDialogOpen(false);
      refetch();
    }
  };
  
  const handleDeleteDepartment = async (id: string, name: string) => {
    const success = await operations.handleDeleteDepartment(id, name);
    if (success) {
      refetch();
    }
  };
  
  const handleSaveEmployeeAssignments = async () => {
    const success = await operations.handleSaveEmployeeAssignments(
      dialogs.currentDepartment, 
      form.selectedEmployees
    );
    if (success) {
      dialogs.setIsManageEmployeesDialogOpen(false);
      refetch();
    }
  };
  
  return {
    // Data
    departments,
    loading,
    error,
    allEmployees,
    
    // Form state
    formData: form.formData,
    activeTab: form.activeTab,
    selectedEmployees: form.selectedEmployees,
    
    // Dialog state
    isAddDialogOpen: dialogs.isAddDialogOpen,
    isEditDialogOpen: dialogs.isEditDialogOpen,
    isManageEmployeesDialogOpen: dialogs.isManageEmployeesDialogOpen,
    isViewDialogOpen: dialogs.isViewDialogOpen,
    currentDepartment: dialogs.currentDepartment,
    
    // Dialog operations
    setIsAddDialogOpen: dialogs.setIsAddDialogOpen,
    setIsEditDialogOpen: dialogs.setIsEditDialogOpen,
    setIsManageEmployeesDialogOpen: dialogs.setIsManageEmployeesDialogOpen,
    setIsViewDialogOpen: dialogs.setIsViewDialogOpen,
    
    // Form operations
    setActiveTab: form.setActiveTab,
    handleInputChange: form.handleInputChange,
    handleManagerChange: form.handleManagerChange,
    handleColorChange: form.handleColorChange,
    handleEmployeeSelection: form.handleEmployeeSelection,
    
    // Operations
    handleAddDepartment,
    handleEditDepartment,
    handleViewDepartment,
    handleManageEmployees,
    handleSaveDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments,
    getDepartmentEmployees
  };
};

export default useDepartments;
