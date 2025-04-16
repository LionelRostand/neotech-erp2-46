
import { useState, useCallback } from 'react';
import { Department, DepartmentFormData, departmentColors } from '../types';
import { createEmptyFormData } from '../utils/departmentUtils';
import { toast } from 'sonner';

export const useDepartmentForm = (departments: Department[] = []) => {
  const [formData, setFormData] = useState<DepartmentFormData>(createEmptyFormData(departments));
  const [activeTab, setActiveTab] = useState("general");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  // Reset form with initial data
  const resetForm = useCallback((depts: Department[]) => {
    // We don't want to continuously reset this in an infinite loop
    setFormData(createEmptyFormData(depts));
    setSelectedEmployees([]);
    setActiveTab("general");
  }, []);
  
  // Initialize form with department data for editing
  const initFormWithDepartment = useCallback((department: Department) => {
    console.log("Initializing form with department:", department);
    setFormData({
      id: department.id,
      name: department.name,
      description: department.description || "",
      managerId: department.managerId || "",
      color: department.color || departmentColors[0].value,
      employeeIds: department.employeeIds || [],
      companyId: department.companyId || ""
    });
    setSelectedEmployees(department.employeeIds || []);
    setActiveTab("general");
  }, []);
  
  // Form input handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleManagerChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, managerId: value === "none" ? "" : value }));
  }, []);
  
  const handleColorChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, color: value }));
  }, []);
  
  const handleEmployeeSelection = useCallback((employeeId: string, checked: boolean) => {
    setSelectedEmployees(prev => {
      if (checked) {
        return [...prev, employeeId];
      } else {
        return prev.filter(id => id !== employeeId);
      }
    });
  }, []);
  
  // Validation
  const validateForm = useCallback(() => {
    if (!formData.name || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    return true;
  }, [formData]);
  
  return {
    formData,
    activeTab,
    selectedEmployees,
    resetForm,
    initFormWithDepartment,
    setActiveTab,
    handleInputChange,
    handleManagerChange,
    handleColorChange,
    handleEmployeeSelection,
    validateForm,
    setSelectedEmployees
  };
};
