
import { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { getEmployee } from '../services/employeeService';
import { useQuery } from '@tanstack/react-query';

export const useEmployee = (employeeId: string | null) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Use React Query for data fetching with caching
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      if (!employeeId) {
        console.log("No employee ID provided");
        return null;
      }
      
      console.log("Fetching employee data for ID:", employeeId);
      try {
        const employeeData = await getEmployee(employeeId);
        return employeeData;
      } catch (err) {
        console.error("Error in query function:", err);
        throw err;
      }
    },
    enabled: !!employeeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onSuccess: (data) => {
      if (data) {
        console.log("Employee data retrieved:", data);
        setEmployee(data);
      } else {
        console.log("No employee data returned");
      }
    },
    onError: (err) => {
      console.error("Error fetching employee:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch employee data'));
    }
  });

  // Update employee when data changes
  useEffect(() => {
    if (data) {
      setEmployee(data);
    }
  }, [data]);
  
  return {
    employee,
    isLoading,
    error,
    refetch
  };
};
