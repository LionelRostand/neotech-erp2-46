
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { FreightAlert } from '../components/FreightAlert';

interface FreightGeneralSettingsProps {
  isAdmin: boolean;
  canEdit: boolean;
}

interface GeneralSettings {
  companyName: string;
  emailContact: string;
  phoneContact: string;
  trackingSettings: {
    enableMap: boolean;
    enableNotifications: boolean;
    updateFrequency: string;
  };
  defaultCurrency: string;
  weightUnit: string;
  volumeUnit: string;
}

const DEFAULT_SETTINGS: GeneralSettings = {
  companyName: '',
  emailContact: '',
  phoneContact: '',
  trackingSettings: {
    enableMap: true,
    enableNotifications: true,
    updateFrequency: '1h',
  },
  defaultCurrency: 'EUR',
  weightUnit: 'kg',
  volumeUnit: 'm³',
};

const FreightGeneralSettings: React.FC<FreightGeneralSettingsProps> = ({ isAdmin, canEdit }) => {
  const [settings, setSettings] = useState<GeneralSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        // Attempt to get settings from Firestore
        const docRef = doc(db, COLLECTIONS.FREIGHT.SETTINGS, 'general');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<GeneralSettings>;
          // Merge with defaults for any missing fields
          setSettings({
            ...DEFAULT_SETTINGS,
            ...data,
            trackingSettings: {
              ...DEFAULT_SETTINGS.trackingSettings,
              ...data.trackingSettings
            }
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres du fret:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les paramètres du module fret",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('tracking.')) {
        const trackingField = name.split('.')[1];
        setSettings(prev => ({
          ...prev,
          trackingSettings: {
            ...prev.trackingSettings,
            [trackingField]: checked
          }
        }));
      }
      return;
    }
    
    // Handle tracking settings
    if (name.startsWith('tracking.')) {
      const trackingField = name.split('.')[1];
      setSettings(prev => ({
        ...prev,
        trackingSettings: {
          ...prev.trackingSettings,
          [trackingField]: value
        }
      }));
      return;
    }
    
    // Handle regular inputs
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSettings = async () => {
    if (!currentUser) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive"
      });
      return;
    }

    if (!canEdit && !isAdmin) {
      toast({
        title: "Permission refusée",
        description: "Vous n'avez pas les droits nécessaires pour modifier les paramètres",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      await setDoc(doc(db, COLLECTIONS.FREIGHT.SETTINGS, 'general'), settings);
      toast({
        title: "Paramètres enregistrés",
        description: "Les modifications ont été enregistrées avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des paramètres:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <FreightAlert variant="default">
        Chargement des paramètres...
      </FreightAlert>
    );
  }

  return (
    <div className="space-y-6">
      {!canEdit && !isAdmin && (
        <FreightAlert variant="warning">
          Vous consultez les paramètres en mode lecture seule. Contactez un administrateur
          pour effectuer des modifications.
        </FreightAlert>
      )}
      
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations de l'entreprise</h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Nom de l'entreprise
                <input
                  type="text"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleInputChange}
                  disabled={!canEdit && !isAdmin}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Email de contact
                <input
                  type="email"
                  name="emailContact"
                  value={settings.emailContact}
                  onChange={handleInputChange}
                  disabled={!canEdit && !isAdmin}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Téléphone de contact
                <input
                  type="tel"
                  name="phoneContact"
                  value={settings.phoneContact}
                  onChange={handleInputChange}
                  disabled={!canEdit && !isAdmin}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                />
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Paramètres par défaut</h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Devise par défaut
                <select
                  name="defaultCurrency"
                  value={settings.defaultCurrency}
                  onChange={handleInputChange}
                  disabled={!canEdit && !isAdmin}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar US ($)</option>
                  <option value="GBP">Livre Sterling (£)</option>
                  <option value="CAD">Dollar Canadien (C$)</option>
                  <option value="CHF">Franc Suisse (Fr)</option>
                </select>
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Unité de poids
                <select
                  name="weightUnit"
                  value={settings.weightUnit}
                  onChange={handleInputChange}
                  disabled={!canEdit && !isAdmin}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="kg">Kilogrammes (kg)</option>
                  <option value="lb">Livres (lb)</option>
                  <option value="t">Tonnes (t)</option>
                </select>
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Unité de volume
                <select
                  name="volumeUnit"
                  value={settings.volumeUnit}
                  onChange={handleInputChange}
                  disabled={!canEdit && !isAdmin}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="m³">Mètres cubes (m³)</option>
                  <option value="ft³">Pieds cubes (ft³)</option>
                  <option value="L">Litres (L)</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-medium">Paramètres de suivi</h3>
          
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="tracking.enableMap"
                checked={settings.trackingSettings.enableMap}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    trackingSettings: {
                      ...prev.trackingSettings,
                      enableMap: e.target.checked
                    }
                  }));
                }}
                disabled={!canEdit && !isAdmin}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
              <span>Activer la carte de suivi</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="tracking.enableNotifications"
                checked={settings.trackingSettings.enableNotifications}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    trackingSettings: {
                      ...prev.trackingSettings,
                      enableNotifications: e.target.checked
                    }
                  }));
                }}
                disabled={!canEdit && !isAdmin}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
              />
              <span>Activer les notifications automatiques</span>
            </label>
          </div>
          
          <div className="space-y-2 max-w-md">
            <label className="block text-sm font-medium">
              Fréquence des mises à jour
              <select
                name="tracking.updateFrequency"
                value={settings.trackingSettings.updateFrequency}
                onChange={(e) => {
                  setSettings(prev => ({
                    ...prev,
                    trackingSettings: {
                      ...prev.trackingSettings,
                      updateFrequency: e.target.value
                    }
                  }));
                }}
                disabled={!canEdit && !isAdmin}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="15m">Toutes les 15 minutes</option>
                <option value="30m">Toutes les 30 minutes</option>
                <option value="1h">Toutes les heures</option>
                <option value="2h">Toutes les 2 heures</option>
                <option value="6h">Toutes les 6 heures</option>
                <option value="12h">Toutes les 12 heures</option>
                <option value="24h">Une fois par jour</option>
              </select>
            </label>
          </div>
        </div>
        
        <FreightAlert variant="success">
          Les paramètres du module fret sont utilisés par l'ensemble des fonctionnalités 
          du module et peuvent influencer le comportement de l'application sur les différents
          postes clients.
        </FreightAlert>
                
        {(canEdit || isAdmin) && (
          <div className="flex justify-end pt-4">
            <Button 
              onClick={saveSettings} 
              disabled={isSaving || (!canEdit && !isAdmin)}
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreightGeneralSettings;
