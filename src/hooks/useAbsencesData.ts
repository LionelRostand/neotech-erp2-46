
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

export interface Absence {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeePhoto?: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'En attente' | 'Validé' | 'Refusé';
  reason?: string;
  department?: string;
  approvedBy?: string;
  approverName?: string;
  approvalDate?: string;
}

/**
 * Hook pour accéder aux données des absences directement depuis Firebase
 */
export const useAbsencesData = () => {
  const { absenceRequests, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les absences avec les noms des employés
  const formattedAbsences = useMemo(() => {
    if (!absenceRequests || absenceRequests.length === 0) return [];
    
    return absenceRequests.map(absence => {
      // Trouver l'employé associé à cette absence
      const employee = employees?.find(emp => emp.id === absence.employeeId);
      
      // Trouver l'approbateur si présent
      const approver = absence.approvedBy && employees
        ? employees.find(emp => emp.id === absence.approvedBy)
        : undefined;
      
      // Calculer le nombre de jours
      const startDate = new Date(absence.startDate);
      const endDate = new Date(absence.endDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 car inclusif
      
      return {
        id: absence.id,
        employeeId: absence.employeeId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        type: absence.type || 'Absence non justifiée',
        startDate: formatDate(absence.startDate),
        endDate: formatDate(absence.endDate),
        days: absence.days || diffDays,
        status: absence.status || 'En attente',
        reason: absence.reason,
        department: employee?.department || 'Non spécifié',
        approvedBy: absence.approvedBy,
        approverName: approver ? `${approver.firstName} ${approver.lastName}` : absence.approverName,
        approvalDate: absence.approvalDate ? formatDate(absence.approvalDate) : undefined,
      } as Absence;
    });
  }, [absenceRequests, employees]);
  
  // Fonction pour formater les dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur de formatage de date:', dateStr, error);
      return dateStr;
    }
  };

  // Obtenir des statistiques sur les absences
  const absenceStats = useMemo(() => {
    const pending = formattedAbsences.filter(absence => absence.status === 'En attente').length;
    const validated = formattedAbsences.filter(absence => absence.status === 'Validé').length;
    const rejected = formattedAbsences.filter(absence => absence.status === 'Refusé').length;
    const total = formattedAbsences.length;
    
    return { pending, validated, rejected, total };
  }, [formattedAbsences]);
  
  return {
    absences: formattedAbsences,
    stats: absenceStats,
    isLoading,
    error
  };
};
