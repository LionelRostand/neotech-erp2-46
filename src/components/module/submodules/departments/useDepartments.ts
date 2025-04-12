
import { useState, useEffect, useCallback } from 'react';
import { Department } from './types';
import { useDepartmentService } from './services/departmentService';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Define the interface for department form data
interface DepartmentFormData {
  id: string;
  name: string;
  description: string;
  managerId: string;
  color: string;
}

export const useDepartments = () => {
  // Load departments service
  const departmentService = useDepartmentService();
  
  // State for departments
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for dialog management
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState<DepartmentFormData>({
    id: '',
    name: '',
    description: '',
    managerId: '',
    color: '#3b82f6', // Default color - blue
  });
  
  // Current department for operations
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  
  // Tab state for dialogs
  const [activeTab, setActiveTab] = useState('info');
  
  // Selected employees for the department
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  // Get employees data
  const { employees } = useEmployeeData();
  
  // Load departments
  const loadDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      console.error("Error loading departments:", error);
      toast.error("Erreur lors du chargement des départements");
    } finally {
      setLoading(false);
    }
  }, [departmentService]);
  
  // Load departments on mount
  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle manager change
  const handleManagerChange = (managerId: string) => {
    setFormData(prev => ({ ...prev, managerId }));
  };
  
  // Handle color change
  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      managerId: '',
      color: '#3b82f6',
    });
    setSelectedEmployees([]);
  };
  
  // Open add department dialog
  const handleAddDepartment = () => {
    resetFormData();
    setIsAddDialogOpen(true);
  };
  
  // Open edit department dialog
  const handleEditDepartment = (department: Department) => {
    setFormData({
      id: department.id,
      name: department.name,
      description: department.description || '',
      managerId: department.managerId || '',
      color: department.color || '#3b82f6',
    });
    
    // Get employees for this department
    const deptEmployees = getDepartmentEmployees(department.id);
    setSelectedEmployees(deptEmployees.map(emp => emp.id));
    
    setCurrentDepartment(department);
    setIsEditDialogOpen(true);
  };
  
  // Open manage employees dialog
  const handleManageEmployees = (department: Department) => {
    setCurrentDepartment(department);
    
    // Get employees for this department
    const deptEmployees = getDepartmentEmployees(department.id);
    setSelectedEmployees(deptEmployees.map(emp => emp.id));
    
    setIsManageEmployeesDialogOpen(true);
  };
  
  // Toggle employee selection
  const handleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };
  
  // Get employees for a department
  const getDepartmentEmployees = (departmentId: string): Employee[] => {
    if (!employees) return [];
    
    return employees.filter(emp => 
      emp.department === departmentId || 
      emp.departmentId === departmentId
    );
  };
  
  // Save new department
  const handleSaveDepartment = async () => {
    if (!formData.name.trim()) {
      toast.error("Le nom du département est requis");
      return;
    }
    
    try {
      const newDepartment: Department = {
        id: uuidv4(),
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId || undefined,
        color: formData.color,
        employeeCount: selectedEmployees.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const success = await departmentService.createDepartment(newDepartment);
      
      if (success) {
        // Refresh departments list
        await loadDepartments();
        
        // Close dialog
        setIsAddDialogOpen(false);
        resetFormData();
      }
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("Erreur lors de la création du département");
    }
  };
  
  // Update existing department
  const handleUpdateDepartment = async () => {
    if (!formData.name.trim() || !currentDepartment) {
      toast.error("Le nom du département est requis");
      return;
    }
    
    try {
      const updatedDepartment: Department = {
        ...currentDepartment,
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId || undefined,
        color: formData.color,
        employeeCount: selectedEmployees.length,
        updatedAt: new Date().toISOString(),
      };
      
      const success = await departmentService.updateDepartment(updatedDepartment);
      
      if (success) {
        // Refresh departments list
        await loadDepartments();
        
        // Close dialog
        setIsEditDialogOpen(false);
        resetFormData();
      }
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Erreur lors de la mise à jour du département");
    }
  };
  
  // Delete department
  const handleDeleteDepartment = async (department: Department) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le département "${department.name}" ?`)) {
      try {
        const success = await departmentService.deleteDepartment(department.id, department.name);
        
        if (success) {
          // Refresh departments list
          await loadDepartments();
          toast.success(`Le département ${department.name} a été supprimé`);
        }
      } catch (error) {
        console.error("Error deleting department:", error);
        toast.error("Erreur lors de la suppression du département");
      }
    }
  };
  
  // Save employee assignments
  const handleSaveEmployeeAssignments = async () => {
    if (!currentDepartment) {
      toast.error("Aucun département sélectionné");
      return;
    }
    
    try {
      // Update department with new employee count
      const updatedDepartment: Department = {
        ...currentDepartment,
        employeeCount: selectedEmployees.length,
        updatedAt: new Date().toISOString(),
      };
      
      console.log("Updating department with employee count:", updatedDepartment);
      const success = await departmentService.updateDepartment(updatedDepartment);
      
      if (success) {
        // Here you would typically update the employee records to assign them to the department
        // This is just a placeholder - in a real app, update the employee records as well
        
        // Refresh departments list
        await loadDepartments();
        
        // Close dialog
        setIsManageEmployeesDialogOpen(false);
        toast.success(`Les employés ont été assignés au département ${currentDepartment.name}`);
      }
    } catch (error) {
      console.error("Error saving employee assignments:", error);
      toast.error("Erreur lors de l'enregistrement des assignations");
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
