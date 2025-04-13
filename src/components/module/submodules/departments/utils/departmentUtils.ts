
import { Department, DepartmentFormData } from '../types';
import { Employee } from '@/types/employee';

export const createDefaultDepartments = (): Department[] => {
  return [
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
};

export const generateDepartmentId = (departments: Department[]): string => {
  return `DEP${(departments.length + 1).toString().padStart(3, '0')}`;
};

export const createEmptyFormData = (departments: Department[]): DepartmentFormData => {
  return {
    id: generateDepartmentId(departments),
    name: "",
    description: "",
    managerId: "",
    color: "#3b82f6",
    employeeIds: []
  };
};

export const prepareDepartmentFromForm = (
  formData: DepartmentFormData, 
  selectedEmployees: string[],
  allEmployees: Employee[],
  currentDepartment?: Department
): Department => {
  // Find the selected manager from all employees
  const selectedManager = formData.managerId && formData.managerId !== "none"
    ? allEmployees.find(emp => emp.id === formData.managerId) 
    : null;

  const managerName = selectedManager 
    ? `${selectedManager.firstName} ${selectedManager.lastName}` 
    : null;

  return {
    id: formData.id,
    name: formData.name,
    description: formData.description,
    managerId: formData.managerId === "none" ? null : formData.managerId || null,
    managerName: managerName,
    employeesCount: selectedEmployees.length,
    color: formData.color,
    employeeIds: selectedEmployees,
    ...(currentDepartment && { ...currentDepartment })
  };
};

export const getDepartmentEmployees = (departmentId: string, allEmployees: Employee[] = []): Employee[] => {
  if (!departmentId || allEmployees.length === 0) return [];
  
  return allEmployees.filter(emp => {
    // Check if employee is in the department by employeeIds
    // or by department/departmentId property
    
    if (!emp.department && !emp.departmentId) return false;
    
    // Check if department is a string (departmentId)
    if (typeof emp.department === 'string') {
      return emp.department === departmentId;
    }
    
    // Check if department is an object with an id property
    if (typeof emp.department === 'object' && emp.department !== null) {
      // Type assertion to tell TypeScript this object should have an id property
      const deptObj = emp.department as { id: string };
      return deptObj.id === departmentId;
    }
    
    // Check departmentId property
    return emp.departmentId === departmentId;
  });
};

// Système de notification pour les mises à jour de départements
const departmentUpdateListeners: Array<(departments: Department[]) => void> = [];

export const notifyDepartmentUpdates = (departments: Department[]) => {
  try {
    console.log("Envoi de notification de mise à jour des départements:", departments);
    
    // Déclencher l'événement personnalisé
    const updateEvent = new CustomEvent('departments-updated', { 
      detail: { departments } 
    });
    window.dispatchEvent(updateEvent);
    
    // Notifier aussi tous les écouteurs inscrits directement
    departmentUpdateListeners.forEach(listener => {
      try {
        listener(departments);
      } catch (error) {
        console.error("Erreur dans un écouteur de mise à jour de département:", error);
      }
    });
  } catch (error) {
    console.error("Erreur lors de la notification des mises à jour de département:", error);
  }
};

export const subscribeToDepartmentUpdates = (callback: (departments: Department[]) => void) => {
  const handleUpdate = (event: Event) => {
    const customEvent = event as CustomEvent<{departments: Department[]}>;
    if (customEvent.detail && customEvent.detail.departments) {
      callback(customEvent.detail.departments);
    }
  };
  
  // Ajouter à la liste des écouteurs directs
  departmentUpdateListeners.push(callback);
  
  // S'abonner aussi à l'événement
  window.addEventListener('departments-updated', handleUpdate);
  
  // Retourner une fonction pour se désabonner
  return () => {
    // Retirer de la liste des écouteurs directs
    const index = departmentUpdateListeners.indexOf(callback);
    if (index !== -1) {
      departmentUpdateListeners.splice(index, 1);
    }
    
    // Se désabonner de l'événement
    window.removeEventListener('departments-updated', handleUpdate);
  };
};
