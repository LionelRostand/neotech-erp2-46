
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Save } from "lucide-react";

interface SyncSettingsFormProps {
  onSubmit?: (settings: any) => Promise<void>;
  defaultValues?: {
    apiUrl?: string;
    apiKey?: string;
    syncContacts?: boolean;
    syncCompanies?: boolean;
    syncDeals?: boolean;
    syncFrequency?: 'hourly' | 'daily' | 'manual';
  };
}

const SyncSettingsForm: React.FC<SyncSettingsFormProps> = ({ 
  onSubmit, 
  defaultValues = {} 
}) => {
  const [settings, setSettings] = useState({
    apiUrl: defaultValues.apiUrl || '',
    apiKey: defaultValues.apiKey || '',
    syncContacts: defaultValues.syncContacts || false,
    syncCompanies: defaultValues.syncCompanies || false,
    syncDeals: defaultValues.syncDeals || false,
    syncFrequency: defaultValues.syncFrequency || 'daily',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      syncFrequency: e.target.value as 'hourly' | 'daily' | 'manual'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(settings);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    // Simulate API connection test
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsTesting(false);
    // Here you would typically make an actual API call to test the connection
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">URL de l'API CRM</label>
          <Input 
            name="apiUrl"
            value={settings.apiUrl} 
            onChange={handleInputChange}
            placeholder="https://api.votrecrm.com/v1" 
          />
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium">Clé API</label>
          <Input 
            name="apiKey"
            type="password" 
            value={settings.apiKey}
            onChange={handleInputChange}
            placeholder="Votre clé API secrète" 
          />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Options de synchronisation</h4>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sync-contacts" 
              name="syncContacts"
              checked={settings.syncContacts}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, syncContacts: checked === true }))
              }
            />
            <label htmlFor="sync-contacts" className="text-sm">Contacts</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sync-companies"
              name="syncCompanies" 
              checked={settings.syncCompanies}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, syncCompanies: checked === true }))
              }
            />
            <label htmlFor="sync-companies" className="text-sm">Entreprises</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sync-deals"
              name="syncDeals" 
              checked={settings.syncDeals}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, syncDeals: checked === true }))
              }
            />
            <label htmlFor="sync-deals" className="text-sm">Opportunités</label>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Fréquence de synchronisation</h4>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="sync-hourly" 
              name="syncFrequency" 
              value="hourly"
              checked={settings.syncFrequency === 'hourly'}
              onChange={handleRadioChange}
            />
            <label htmlFor="sync-hourly" className="text-sm">Toutes les heures</label>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="sync-daily" 
              name="syncFrequency" 
              value="daily"
              checked={settings.syncFrequency === 'daily'}
              onChange={handleRadioChange}
            />
            <label htmlFor="sync-daily" className="text-sm">Une fois par jour</label>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="radio" 
              id="sync-manual" 
              name="syncFrequency" 
              value="manual"
              checked={settings.syncFrequency === 'manual'}
              onChange={handleRadioChange}
            />
            <label htmlFor="sync-manual" className="text-sm">Manuellement</label>
          </div>
        </div>
      </div>

      <div className="pt-4 flex space-x-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Enregistrer la configuration
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleTestConnection}
          disabled={isTesting}
        >
          {isTesting ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Tester la connexion
        </Button>
      </div>
    </form>
  );
};

export default SyncSettingsForm;
