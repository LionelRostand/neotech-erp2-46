
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export const useMechanicService = () => {
  const addMechanic = async (mechanicData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => {
    try {
      const mechanicsRef = collection(db, COLLECTIONS.GARAGE.MECHANICS);
      const newMechanic = {
        ...mechanicData,
        position: 'Mécanicien',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await addDoc(mechanicsRef, newMechanic);
      toast.success('Mécanicien ajouté avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du mécanicien:', error);
      toast.error('Erreur lors de l\'ajout du mécanicien');
      return false;
    }
  };

  return { addMechanic };
};
