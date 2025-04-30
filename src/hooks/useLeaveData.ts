
import { useState, useEffect, useCallback } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  days: number;
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export const useLeaveData = () => {
  const { leaveRequests: rawLeaveRequests = [], employees = [], isLoading, error } = useHrModuleData();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  // Format leaves data with employee names
  useEffect(() => {
    // Ensure we have valid arrays to work with
    const safeLeaveRequests = Array.isArray(rawLeaveRequests) ? rawLeaveRequests : [];
    const safeEmployees = Array.isArray(employees) ? employees : [];
    
    if (safeLeaveRequests.length === 0) {
      console.log('useLeaveData: No leave requests data available');
      setLeaves([]);
      return;
    }

    // Process and enrich leave data
    const formattedLeaves = safeLeaveRequests
      .filter(leave => leave !== null && leave !== undefined)
      .map(leave => {
        // Safety check for leave object
        if (!leave) return null;
        
        const employee = safeEmployees.find(emp => emp && emp.id === leave.employeeId);
        
        // Format dates to be more readable
        const formatDate = (dateString: string) => {
          try {
            if (!dateString) return '';
            return new Date(dateString).toLocaleDateString('fr-FR');
          } catch (e) {
            console.error('Invalid date format:', dateString);
            return dateString || '';
          }
        };

        return {
          ...leave,
          employeeName: employee 
            ? `${employee.firstName || ''} ${employee.lastName || ''}`.trim()
            : 'Employé inconnu',
          startDate: formatDate(leave.startDate),
          endDate: formatDate(leave.endDate),
        };
      })
      .filter(Boolean); // Filter out any null values

    setLeaves(formattedLeaves as Leave[]);
  }, [rawLeaveRequests, employees, refreshKey]);

  // Statistics about leaves with safe array handling
  const stats = {
    total: Array.isArray(leaves) ? leaves.length : 0,
    approved: Array.isArray(leaves) 
      ? leaves.filter(leave => leave.status === 'Approuvé' || leave.status === 'approved').length
      : 0,
    pending: Array.isArray(leaves)
      ? leaves.filter(leave => leave.status === 'En attente' || leave.status === 'pending').length
      : 0,
    rejected: Array.isArray(leaves)
      ? leaves.filter(leave => leave.status === 'Refusé' || leave.status === 'rejected').length
      : 0
  };

  // Refresh data
  const refetch = useCallback(() => {
    setRefreshKey(Date.now());
  }, []);

  return {
    leaves: leaves || [],
    stats,
    isLoading,
    error,
    refetch
  };
};
