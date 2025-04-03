
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  requestDate: string;
  approverId?: string;
  approverName?: string;
  approvedDate?: string;
  comments?: string;
}

/**
 * Hook pour accéder aux données des congés directement depuis Firebase
 */
export const useLeaveData = () => {
  const { leaveRequests, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les demandes de congés avec les noms des employés
  const formattedLeaves = useMemo(() => {
    if (!leaveRequests || leaveRequests.length === 0) return [];
    
    return leaveRequests.map(request => {
      // Trouver l'employé associé à cette demande
      const employee = employees?.find(emp => emp.id === request.employeeId);
      
      // Trouver l'approbateur si présent
      const approver = request.approverId 
        ? employees?.find(emp => emp.id === request.approverId)
        : undefined;
      
      // Calculer le nombre de jours
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 car inclusif
      
      // Formater les dates
      const formattedStartDate = formatDate(request.startDate);
      const formattedEndDate = formatDate(request.endDate);
      const formattedRequestDate = formatDate(request.createdAt || request.requestDate || new Date().toISOString());
      
      return {
        id: request.id,
        employeeId: request.employeeId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        type: request.type || 'Congés payés',
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        days: request.days || diffDays,
        status: request.status || 'En attente',
        reason: request.reason,
        requestDate: formattedRequestDate,
        approverId: request.approverId,
        approverName: approver ? `${approver.firstName} ${approver.lastName}` : undefined,
        approvedDate: request.approvedAt ? formatDate(request.approvedAt) : undefined,
        comments: request.comments,
        department: employee?.department || 'Non spécifié',
      } as Leave;
    });
  }, [leaveRequests, employees]);
  
  // Fonction pour formater les dates
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: fr });
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
