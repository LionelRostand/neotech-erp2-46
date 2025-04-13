
import { useState, useEffect, useCallback } from 'react';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Department, DepartmentFormData, departmentColors } from './types';
import { createEmptyFormData, prepareDepartmentFromForm, getDepartmentEmployees, notifyDepartmentUpdates } from './utils/departmentUtils';
import { useDepartmentService } from './services/departmentService';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { employees } from '@/data/employees';

export const useDepartments = () => {
  // Fetch departments directly from Firestore
  const { departments = [], isLoading: loading, error } = useFirebaseDepartments();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>(createEmptyFormData(departments));
  const [activeTab, setActiveTab] = useState("general");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  const departmentService = useDepartmentService();
  
  // Fetch all available employees
  const allEmployees = employees;
  
  // Reset form when departments change
  useEffect(() => {
    if (departments && departments.length > 0) {
      setFormData(createEmptyFormData(departments));
    }
  }, [departments]);
  
  // Notify other components when departments are updated
  useEffect(() => {
    if (departments && departments.length > 0) {
      notifyDepartmentUpdates(departments);
    }
  }, [departments]);
  
  // Handle dialog open/close
  const handleAddDepartment = useCallback(() => {
    setFormData(createEmptyFormData(departments));
    setSelectedEmployees([]);
    setActiveTab("general");
    setIsAddDialogOpen(true);
  }, [departments]);
  
  const handleEditDepartment = useCallback((department: Department) => {
    setCurrentDepartment(department);
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
    setIsEditDialogOpen(true);
  }, []);
  
  const handleManageEmployees = useCallback((department: Department) => {
    setCurrentDepartment(department);
    setSelectedEmployees(department.employeeIds || []);
    setIsManageEmployeesDialogOpen(true);
  }, []);
  
  // Form input handlers
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
  
  // Department operations
  const handleSaveDepartment = useCallback(async () => {
    if (!formData.name || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    try {
      const departmentToSave = prepareDepartmentFromForm(formData, selectedEmployees);
      const success = await departmentService.createDepartment(departmentToSave);
      
      if (success) {
        setIsAddDialogOpen(false);
        toast.success(`Département ${formData.name} créé avec succès`);
      }
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("Erreur lors de la création du département");
    }
  }, [formData, selectedEmployees, departmentService]);
  
  const handleUpdateDepartment = useCallback(async () => {
    if (!formData.name || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (!currentDepartment) {
      toast.error("Aucun département sélectionné pour la mise à jour");
      return;
    }
    
    try {
      console.log("Current department before update:", currentDepartment);
      
      // Préparer le département avec les données du formulaire tout en préservant les métadonnées existantes
      const departmentToUpdate: Department = {
        ...currentDepartment,
        id: formData.id, // Garder l'ID d'origine
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId === "none" ? null : formData.managerId,
        color: formData.color,
        employeeIds: selectedEmployees,
        employeesCount: selectedEmployees.length
      };
      
      console.log("Department to update:", departmentToUpdate);
      
      // Mettre à jour le département
      const success = await departmentService.updateDepartment(departmentToUpdate);
      
      if (success) {
        setIsEditDialogOpen(false);
        toast.success(`Département ${formData.name} mis à jour avec succès`);
      }
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Erreur lors de la mise à jour du département");
    }
  }, [formData, selectedEmployees, currentDepartment, departmentService]);
  
  const handleDeleteDepartment = useCallback(async (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le département "${name}" ?`)) {
      try {
        const success = await departmentService.deleteDepartment(id, name);
        
        if (success) {
          toast.success(`Département ${name} supprimé avec succès`);
        }
      } catch (error) {
        console.error("Error deleting department:", error);
        toast.error("Erreur lors de la suppression du département");
      }
    }
  }, [departmentService]);
  
  const handleSaveEmployeeAssignments = useCallback(async () => {
    if (!currentDepartment) {
      toast.error("Aucun département sélectionné");
      return;
    }
    
    try {
      const updatedDepartment: Department = {
        ...currentDepartment,
        employeeIds: selectedEmployees,
        employeesCount: selectedEmployees.length
      };
      
      const success = await departmentService.updateDepartment(updatedDepartment);
      
      if (success) {
        setIsManageEmployeesDialogOpen(false);
        toast.success(`Assignations d'employés mises à jour pour ${currentDepartment.name}`);
      }
    } catch (error) {
      console.error("Error updating employee assignments:", error);
      toast.error("Erreur lors de la mise à jour des assignations d'employés");
    }
  }, [currentDepartment, selectedEmployees, departmentService]);
  
  return {
    departments,
    loading,
    error,
    isAddDialogOpen,
    isEditDialogOpen,
    isManageEmployeesDialogOpen,
    formData,
    currentDepartment,
    activeTab,
    selectedEmployees,
    allEmployees,
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

export default useDepartments;
