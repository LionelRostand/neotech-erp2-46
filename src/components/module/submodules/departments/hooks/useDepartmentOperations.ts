
import { useState } from 'react';
import { toast } from 'sonner';
import { doc, collection, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Department } from '../types';
import { prepareDepartmentFromForm } from '../utils/departmentUtils';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';

export const useDepartmentOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { employees } = useEmployeeData();
  const { companies } = useFirebaseCompanies();

  // Créer un nouveau département
  const handleSaveDepartment = async (formData: any, selectedEmployees: string[]) => {
    setIsLoading(true);
    
    try {
      // Préparer les données du département
      const departmentData = prepareDepartmentFromForm(formData, selectedEmployees, employees);
      
      // Ajouter le nom de l'entreprise si un ID d'entreprise est fourni
      if (formData.companyId && companies) {
        const company = companies.find(comp => comp.id === formData.companyId);
        if (company) {
          departmentData.companyName = company.name;
        }
      }
      
      // Ajouter des timestamps
      const dataWithTimestamps = {
        ...departmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Enregistrer dans Firestore
      await addDoc(collection(db, COLLECTIONS.HR.DEPARTMENTS), dataWithTimestamps);
      
      toast.success(`Le département ${formData.name} a été créé avec succès`);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erreur lors de la création du département:', error);
      toast.error(`Erreur lors de la création du département: ${error}`);
      setIsLoading(false);
      return false;
    }
  };

  // Mettre à jour un département existant
  const handleUpdateDepartment = async (formData: any, selectedEmployees: string[], currentDepartment?: Department) => {
    if (!currentDepartment) {
      toast.error('Impossible de mettre à jour: département non trouvé');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Préparer les données du département
      const departmentData = {
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId === 'none' ? null : formData.managerId,
        color: formData.color,
        employeeIds: selectedEmployees,
        employeesCount: selectedEmployees.length,
        companyId: formData.companyId || null,
        updatedAt: serverTimestamp()
      };
      
      // Ajouter le nom du manager si un ID de manager est fourni
      if (departmentData.managerId) {
        const manager = employees.find(emp => emp.id === departmentData.managerId);
        if (manager) {
          departmentData.managerName = `${manager.firstName} ${manager.lastName}`;
        }
      } else {
        departmentData.managerName = null;
      }
      
      // Ajouter le nom de l'entreprise si un ID d'entreprise est fourni
      if (formData.companyId && companies) {
        const company = companies.find(comp => comp.id === formData.companyId);
        if (company) {
          departmentData.companyName = company.name;
        }
      } else {
        departmentData.companyName = null;
      }
      
      // Mettre à jour dans Firestore
      const docRef = doc(db, COLLECTIONS.HR.DEPARTMENTS, currentDepartment.id);
      await updateDoc(docRef, departmentData);
      
      toast.success(`Le département ${formData.name} a été mis à jour avec succès`);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du département:', error);
      toast.error(`Erreur lors de la mise à jour du département: ${error}`);
      setIsLoading(false);
      return false;
    }
  };

  // Supprimer un département
  const handleDeleteDepartment = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le département "${name}" ?`)) {
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Supprimer de Firestore
      const docRef = doc(db, COLLECTIONS.HR.DEPARTMENTS, id);
      await deleteDoc(docRef);
      
      toast.success(`Le département ${name} a été supprimé avec succès`);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du département:', error);
      toast.error(`Erreur lors de la suppression du département: ${error}`);
      setIsLoading(false);
      return false;
    }
  };

  // Gérer les affectations d'employés à un département
  const handleSaveEmployeeAssignments = async (currentDepartment?: Department, selectedEmployees: string[] = []) => {
    if (!currentDepartment) {
      toast.error('Impossible de mettre à jour: département non trouvé');
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Mettre à jour dans Firestore
      const docRef = doc(db, COLLECTIONS.HR.DEPARTMENTS, currentDepartment.id);
      await updateDoc(docRef, {
        employeeIds: selectedEmployees,
        employeesCount: selectedEmployees.length,
        updatedAt: serverTimestamp()
      });
      
      toast.success(`Les employés du département ${currentDepartment.name} ont été mis à jour avec succès`);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des employés du département:', error);
      toast.error(`Erreur lors de la mise à jour des employés: ${error}`);
      setIsLoading(false);
      return false;
    }
  };

  return {
    isLoading,
    handleSaveDepartment,
    handleUpdateDepartment,
    handleDeleteDepartment,
    handleSaveEmployeeAssignments
  };
};
