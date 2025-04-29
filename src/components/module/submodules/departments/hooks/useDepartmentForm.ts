
import { useState, useCallback } from 'react';
import { Department, DepartmentFormData, departmentColors } from '../types';
import { createEmptyFormData } from '../utils/departmentUtils';
import { toast } from 'sonner';

export const useDepartmentForm = () => {
  const [formData, setFormData] = useState<DepartmentFormData>(createEmptyFormData());
  const [activeTab, setActiveTab] = useState("informations");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  // Reset form with initial data
  const resetForm = useCallback(() => {
    setFormData(createEmptyFormData());
    setSelectedEmployees([]);
    setActiveTab("informations");
  }, []);
  
  // Initialize form with department data for editing
  const initFormWithDepartment = useCallback((department: Department) => {
    setFormData({
      id: department.id,
      name: department.name,
      description: department.description || "",
      managerId: department.managerId || "",
      color: department.color || departmentColors[0].value,
      companyId: department.companyId || "",
      employeeIds: department.employeeIds || []
    });
    setSelectedEmployees(department.employeeIds || []);
    setActiveTab("informations");
  }, []);
  
  // Form input handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleManagerChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, managerId: value === "none" ? "" : value }));
  }, []);
  
  const handleCompanyChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, companyId: value === "none" ? "" : value }));
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
    handleCompanyChange,
    handleColorChange,
    handleEmployeeSelection,
    validateForm,
    setFormData,
    setSelectedEmployees
  };
};
