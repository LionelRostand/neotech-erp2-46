
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
      // Check that the collection path exists before attempting to use it
      if (!COLLECTIONS.GARAGE || !COLLECTIONS.GARAGE.MECHANICS) {
        console.error('COLLECTIONS.GARAGE.MECHANICS is not defined');
        toast.error('Erreur de configuration: collection non définie');
        return false;
      }
      
      const mechanicsCollectionPath = COLLECTIONS.GARAGE.MECHANICS;
      console.log('Adding mechanic to collection path:', mechanicsCollectionPath);
      
      const mechanicsRef = collection(db, mechanicsCollectionPath);
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
