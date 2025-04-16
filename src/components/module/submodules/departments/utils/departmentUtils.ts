
import { Department } from '../types';
import { Employee } from '@/types/employee';
import { v4 as uuidv4 } from 'uuid';

// Créer un système d'événements pour les mises à jour des départements
const departmentUpdateListeners: Array<(departments?: Department[]) => void> = [];

/**
 * S'abonner aux mises à jour des départements
 * @param callback Fonction à appeler lors d'une mise à jour
 * @returns Fonction pour se désabonner
 */
export const subscribeToDepartmentUpdates = (
  callback: (departments?: Department[]) => void
): (() => void) => {
  departmentUpdateListeners.push(callback);
  
  // Retourner une fonction pour se désabonner
  return () => {
    const index = departmentUpdateListeners.indexOf(callback);
    if (index !== -1) {
      departmentUpdateListeners.splice(index, 1);
    }
  };
};

/**
 * Notifier tous les abonnés d'une mise à jour des départements
 * @param departments Données des départements mises à jour (optionnel)
 */
export const notifyDepartmentUpdates = (departments?: Department[]): void => {
  console.log(`Notifying ${departmentUpdateListeners.length} listeners about department/hierarchy updates`);
  departmentUpdateListeners.forEach(listener => listener(departments));
};

/**
 * Créer un formulaire vide pour la création d'un département
 * @param departments Liste des départements existants (pour éviter les doublons)
 * @returns Données de formulaire vides
 */
export const createEmptyFormData = (departments: Department[] = []) => {
  // Générer un ID unique qui n'existe pas déjà dans la liste des départements
  let id = uuidv4();
  while (departments.some(dept => dept.id === id)) {
    id = uuidv4();
  }
  
  return {
    id,
    name: '',
    description: '',
    managerId: '',
    color: '#4f46e5', // Couleur par défaut (indigo)
    employeeIds: []
  };
};

/**
 * Préparer les données du département à partir du formulaire
 * @param formData Données du formulaire
 * @param selectedEmployees IDs des employés sélectionnés
 * @param allEmployees Liste complète des employés (pour trouver le manager)
 * @returns Objet département formaté
 */
export const prepareDepartmentFromForm = (
  formData: any, 
  selectedEmployees: string[],
  allEmployees: Employee[] = []
): Department => {
  // Trouver le manager sélectionné pour obtenir son nom
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
    managerId: formData.managerId === "none" ? null : formData.managerId,
    managerName: managerName,
    color: formData.color,
    employeeIds: selectedEmployees,
    employeesCount: selectedEmployees.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Récupérer les employés appartenant à un département
 * @param departmentId ID du département
 * @param employees Liste complète des employés
 * @returns Liste des employés du département
 */
export const getDepartmentEmployees = (
  departmentId: string, 
  employees: Employee[] = []
): Employee[] => {
  if (!departmentId || !employees.length) return [];
  
  return employees.filter(emp => 
    emp.department === departmentId || 
    emp.departmentId === departmentId
  );
};

