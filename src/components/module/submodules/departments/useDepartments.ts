
import { useState, useCallback, useEffect } from 'react';
import { Department } from './types';
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

  // Utiliser le hook d'opérations pour gérer les opérations CRUD
  const {
    handleSaveDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments
  } = useDepartmentOperations();

  // Log pour voir les départements disponibles
  useEffect(() => {
    console.log("Departments in useDepartments:", departments?.length || 0);
  }, [departments]);

  // Ouvrir le formulaire d'ajout
  const handleAddDepartment = useCallback(() => {
    resetForm();
    setIsAddDialogOpen(true);
  }, [resetForm]);

  // Ouvrir le formulaire de modification
  const handleEditDepartment = useCallback((department: Department) => {
    initFormWithDepartment(department);
    setCurrentDepartment(department);
    setIsEditDialogOpen(true);
  }, [initFormWithDepartment]);

  // Ouvrir le gestionnaire d'employés
  const handleManageEmployees = useCallback((department: Department) => {
    setCurrentDepartment(department);
    setSelectedEmployees(department.employeeIds || []);
    setIsManageEmployeesDialogOpen(true);
  }, [setSelectedEmployees]);

  // Enregistrer un nouveau département
  const handleSaveDepartmentWrapper = useCallback(async () => {
    const success = await handleSaveDepartment(formData, selectedEmployees);
    if (success) {
      setIsAddDialogOpen(false);
      resetForm();
      // S'assurer d'avoir la fonction refetch
      if (typeof refetchDepartments === 'function') {
        refetchDepartments();
      }
    }
  }, [formData, selectedEmployees, handleSaveDepartment, resetForm, refetchDepartments]);

  // Mettre à jour un département
  const handleUpdateDepartmentWrapper = useCallback(async () => {
    const success = await handleUpdateDepartment(formData, selectedEmployees, currentDepartment);
    if (success) {
      setIsEditDialogOpen(false);
      resetForm();
      setCurrentDepartment(null);
      // S'assurer d'avoir la fonction refetch
      if (typeof refetchDepartments === 'function') {
        refetchDepartments();
      }
    }
  }, [formData, selectedEmployees, currentDepartment, handleUpdateDepartment, resetForm, refetchDepartments]);

  // Enregistrer les assignations d'employés
  const handleSaveEmployeeAssignmentsWrapper = useCallback(async () => {
    const success = await handleSaveEmployeeAssignments(currentDepartment, selectedEmployees);
    if (success) {
      setIsManageEmployeesDialogOpen(false);
      setCurrentDepartment(null);
      setSelectedEmployees([]);
      // S'assurer d'avoir la fonction refetch
      if (typeof refetchDepartments === 'function') {
        refetchDepartments();
      }
    }
  }, [currentDepartment, selectedEmployees, handleSaveEmployeeAssignments, setSelectedEmployees, refetchDepartments]);

  // Supprimer un département
  const handleDeleteDepartmentWrapper = useCallback(async (id: string, name: string) => {
    const success = await handleDeleteDepartment(id, name);
    if (success && typeof refetchDepartments === 'function') {
      refetchDepartments();
    }
  }, [handleDeleteDepartment, refetchDepartments]);

  // Obtenir les employés d'un département
  const getDepartmentEmployees = useCallback((departmentId: string) => {
    if (!departmentId || !Array.isArray(employees)) {
      return [];
    }
    
    // Trouver le département
    const department = departments.find(d => d.id === departmentId);
    if (!department) {
      return [];
    }
    
    // Obtenir les IDs des employés du département
    const employeeIds = department.employeeIds || [];
    
    // Trouver les employés correspondants
    return employees.filter(employee => employeeIds.includes(employee.id));
  }, [employees, departments]);

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
    handleSaveDepartment: handleSaveDepartmentWrapper,
    handleUpdateDepartment: handleUpdateDepartmentWrapper,
    handleDeleteDepartment: handleDeleteDepartmentWrapper,
    handleSaveEmployeeAssignments: handleSaveEmployeeAssignmentsWrapper,
    getDepartmentEmployees
  };
};
