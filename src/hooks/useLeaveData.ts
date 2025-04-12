
import { useMemo, useState } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { formatDate } from '@/lib/formatters';

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
        const formatSafeDate = (dateString: string | number) => {
          if (!dateString) return '';
          
          try {
            // Convert string to date if it's a string, or number to date if it's a timestamp
            let dateValue: any = dateString;
            
            // Handle numeric timestamps
            if (typeof dateString === 'number') {
              dateValue = new Date(dateString);
            } else if (typeof dateString === 'string') {
              // Check if the date string is valid
              const timestamp = Date.parse(dateString);
              if (isNaN(timestamp)) {
                console.warn('Invalid date:', dateString);
                return '';
              }
              dateValue = new Date(dateString);
            }
            
            // Validate the created date object
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) {
              console.warn('Invalid date object created from:', dateString);
              return '';
            }
            
            return formatDate(date.toISOString(), {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
          } catch (e) {
            console.error('Error formatting date', e);
            return '';
          }
        };
        
        // Ensure dates are valid
        let validStartDate = leave.startDate || '';
        let validEndDate = leave.endDate || '';
        let validRequestDate = leave.requestDate || '';
        
        // Try to fix invalid dates by using current date
        if (validStartDate && typeof validStartDate === 'string' && isNaN(Date.parse(validStartDate))) {
          console.warn(`Invalid start date detected: ${validStartDate}, using current date instead`);
          validStartDate = new Date().toISOString();
        }
        
        if (validEndDate && typeof validEndDate === 'string' && isNaN(Date.parse(validEndDate))) {
          console.warn(`Invalid end date detected: ${validEndDate}, using current date instead`);
          validEndDate = new Date().toISOString();
        }
        
        if (validRequestDate && typeof validRequestDate === 'string' && isNaN(Date.parse(validRequestDate))) {
          console.warn(`Invalid request date detected: ${validRequestDate}, using current date instead`);
          validRequestDate = new Date().toISOString();
        }
        
        const startDate = formatSafeDate(validStartDate);
        const endDate = formatSafeDate(validEndDate);
        
        // Calculate days if not provided
        let days = leave.durationDays || leave.days || 0;
        if (days === 0 && leave.startDate && leave.endDate) {
          try {
            // Simple calculation if dates are available
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
              const diffTime = Math.abs(end.getTime() - start.getTime());
              days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            }
          } catch (e) {
            console.error('Error calculating days', e);
            days = 1; // Default to 1 day if calculation fails
          }
        }
        
        // Rename approverName to approvedBy for consistency
        const approvedBy = leave.approvedBy || leave.approverName || '';
        
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
          requestDate: formatSafeDate(validRequestDate),
          approvedBy,
          employeePhoto: employee?.photoURL || employee?.photo || '',
        };
      });
    } catch (err) {
      console.error('Error processing leave data', err);
      setError(err instanceof Error ? err : new Error('Erreur de traitement des données de congés'));
      return [];
    }
  }, [leaveRequests, employees]);
  
  return { leaves, stats, isLoading, error };
};
