
import { useState, useEffect, useCallback } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { toast } from 'sonner';
import { updateDocument } from './firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';

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
    if (!leaveRequests || !employees) {
      setLeaves([]);
      return;
    }
    
    try {
      const safeLeaveRequests = Array.isArray(leaveRequests) ? leaveRequests : [];
      const safeEmployees = Array.isArray(employees) ? employees : [];
      
      // Update stats
      stats.total = safeLeaveRequests.length;
      stats.pending = safeLeaveRequests.filter(req => 
        req && (req.status === 'pending' || req.status === 'En attente')).length;
      stats.approved = safeLeaveRequests.filter(req => 
        req && (req.status === 'approved' || req.status === 'Approuvé')).length;
      stats.rejected = safeLeaveRequests.filter(req => 
        req && (req.status === 'rejected' || req.status === 'Refusé')).length;
      
      const formattedLeaves = safeLeaveRequests.map(leave => {
        if (!leave) return null;
        
        // Find employee info
        const employee = safeEmployees.find(emp => emp && emp.id === leave.employeeId);
        
        // Format the date from ISO or timestamp to DD/MM/YYYY
        const formatDate = (dateString: string | number) => {
          try {
            if (!dateString) return '';
            
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
          id: leave.id || '',
          employeeId: leave.employeeId || '',
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
      }).filter(Boolean) as Leave[];
      
      setLeaves(formattedLeaves);
    } catch (err) {
      console.error('Error processing leave data', err);
      setError(err instanceof Error ? err : new Error('Erreur de traitement des données de congés'));
    }
  }, [leaveRequests, employees, refreshKey]);
  
  // Update leave status
  const updateLeaveStatus = useCallback(async (leaveId: string, newStatus: string) => {
    try {
      console.log(`Updating leave status: ${leaveId} to ${newStatus}`);
      
      // Get the leave request to update
      const leaveToUpdate = leaves.find(leave => leave.id === leaveId);
      if (!leaveToUpdate) {
        console.error(`Leave with ID ${leaveId} not found`);
        toast.error("Erreur: demande de congé introuvable");
        return false;
      }

      // Update in Firestore
      await updateDocument(COLLECTIONS.HR.LEAVE_REQUESTS, leaveId, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        // If approved, add the approval date
        ...(newStatus === 'approved' || newStatus === 'Approuvé' ? { approvedAt: new Date().toISOString() } : {})
      });
      
      // If approved, update the employee's leave balance
      if ((newStatus === 'approved' || newStatus === 'Approuvé') && leaveToUpdate.employeeId) {
        await updateEmployeeLeaveBalance(leaveToUpdate);
      }
      
      // Show success message
      toast.success(`Demande de congé ${newStatus === 'approved' || newStatus === 'Approuvé' ? 'approuvée' : 
        newStatus === 'rejected' || newStatus === 'Refusé' ? 'refusée' : 'mise à jour'}`);
      
      // Trigger refresh
      setRefreshKey(Date.now());
      
      return true;
    } catch (err) {
      console.error('Error updating leave status', err);
      toast.error("Erreur lors de la mise à jour du statut de la demande");
      return false;
    }
  }, [leaves]);

  // Update employee's leave balance when a leave is approved
  const updateEmployeeLeaveBalance = async (leave: Leave) => {
    try {
      const employeeId = leave.employeeId;
      if (!employeeId) {
        console.error("Cannot update leave balance: no employee ID");
        return false;
      }

      // Find the employee
      const employee = employees?.find(emp => emp.id === employeeId);
      if (!employee) {
        console.error(`Employee with ID ${employeeId} not found`);
        return false;
      }

      // Determine leave type and update the appropriate balance
      const days = leave.days || 0;
      const isRtt = leave.type.toLowerCase().includes('rtt');
      
      // Get current values or set defaults
      const currentConges = employee.conges || { acquired: 25, taken: 0, balance: 25 };
      const currentRtt = employee.rtt || { acquired: 12, taken: 0, balance: 12 };
      
      if (isRtt) {
        // Update RTT
        const newTaken = (currentRtt.taken || 0) + days;
        const newBalance = Math.max(0, (currentRtt.acquired || 12) - newTaken);
        
        await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, {
          rtt: {
            acquired: currentRtt.acquired || 12,
            taken: newTaken,
            balance: newBalance
          },
          updatedAt: new Date().toISOString()
        });
      } else {
        // Update regular paid leave (congés payés)
        const newTaken = (currentConges.taken || 0) + days;
        const newBalance = Math.max(0, (currentConges.acquired || 25) - newTaken);
        
        await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, {
          conges: {
            acquired: currentConges.acquired || 25,
            taken: newTaken,
            balance: newBalance
          },
          updatedAt: new Date().toISOString()
        });
      }

      return true;
    } catch (error) {
      console.error("Error updating employee leave balance:", error);
      return false;
    }
  };
  
  // Refresh data
  const refetch = useCallback(() => {
    setRefreshKey(Date.now());
  }, []);
  
  return { leaves, stats, isLoading, error, refetch, updateLeaveStatus };
};
