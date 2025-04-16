
import { useState } from 'react';
import { Department } from '../types';
import { createEmptyFormData } from '../utils/departmentUtils';

export const useDepartmentForm = (departments: Department[] = []) => {
  const [formData, setFormData] = useState(() => createEmptyFormData(departments));
  const [activeTab, setActiveTab] = useState('general');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Réinitialiser le formulaire avec des valeurs par défaut
  const resetForm = (departments: Department[] = []) => {
    setFormData(createEmptyFormData(departments));
    setSelectedEmployees([]);
    setActiveTab('general');
  };

  // Initialiser le formulaire avec les données d'un département existant
  const initFormWithDepartment = (department: Department) => {
    setFormData({
      id: department.id,
      name: department.name,
      description: department.description,
      managerId: department.managerId || 'none',
      companyId: department.companyId || '',
      color: department.color
    });
    setSelectedEmployees(department.employeeIds || []);
    setActiveTab('general');
  };

  // Gérer le changement des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gérer le changement du manager
  const handleManagerChange = (value: string) => {
    setFormData(prev => ({ ...prev, managerId: value === 'none' ? null : value }));
  };

  // Gérer le changement de la couleur
  const handleColorChange = (value: string) => {
    setFormData(prev => ({ ...prev, color: value }));
  };

  // Gérer la sélection/désélection d'un employé
  const handleEmployeeSelection = (employeeId: string, selected: boolean) => {
    if (selected) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    }
  };

  return {
    formData,
    activeTab,
    selectedEmployees,
    setFormData,
    setActiveTab,
    setSelectedEmployees,
    resetForm,
    initFormWithDepartment,
    handleInputChange,
    handleManagerChange,
    handleColorChange,
    handleEmployeeSelection
  };
};
