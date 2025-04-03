
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

/**
 * Hook pour accéder aux données des formations
 */
export const useTrainingsData = () => {
  const { trainings, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les formations avec les noms des participants
  const formattedTrainings = useMemo(() => {
    if (!trainings || trainings.length === 0) return [];
    if (!employees || employees.length === 0) return trainings;
    
    return trainings.map(training => {
      // Trouver les noms des participants
      const participantsInfo = training.participantIds?.map(id => {
        const employee = employees.find(emp => emp.id === id);
        return employee ? {
          id,
          name: `${employee.firstName} ${employee.lastName}`,
          photo: employee.photoURL || employee.photo || ''
        } : { id, name: 'Participant inconnu', photo: '' };
      }) || [];
      
      // Trouver le formateur
      const trainer = training.trainerId 
        ? employees.find(emp => emp.id === training.trainerId)
        : null;
      
      return {
        ...training,
        participants: participantsInfo,
        trainerName: trainer ? `${trainer.firstName} ${trainer.lastName}` : training.trainerName || 'Formateur externe',
        participantsCount: participantsInfo.length
      };
    });
  }, [trainings, employees]);
  
  return {
    trainings: formattedTrainings,
    isLoading,
    error
  };
};
