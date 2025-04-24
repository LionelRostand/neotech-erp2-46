
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface GarageAppointment {
  id: string;
  date: string;
  time: string;
  clientId: string;
  clientName: string;
  vehicleId: string;
  service: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export const useGarageAppointments = () => {
  const collectionPath = COLLECTIONS.GARAGE.APPOINTMENTS;
  
  if (!collectionPath) {
    console.error('Collection path for garage appointments is undefined');
    throw new Error('Collection path for garage appointments is undefined');
  }
  
  const { add, getAll, update, remove, loading, error } = useFirestore(collectionPath);

  const { data: appointments = [], refetch } = useQuery({
    queryKey: ['garage', 'appointments'],
    queryFn: async () => {
      try {
        const result = await getAll() as GarageAppointment[];
        return result;
      } catch (err) {
        console.error('Erreur lors de la récupération des rendez-vous:', err);
        toast.error('Erreur lors de la récupération des rendez-vous');
        return [];
      }
    }
  });

  const addAppointment = async (appointmentData: Omit<GarageAppointment, 'id'>) => {
    try {
      const result = await add({
        ...appointmentData,
        createdAt: new Date().toISOString(),
      });
      toast.success('Rendez-vous ajouté avec succès');
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du rendez-vous:', err);
      toast.error('Erreur lors de l\'ajout du rendez-vous');
      throw err;
    }
  };

  const updateAppointment = async (id: string, data: Partial<GarageAppointment>) => {
    try {
      await update(id, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      toast.success('Rendez-vous mis à jour avec succès');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', err);
      toast.error('Erreur lors de la mise à jour du rendez-vous');
      throw err;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await remove(id);
      toast.success('Rendez-vous supprimé avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression du rendez-vous:', err);
      toast.error('Erreur lors de la suppression du rendez-vous');
      throw err;
    }
  };

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    refetchAppointments: refetch,
    loading,
    error
  };
};
