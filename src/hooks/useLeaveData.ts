
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

export interface Leave {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeePhoto?: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'En attente' | 'Approuvé' | 'Refusé';
  reason?: string;
  department?: string;
  approvedBy?: string;
  approverName?: string;
  approvalDate?: string;
}

/**
 * Hook pour accéder aux données des congés directement depuis Firebase
 */
export const useLeaveData = () => {
  const { leaveRequests, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les congés avec les noms des employés
  const formattedLeaves = useMemo(() => {
    if (!leaveRequests || leaveRequests.length === 0) return [];
    
    return leaveRequests.map(leave => {
      // Trouver l'employé associé à ce congé
      const employee = employees?.find(emp => emp.id === leave.employeeId);
      
      // Trouver l'approbateur si présent
      const approver = leave.approvedBy && employees
        ? employees.find(emp => emp.id === leave.approvedBy)
        : undefined;
      
      // Calculer le nombre de jours
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 car inclusif
      
      return {
        id: leave.id,
        employeeId: leave.employeeId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        type: leave.type || 'Congés payés',
        startDate: formatDate(leave.startDate),
        endDate: formatDate(leave.endDate),
        days: leave.days || diffDays,
        status: leave.status || 'En attente',
        reason: leave.reason,
        department: employee?.department || 'Non spécifié',
        approvedBy: leave.approvedBy,
        approverName: approver ? `${approver.firstName} ${approver.lastName}` : leave.approverName,
        approvalDate: leave.approvalDate ? formatDate(leave.approvalDate) : undefined,
      } as Leave;
    });
  }, [leaveRequests, employees]);
  
  // Fonction pour formater les dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur de formatage de date:', dateStr, error);
      return dateStr;
    }
  };

  // Obtenir des statistiques sur les congés
  const leaveStats = useMemo(() => {
    const pending = formattedLeaves.filter(leave => leave.status === 'En attente').length;
    const approved = formattedLeaves.filter(leave => leave.status === 'Approuvé').length;
    const rejected = formattedLeaves.filter(leave => leave.status === 'Refusé').length;
    const total = formattedLeaves.length;
    
    return { pending, approved, rejected, total };
  }, [formattedLeaves]);
  
  return {
    leaves: formattedLeaves,
    stats: leaveStats,
    isLoading,
    error
  };
};
