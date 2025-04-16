
import { useState, useCallback } from 'react';
import { Department, DepartmentFormData, departmentColors } from '../types';

export const useDepartmentForm = (departments: Department[]) => {
  const [formData, setFormData] = useState<DepartmentFormData>({
    id: '',
    name: '',
    description: '',
    managerId: '',
    managerName: '',
    color: departmentColors[0].value,
    companyId: ''
  });
  
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('general');
  
  const resetForm = useCallback((deps: Department[]) => {
    setFormData({
      id: '',
      name: '',
      description: '',
      managerId: '',
      managerName: '',
      color: departmentColors[0].value,
      companyId: ''
    });
    setSelectedEmployees([]);
    setActiveTab('general');
  }, []);
  
  const initFormWithDepartment = useCallback((department: Department) => {
    setFormData({
      id: department.id || '',
      name: department.name || '',
      description: department.description || '',
      managerId: department.managerId || '',
      managerName: department.managerName || '',
      color: department.color || departmentColors[0].value,
      companyId: department.companyId || ''
    });
    
    setSelectedEmployees(department.employeeIds || []);
    setActiveTab('general');
  }, []);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleManagerChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, managerId: value }));
  }, []);
  
  const handleColorChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, color: value }));
  }, []);
  
  const handleCompanyChange = useCallback((value: string) => {
    console.log("Company selected:", value);
    setFormData(prev => ({ ...prev, companyId: value }));
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
  
  return {
    formData,
    selectedEmployees,
    activeTab,
    setActiveTab,
    resetForm,
    initFormWithDepartment,
    handleInputChange,
    handleManagerChange,
    handleColorChange,
    handleCompanyChange,
    handleEmployeeSelection,
    setSelectedEmployees
  };
};
