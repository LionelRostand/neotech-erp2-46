
import { useEffect, useMemo } from 'react';
import { Department } from './types';
import { getDepartmentEmployees, notifyDepartmentUpdates } from './utils/departmentUtils';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { useDepartmentForm } from './hooks/useDepartmentForm';
import { useDepartmentDialogs } from './hooks/useDepartmentDialogs';
import { useDepartmentOperations } from './hooks/useDepartmentOperations';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';

export const useDepartments = () => {
  // Fetch departments directly from Firestore
  const { departments: fetchedDepartments = [], isLoading: loading, error, refetch } = useFirebaseDepartments();
  
  // Get all available employees and companies
  const { employees: allEmployees } = useEmployeeData();
  const { companies } = useFirebaseCompanies();
  
  // Enrich departments with manager names and company names if missing
  const departments = useMemo(() => {
    if (!fetchedDepartments || !allEmployees || allEmployees.length === 0) {
      return fetchedDepartments;
    }
    
    return fetchedDepartments.map(department => {
      // Enrichissement avec le nom du manager
      let enrichedDepartment = { ...department };
      
      // Si managerName est déjà défini, le garder
      if (!department.managerName && department.managerId) {
        const manager = allEmployees.find(emp => emp.id === department.managerId);
        if (manager) {
          enrichedDepartment.managerName = `${manager.firstName} ${manager.lastName}`;
        }
      }
      
      // Enrichissement avec le nom de l'entreprise
      if (!department.companyName && department.companyId && companies) {
        const company = companies.find(comp => comp.id === department.companyId);
        if (company) {
          enrichedDepartment.companyName = company.name;
        }
      }
      
      return enrichedDepartment;
    });
  }, [fetchedDepartments, allEmployees, companies]);
  
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
