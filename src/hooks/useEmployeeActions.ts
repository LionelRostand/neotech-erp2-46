
import { useState } from 'react';
import { Employee } from '@/types/employee';
import { 
  updateEmployee as apiUpdateEmployee,
  deleteEmployee as apiDeleteEmployee,
  createEmployee as apiCreateEmployee,
  updateEmployeeDoc
} from '@/components/module/submodules/employees/services/employeeService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useEmployeeActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateEmployee = async (data: Partial<Employee>): Promise<void> => {
    setIsLoading(true);
    try {
      if (!data.id) {
        throw new Error("Employee ID is required for update");
      }
      
      console.log("Updating employee data:", data);
      
      // Ensure skills are properly formatted before sending to API
      if (data.skills && Array.isArray(data.skills)) {
        // Filter out null/undefined values and transform any invalid objects
        data.skills = data.skills
          .filter(skill => skill !== null && skill !== undefined)
          .map(skill => {
            if (typeof skill === 'string') {
              return skill;
            }
            // Ensure skill objects have the required properties
            const skillObj = skill as any;
            if (!skillObj.name) {
              return JSON.stringify(skillObj);
            }
            return {
              ...skillObj,
              id: skillObj.id || Date.now().toString(),
              level: skillObj.level || 'other',
              // Ensure name is a string to avoid rendering issues
              name: typeof skillObj.name === 'object' ? JSON.stringify(skillObj.name) : String(skillObj.name)
            };
          });
      } else {
        // Ensure skills is a valid array to prevent errors
        data.skills = [];
      }
      
      // Use updateEmployeeDoc for better handling of nested objects like addresses
      const updatedEmployee = await updateEmployeeDoc(data.id, data);
      
      if (updatedEmployee) {
        toast.success("Employé mis à jour avec succès");
      }
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Erreur lors de la mise à jour de l'employé");
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await apiDeleteEmployee(id);
      
      toast.success("Employé supprimé avec succès");
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Erreur lors de la suppression de l'employé");
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createEmployee = async (data: Omit<Employee, 'id'>): Promise<Employee | null> => {
    setIsLoading(true);
    try {
      console.log("Creating new employee:", data);
      
      // Create a copy of the data to ensure we don't mutate the original
      const employeeData = {...data};
      
      // Ensure skills are properly formatted before sending to API
      if (employeeData.skills && Array.isArray(employeeData.skills)) {
        // Filter out null/undefined values and transform any invalid objects
        employeeData.skills = employeeData.skills
          .filter(skill => skill !== null && skill !== undefined)
          .map(skill => {
            if (typeof skill === 'string') {
              return skill;
            }
            // Ensure skill objects have the required properties
            const skillObj = skill as any;
            if (!skillObj.name) {
              return JSON.stringify(skillObj);
            }
            return {
              ...skillObj,
              id: skillObj.id || Date.now().toString(),
              level: skillObj.level || 'other',
              // Ensure name is a string to avoid rendering issues
              name: typeof skillObj.name === 'object' ? JSON.stringify(skillObj.name) : String(skillObj.name)
            };
          });
      } else {
        // Ensure skills is a valid array to prevent errors
        employeeData.skills = [];
      }
      
      // Ensure address objects are properly initialized
      if (!employeeData.address || typeof employeeData.address !== 'object') {
        employeeData.address = {
          street: '',
          city: '',
          postalCode: '',
          country: '',
          state: ''
        };
      }
      
      if (!employeeData.workAddress || typeof employeeData.workAddress !== 'object') {
        employeeData.workAddress = {
          street: '',
          city: '',
          postalCode: '',
          country: ''
        };
      }
      
      const newEmployee = await apiCreateEmployee(employeeData);
      
      if (newEmployee) {
        toast.success("Nouvel employé créé avec succès");
      }
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      return newEmployee;
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Erreur lors de la création de l'employé");
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateEmployee,
    deleteEmployee,
    createEmployee,
    isLoading
  };
};
