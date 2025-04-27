
import { useState } from 'react';
import { createEmployee, syncManagerStatus, updateEmployeeDoc } from '@/services/employeeService';
import { Employee } from '@/types/employee';
import { useFirestore } from './useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
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
      
      // Utiliser directement la fonction du service pour créer l'employé
      const newEmployee = await createEmployee(employeeData);
      
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
      
      // S'assurer que l'email professionnel est correctement généré lors de la mise à jour
      if (employeeData.firstName && employeeData.lastName && employeeData.company) {
        const firstName = employeeData.firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const lastName = employeeData.lastName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const company = typeof employeeData.company === 'string' 
          ? employeeData.company.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '')
          : '';
          
        employeeData.professionalEmail = `${firstName}.${lastName}@${company}.com`;
      }

      // Ensure we're not sending undefined values
      const cleanedData: Partial<Employee> = {};
      Object.entries(employeeData).forEach(([key, value]) => {
        if (value !== undefined) {
          cleanedData[key as keyof Employee] = value;
        }
      });
      
      // Use the update operation directly from firestore hook
      await firestore.update(id, cleanedData);
      
      // Reconstruct the updated employee data with the ID
      const updatedEmployee = { 
        id, 
        ...cleanedData,
        updatedAt: new Date().toISOString()
      } as Employee;
      
      // Synchroniser le statut de manager si nécessaire
      if (cleanedData.isManager !== undefined) {
        await syncManagerStatus(updatedEmployee);
      }
      
      toast.success(`L'employé ${updatedEmployee.firstName} ${updatedEmployee.lastName} a été mis à jour avec succès`);
      
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
