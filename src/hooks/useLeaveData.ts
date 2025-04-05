
import { useMemo, useState } from 'react';
import { useHrModuleData } from './useHrModuleData';

// Define the Leave type to be exported
export interface Leave {
  id: string;
  employeeName: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  reason: string;
  employeeId: string;
  requestDate: string;
  approvedBy: string;
  employeePhoto: string;
}

export const useLeaveData = () => {
  const { leaveRequests, employees, isLoading } = useHrModuleData();
  const [error, setError] = useState<Error | null>(null);
  
  // Calculate stats based on leave requests
  const stats = useMemo(() => {
    if (!leaveRequests) {
      return { pending: 0, approved: 0, rejected: 0, total: 0 };
    }
    
    const pending = leaveRequests.filter(req => 
      req.status === 'pending' || req.status === 'En attente').length;
    
    const approved = leaveRequests.filter(req => 
      req.status === 'approved' || req.status === 'Approuvé').length;
    
    const rejected = leaveRequests.filter(req => 
      req.status === 'rejected' || req.status === 'Refusé').length;
    
    return {
      pending,
      approved, 
      rejected,
      total: leaveRequests.length
    };
  }, [leaveRequests]);
  
  // Format leave requests to a more user-friendly format
  const leaves = useMemo(() => {
    if (!leaveRequests || !employees) return [];
    
    return leaveRequests.map(leave => {
      // Find employee info
      const employee = employees.find(emp => emp.id === leave.employeeId);
      
      // Format the date from ISO or timestamp to DD/MM/YYYY
      const formatDate = (dateString: string | number) => {
        const date = typeof dateString === 'number' 
          ? new Date(dateString) 
          : new Date(dateString);
        
        return date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      };
      
      const startDate = leave.startDate ? formatDate(leave.startDate) : '';
      const endDate = leave.endDate ? formatDate(leave.endDate) : '';
      
      // Calculate days if not provided
      let days = leave.durationDays || leave.days || 0;
      if (days === 0 && startDate && endDate) {
        // Simple calculation if dates are available
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
      
      return {
        id: leave.id,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        department: employee?.department || 'Non spécifié',
        type: leave.type || 'Congés payés',
        startDate,
        endDate,
        days,
        status: leave.status || 'En attente',
        reason: leave.reason || leave.comment || '',
        employeeId: leave.employeeId,
        requestDate: leave.requestDate ? formatDate(leave.requestDate) : '',
        approvedBy: leave.approvedBy || '',
        employeePhoto: employee?.photoURL || employee?.photo || '',
      };
    });
  }, [leaveRequests, employees]);
  
  return { leaves, stats, isLoading, error };
};
