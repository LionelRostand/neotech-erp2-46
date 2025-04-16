
import { useState, useEffect, useCallback } from 'react';
import { useDepartmentForm } from './hooks/useDepartmentForm';
import { useDepartmentOperations } from './hooks/useDepartmentOperations';
import { Department } from './types';
import { useDepartmentService } from './services/departmentService';
import { useEmployeeData } from '@/hooks/useEmployeeData';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  
  const departmentService = useDepartmentService();
  const { employees } = useEmployeeData();
  
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
    validateForm,
    setSelectedEmployees
  } = useDepartmentForm(departments);
  
  const {
    handleSaveDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments
  } = useDepartmentOperations();
  
  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const fetchedDepartments = await departmentService.getAll();
        setDepartments(fetchedDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
  }, [departmentService]);
  
  // Get employees for a department
  const getDepartmentEmployees = useCallback((departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (!department) return [];
    
    return employees.filter(emp => department.employeeIds.includes(emp.id));
  }, [departments, employees]);
  
  // Show add department dialog
  const handleAddDepartment = useCallback(() => {
    resetForm(departments);
    setIsAddDialogOpen(true);
  }, [departments, resetForm]);
  
  // Show edit department dialog
  const handleEditDepartment = useCallback((department: Department) => {
    setCurrentDepartment(department);
    initFormWithDepartment(department);
    setSelectedEmployees(department.employeeIds || []);
    setIsEditDialogOpen(true);
  }, [initFormWithDepartment, setSelectedEmployees]);
  
  // Show manage employees dialog
  const handleManageEmployees = useCallback((department: Department) => {
    setCurrentDepartment(department);
    setSelectedEmployees(department.employeeIds || []);
    setIsManageEmployeesDialogOpen(true);
  }, [setSelectedEmployees]);
  
  // Save new department
  const handleSaveNewDepartment = useCallback(async () => {
    if (!validateForm()) return;
    
    const success = await handleSaveDepartment(formData, selectedEmployees);
    
    if (success) {
      setIsAddDialogOpen(false);
      
      // Refresh departments list
      const updatedDepartments = await departmentService.getAll();
      setDepartments(updatedDepartments);
    }
  }, [formData, selectedEmployees, validateForm, handleSaveDepartment, departmentService]);
  
  // Update department
  const handleUpdateExistingDepartment = useCallback(async () => {
    if (!validateForm()) return;
    
    const success = await handleUpdateDepartment(formData, selectedEmployees, currentDepartment);
    
    if (success) {
      setIsEditDialogOpen(false);
      
      // Refresh departments list
      const updatedDepartments = await departmentService.getAll();
      setDepartments(updatedDepartments);
    }
  }, [formData, selectedEmployees, currentDepartment, validateForm, handleUpdateDepartment, departmentService]);
  
  // Save employee assignments
  const handleSaveEmployees = useCallback(async () => {
    if (!currentDepartment) return;
    
    const success = await handleSaveEmployeeAssignments(currentDepartment, selectedEmployees);
    
    if (success) {
      setIsManageEmployeesDialogOpen(false);
      
      // Refresh departments list
      const updatedDepartments = await departmentService.getAll();
      setDepartments(updatedDepartments);
    }
  }, [currentDepartment, selectedEmployees, handleSaveEmployeeAssignments, departmentService]);
  
  // Delete department
  const handleDeleteDept = useCallback(async (id: string, name: string) => {
    const success = await handleDeleteDepartment(id, name);
    
    if (success) {
      // Refresh departments list
      const updatedDepartments = await departmentService.getAll();
      setDepartments(updatedDepartments);
    }
  }, [handleDeleteDepartment, departmentService]);
  
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
    handleSaveDepartment: handleSaveNewDepartment,
    handleUpdateDepartment: handleUpdateExistingDepartment,
    handleDeleteDepartment: handleDeleteDept,
    handleSaveEmployeeAssignments: handleSaveEmployees,
    getDepartmentEmployees
  };
};
