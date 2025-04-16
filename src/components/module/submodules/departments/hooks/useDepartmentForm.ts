import { useState, useCallback } from 'react';
import { Department, DepartmentFormData, departmentColors } from '../types';
import { createEmptyFormData } from '../utils/departmentUtils';
import { toast } from 'sonner';

export const useDepartmentForm = (departments: Department[] = []) => {
  const [formData, setFormData] = useState<DepartmentFormData>({
    id: '',
    name: '',
    description: '',
    managerId: '',
    color: departmentColors[0].value,
    employeeIds: [],
    companyId: ''
  });
  const [activeTab, setActiveTab] = useState("general");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  const resetForm = useCallback((depts: Department[]) => {
    setFormData(createEmptyFormData(depts));
    setSelectedEmployees([]);
    setActiveTab("general");
  }, []);
  
  const initFormWithDepartment = useCallback((department: Department) => {
    setFormData({
      id: department.id,
      name: department.name,
      description: department.description || "",
      managerId: department.managerId || "",
      color: department.color || departmentColors[0].value,
      employeeIds: department.employeeIds || []
    });
    setSelectedEmployees(department.employeeIds || []);
    setActiveTab("general");
  }, []);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
  
  const handleCompanyChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, companyId: value === 'none' ? '' : value }));
  }, []);
  
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
    handleCompanyChange,
    validateForm,
    setSelectedEmployees
  };
};
