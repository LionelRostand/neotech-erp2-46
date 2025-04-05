
import { useState, useEffect, useCallback } from 'react';
import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

// Type pour les paramètres CRM
export interface CrmSettings {
  id?: string;
  companyName: string;
  emailNotifications: boolean;
  defaultCurrency: string;
  language: string;
  termsAndConditions: string;
  automaticBackup: boolean;
  dataRetentionPeriod: string;
  updatedAt?: any;
  createdAt?: any;
}

// Valeurs par défaut
const defaultSettings: Omit<CrmSettings, 'id'> = {
  companyName: "Ma Société",
  emailNotifications: true,
  defaultCurrency: "EUR",
  language: "fr",
  termsAndConditions: "",
  automaticBackup: true,
  dataRetentionPeriod: "12",
};

export const useCrmSettings = () => {
  const [settings, setSettings] = useState<CrmSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reference to the settings document
  const settingsDoc = doc(collection(db, COLLECTIONS.CRM.SETTINGS), 'general');

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const docSnap = await getDoc(settingsDoc);
      
      if (docSnap.exists()) {
        const settingsData = docSnap.data() as CrmSettings;
        setSettings({
          id: docSnap.id,
          ...settingsData
        });
      } else {
        // Aucun document de paramètres trouvé, créer le document par défaut
        await setDoc(settingsDoc, {
          ...defaultSettings,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        setSettings({
          id: 'general',
          ...defaultSettings
        });
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching CRM settings:', err);
      setError('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save settings
  const saveSettings = async (updatedSettings: Partial<CrmSettings>) => {
    setSaving(true);
    try {
      await updateDoc(settingsDoc, {
        ...updatedSettings,
        updatedAt: serverTimestamp()
      });
      
      setSettings(prev => ({
        ...prev,
        ...updatedSettings
      }));
      
      toast.success('Paramètres sauvegardés avec succès');
    } catch (err) {
      console.error('Error saving CRM settings:', err);
      toast.error('Erreur lors de la sauvegarde des paramètres');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    saving,
    error,
    saveSettings,
    fetchSettings
  };
};
