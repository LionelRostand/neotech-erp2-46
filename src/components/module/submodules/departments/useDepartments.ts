
import { useState, useEffect, useCallback } from 'react';
import { Department, DepartmentFormData } from './types';
import { useDepartmentService } from './services/departmentService';
import { toast } from 'sonner';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { syncDepartmentsWithHierarchy } from './utils/departmentUtils';

export const useDepartments = () => {
  // States
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  const [formData, setFormData] = useState<DepartmentFormData>({
    id: '',
    name: '',
    description: '',
    managerId: '',
    color: '#3b82f6',
    employeeIds: [],
  });
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Services
  const departmentService = useDepartmentService();
  const { employees } = useEmployeeData();

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
      
      // Sync with hierarchy component
      syncDepartmentsWithHierarchy(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Erreur lors du chargement des départements");
    } finally {
      setLoading(false);
    }
  }, [departmentService]);

  // Load departments on mount
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Handle input change for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle manager selection
  const handleManagerChange = (managerId: string) => {
    setFormData(prev => ({ ...prev, managerId }));
  };

  // Handle color selection
  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  // Handle employee selection in the form
  const handleEmployeeSelection = (employeeIds: string[]) => {
    setSelectedEmployees(employeeIds);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: `DEP${Date.now().toString().slice(-8)}`,
      name: '',
      description: '',
      managerId: '',
      color: '#3b82f6',
      employeeIds: [],
    });
    setSelectedEmployees([]);
    setActiveTab(0);
  };

  // Show add department dialog
  const handleAddDepartment = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  // Show edit department dialog
  const handleEditDepartment = (department: Department) => {
    // Find selected manager name
    const manager = employees.find(emp => emp.id === department.managerId);
    
    // Setup form data
    setFormData({
      id: department.id,
      name: department.name,
      description: department.description || '',
      managerId: department.managerId || '',
      color: department.color,
      employeeIds: department.employeeIds || [],
    });
    
    // Set selected employees
    setSelectedEmployees(department.employeeIds || []);
    setCurrentDepartment(department);
    setActiveTab(0);
    setIsEditDialogOpen(true);
  };

  // Show manage employees dialog
  const handleManageEmployees = (department: Department) => {
    setCurrentDepartment(department);
    setSelectedEmployees(department.employeeIds || []);
    setIsManageEmployeesDialogOpen(true);
  };

  // Get employees for a department
  const getDepartmentEmployees = (departmentId: string) => {
    const department = departments.find(dep => dep.id === departmentId);
    if (!department || !department.employeeIds) return [];
    
    return employees.filter(emp => department.employeeIds.includes(emp.id));
  };

  // Save a new department
  const handleSaveDepartment = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Le nom du département est requis");
        return;
      }

      // Find selected manager
      const manager = employees.find(emp => emp.id === formData.managerId);
      
      // Create department object
      const newDepartment: Department = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId || null,
        managerName: manager ? `${manager.firstName} ${manager.lastName}` : null,
        employeesCount: selectedEmployees.length,
        color: formData.color,
        employeeIds: selectedEmployees,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save to database
      const success = await departmentService.createDepartment(newDepartment);
      
      if (success) {
        setIsAddDialogOpen(false);
        await fetchDepartments();
      }
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("Erreur lors de la création du département");
    }
  };

  // Update an existing department
  const handleUpdateDepartment = async () => {
    try {
      if (!formData.name.trim() || !currentDepartment) {
        toast.error("Données invalides pour la mise à jour");
        return;
      }

      // Find selected manager
      const manager = employees.find(emp => emp.id === formData.managerId);
      
      // Create updated department object
      const updatedDepartment: Department = {
        ...currentDepartment,
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId || null,
        managerName: manager ? `${manager.firstName} ${manager.lastName}` : null,
        color: formData.color,
        employeesCount: selectedEmployees.length,
        employeeIds: selectedEmployees,
        updatedAt: new Date().toISOString(),
      };
      
      // Save to database
      const success = await departmentService.updateDepartment(updatedDepartment);
      
      if (success) {
        setIsEditDialogOpen(false);
        await fetchDepartments();
      }
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Erreur lors de la mise à jour du département");
    }
  };

  // Delete a department
  const handleDeleteDepartment = async (id: string) => {
    try {
      const departmentToDelete = departments.find(d => d.id === id);
      if (!departmentToDelete) {
        toast.error("Département non trouvé");
        return;
      }
      
      const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer le département ${departmentToDelete.name} ?`);
      if (!confirmed) return;
      
      const success = await departmentService.deleteDepartment(id, departmentToDelete.name);
      if (success) {
        await fetchDepartments();
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Erreur lors de la suppression du département");
    }
  };

  // Save employee assignments
  const handleSaveEmployeeAssignments = async () => {
    try {
      if (!currentDepartment) {
        toast.error("Département non trouvé");
        return;
      }
      
      // Update department with new employee list
      const updatedDepartment: Department = {
        ...currentDepartment,
        employeesCount: selectedEmployees.length,
        employeeIds: selectedEmployees,
        updatedAt: new Date().toISOString(),
      };
      
      // Save to database
      const success = await departmentService.updateDepartment(updatedDepartment);
      
      if (success) {
        setIsManageEmployeesDialogOpen(false);
        await fetchDepartments();
      }
    } catch (error) {
      console.error("Error saving employee assignments:", error);
      toast.error("Erreur lors de l'enregistrement des affectations");
    }
  };

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
    handleColorChange,
    handleAddDepartment,
    handleEditDepartment,
    handleManageEmployees,
    handleEmployeeSelection,
    handleSaveDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments,
    getDepartmentEmployees
  };
};
