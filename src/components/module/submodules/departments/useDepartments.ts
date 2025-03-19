
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { employees } from '@/data/employees';
import { Department, DepartmentFormData } from './types';
import { Employee } from '@/types/employee';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useDepartments = () => {
  // Hook to Firestore departments collection
  const departmentsFirestore = useFirestore(COLLECTIONS.EMPLOYEES + '_departments');
  
  // Departments data state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // State for dialog control and form data
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  const [formData, setFormData] = useState<DepartmentFormData>({
    id: "",
    name: "",
    description: "",
    managerId: "",
    color: "#3b82f6",
    employeeIds: []
  });
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [activeTab, setActiveTab] = useState("department-info");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Load departments from Firestore on component mount
  useEffect(() => {
    loadDepartmentsFromFirestore();
  }, []);

  // Function to load departments from Firestore
  const loadDepartmentsFromFirestore = async () => {
    setLoading(true);
    try {
      const data = await departmentsFirestore.getAll();
      if (data && data.length > 0) {
        setDepartments(data as Department[]);
      } else {
        // If no departments found, initialize with default departments
        const defaultDepartments = [
          {
            id: "DEP001",
            name: "Marketing",
            description: "Responsable de la stratégie marketing et de la communication",
            managerId: "EMP003",
            managerName: "Sophie Martin",
            employeesCount: 2,
            color: "#3b82f6", // blue-500
            employeeIds: ["EMP003", "EMP004"]
          },
          {
            id: "DEP002",
            name: "Direction",
            description: "Direction générale de l'entreprise",
            managerId: "EMP002",
            managerName: "Lionel Djossa",
            employeesCount: 1,
            color: "#10b981", // emerald-500
            employeeIds: ["EMP002"]
          }
        ];
        
        // Save default departments to Firestore
        for (const dept of defaultDepartments) {
          await departmentsFirestore.set(dept.id, dept);
        }
        
        setDepartments(defaultDepartments);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      toast.error("Erreur lors du chargement des départements");
      
      // Fallback to default departments if Firebase load fails
      setDepartments([
        {
          id: "DEP001",
          name: "Marketing",
          description: "Responsable de la stratégie marketing et de la communication",
          managerId: "EMP003",
          managerName: "Sophie Martin",
          employeesCount: 2,
          color: "#3b82f6",
          employeeIds: ["EMP003", "EMP004"]
        },
        {
          id: "DEP002",
          name: "Direction",
          description: "Direction générale de l'entreprise",
          managerId: "EMP002",
          managerName: "Lionel Djossa",
          employeesCount: 1,
          color: "#10b981",
          employeeIds: ["EMP002"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle manager selection
  const handleManagerChange = (value: string) => {
    // If value is 'none', set to empty string to indicate no manager
    setFormData({ ...formData, managerId: value === 'none' ? '' : value });
  };

  // Handle color selection
  const handleColorChange = (value: string) => {
    setFormData({ ...formData, color: value });
  };

  // Open add department dialog
  const handleAddDepartment = () => {
    setFormData({
      id: `DEP${(departments.length + 1).toString().padStart(3, '0')}`,
      name: "",
      description: "",
      managerId: "",
      color: "#3b82f6",
      employeeIds: []
    });
    setSelectedEmployees([]);
    setActiveTab("department-info");
    setIsAddDialogOpen(true);
  };

  // Open edit department dialog
  const handleEditDepartment = (department: Department) => {
    setCurrentDepartment(department);
    setFormData({
      id: department.id,
      name: department.name,
      description: department.description,
      managerId: department.managerId || "",
      color: department.color,
      employeeIds: department.employeeIds || []
    });
    setSelectedEmployees(department.employeeIds || []);
    setActiveTab("department-info");
    setIsEditDialogOpen(true);
  };

  // Open manage employees dialog
  const handleManageEmployees = (department: Department) => {
    setCurrentDepartment(department);
    setSelectedEmployees(department.employeeIds || []);
    setIsManageEmployeesDialogOpen(true);
  };

  // Handle employee selection/deselection
  const handleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  // Save new department
  const handleSaveDepartment = async () => {
    if (!formData.name) {
      toast.error("Le nom du département est requis");
      return;
    }

    const selectedManager = formData.managerId 
      ? employees.find(emp => emp.id === formData.managerId) 
      : null;

    const newDepartment: Department = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      managerId: formData.managerId || null,
      managerName: selectedManager ? `${selectedManager.firstName} ${selectedManager.lastName}` : null,
      employeesCount: selectedEmployees.length,
      color: formData.color,
      employeeIds: selectedEmployees
    };

    try {
      await departmentsFirestore.set(newDepartment.id, newDepartment);
      setDepartments([...departments, newDepartment]);
      setIsAddDialogOpen(false);
      toast.success(`Département ${formData.name} créé avec succès`);
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("Erreur lors de la création du département");
    }
  };

  // Update existing department
  const handleUpdateDepartment = async () => {
    if (!formData.name || !currentDepartment) {
      toast.error("Le nom du département est requis");
      return;
    }

    const selectedManager = formData.managerId 
      ? employees.find(emp => emp.id === formData.managerId) 
      : null;

    const updatedDepartment: Department = {
      ...currentDepartment,
      name: formData.name,
      description: formData.description,
      managerId: formData.managerId || null,
      managerName: selectedManager ? `${selectedManager.firstName} ${selectedManager.lastName}` : null,
      employeesCount: selectedEmployees.length,
      color: formData.color,
      employeeIds: selectedEmployees
    };

    try {
      await departmentsFirestore.update(updatedDepartment.id, updatedDepartment);
      
      const updatedDepartments = departments.map(dep => {
        if (dep.id === currentDepartment.id) {
          return updatedDepartment;
        }
        return dep;
      });

      setDepartments(updatedDepartments);
      setIsEditDialogOpen(false);
      toast.success(`Département ${formData.name} mis à jour avec succès`);
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Erreur lors de la mise à jour du département");
    }
  };

  // Delete department
  const handleDeleteDepartment = async (id: string) => {
    const departmentToDelete = departments.find(dep => dep.id === id);
    if (!departmentToDelete) return;

    // Confirm deletion
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le département ${departmentToDelete.name} ?`)) {
      try {
        await departmentsFirestore.remove(id);
        setDepartments(departments.filter(dep => dep.id !== id));
        toast.success(`Département ${departmentToDelete.name} supprimé avec succès`);
      } catch (error) {
        console.error("Error deleting department:", error);
        toast.error("Erreur lors de la suppression du département");
      }
    }
  };

  // Save employee assignments
  const handleSaveEmployeeAssignments = async () => {
    if (!currentDepartment) return;

    try {
      const updatedDepartment = {
        ...currentDepartment,
        employeeIds: selectedEmployees,
        employeesCount: selectedEmployees.length
      };

      await departmentsFirestore.update(updatedDepartment.id, updatedDepartment);

      const updatedDepartments = departments.map(dep => {
        if (dep.id === currentDepartment.id) {
          return updatedDepartment;
        }
        return dep;
      });

      setDepartments(updatedDepartments);
      setIsManageEmployeesDialogOpen(false);
      toast.success(`Employés du département ${currentDepartment.name} mis à jour avec succès`);
    } catch (error) {
      console.error("Error updating department employees:", error);
      toast.error("Erreur lors de la mise à jour des employés du département");
    }
  };

  // Get employees list for a department
  const getDepartmentEmployees = (departmentId: string): Employee[] => {
    const department = departments.find(dep => dep.id === departmentId);
    if (!department || !department.employeeIds) return [];
    
    return employees.filter(emp => department.employeeIds.includes(emp.id));
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
