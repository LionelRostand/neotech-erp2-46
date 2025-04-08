
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/patched-select";
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { Loader2, Settings, Save, Building, WifiOff } from "lucide-react";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

interface SettingsProps {
  isOffline?: boolean;
}

interface FreightSettings {
  defaultCompanyId: string;
  defaultCarrier: string;
  trackingEnabled: boolean;
  notificationsEnabled: boolean;
  autoArchiveShipments: boolean;
  archiveDays: number;
  weightUnit: 'kg' | 'lb';
  dimensionUnit: 'cm' | 'in';
}

const defaultSettings: FreightSettings = {
  defaultCompanyId: '',
  defaultCarrier: '',
  trackingEnabled: true,
  notificationsEnabled: true,
  autoArchiveShipments: false,
  archiveDays: 30,
  weightUnit: 'kg',
  dimensionUnit: 'cm'
};

const FreightGeneralSettings: React.FC<SettingsProps> = ({ isOffline = false }) => {
  const [settings, setSettings] = useState<FreightSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { companies, isLoading: isLoadingCompanies } = useFirebaseCompanies();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have cached settings in localStorage
        const cachedSettings = localStorage.getItem('freight_settings');
        if (isOffline && cachedSettings) {
          setSettings(JSON.parse(cachedSettings));
          setIsLoading(false);
          return;
        }
        
        const settingsDoc = await getDoc(doc(db, 'freight_settings', 'general'));
        if (settingsDoc.exists()) {
          const settingsData = settingsDoc.data() as FreightSettings;
          setSettings(settingsData);
          // Cache settings in localStorage
          localStorage.setItem('freight_settings', JSON.stringify(settingsData));
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement des paramètres du fret:', err);
        // If offline, try to use cached settings
        const cachedSettings = localStorage.getItem('freight_settings');
        if (cachedSettings) {
          setSettings(JSON.parse(cachedSettings));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [isOffline]);
  
  const handleSaveSettings = async () => {
    if (isOffline) {
      toast.error("Impossible d'enregistrer les paramètres en mode hors ligne");
      return;
    }
    
    try {
      setIsSaving(true);
      await setDoc(doc(db, 'freight_settings', 'general'), settings);
      // Update cache
      localStorage.setItem('freight_settings', JSON.stringify(settings));
      toast.success("Paramètres enregistrés avec succès");
    } catch (err: any) {
      console.error('Erreur lors de l\'enregistrement des paramètres:', err);
      toast.error(`Erreur: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleChange = (field: keyof FreightSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Paramètres généraux
        </CardTitle>
        <CardDescription>
          Configurez les paramètres généraux du module Fret
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isOffline && (
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 mb-4">
            <div className="flex items-start">
              <WifiOff className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Mode hors ligne</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                  Vous êtes en mode hors ligne. Les paramètres ne peuvent pas être sauvegardés.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultCompany">Entreprise par défaut</Label>
            {isLoadingCompanies ? (
              <div className="flex items-center h-9 space-x-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Chargement des entreprises...</span>
              </div>
            ) : (
              <Select 
                value={settings.defaultCompanyId}
                onValueChange={(value) => handleChange('defaultCompanyId', value)}
                disabled={isOffline}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="Sélectionnez une entreprise" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {companies.length === 0 ? (
                    <SelectItem value="no-companies" disabled>
                      Aucune entreprise trouvée
                    </SelectItem>
                  ) : (
                    companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultCarrier">Transporteur par défaut</Label>
            <Input 
              id="defaultCarrier" 
              value={settings.defaultCarrier} 
              onChange={(e) => handleChange('defaultCarrier', e.target.value)}
              placeholder="Nom du transporteur par défaut"
              disabled={isOffline}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weightUnit">Unité de poids</Label>
              <Select 
                value={settings.weightUnit}
                onValueChange={(value) => handleChange('weightUnit', value)}
                disabled={isOffline}
              >
                <SelectTrigger id="weightUnit">
                  <SelectValue placeholder="Sélectionnez une unité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogrammes (kg)</SelectItem>
                  <SelectItem value="lb">Livres (lb)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dimensionUnit">Unité de dimension</Label>
              <Select 
                value={settings.dimensionUnit}
                onValueChange={(value) => handleChange('dimensionUnit', value)}
                disabled={isOffline}
              >
                <SelectTrigger id="dimensionUnit">
                  <SelectValue placeholder="Sélectionnez une unité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">Centimètres (cm)</SelectItem>
                  <SelectItem value="in">Pouces (in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="archiveDays">Jours avant archivage automatique</Label>
            <Input 
              type="number" 
              id="archiveDays" 
              value={settings.archiveDays} 
              onChange={(e) => handleChange('archiveDays', Number(e.target.value))}
              min={1}
              max={365}
              disabled={!settings.autoArchiveShipments || isOffline}
            />
          </div>
          
          <Tabs defaultValue="features" className="pt-2">
            <TabsList>
              <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
              <TabsTrigger value="automation">Automatisation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackingEnabled">Suivi des expéditions</Label>
                  <p className="text-sm text-muted-foreground">Activer le suivi en temps réel des expéditions</p>
                </div>
                <Switch 
                  id="trackingEnabled" 
                  checked={settings.trackingEnabled}
                  onCheckedChange={(checked) => handleChange('trackingEnabled', checked)}
                  disabled={isOffline}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notificationsEnabled">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Envoyer des notifications sur les mises à jour d'expédition</p>
                </div>
                <Switch 
                  id="notificationsEnabled" 
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => handleChange('notificationsEnabled', checked)}
                  disabled={isOffline}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="automation" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoArchiveShipments">Archivage automatique</Label>
                  <p className="text-sm text-muted-foreground">Archiver automatiquement les expéditions terminées</p>
                </div>
                <Switch 
                  id="autoArchiveShipments" 
                  checked={settings.autoArchiveShipments}
                  onCheckedChange={(checked) => handleChange('autoArchiveShipments', checked)}
                  disabled={isOffline}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <Button 
          className="w-full mt-6 flex items-center gap-2"
          onClick={handleSaveSettings}
          disabled={isOffline || isSaving}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer les paramètres
        </Button>
      </CardContent>
    </Card>
  );
};

export default FreightGeneralSettings;
