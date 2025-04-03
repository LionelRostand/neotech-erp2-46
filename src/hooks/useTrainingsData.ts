
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

export interface Training {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeePhoto?: string;
  title: string;
  description?: string;
  type: string;
  status: 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée';
  startDate: string;
  endDate?: string;
  duration?: number;
  provider?: string;
  location?: string;
  cost?: number;
  department?: string;
  skills?: string[];
  certificate?: boolean;
  certificateURL?: string;
}

/**
 * Hook pour accéder aux données des formations directement depuis Firebase
 */
export const useTrainingsData = () => {
  const { trainings, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les formations avec les noms des employés
  const formattedTrainings = useMemo(() => {
    if (!trainings || trainings.length === 0) return [];
    
    return trainings.map(training => {
      // Trouver l'employé associé à cette formation
      const employee = employees?.find(emp => emp.id === training.employeeId);
      
      return {
        id: training.id,
        employeeId: training.employeeId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        title: training.title || 'Formation sans titre',
        description: training.description,
        type: training.type || 'Formation professionnelle',
        status: training.status || 'Planifiée',
        startDate: formatDate(training.startDate),
        endDate: training.endDate ? formatDate(training.endDate) : undefined,
        duration: training.duration || calculateDuration(training.startDate, training.endDate),
        provider: training.provider,
        location: training.location,
        cost: training.cost,
        department: employee?.department || 'Non spécifié',
        skills: training.skills || [],
        certificate: training.certificate || false,
        certificateURL: training.certificateURL,
      } as Training;
    });
  }, [trainings, employees]);
  
  // Fonction pour formater les dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur de formatage de date:', dateStr, error);
      return dateStr;
    }
  };

  // Fonction pour calculer la durée en jours
  const calculateDuration = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return 1;
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    } catch (error) {
      console.error('Erreur de calcul de durée:', error);
      return 1;
    }
  };

  // Obtenir des statistiques sur les formations
  const trainingStats = useMemo(() => {
    const planned = formattedTrainings.filter(training => training.status === 'Planifiée').length;
    const inProgress = formattedTrainings.filter(training => training.status === 'En cours').length;
    const completed = formattedTrainings.filter(training => training.status === 'Terminée').length;
    const cancelled = formattedTrainings.filter(training => training.status === 'Annulée').length;
    const total = formattedTrainings.length;
    
    return { planned, inProgress, completed, cancelled, total };
  }, [formattedTrainings]);
  
  return {
    trainings: formattedTrainings,
    stats: trainingStats,
    isLoading,
    error
  };
};
