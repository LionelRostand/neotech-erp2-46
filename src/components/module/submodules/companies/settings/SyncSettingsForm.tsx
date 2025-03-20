
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, Save } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SyncSettingsFormProps {
  onSubmit?: (settings: any) => Promise<void>;
  defaultValues?: {
    apiUrl?: string;
    apiKey?: string;
    syncContacts?: boolean;
    syncCompanies?: boolean;
    syncDeals?: boolean;
    syncFrequency?: 'hourly' | 'daily' | 'manual';
    lastSyncedAt?: string;
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
    lastSyncedAt: defaultValues.lastSyncedAt || null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRadioChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      syncFrequency: value as 'hourly' | 'daily' | 'manual'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(settings);
        toast.success("Configuration enregistrée avec succès");
      } catch (error) {
        toast.error("Erreur lors de l'enregistrement de la configuration");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    // Simulate API connection test
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (settings.apiUrl && settings.apiKey) {
      toast.success("Connexion au CRM établie avec succès");
    } else {
      toast.error("Veuillez renseigner l'URL et la clé API");
    }
    
    setIsTesting(false);
  };

  const handleManualSync = async () => {
    if (!settings.apiUrl || !settings.apiKey) {
      toast.error("Veuillez configurer les informations de connexion au CRM");
      return;
    }

    setIsSyncing(true);
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    
    // Update last synced date
    setSettings(prev => ({
      ...prev,
      lastSyncedAt: new Date().toISOString()
    }));
    
    toast.success("Synchronisation effectuée avec succès");
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
        <RadioGroup 
          value={settings.syncFrequency} 
          onValueChange={handleRadioChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hourly" id="sync-hourly" />
            <Label htmlFor="sync-hourly">Toutes les heures</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="sync-daily" />
            <Label htmlFor="sync-daily">Une fois par jour</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manual" id="sync-manual" />
            <Label htmlFor="sync-manual">Manuellement</Label>
          </div>
        </RadioGroup>
      </div>

      {settings.lastSyncedAt && (
        <div className="text-sm text-muted-foreground">
          Dernière synchronisation: {new Date(settings.lastSyncedAt).toLocaleString('fr-FR')}
        </div>
      )}

      <div className="pt-4 flex flex-wrap gap-3">
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
        <Button
          type="button"
          variant="secondary"
          onClick={handleManualSync}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Synchroniser maintenant
        </Button>
      </div>
    </form>
  );
};

export default SyncSettingsForm;
