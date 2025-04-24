
import { useState } from 'react';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Mechanic } from '../types/garage-types';
import { toast } from 'sonner';
import { addDocument, deleteDocument, updateDocument } from '@/hooks/firestore/firestore-utils';

export const useMechanicService = () => {
  const [showAddMechanic, setShowAddMechanic] = useState(false);
  const [showEditMechanic, setShowEditMechanic] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentMechanic, setCurrentMechanic] = useState<Mechanic | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Use definite mechanics collection path
  const mechanicsPath = COLLECTIONS.GARAGE.MECHANICS;
  
  console.log('Mechanics collection path:', mechanicsPath);
  
  const {
    data: mechanics = [],
    isLoading,
    error,
    refetch
  } = useFirebaseCollection<Mechanic>(mechanicsPath);

  const addMechanic = async (mechanic: Omit<Mechanic, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      await addDocument(mechanicsPath, {
        ...mechanic,
        status: mechanic.status || 'active',
        hiringDate: mechanic.hiringDate || new Date().toISOString()
      });
      toast.success('Mécanicien ajouté avec succès');
      refetch();
    } catch (error: any) {
      toast.error(`Erreur lors de l'ajout: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
      setShowAddMechanic(false);
    }
  };

  const updateMechanic = async (id: string, updatedData: Partial<Mechanic>) => {
    try {
      setLoading(true);
      await updateDocument(mechanicsPath, id, updatedData);
      toast.success('Mécanicien mis à jour avec succès');
      refetch();
    } catch (error: any) {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
      setShowEditMechanic(false);
    }
  };

  const deleteMechanic = async (id: string) => {
    try {
      setLoading(true);
      await deleteDocument(mechanicsPath, id);
      toast.success('Mécanicien supprimé avec succès');
      refetch();
    } catch (error: any) {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return {
    mechanics: mechanics || [],
    isLoading,
    error,
    addMechanic,
    updateMechanic,
    deleteMechanic,
    showAddMechanic,
    setShowAddMechanic,
    showEditMechanic,
    setShowEditMechanic,
    showDeleteDialog,
    setShowDeleteDialog,
    currentMechanic,
    setCurrentMechanic,
    loading
  };
};
