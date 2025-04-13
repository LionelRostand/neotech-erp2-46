
import { useMemo, useState, useCallback } from 'react';
import { useHrModuleData } from './useHrModuleData';

/**
 * Policy type definitions
 */
export interface LeavePolicy {
  type: string;
  daysPerYear: number;
  carryOver: boolean;
  maxCarryOver?: number;
  proRated: boolean;
}

export interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  employeePhoto: string;
  department: string;
  type: string;
  total: number;
  used: number;
  remaining: number;
}

/**
 * Default leave policies
 */
const DEFAULT_LEAVE_POLICIES: LeavePolicy[] = [
  { type: 'Congés payés', daysPerYear: 25, carryOver: true, maxCarryOver: 10, proRated: true },
  { type: 'RTT', daysPerYear: 12, carryOver: false, proRated: true },
  { type: 'Congé maladie', daysPerYear: 0, carryOver: false, proRated: false }, // Unlimited
  { type: 'Congé exceptionnel', daysPerYear: 3, carryOver: false, proRated: false },
];

/**
 * Hook to calculate leave balances based on policies and leave requests
 */
export const useLeaveBalances = (employeeId?: string) => {
  const { employees, leaveRequests, isLoading } = useHrModuleData();
  const [error, setError] = useState<Error | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // Function to force refresh the data
  const refetch = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);
  
  // Calculate leave balances
  const leaveBalances = useMemo(() => {
    if (!employees || !leaveRequests) return [];
    
    try {
      // Filter requests by employee if employeeId is provided
      const filteredRequests = employeeId
        ? leaveRequests.filter(req => req.employeeId === employeeId)
        : leaveRequests;
      
      // Calculate used days for each leave type and employee
      const usedDaysByEmployeeAndType = filteredRequests.reduce((acc, request) => {
        if (request.status === 'approved' || request.status === 'Approuvé') {
          const empId = request.employeeId;
          const type = request.type || 'Congés payés';
          let days = request.durationDays || request.days || 0;
          
          // Calculate days if not provided
          if (days === 0 && request.startDate && request.endDate) {
            try {
              const start = new Date(request.startDate);
              const end = new Date(request.endDate);
              const diffTime = Math.abs(end.getTime() - start.getTime());
              days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            } catch (e) {
              console.error('Error calculating days', e);
              days = 1; // Default to 1 day if calculation fails
            }
          }
          
          if (!acc[empId]) acc[empId] = {};
          if (!acc[empId][type]) acc[empId][type] = 0;
          
          acc[empId][type] += days;
        }
        return acc;
      }, {});
      
      // Apply policies to each employee
      const balances = employees.flatMap(employee => {
        const empId = employee.id;
        const hireDate = new Date(employee.hireDate || employee.startDate || new Date());
        const now = new Date();
        
        // Calculate employment duration in years
        const employmentYears = (now.getFullYear() - hireDate.getFullYear()) + 
          (now.getMonth() - hireDate.getMonth()) / 12;
        
        // Apply pro-ration for first year if needed
        const proRationFactor = employmentYears < 1 ? employmentYears : 1;
        
        return DEFAULT_LEAVE_POLICIES.map(policy => {
          const total = policy.proRated && employmentYears < 1
            ? Math.floor(policy.daysPerYear * proRationFactor)
            : policy.daysPerYear;
            
          const used = usedDaysByEmployeeAndType[empId]?.[policy.type] || 0;
          const remaining = policy.type === 'Congé maladie' ? 0 : Math.max(0, total - used);
          
          return {
            employeeId: empId,
            type: policy.type,
            total,
            used,
            remaining,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            employeePhoto: employee.photoURL || employee.photo || '',
            department: employee.department || 'Non spécifié',
          };
        });
      });
      
      // If employeeId is provided, filter the results
      return employeeId 
        ? balances.filter(balance => balance.employeeId === employeeId)
        : balances;
    } catch (err) {
      console.error('Error calculating leave balances', err);
      setError(err instanceof Error ? err : new Error('Erreur de calcul des soldes de congés'));
      return [];
    }
  }, [employees, leaveRequests, employeeId, refreshCounter]);
  
  return {
    leaveBalances,
    isLoading,
    error,
    refetch
  };
};
