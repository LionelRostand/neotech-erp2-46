
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Department, DepartmentFormData } from './types';
import { useDepartmentService } from './services/departmentService';
import { 
  createDefaultDepartments, 
  createEmptyFormData, 
  prepareDepartmentFromForm,
  getDepartmentEmployees
} from './utils/departmentUtils';

export const useDepartments = () => {
  // Department service for Firebase operations
  const departmentService = useDepartmentService();
  
  // Departments data state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // State for dialog control and form data
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  const [formData, setFormData] = useState<DepartmentFormData>(createEmptyFormData([]));
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
      const data = await departmentService.getAll();
      
      if (data.length > 0) {
        setDepartments(data);
      } else {
        // If no departments found, initialize with default departments
        const defaultDepartments = createDefaultDepartments();
        
        // Save default departments to Firestore
        for (const dept of defaultDepartments) {
          await departmentService.createDepartment(dept);
        }
        
        setDepartments(defaultDepartments);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      
      // Fallback to default departments if Firebase load fails
      setDepartments(createDefaultDepartments());
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
    setFormData(createEmptyFormData(departments));
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

    const newDepartment = prepareDepartmentFromForm(formData, selectedEmployees);
    const success = await departmentService.createDepartment(newDepartment);
    
    if (success) {
      setDepartments([...departments, newDepartment]);
      setIsAddDialogOpen(false);
    }
  };

  // Update existing department
  const handleUpdateDepartment = async () => {
    if (!formData.name || !currentDepartment) {
      toast.error("Le nom du département est requis");
      return;
    }

    const updatedDepartment = prepareDepartmentFromForm(
      formData, 
      selectedEmployees, 
      currentDepartment
    );

    const success = await departmentService.updateDepartment(updatedDepartment);
    
    if (success) {
      const updatedDepartments = departments.map(dep => {
        if (dep.id === currentDepartment.id) {
          return updatedDepartment;
        }
        return dep;
      });

      setDepartments(updatedDepartments);
      setIsEditDialogOpen(false);
    }
  };

  // Delete department
  const handleDeleteDepartment = async (id: string) => {
    const departmentToDelete = departments.find(dep => dep.id === id);
    if (!departmentToDelete) return;

    // Confirm deletion
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le département ${departmentToDelete.name} ?`)) {
      const success = await departmentService.deleteDepartment(id, departmentToDelete.name);
      
      if (success) {
        setDepartments(departments.filter(dep => dep.id !== id));
      }
    }
  };

  // Save employee assignments
  const handleSaveEmployeeAssignments = async () => {
    if (!currentDepartment) return;

    const updatedDepartment = {
      ...currentDepartment,
      employeeIds: selectedEmployees,
      employeesCount: selectedEmployees.length
    };

    const success = await departmentService.updateDepartment(updatedDepartment);
    
    if (success) {
      const updatedDepartments = departments.map(dep => {
        if (dep.id === currentDepartment.id) {
          return updatedDepartment;
        }
        return dep;
      });

      setDepartments(updatedDepartments);
      setIsManageEmployeesDialogOpen(false);
    }
  };

  // Get employees for a specific department
  const getDepartmentEmployeesById = (departmentId: string) => {
    return getDepartmentEmployees(departmentId, departments);
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
    getDepartmentEmployees: getDepartmentEmployeesById
  };
};
