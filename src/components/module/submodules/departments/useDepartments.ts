
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDepartmentForm } from './hooks/useDepartmentForm';
import { useDepartmentOperations } from './hooks/useDepartmentOperations';
import { Department } from './types';
import { useDepartmentService } from './services/departmentService';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  
  const departmentService = useDepartmentService();
  const { employees } = useEmployeeData();
  const { departments: firebaseDepartments, isLoading: isFirebaseLoading, error: firebaseError, refetch } = useFirebaseDepartments();
  
  // Use firebaseDepartments when available
  useEffect(() => {
    if (firebaseDepartments && firebaseDepartments.length > 0) {
      console.log("Setting departments from Firebase:", firebaseDepartments);
      setDepartments(firebaseDepartments);
      setLoading(isFirebaseLoading);
    }
  }, [firebaseDepartments, isFirebaseLoading]);
  
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
  
  // Get employees for a department
  const getDepartmentEmployees = useCallback((departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    if (!department || !department.employeeIds) return [];
    
    return employees.filter(emp => department.employeeIds?.includes(emp.id));
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
      refetch(); // Use direct refetch from Firebase hook
    }
  }, [formData, selectedEmployees, validateForm, handleSaveDepartment, refetch]);
  
  // Update department
  const handleUpdateExistingDepartment = useCallback(async () => {
    if (!validateForm()) return;
    
    const success = await handleUpdateDepartment(formData, selectedEmployees, currentDepartment);
    
    if (success) {
      setIsEditDialogOpen(false);
      refetch(); // Use direct refetch from Firebase hook
    }
  }, [formData, selectedEmployees, currentDepartment, validateForm, handleUpdateDepartment, refetch]);
  
  // Save employee assignments
  const handleSaveEmployees = useCallback(async () => {
    if (!currentDepartment) return;
    
    const success = await handleSaveEmployeeAssignments(currentDepartment, selectedEmployees);
    
    if (success) {
      setIsManageEmployeesDialogOpen(false);
      refetch(); // Use direct refetch from Firebase hook
    }
  }, [currentDepartment, selectedEmployees, handleSaveEmployeeAssignments, refetch]);
  
  // Delete department
  const handleDeleteDept = useCallback(async (id: string, name: string) => {
    const success = await handleDeleteDepartment(id, name);
    
    if (success) {
      refetch(); // Use direct refetch from Firebase hook
    }
  }, [handleDeleteDepartment, refetch]);
  
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
