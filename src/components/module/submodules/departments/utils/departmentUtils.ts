
import { Department } from '../types';

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
