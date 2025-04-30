
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Department } from '../types';
import { updateDocument, setDocument } from '@/hooks/firestore/update-operations';
import { deleteDocument } from '@/hooks/firestore/delete-operations';

export const useDepartmentService = () => {
  const createDepartment = async (department: Department): Promise<boolean> => {
    try {
      // Make sure to add any missing properties
      const now = new Date().toISOString();
      const fullDepartment: Department = {
        ...department,
        createdAt: now,
        updatedAt: now,
        employeesCount: department.employeeIds?.length || 0
      };
      
      // Use the ID if it exists, otherwise Firebase will generate one
      const result = await setDocument(COLLECTIONS.HR.DEPARTMENTS, department.id, fullDepartment);
      return !!result;
    } catch (error) {
      console.error("Error creating department:", error);
      return false;
    }
  };

  const updateDepartment = async (department: Department): Promise<boolean> => {
    if (!department.id) {
      console.error("Cannot update department without ID");
      return false;
    }
    
    try {
      // Update the timestamp
      const updatedDepartment = {
        ...department,
        updatedAt: new Date().toISOString()
      };
      
      const result = await updateDocument(COLLECTIONS.HR.DEPARTMENTS, department.id, updatedDepartment);
      return !!result;
    } catch (error) {
      console.error("Error updating department:", error);
      return false;
    }
  };

  const deleteDepartment = async (id: string, name: string): Promise<boolean> => {
    if (!id) {
      console.error("Cannot delete department without ID");
      return false;
    }
    
    try {
      await deleteDocument(COLLECTIONS.HR.DEPARTMENTS, id);
      return true;
    } catch (error) {
      console.error(`Error deleting department ${name}:`, error);
      return false;
    }
  };

  return {
    createDepartment,
    updateDepartment,
    deleteDepartment
  };
};
