
import { useState, useEffect, useCallback } from 'react';
import { useHrModuleData } from './useHrModuleData';

// Define the Leave type to be exported
export interface Leave {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  reason: string;
  requestDate: string;
  approvedBy: string;
  employeePhoto: string;
}

export const useLeaveData = () => {
  const { leaveRequests, employees, isLoading } = useHrModuleData();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  
  // Calculate stats based on leave requests
  const stats = {
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  };
  
  // Format leave requests to a more user-friendly format
  useEffect(() => {
    if (!leaveRequests || !employees) return;
    
    try {
      const safeLeaveRequests = Array.isArray(leaveRequests) ? leaveRequests : [];
      const safeEmployees = Array.isArray(employees) ? employees : [];
      
      // Update stats
      stats.total = safeLeaveRequests.length;
      stats.pending = safeLeaveRequests.filter(req => 
        req.status === 'pending' || req.status === 'En attente').length;
      stats.approved = safeLeaveRequests.filter(req => 
        req.status === 'approved' || req.status === 'Approuvé').length;
      stats.rejected = safeLeaveRequests.filter(req => 
        req.status === 'rejected' || req.status === 'Refusé').length;
      
      const formattedLeaves = safeLeaveRequests.map(leave => {
        // Find employee info
        const employee = safeEmployees.find(emp => emp && emp.id === leave.employeeId);
        
        // Format the date from ISO or timestamp to DD/MM/YYYY
        const formatDate = (dateString: string | number) => {
          try {
            const date = typeof dateString === 'number' 
              ? new Date(dateString) 
              : new Date(dateString);
            
            return date.toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
          } catch (e) {
            console.error('Error formatting date', e);
            return 'Date invalide';
          }
        };
        
        const startDate = leave.startDate ? formatDate(leave.startDate) : '';
        const endDate = leave.endDate ? formatDate(leave.endDate) : '';
        
        // Calculate days if not provided
        let days = leave.durationDays || leave.days || 0;
        if (days === 0 && startDate && endDate) {
          try {
            // Simple calculation if dates are available
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          } catch (e) {
            console.error('Error calculating days', e);
            days = 1; // Default to 1 day if calculation fails
          }
        }
        
        return {
          id: leave.id,
          employeeId: leave.employeeId,
          employeeName: employee ? `${employee.firstName || ''} ${employee.lastName || ''}`.trim() : 'Employé inconnu',
          department: employee?.department || 'Non spécifié',
          type: leave.type || 'Congés payés',
          startDate,
          endDate,
          days,
          status: leave.status || 'En attente',
          reason: leave.reason || leave.comment || '',
          requestDate: leave.requestDate ? formatDate(leave.requestDate) : '',
          approvedBy: leave.approvedBy || '',
          employeePhoto: employee?.photoURL || employee?.photo || '',
        };
      });
      
      setLeaves(formattedLeaves);
    } catch (err) {
      console.error('Error processing leave data', err);
      setError(err instanceof Error ? err : new Error('Erreur de traitement des données de congés'));
    }
  }, [leaveRequests, employees, refreshKey]);
  
  // Refresh data
  const refetch = useCallback(() => {
    setRefreshKey(Date.now());
  }, []);
  
  return { leaves, stats, isLoading, error, refetch };
};
