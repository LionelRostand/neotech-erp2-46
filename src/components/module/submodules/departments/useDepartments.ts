
import { useEffect } from 'react';
import { Department } from './types';
import { getDepartmentEmployees, notifyDepartmentUpdates } from './utils/departmentUtils';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { useDepartmentForm } from './hooks/useDepartmentForm';
import { useDepartmentDialogs } from './hooks/useDepartmentDialogs';
import { useDepartmentOperations } from './hooks/useDepartmentOperations';
import { employees } from '@/data/employees';

export const useDepartments = () => {
  // Fetch departments directly from Firestore
  const { departments = [], isLoading: loading, error } = useFirebaseDepartments();
  
  // Get all available employees
  const allEmployees = employees;
  
  // Custom hooks for form, dialogs, and operations
  const form = useDepartmentForm(departments);
  const dialogs = useDepartmentDialogs();
  const operations = useDepartmentOperations();
  
  // Reset form when departments change - but only once on initial load
  // Added a check to prevent infinite loop
  useEffect(() => {
    // Only reset form on initial load or when departments array changes length
    if (departments && departments.length > 0) {
      form.resetForm(departments);
    }
  }, []);  // Removed departments dependency to prevent infinite updates
  
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
    }
  };
  
  const handleDeleteDepartment = async (id: string, name: string) => {
    await operations.handleDeleteDepartment(id, name);
  };
  
  const handleSaveEmployeeAssignments = async () => {
    const success = await operations.handleSaveEmployeeAssignments(
      dialogs.currentDepartment, 
      form.selectedEmployees
    );
    if (success) {
      dialogs.setIsManageEmployeesDialogOpen(false);
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
    currentDepartment: dialogs.currentDepartment,
    
    // Dialog operations
    setIsAddDialogOpen: dialogs.setIsAddDialogOpen,
    setIsEditDialogOpen: dialogs.setIsEditDialogOpen,
    setIsManageEmployeesDialogOpen: dialogs.setIsManageEmployeesDialogOpen,
    
    // Form operations
    setActiveTab: form.setActiveTab,
    handleInputChange: form.handleInputChange,
    handleManagerChange: form.handleManagerChange,
    handleColorChange: form.handleColorChange,
    handleEmployeeSelection: form.handleEmployeeSelection,
    
    // Operations
    handleAddDepartment,
    handleEditDepartment,
    handleManageEmployees,
    handleSaveDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments,
    getDepartmentEmployees
  };
};

export default useDepartments;
