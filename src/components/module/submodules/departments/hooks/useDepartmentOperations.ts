
import { useCallback } from 'react';
import { collection, doc, updateDoc, getDoc, addDoc, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';
import { toast } from 'sonner';
import { Department, DepartmentFormData } from '../types';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/employee';
import { updateDocument, setDocument } from '@/hooks/firestore/update-operations';

export const useDepartmentOperations = () => {
  const { refetch } = useFirebaseDepartments();
  const { employees } = useEmployeeData();

  // Save department
  const handleSaveDepartment = useCallback(async (formData: DepartmentFormData, selectedEmployeeIds: string[]): Promise<boolean> => {
    try {
      // Find manager name if managerId is set
      let managerName = '';
      if (formData.managerId && employees && Array.isArray(employees)) {
        const manager = employees.find(emp => emp.id === formData.managerId);
        if (manager) {
          managerName = `${manager.lastName || ''} ${manager.firstName || ''}`.trim();
        }
      }

      // Create a new department
      const departmentRef = collection(db, COLLECTIONS.HR.DEPARTMENTS);
      await addDoc(departmentRef, {
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId || '',
        managerName,
        companyId: formData.companyId || '',
        color: formData.color || '#3b82f6',
        employeeIds: selectedEmployeeIds,
        employeesCount: selectedEmployeeIds.length,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast.success('Département créé avec succès');
      refetch(); // Refresh departments list
      return true;
    } catch (error) {
      console.error('Error creating department:', error);
      toast.error('Erreur lors de la création du département');
      return false;
    }
  }, [employees, refetch]);

  // Update department
  const handleUpdateDepartment = useCallback(async (formData: DepartmentFormData, selectedEmployeeIds: string[]): Promise<boolean> => {
    try {
      if (!formData.id) {
        toast.error('ID du département manquant');
        return false;
      }

      // Find manager name if managerId is set
      let managerName = '';
      if (formData.managerId && employees && Array.isArray(employees)) {
        const manager = employees.find(emp => emp.id === formData.managerId);
        if (manager) {
          managerName = `${manager.lastName || ''} ${manager.firstName || ''}`.trim();
        }
      }

      // Use setDocument instead of updateDoc to handle the case where the document doesn't exist
      await setDocument(COLLECTIONS.HR.DEPARTMENTS, formData.id, {
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId || '',
        managerName,
        companyId: formData.companyId || '',
        color: formData.color || '#3b82f6',
        employeeIds: selectedEmployeeIds,
        employeesCount: selectedEmployeeIds.length,
        updatedAt: new Date().toISOString()
      });

      toast.success('Département mis à jour avec succès');
      refetch(); // Refresh departments list
      return true;
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error('Erreur lors de la mise à jour du département');
      return false;
    }
  }, [employees, refetch]);

  // Save employee assignments
  const handleSaveEmployeeAssignments = useCallback(async (departmentId: string, departmentName: string, selectedEmployeeIds: string[]): Promise<boolean> => {
    try {
      // Use setDocument instead of updateDoc to handle the case where the document doesn't exist
      await setDocument(COLLECTIONS.HR.DEPARTMENTS, departmentId, {
        employeeIds: selectedEmployeeIds,
        employeesCount: selectedEmployeeIds.length,
        updatedAt: new Date().toISOString()
      });

      toast.success(`Employés assignés au département ${departmentName}`);
      refetch();
      return true;
    } catch (error) {
      console.error('Error assigning employees:', error);
      toast.error(`Erreur lors de l'assignation des employés: ${(error as Error).message}`);
      return false;
    }
  }, [refetch]);

  // Delete department
  const handleDeleteDepartment = useCallback(async (departmentId: string): Promise<boolean> => {
    try {
      if (!departmentId) return false;
      
      await deleteDoc(doc(db, COLLECTIONS.HR.DEPARTMENTS, departmentId));
      toast.success('Département supprimé avec succès');
      refetch();
      return true;
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Erreur lors de la suppression du département');
      return false;
    }
  }, [refetch]);

  // Get department employees
  const getDepartmentEmployees = useCallback((departmentId: string): string[] => {
    if (!departmentId || !employees || !Array.isArray(employees)) return [];

    // Filter employees that belong to the department
    const deptEmployees = employees.filter((employee: Employee) => {
      return employee.department === departmentId;
    });

    // Return array of employee IDs
    return deptEmployees.map((employee: Employee) => employee.id || '').filter(Boolean);
  }, [employees]);

  return {
    handleSaveDepartment,
    handleUpdateDepartment,
    handleSaveEmployeeAssignments,
    handleDeleteDepartment,
    getDepartmentEmployees
  };
};
