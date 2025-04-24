
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
      if (!COLLECTIONS.GARAGE?.MECHANICS) {
        console.error('COLLECTIONS.GARAGE.MECHANICS is not defined');
        toast.error('Erreur de configuration: collection MECHANICS non définie');
        return false;
      }
      
      console.log('Adding mechanic to collection:', COLLECTIONS.GARAGE.MECHANICS);
      
      const mechanicsRef = collection(db, COLLECTIONS.GARAGE.MECHANICS);
      const newMechanic: Partial<Mechanic> = {
        ...mechanicData,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await addDoc(mechanicsRef, newMechanic);
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
