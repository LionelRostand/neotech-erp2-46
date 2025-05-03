
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
      if (!employeeId) return null;
      
      console.log("Fetching employee data for ID:", employeeId);
      return getEmployee(employeeId);
    },
    enabled: !!employeeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onSuccess: (data) => {
      console.log("Employee data retrieved:", data);
      setEmployee(data);
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
    employee: employee,
    isLoading,
    error,
    refetch
  };
};
