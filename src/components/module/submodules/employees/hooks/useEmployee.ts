
import { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { getEmployee } from '../services/employeeService';

export const useEmployee = (employeeId: string | null) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEmployeeData = async () => {
    if (!employeeId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching employee data for ID:", employeeId);
      const employeeData = await getEmployee(employeeId);
      
      if (employeeData) {
        console.log("Employee data retrieved:", employeeData);
        
        // Ensure the employee has all required fields
        const processedEmployee = {
          ...employeeData,
          // Ensure skills array exists and is valid
          skills: Array.isArray(employeeData.skills) 
            ? employeeData.skills.filter(skill => skill !== null && skill !== undefined)
            : [],
        };
        
        setEmployee(processedEmployee);
      } else {
        console.warn("No employee data found for ID:", employeeId);
        setError(new Error("Employee not found"));
      }
    } catch (err) {
      console.error("Error fetching employee:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch employee data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [employeeId]);

  return {
    employee,
    isLoading,
    error,
    refetch: fetchEmployeeData
  };
};
