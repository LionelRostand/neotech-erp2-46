
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
    position?: string;
  }) => {
    try {
      // Ensure we have a valid collection path with a solid fallback
      const mechanicsPath = 
        (COLLECTIONS.GARAGE && COLLECTIONS.GARAGE.MECHANICS) || 
        'garage_mechanics';
      
      console.log('Adding mechanic to collection:', mechanicsPath);
      
      // Make sure mechanicsPath is definitely not empty before proceeding
      if (!mechanicsPath || mechanicsPath.trim() === '') {
        throw new Error('Invalid collection path for mechanics');
      }
      
      const mechanicsRef = collection(db, mechanicsPath);
      const newMechanic: Partial<Mechanic> = {
        ...mechanicData,
        position: mechanicData.position || 'Mécanicien',
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
