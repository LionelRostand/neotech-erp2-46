
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

export interface Training {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'À venir' | 'En cours' | 'Terminée' | 'Annulée';
  type: string;
  location?: string;
  participants: {
    id: string;
    name: string;
    photo?: string;
  }[];
  trainerId?: string;
  trainerName?: string;
  department?: string;
  skills?: string[];
}

/**
 * Hook pour accéder aux données des formations directement depuis Firebase
 */
export const useTrainingsData = () => {
  const { trainings, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les formations avec les informations des participants
  const formattedTrainings = useMemo(() => {
    if (!trainings || trainings.length === 0) return [];
    
    return trainings.map(training => {
      // Déterminer le statut de la formation
      const now = new Date();
      const startDate = new Date(training.startDate);
      const endDate = new Date(training.endDate);
      
      let status: 'À venir' | 'En cours' | 'Terminée' | 'Annulée' = 'À venir';
      if (startDate <= now && now <= endDate) {
        status = 'En cours';
      } else if (now > endDate) {
        status = 'Terminée';
      }
      
      if (training.status === 'cancelled') {
        status = 'Annulée';
      }
      
      // Récupérer les informations des participants
      const participants = training.participantIds?.map(participantId => {
        const participant = employees?.find(emp => emp.id === participantId);
        return {
          id: participantId,
          name: participant 
            ? `${participant.firstName} ${participant.lastName}` 
            : 'Participant inconnu',
          photo: participant?.photoURL || participant?.photo,
        };
      }) || [];
      
      // Récupérer les informations du formateur
      let trainerName = training.trainerName;
      if (training.trainerId && employees) {
        const trainer = employees.find(emp => emp.id === training.trainerId);
        if (trainer) {
          trainerName = `${trainer.firstName} ${trainer.lastName}`;
        }
      }
      
      return {
        id: training.id,
        title: training.title || 'Formation sans titre',
        description: training.description,
        startDate: formatDate(training.startDate),
        endDate: formatDate(training.endDate),
        status,
        type: training.type || 'Formation professionnelle',
        location: training.location,
        participants,
        trainerId: training.trainerId,
        trainerName: trainerName || 'Formateur externe',
        department: training.department,
        skills: training.skills,
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

  // Obtenir des statistiques sur les formations
  const trainingStats = useMemo(() => {
    const upcoming = formattedTrainings.filter(training => training.status === 'À venir').length;
    const inProgress = formattedTrainings.filter(training => training.status === 'En cours').length;
    const completed = formattedTrainings.filter(training => training.status === 'Terminée').length;
    const cancelled = formattedTrainings.filter(training => training.status === 'Annulée').length;
    const total = formattedTrainings.length;
    
    return { upcoming, inProgress, completed, cancelled, total };
  }, [formattedTrainings]);
  
  return {
    trainings: formattedTrainings,
    stats: trainingStats,
    isLoading,
    error
  };
};
