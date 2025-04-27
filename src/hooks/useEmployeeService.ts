
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
   * Générer un email professionnel à partir du prénom, nom et entreprise
   */
  const generateProfessionalEmail = (firstName: string, lastName: string, company: string): string => {
    if (!firstName || !lastName || !company) {
      return '';
    }
    
    const normalizedFirstName = firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedLastName = lastName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedCompany = typeof company === 'string' 
      ? company.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '')
      : '';
      
    return `${normalizedFirstName}.${normalizedLastName}@${normalizedCompany}.com`;
  };
  
  /**
   * Créer un nouvel employé en vérifiant les doublons et le statut de manager
   */
  const addEmployee = async (employeeData: Partial<Employee>): Promise<Employee | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Début de création d\'un employé:', employeeData);
      
      // S'assurer que l'email professionnel est correctement généré
      if (employeeData.firstName && employeeData.lastName && employeeData.company) {
        employeeData.professionalEmail = generateProfessionalEmail(
          employeeData.firstName,
          employeeData.lastName,
          typeof employeeData.company === 'string' ? employeeData.company : employeeData.company.id || ''
        );
      }
      
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
      
      // Récupérer l'employé existant si nécessaire pour la construction de l'email
      let existingEmployee = null;
      if ((employeeData.firstName || employeeData.lastName || employeeData.company) && 
          (!employeeData.firstName || !employeeData.lastName || !employeeData.company)) {
        // Il nous manque des données pour générer l'email, récupérons l'employé existant
        const docSnapshot = await firestore.get(id);
        if (docSnapshot) {
          existingEmployee = docSnapshot as Employee;
        }
      }
      
      // Recalculer l'email professionnel si une des données utilisées pour le générer change
      if (employeeData.firstName || employeeData.lastName || employeeData.company) {
        const firstName = employeeData.firstName || existingEmployee?.firstName || '';
        const lastName = employeeData.lastName || existingEmployee?.lastName || '';
        const company = employeeData.company || existingEmployee?.company || '';
        
        employeeData.professionalEmail = generateProfessionalEmail(firstName, lastName, company);
        console.log("Nouvel email professionnel généré:", employeeData.professionalEmail);
      }

      // Ensure we're not sending undefined values
      const cleanedData: Partial<Employee> = {};
      Object.entries(employeeData).forEach(([key, value]) => {
        if (value !== undefined) {
          cleanedData[key as keyof Employee] = value;
        }
      });
      
      // Ajouter la date de mise à jour
      cleanedData.updatedAt = new Date().toISOString();
      
      console.log("Données nettoyées pour la mise à jour:", cleanedData);
      
      // Use the update operation directly from firestore hook
      await firestore.update(id, cleanedData);
      
      // Reconstruct the updated employee data with the ID
      const updatedEmployee = { 
        id, 
        ...cleanedData
      } as Employee;
      
      // Synchroniser le statut de manager si nécessaire
      if (cleanedData.isManager !== undefined) {
        await syncManagerStatus(updatedEmployee);
      }
      
      toast.success(`L'employé ${updatedEmployee.firstName || ''} ${updatedEmployee.lastName || ''} a été mis à jour avec succès`);
      
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
