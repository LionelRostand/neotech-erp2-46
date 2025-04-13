
import { useState } from 'react';
import { createEmployee, syncManagerStatus, updateEmployeeDoc } from '@/services/employeeService';
import { Employee } from '@/types/employee';
import { useFirestore } from './useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { isEmployeeManager } from '@/components/module/submodules/employees/utils/employeeUtils';
import { toast } from 'sonner';

export const useEmployeeService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const firestore = useFirestore(COLLECTIONS.HR.EMPLOYEES);
  
  /**
   * Créer un nouvel employé en vérifiant les doublons et le statut de manager
   */
  const addEmployee = async (employeeData: Partial<Employee>): Promise<Employee | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Début de création d\'un employé:', employeeData);
      
      // Nettoyer les données pour éliminer les valeurs undefined
      const cleanedData = Object.entries(employeeData).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      console.log('Données nettoyées:', cleanedData);
      
      // Déterminer si l'employé est un manager basé sur sa position ou si forceManager est vrai
      const isManager = cleanedData.forceManager === true || 
                       isEmployeeManager(cleanedData.position || '') || 
                       isEmployeeManager(cleanedData.role || '');
      
      // Ajouter explicitement la propriété isManager
      const employeeWithManagerStatus = {
        ...cleanedData,
        isManager
      };
      
      // Utiliser le service dédié pour créer l'employé
      const newEmployee = await createEmployee(employeeWithManagerStatus);
      
      if (newEmployee) {
        toast.success(`L'employé ${newEmployee.firstName} ${newEmployee.lastName} a été créé avec succès`);
        
        // Notifier si c'est un manager
        if (newEmployee.isManager) {
          toast.success(`${newEmployee.firstName} ${newEmployee.lastName} a été ajouté à la liste des managers`);
        }
      }
      
      return newEmployee;
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      setError(error instanceof Error ? error : new Error('Erreur inconnue'));
      toast.error(`Erreur lors de la création de l'employé: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Mettre à jour un employé existant et synchroniser son statut de manager
   */
  const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Début de mise à jour d\'un employé:', id, employeeData);
      
      // Nettoyer les données pour éliminer les valeurs undefined
      const cleanedData = Object.entries(employeeData).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      console.log('Données nettoyées pour mise à jour:', cleanedData);
      
      // Déterminer si l'employé est un manager basé sur sa position ou si forceManager est vrai
      const isManager = cleanedData.forceManager === true || 
                       isEmployeeManager(cleanedData.position || '') || 
                       isEmployeeManager(cleanedData.role || '');
      
      // Ajouter explicitement la propriété isManager et timestamp de mise à jour
      const employeeWithManagerStatus = {
        ...cleanedData,
        isManager,
        updatedAt: new Date().toISOString()
      };
      
      // Utiliser le service dédié pour mettre à jour l'employé au lieu d'utiliser directement firestore.update
      const updatedEmployee = await updateEmployeeDoc(id, employeeWithManagerStatus);
      
      if (updatedEmployee) {
        // Synchroniser le statut de manager
        await syncManagerStatus(updatedEmployee);
        toast.success(`L'employé ${updatedEmployee.firstName} ${updatedEmployee.lastName} a été mis à jour avec succès`);
      }
      
      return updatedEmployee;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'employé:', error);
      setError(error instanceof Error ? error : new Error('Erreur inconnue'));
      toast.error(`Erreur lors de la mise à jour de l'employé: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    addEmployee,
    updateEmployee,
    isLoading,
    error
  };
};
