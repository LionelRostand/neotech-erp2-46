
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import type { Mechanic } from '@/components/module/submodules/garage/types/garage-types';

export const useMechanicService = () => {
  const addMechanic = async (mechanicData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => {
    try {
      const collectionPath = COLLECTIONS.GARAGE.MECHANICS;
      
      if (!collectionPath) {
        throw new Error('Collection path for mechanics is not defined');
      }
      
      console.log('Adding mechanic to collection:', collectionPath);
      
      const mechanicsRef = collection(db, collectionPath);
      const newMechanic: Partial<Mechanic> = {
        ...mechanicData,
        position: 'Mécanicien',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(mechanicsRef, newMechanic);
      console.log('Mechanic added successfully with ID:', docRef.id);
      toast.success('Mécanicien ajouté avec succès');
      return true;
    } catch (error: any) {
      console.error('Error adding mechanic:', error);
      toast.error('Erreur lors de l\'ajout du mécanicien: ' + error.message);
      return false;
    }
  };

  return { addMechanic };
};
