
import { useFirestore } from '@/hooks/use-firestore';
import { DOCUMENT_COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { DocumentSettings } from '../types/document-types';

export const useSettingsService = () => {
  const firestore = useFirestore(DOCUMENT_COLLECTIONS.SETTINGS);

  const getDocumentSettings = async (): Promise<DocumentSettings | null> => {
    try {
      const settings = await firestore.getById('settings') as DocumentSettings;
      if (!settings) {
        // Create default settings if none exist
        const defaultSettings: DocumentSettings = {
          id: 'settings',
          autoArchiveDays: 90,
          maxStoragePerUser: 1024 * 1024 * 1024, // 1GB
          allowedFormats: ['pdf', 'docx', 'xlsx', 'jpg', 'png'],
          encryptionEnabled: true,
          emailNotifications: true,
          updatedAt: new Date()
        };
        
        await firestore.set('settings', defaultSettings);
        return defaultSettings;
      }
      
      return settings;
    } catch (error) {
      console.error('Error getting document settings:', error);
      toast.error('Erreur lors de la récupération des paramètres');
      return null;
    }
  };

  const updateDocumentSettings = async (settings: Partial<DocumentSettings>): Promise<DocumentSettings | null> => {
    try {
      const currentSettings = await getDocumentSettings();
      if (!currentSettings) {
        toast.error('Paramètres non trouvés');
        return null;
      }
      
      const updatedSettings = {
        ...currentSettings,
        ...settings,
        updatedAt: new Date()
      };
      
      await firestore.set('settings', updatedSettings);
      toast.success('Paramètres mis à jour avec succès');
      return updatedSettings;
    } catch (error) {
      console.error('Error updating document settings:', error);
      toast.error('Erreur lors de la mise à jour des paramètres');
      return null;
    }
  };

  return {
    getDocumentSettings,
    updateDocumentSettings
  };
};
