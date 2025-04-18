
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { SmtpConfig } from '@/types/smtp';
import { toast } from 'sonner';

export const useSmtpConfig = () => {
  const [config, setConfig] = useState<SmtpConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const docRef = doc(db, COLLECTIONS.SMTP_CONFIG, 'default');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setConfig(docSnap.data() as SmtpConfig);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching SMTP config:', error);
      toast.error('Erreur lors du chargement de la configuration SMTP');
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig: SmtpConfig) => {
    try {
      const docRef = doc(db, COLLECTIONS.SMTP_CONFIG, 'default');
      await setDoc(docRef, {
        ...newConfig,
        updatedAt: new Date()
      });
      setConfig(newConfig);
      toast.success('Configuration SMTP enregistrée');
    } catch (error) {
      console.error('Error saving SMTP config:', error);
      toast.error('Erreur lors de la sauvegarde de la configuration SMTP');
      throw error;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    saveConfig,
    fetchConfig
  };
};
