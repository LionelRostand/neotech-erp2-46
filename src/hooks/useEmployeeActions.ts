
import { useState } from 'react';
import { Employee } from '@/types/employee';
import { 
  updateEmployee as apiUpdateEmployee,
  deleteEmployee as apiDeleteEmployee,
  createEmployee as apiCreateEmployee
} from '@/components/module/submodules/employees/services/employeeService';
import { useQueryClient } from '@tanstack/react-query';

export const useEmployeeActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateEmployee = async (data: Partial<Employee>): Promise<void> => {
    setIsLoading(true);
    try {
      if (!data.id) {
        throw new Error("Employee ID is required for update");
      }
      
      // Ensure skills are properly formatted before sending to API
      if (data.skills) {
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
      }
      
      await apiUpdateEmployee(data.id, data);
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating employee:", error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await apiDeleteEmployee(id);
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting employee:", error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createEmployee = async (data: Omit<Employee, 'id'>): Promise<Employee | null> => {
    setIsLoading(true);
    try {
      // Ensure skills are properly formatted before sending to API
      if (data.skills) {
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
      }
      
      const newEmployee = await apiCreateEmployee(data);
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      return newEmployee;
    } catch (error) {
      console.error("Error creating employee:", error);
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
