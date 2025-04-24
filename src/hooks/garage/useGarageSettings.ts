
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export interface GarageSettings {
  name: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
  siret: string;
}

export const useGarageSettings = () => {
  const [settings, setSettings] = useState<GarageSettings>({
    name: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    phone: '',
    email: '',
    siret: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // On récupère d'abord le document de la collection companies avec l'ID 'garage'
        const garageDoc = doc(db, 'companies', 'garage');
        const docSnap = await getDoc(garageDoc);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as GarageSettings;
          setSettings(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        toast.error('Erreur lors du chargement des paramètres');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = async (updatedSettings: Partial<GarageSettings>) => {
    try {
      const garageDoc = doc(db, 'companies', 'garage');
      const newSettings = { ...settings, ...updatedSettings };
      
      // Utiliser setDoc avec merge: true pour créer ou mettre à jour le document
      await setDoc(garageDoc, newSettings, { merge: true });
      
      setSettings(newSettings);
      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    }
  };

  return {
    settings,
    loading,
    saveSettings
  };
};
