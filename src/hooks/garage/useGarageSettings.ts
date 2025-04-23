
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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
        const settingsRef = doc(db, COLLECTIONS.GARAGE_SETTINGS, 'general');
        const docSnap = await getDoc(settingsRef);
        
        if (docSnap.exists()) {
          setSettings(docSnap.data() as GarageSettings);
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
      const settingsRef = doc(db, COLLECTIONS.GARAGE_SETTINGS, 'general');
      await updateDoc(settingsRef, updatedSettings);
      setSettings(prev => ({ ...prev, ...updatedSettings }));
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
