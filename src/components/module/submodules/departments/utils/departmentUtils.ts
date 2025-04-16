
import { Department } from '../types';
import { Employee } from '@/types/employee';
import { EventEmitter } from '@/utils/eventEmitter';

// Create an event emitter for department updates
export const departmentEvents = new EventEmitter();

/**
 * Notifie les autres composants des mises à jour de départements
 * @param departments Départements mis à jour (optionnel)
 */
export const notifyDepartmentUpdates = (departments?: Department[]) => {
  departmentEvents.emit('departments:updated', departments);
};

/**
 * S'abonne aux mises à jour de départements
 * @param callback Fonction à appeler lors des mises à jour
 * @returns Fonction pour se désabonner
 */
export const subscribeToDepartmentUpdates = (callback: () => void) => {
  return departmentEvents.on('departments:updated', callback);
};

/**
 * Prépare un objet Department à partir des données de formulaire
 * @param formData Données du formulaire
 * @param selectedEmployees ID des employés sélectionnés
 * @param allEmployees Liste de tous les employés
 * @returns Un objet Department prêt à être enregistré
 */
export const prepareDepartmentFromForm = (
  formData: any, 
  selectedEmployees: string[],
  allEmployees: Employee[]
): Department => {
  // Trouver le manager sélectionné
  const selectedManager = formData.managerId && formData.managerId !== "none" 
    ? allEmployees.find(emp => emp.id === formData.managerId) 
    : null;
  
  const managerName = selectedManager 
    ? `${selectedManager.firstName} ${selectedManager.lastName}` 
    : null;
  
  return {
    id: formData.id || undefined, // Undefined permet à Firestore de générer un ID
    name: formData.name,
    description: formData.description,
    managerId: formData.managerId === "none" ? null : formData.managerId,
    managerName: managerName,
    color: formData.color,
    companyId: formData.companyId === "none" ? null : formData.companyId,
    parentId: formData.parentId === "none" ? null : formData.parentId,
    employeeIds: selectedEmployees,
    employeesCount: selectedEmployees.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Récupère les employés d'un département spécifique
 * @param departmentId ID du département
 * @param allEmployees Liste de tous les employés
 * @returns Liste des employés du département
 */
export const getDepartmentEmployees = (
  departmentId: string, 
  allEmployees: Employee[] = []
): Employee[] => {
  if (!departmentId || !allEmployees || allEmployees.length === 0) {
    return [];
  }
  
  return allEmployees.filter(emp => 
    emp.department === departmentId || 
    emp.departmentId === departmentId
  );
};
