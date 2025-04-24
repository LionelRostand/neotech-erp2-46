
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
    estimatedCost?: number;
    serviceType?: string;
  }) => {
    try {
      // Ensure we have a valid collection path
      const collectionPath = COLLECTIONS.GARAGE?.REPAIRS;
      
      if (!collectionPath || collectionPath.trim() === '') {
        throw new Error('Collection path for repairs is not defined');
      }
      
      console.log('Adding repair to collection:', collectionPath);
      
      const repairsRef = collection(db, collectionPath);
      const newRepair: Partial<Repair> = {
        ...repairData,
        status: 'awaiting_approval',
        progress: 0,
        startDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await addDoc(repairsRef, newRepair);
      console.log('Repair added successfully');
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
