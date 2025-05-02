
import { useState } from 'react';
import { Employee, Skill } from '@/types/employee';
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
        console.log('Formatting skills before update:', data.skills);
        // Ensure skills is an array
        const skillsArray = Array.isArray(data.skills) ? data.skills : [];
        
        // Filter out null/undefined values and transform any invalid objects
        data.skills = skillsArray
          .filter(skill => skill !== null && skill !== undefined)
          .map(skill => {
            if (typeof skill === 'string') {
              return {
                id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                name: skill,
                level: 'débutant'
              };
            }
            // Ensure skill objects have the required properties
            const skillObj = skill as any;
            if (!skillObj.name) {
              return {
                id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                name: JSON.stringify(skillObj),
                level: 'débutant'
              };
            }
            
            return {
              ...skillObj,
              id: skillObj.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
              level: skillObj.level || 'débutant',
              // Ensure name is a string to avoid rendering issues
              name: typeof skillObj.name === 'object' ? JSON.stringify(skillObj.name) : String(skillObj.name)
            } as Skill;
          });
          
        console.log('Skills after formatting:', data.skills);
      }
      
      await apiUpdateEmployee(data.id, data);
      console.log('Employee updated successfully:', data.id);
      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', data.id] });
      
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
