
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import type { Repair } from '@/components/module/submodules/garage/types/garage-types';

export const useRepairService = () => {
  const addRepair = async (repairData: {
    clientName: string;
    vehicleName: string;
    mechanicName: string;
    description: string;
  }) => {
    try {
      if (!COLLECTIONS.GARAGE?.REPAIRS) {
        console.error('COLLECTIONS.GARAGE.REPAIRS is not defined');
        toast.error('Erreur de configuration: collection REPAIRS non définie');
        return false;
      }
      
      console.log('Adding repair to collection:', COLLECTIONS.GARAGE.REPAIRS);
      
      const repairsRef = collection(db, COLLECTIONS.GARAGE.REPAIRS);
      const newRepair: Partial<Repair> = {
        ...repairData,
        status: 'awaiting_approval',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await addDoc(repairsRef, newRepair);
      toast.success('Réparation ajoutée avec succès');
      return true;
    } catch (error: any) {
      console.error('Error adding repair:', error);
      toast.error('Erreur lors de l\'ajout de la réparation: ' + error.message);
      return false;
    }
  };

  return { addRepair };
};
