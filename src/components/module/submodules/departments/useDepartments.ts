
import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Use a ref to prevent infinite re-renders
  const fetchingRef = useRef(false);
  
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
  
  // Fetch departments only once on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      // Use ref to prevent duplicate fetching
      if (fetchingRef.current) return;
      
      try {
        fetchingRef.current = true;
        console.log("Fetching departments in useDepartments hook");
        setLoading(true);
        const fetchedDepartments = await departmentService.getAll();
        console.log("Departments fetched:", fetchedDepartments);
        setDepartments(fetchedDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };
    
    fetchDepartments();
  }, [departmentService]);
  
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
      
      // Refresh departments list (with a delay to avoid loop)
      setTimeout(async () => {
        const updatedDepartments = await departmentService.getAll();
        setDepartments(updatedDepartments);
      }, 300);
    }
  }, [formData, selectedEmployees, validateForm, handleSaveDepartment, departmentService]);
  
  // Update department
  const handleUpdateExistingDepartment = useCallback(async () => {
    if (!validateForm()) return;
    
    const success = await handleUpdateDepartment(formData, selectedEmployees, currentDepartment);
    
    if (success) {
      setIsEditDialogOpen(false);
      
      // Refresh departments list (with a delay to avoid loop)
      setTimeout(async () => {
        const updatedDepartments = await departmentService.getAll();
        setDepartments(updatedDepartments);
      }, 300);
    }
  }, [formData, selectedEmployees, currentDepartment, validateForm, handleUpdateDepartment, departmentService]);
  
  // Save employee assignments
  const handleSaveEmployees = useCallback(async () => {
    if (!currentDepartment) return;
    
    const success = await handleSaveEmployeeAssignments(currentDepartment, selectedEmployees);
    
    if (success) {
      setIsManageEmployeesDialogOpen(false);
      
      // Refresh departments list (with a delay to avoid loop)
      setTimeout(async () => {
        const updatedDepartments = await departmentService.getAll();
        setDepartments(updatedDepartments);
      }, 300);
    }
  }, [currentDepartment, selectedEmployees, handleSaveEmployeeAssignments, departmentService]);
  
  // Delete department
  const handleDeleteDept = useCallback(async (id: string, name: string) => {
    const success = await handleDeleteDepartment(id, name);
    
    if (success) {
      // Refresh departments list (with a delay to avoid loop)
      setTimeout(async () => {
        const updatedDepartments = await departmentService.getAll();
        setDepartments(updatedDepartments);
      }, 300);
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
