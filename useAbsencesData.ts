
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
}

/**
 * Hook pour accéder aux données des absences
 */
export const useAbsencesData = () => {
  const { absenceRequests, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les absences avec les noms des employés
  const formattedAbsences = useMemo(() => {
    if (!absenceRequests || absenceRequests.length === 0) return [];
    
    return absenceRequests.map(absence => {
      // Trouver l'employé associé à cette absence
      const employee = employees?.find(emp => emp.id === absence.employeeId);
      
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
        status: absence.status === 'approved' ? 'Validé' : 
                absence.status === 'rejected' ? 'Refusé' : 'En attente',
        reason: absence.reason,
        department: employee?.department || 'Non spécifié',
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
