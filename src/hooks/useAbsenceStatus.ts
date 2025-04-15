
import { useState } from 'react';
import { toast } from 'sonner';
import { updateDocument } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useAbsenceStatus = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateAbsenceStatus = async (absenceId: string, newStatus: 'Validé' | 'Refusé' | 'En attente') => {
    setIsUpdating(true);
    try {
      await updateDocument(COLLECTIONS.HR.ABSENCE_REQUESTS, absenceId, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      toast.success(`Absence ${newStatus.toLowerCase()} avec succès`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error("Erreur lors de la mise à jour du statut de l'absence");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateAbsenceStatus,
    isUpdating
  };
};
