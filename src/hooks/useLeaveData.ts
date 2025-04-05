
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

export interface Leave {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeePhoto?: string;
  department?: string;
  type: string;
  status: 'En attente' | 'Approuvé' | 'Refusé';
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  requestDate: string;
  approver?: string;
  notes?: string;
}

/**
 * Hook to access leave requests data from Firebase
 */
export const useLeaveData = (refreshTrigger?: number) => {
  const { leaveRequests, employees, isLoading, error } = useHrModuleData();
  
  // Transform leave requests with employee data
  const leaves = useMemo(() => {
    if (!leaveRequests || leaveRequests.length === 0) return [];
    
    return leaveRequests.map(request => {
      // Find the associated employee
      const employee = employees?.find(emp => emp.id === request.employeeId);
      
      // Format status
      const status = 
        request.status === 'approved' ? 'Approuvé' :
        request.status === 'rejected' ? 'Refusé' : 
        'En attente';
      
      // Calculate duration in days
      const durationDays = request.durationDays || calculateDuration(request.startDate, request.endDate);
      
      return {
        id: request.id,
        employeeId: request.employeeId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        department: employee?.department || 'Non spécifié',
        type: request.type || 'Congés payés',
        status: status,
        startDate: formatDate(request.startDate),
        endDate: formatDate(request.endDate),
        days: durationDays,
        reason: request.reason,
        requestDate: formatDate(request.requestDate || request.createdAt),
        approver: request.approverName,
        notes: request.notes
      } as Leave;
    });
  }, [leaveRequests, employees, refreshTrigger]);
  
  // Calculate leave stats
  const stats = useMemo(() => {
    const pending = leaves.filter(leave => leave.status === 'En attente').length;
    const approved = leaves.filter(leave => leave.status === 'Approuvé').length;
    const rejected = leaves.filter(leave => leave.status === 'Refusé').length;
    const total = leaves.length;
    
    return {
      pending,
      approved,
      rejected,
      total
    };
  }, [leaves]);
  
  // Helper function to calculate duration between two dates
  const calculateDuration = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because it's inclusive
    } catch (error) {
      console.error('Error calculating duration:', error);
      return 1;
    }
  };
  
  // Helper function to format dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Error formatting date:', dateStr, error);
      return dateStr;
    }
  };
  
  return {
    leaves,
    stats,
    isLoading,
    error
  };
};
