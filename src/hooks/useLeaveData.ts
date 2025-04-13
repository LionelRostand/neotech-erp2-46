
import { useMemo, useState } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { addDocument } from './firestore/create-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

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
    
    try {
      return leaveRequests.map(leave => {
        // Find employee info
        const employee = employees.find(emp => emp.id === leave.employeeId);
        
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
        
        // Normalizing status value for consistent display
        let status = leave.status || 'En attente';
        if (status === 'approved') status = 'Approuvé';
        if (status === 'rejected') status = 'Refusé';
        if (status === 'pending') status = 'En attente';
        
        return {
          id: leave.id,
          employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
          department: employee?.department || 'Non spécifié',
          type: leave.type || 'Congés payés',
          startDate,
          endDate,
          days,
          status,
          reason: leave.reason || leave.comment || '',
          employeeId: leave.employeeId,
          requestDate: leave.requestDate ? formatDate(leave.requestDate) : '',
          approvedBy: leave.approvedBy || '',
          employeePhoto: employee?.photoURL || employee?.photo || '',
        };
      });
    } catch (err) {
      console.error('Error processing leave data', err);
      setError(err instanceof Error ? err : new Error('Erreur de traitement des données de congés'));
      return [];
    }
  }, [leaveRequests, employees]);
  
  // Add the createLeaveRequest method
  const createLeaveRequest = async (leaveData: {
    employeeId: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    reason?: string;
  }) => {
    try {
      // Prepare the leave request data
      const newLeaveRequest = {
        ...leaveData,
        status: 'En attente',
        requestDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add the document to Firestore
      const result = await addDocument(COLLECTIONS.HR.LEAVE_REQUESTS, newLeaveRequest);
      
      toast.success('Demande de congé créée avec succès');
      return result;
    } catch (err) {
      console.error('Error creating leave request:', err);
      setError(err instanceof Error ? err : new Error('Erreur lors de la création de la demande de congé'));
      toast.error('Erreur lors de la création de la demande de congé');
      throw err;
    }
  };

  // Add the refetch function
  const refetch = () => {
    // Currently this is a placeholder as we don't have real-time updates
    // In a real implementation, this would trigger a data refresh
    console.log('Refetching leave data...');
    return Promise.resolve();
  };
  
  return { leaves, stats, isLoading, error, createLeaveRequest, refetch };
};
