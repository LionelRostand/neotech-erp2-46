
import { useState, useCallback, useEffect } from 'react';
import { Department, DepartmentFormData } from './types';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { useDepartmentForm } from './hooks/useDepartmentForm';
import { useDepartmentOperations } from './hooks/useDepartmentOperations';

export const useDepartments = (propDepartments?: any[], propEmployees?: any[]) => {
  // État local pour les dialogues
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);

  // Récupérer les départements et les employés
  const { departments: fetchedDepartments, isLoading: loading, refetch: refetchDepartments } = useFirebaseDepartments();
  const { employees: fetchedEmployees } = useEmployeeData();
  
  // Utiliser les props si fournis, sinon utiliser les données récupérées
  const departments = propDepartments || fetchedDepartments || [];
  const employees = propEmployees || fetchedEmployees || [];

  // Utiliser le hook de formulaire pour gérer l'état du formulaire
  const {
    formData,
    activeTab,
    selectedEmployees,
    setSelectedEmployees,
    setFormData,
    setActiveTab,
    handleInputChange,
    handleManagerChange,
    handleCompanyChange,
    handleColorChange,
    resetForm
  } = useDepartmentForm();

  // Utiliser le hook d'opérations pour gérer les opérations CRUD
  const {
    handleSaveDepartment,
    handleUpdateDepartment,
    handleSaveEmployeeAssignments,
    handleDeleteDepartment,
    getDepartmentEmployees
  } = useDepartmentOperations();

  // Log pour voir les départements disponibles
  useEffect(() => {
    console.log("Departments in useDepartments:", departments?.length || 0);
    console.log("Employees in useDepartments:", employees?.length || 0);
  }, [departments, employees]);

  // Ouvrir le formulaire d'ajout
  const handleAddDepartment = useCallback(() => {
    resetForm();
    setIsAddDialogOpen(true);
  }, [resetForm]);

  // Ouvrir le formulaire d'édition
  const handleEditDepartment = useCallback((department: Department) => {
    if (!department) return;
    
    // Create a form data object from department
    const editFormData: DepartmentFormData = {
      id: department.id,
      name: department.name || '',
      description: department.description || '',
      managerId: department.managerId || '',
      companyId: department.companyId || '',
      color: department.color || '#3b82f6',
      employeeIds: department.employeeIds || []
    };
    
    // Set the form data
    setFormData(editFormData);
    
    // Récupérer les employés du département
    const deptEmployees = getDepartmentEmployees(department.id);
    setSelectedEmployees(deptEmployees);
    
    // Ouvrir le dialogue
    setActiveTab('informations');
    setCurrentDepartment(department);
    setIsEditDialogOpen(true);
  }, [setFormData, setSelectedEmployees, setActiveTab, getDepartmentEmployees]);

  // Ouvrir le dialogue de gestion des employés
  const handleManageEmployees = useCallback((department: Department) => {
    setCurrentDepartment(department);
    const deptEmployees = getDepartmentEmployees(department.id);
    setSelectedEmployees(deptEmployees);
    setIsManageEmployeesDialogOpen(true);
  }, [getDepartmentEmployees, setSelectedEmployees]);

  // Gérer la sélection des employés
  const handleEmployeeSelection = useCallback((employeeId: string, isSelected: boolean) => {
    setSelectedEmployees(prev => {
      if (isSelected) {
        return [...prev, employeeId];
      } else {
        return prev.filter(id => id !== employeeId);
      }
    });
  }, [setSelectedEmployees]);

  return {
    departments,
    employees,
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
