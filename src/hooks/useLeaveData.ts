
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
    if (!rawLeaveRequests || !Array.isArray(rawLeaveRequests)) {
      console.log('useLeaveData: No leave requests data available');
      setLeaves([]);
      return;
    }

    if (!employees || !Array.isArray(employees)) {
      console.log('useLeaveData: No employees data available');
      setLeaves(rawLeaveRequests.map(leave => ({ ...leave })) as Leave[]);
      return;
    }

    // Process and enrich leave data
    const formattedLeaves = rawLeaveRequests
      .filter(leave => leave !== null && leave !== undefined)
      .map(leave => {
        const employee = employees.find(emp => emp && emp.id === leave.employeeId);
        
        // Format dates to be more readable
        const formatDate = (dateString: string) => {
          try {
            return new Date(dateString).toLocaleDateString('fr-FR');
          } catch (e) {
            console.error('Invalid date format:', dateString);
            return dateString;
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
      });

    setLeaves(formattedLeaves as Leave[]);
  }, [rawLeaveRequests, employees, refreshKey]);

  // Statistics about leaves
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
    leaves,
    stats,
    isLoading,
    error,
    refetch
  };
};
