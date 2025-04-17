
import { useState, useCallback, useEffect } from 'react';
import { Department, DepartmentFormData } from './types';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useDepartmentOperations } from './hooks/useDepartmentOperations';
import { toast } from 'sonner';
import { useHrData } from '@/hooks/modules/useHrData';
import { v4 as uuidv4 } from 'uuid';

export const useDepartments = () => {
  const { employees } = useEmployeeData();
  const { departments: fetchedDepartments, isLoading, refetchDepartments } = useHrData();
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(isLoading);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  const [formData, setFormData] = useState<DepartmentFormData>({
    id: `dept-${uuidv4().substring(0, 8)}`,
    name: '',
    description: '',
    managerId: '',
    companyId: '',
    color: '#3B82F6',
    employeeIds: []
  });
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [activeTab, setActiveTab] = useState<string>('general');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  const {
    handleSaveDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments
  } = useDepartmentOperations();

  // Synchroniser les départements récupérés
  useEffect(() => {
    if (fetchedDepartments) {
      console.log("Synchronizing departments:", fetchedDepartments.length);
      
      // On s'assure qu'il n'y a pas de doublons lors de la synchronisation
      const uniqueDepartments = new Map<string, Department>();
      fetchedDepartments.forEach(dept => {
        if (dept && dept.id) {
          uniqueDepartments.set(dept.id, dept);
        }
      });
      
      const uniqueData = Array.from(uniqueDepartments.values());
      setDepartments(uniqueData);
    }
    setLoading(isLoading);
  }, [fetchedDepartments, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleManagerChange = (value: string) => {
    setFormData(prev => ({ ...prev, managerId: value }));
  };

  const handleCompanyChange = (value: string) => {
    setFormData(prev => ({ ...prev, companyId: value }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const handleAddDepartment = () => {
    // Reset form data with a new ID and empty values
    setFormData({
      id: `dept-${uuidv4().substring(0, 8)}`,
      name: '',
      description: '',
      managerId: '',
      companyId: '',
      color: '#3B82F6',
      employeeIds: []
    });
    setSelectedEmployees([]);
    setIsAddDialogOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setCurrentDepartment(department);
    setFormData({
      id: department.id,
      name: department.name,
      description: department.description,
      managerId: department.managerId || '',
      companyId: department.companyId || '',
      color: department.color || '#3B82F6',
      employeeIds: department.employeeIds || []
    });
    setSelectedEmployees(department.employeeIds || []);
    setIsEditDialogOpen(true);
  };

  const handleManageEmployees = (department: Department) => {
    setCurrentDepartment(department);
    setSelectedEmployees(department.employeeIds || []);
    setIsManageEmployeesDialogOpen(true);
  };

  const handleEmployeeSelection = (employeeId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    }
  };

  const handleSaveDepartmentWrapper = async () => {
    if (!formData.name || !formData.description) {
      toast.error("Les champs nom et description sont obligatoires");
      return;
    }
    
    const success = await handleSaveDepartment(formData, selectedEmployees);
    if (success) {
      setIsAddDialogOpen(false);
      // Refetch departments to get the updated list with the new department
      await refetchDepartments();
    }
  };

  const handleUpdateDepartmentWrapper = async () => {
    if (!formData.name || !formData.description) {
      toast.error("Les champs nom et description sont obligatoires");
      return;
    }
    
    const success = await handleUpdateDepartment(formData, selectedEmployees, currentDepartment);
    if (success) {
      setIsEditDialogOpen(false);
      // Refetch departments to get the updated list
      await refetchDepartments();
    }
  };

  const handleDeleteDepartmentWrapper = async (id: string, name: string) => {
    const success = await handleDeleteDepartment(id, name);
    if (success) {
      // Refetch departments to get the updated list without the deleted department
      await refetchDepartments();
    }
  };

  const handleSaveEmployeeAssignmentsWrapper = async () => {
    const success = await handleSaveEmployeeAssignments(currentDepartment, selectedEmployees);
    if (success) {
      setIsManageEmployeesDialogOpen(false);
      // Refetch departments to get the updated list with new employee assignments
      await refetchDepartments();
    }
  };

  const getDepartmentEmployees = useCallback((departmentId: string) => {
    return employees.filter(emp => {
      const department = departments.find(dept => dept.id === departmentId);
      if (department && department.employeeIds) {
        return department.employeeIds.includes(emp.id);
      }
      return false;
    });
  }, [departments, employees]);

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
