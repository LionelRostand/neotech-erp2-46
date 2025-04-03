
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Department, DepartmentFormData } from './types';
import { useDepartmentService } from './services/departmentService';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { v4 as uuidv4 } from 'uuid';

// Fonction pour créer un nouveau département vide
const createEmptyFormData = (): DepartmentFormData => {
  return {
    id: uuidv4(),
    name: '',
    description: '',
    managerId: '',
    color: '#3b82f6', // Bleu par défaut
    employeeIds: []
  };
};

// Fonction pour préparer les données du formulaire pour l'enregistrement
const prepareDepartmentFromForm = (
  formData: DepartmentFormData,
  selectedEmployees: string[],
  currentDepartment?: Department
): Department => {
  return {
    id: formData.id,
    name: formData.name,
    description: formData.description,
    managerId: formData.managerId === 'none' ? null : formData.managerId,
    managerName: null, // Sera rempli par useEmployeeData
    color: formData.color,
    employeeIds: selectedEmployees,
    employeesCount: selectedEmployees.length
  };
};

export const useDepartments = () => {
  // Service d'accès aux départements dans Firebase
  const departmentService = useDepartmentService();
  
  // Utiliser notre hook pour récupérer les données des employés et départements
  const { employees, departments: hrDepartments, isLoading } = useEmployeeData();

  // États pour les départements
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // États pour les dialogues et formulaires
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageEmployeesDialogOpen, setIsManageEmployeesDialogOpen] = useState(false);
  const [formData, setFormData] = useState<DepartmentFormData>(createEmptyFormData());
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [activeTab, setActiveTab] = useState("department-info");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Charger les départements depuis Firestore via useEmployeeData
  useEffect(() => {
    if (!isLoading) {
      if (hrDepartments && hrDepartments.length > 0) {
        setDepartments(hrDepartments);
        setLoading(false);
      } else {
        // Si aucun département n'est disponible, on charge depuis Firestore
        loadDepartmentsFromFirestore();
      }
    }
  }, [hrDepartments, isLoading]);

  // Fonction pour charger les départements directement depuis Firestore
  const loadDepartmentsFromFirestore = async () => {
    setLoading(true);
    try {
      const data = await departmentService.getAll();
      
      if (data.length > 0) {
        setDepartments(data);
      } else {
        // Si aucun département n'est trouvé, initialiser avec des départements par défaut
        const defaultDepartments = createDefaultDepartments();
        
        // Enregistrer les départements par défaut dans Firestore
        for (const dept of defaultDepartments) {
          await departmentService.createDepartment(dept);
        }
        
        setDepartments(defaultDepartments);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      toast.error("Erreur lors du chargement des départements");
    } finally {
      setLoading(false);
    }
  };

  // Créer des départements par défaut
  const createDefaultDepartments = (): Department[] => {
    return [
      {
        id: uuidv4(),
        name: 'Direction',
        description: 'Direction générale de l\'entreprise',
        managerId: null,
        managerName: null,
        employeesCount: 0,
        color: '#111827',
        employeeIds: []
      },
      {
        id: uuidv4(),
        name: 'Ressources Humaines',
        description: 'Gestion du personnel et recrutement',
        managerId: null,
        managerName: null,
        employeesCount: 0,
        color: '#3b82f6',
        employeeIds: []
      },
      {
        id: uuidv4(),
        name: 'Développement',
        description: 'Équipe de développement logiciel',
        managerId: null,
        managerName: null,
        employeesCount: 0,
        color: '#10b981',
        employeeIds: []
      },
      {
        id: uuidv4(),
        name: 'Marketing',
        description: 'Service marketing et communication',
        managerId: null,
        managerName: null,
        employeesCount: 0,
        color: '#f59e0b',
        employeeIds: []
      },
      {
        id: uuidv4(),
        name: 'Commercial',
        description: 'Équipe commerciale et ventes',
        managerId: null,
        managerName: null,
        employeesCount: 0,
        color: '#ef4444',
        employeeIds: []
      }
    ];
  };

  // Gérer les changements d'inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gérer la sélection du manager
  const handleManagerChange = (value: string) => {
    // Si value est 'none', définir sur une chaîne vide pour indiquer aucun manager
    setFormData({ ...formData, managerId: value === 'none' ? '' : value });
  };

  // Gérer la sélection de couleur
  const handleColorChange = (value: string) => {
    setFormData({ ...formData, color: value });
  };

  // Ouvrir la boîte de dialogue d'ajout de département
  const handleAddDepartment = () => {
    setFormData(createEmptyFormData());
    setSelectedEmployees([]);
    setActiveTab("department-info");
    setIsAddDialogOpen(true);
  };

  // Ouvrir la boîte de dialogue d'édition de département
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

  // Ouvrir la boîte de dialogue de gestion des employés
  const handleManageEmployees = (department: Department) => {
    setCurrentDepartment(department);
    setSelectedEmployees(department.employeeIds || []);
    setIsManageEmployeesDialogOpen(true);
  };

  // Gérer la sélection/désélection des employés
  const handleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  // Enregistrer un nouveau département
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
      // Recharger les données pour obtenir les informations enrichies
      loadDepartmentsFromFirestore();
    }
  };

  // Mettre à jour un département existant
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
      // Recharger les données pour obtenir les informations enrichies
      loadDepartmentsFromFirestore();
    }
  };

  // Supprimer un département
  const handleDeleteDepartment = async (id: string) => {
    const departmentToDelete = departments.find(dep => dep.id === id);
    if (!departmentToDelete) return;

    // Confirmer la suppression
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le département ${departmentToDelete.name} ?`)) {
      const success = await departmentService.deleteDepartment(id, departmentToDelete.name);
      
      if (success) {
        setDepartments(departments.filter(dep => dep.id !== id));
      }
    }
  };

  // Enregistrer les affectations d'employés
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
      // Recharger les données pour obtenir les informations enrichies
      loadDepartmentsFromFirestore();
    }
  };

  // Obtenir les employés pour un département spécifique en utilisant les données réelles
  const getDepartmentEmployeesById = (departmentId: string) => {
    if (!employees || !employees.length) return [];
    
    return employees.filter(emp => {
      const empDeptId = emp.departmentId || emp.department;
      return empDeptId === departmentId;
    });
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
