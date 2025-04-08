
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Save, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FreightGeneralSettingsProps {
  isOffline?: boolean;
}

interface SettingsData {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  defaultCurrency: string;
  enableNotifications: boolean;
  weightUnit: string;
  distanceUnit: string;
  defaultShippingTerms: string;
  lastUpdated?: Timestamp | null;
}

const defaultSettings: SettingsData = {
  companyName: 'Votre Entreprise',
  contactEmail: 'contact@example.com',
  contactPhone: '',
  defaultCurrency: 'EUR',
  enableNotifications: true,
  weightUnit: 'kg',
  distanceUnit: 'km',
  defaultShippingTerms: '',
  lastUpdated: null
};

const FreightGeneralSettings: React.FC<FreightGeneralSettingsProps> = ({ isOffline = false }) => {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      if (isOffline) {
        // If offline, use defaults or cached data
        const cachedSettings = localStorage.getItem('freight_settings');
        if (cachedSettings) {
          try {
            setSettings(JSON.parse(cachedSettings));
          } catch (err) {
            console.error('Error parsing cached settings:', err);
            setSettings(defaultSettings);
          }
        } else {
          setSettings(defaultSettings);
        }
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const settingsDocRef = doc(db, 'freight', 'settings');
        const settingsDoc = await getDoc(settingsDocRef);
        
        if (settingsDoc.exists()) {
          const data = settingsDoc.data() as SettingsData;
          setSettings(data);
          // Cache the settings
          localStorage.setItem('freight_settings', JSON.stringify(data));
        } else {
          setSettings(defaultSettings);
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement des paramètres du fret:', err);
        
        // If error occurs, try to use cached settings
        const cachedSettings = localStorage.getItem('freight_settings');
        if (cachedSettings) {
          try {
            setSettings(JSON.parse(cachedSettings));
            toast({
              title: "Utilisation des paramètres en cache",
              description: "Les paramètres les plus récents sont affichés à partir du cache local.",
              variant: "default"
            });
          } catch (parseErr) {
            console.error('Error parsing cached settings:', parseErr);
            setSettings(defaultSettings);
          }
        } else {
          setSettings(defaultSettings);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [isOffline, toast]);

  const handleChange = (field: keyof SettingsData, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (isOffline) {
      // If offline, just save to localStorage
      localStorage.setItem('freight_settings', JSON.stringify(settings));
      toast({
        title: "Paramètres enregistrés localement",
        description: "Les modifications seront synchronisées lorsque vous serez à nouveau en ligne.",
        variant: "default"
      });
      return;
    }

    try {
      setIsSaving(true);
      const settingsDocRef = doc(db, 'freight', 'settings');
      await setDoc(settingsDocRef, {
        ...settings,
        lastUpdated: Timestamp.now()
      });
      
      // Cache the settings
      localStorage.setItem('freight_settings', JSON.stringify(settings));
      
      toast({
        title: "Paramètres enregistrés",
        description: "Les modifications ont été appliquées avec succès.",
        variant: "default"
      });
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde des paramètres:', err);
      toast({
        title: "Erreur de sauvegarde",
        description: err.message || "Une erreur est survenue lors de l'enregistrement des paramètres.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Chargement des paramètres...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Paramètres généraux</CardTitle>
        <CardDescription>
          Configurez les paramètres de base pour le module de gestion du fret
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isOffline && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6 flex items-center">
            <WifiOff className="h-5 w-5 text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-700">
              Vous êtes en mode hors ligne. Les modifications seront enregistrées localement.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nom de l'entreprise</Label>
            <Input 
              id="companyName" 
              value={settings.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email de contact</Label>
            <Input 
              id="contactEmail" 
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Téléphone de contact</Label>
            <Input 
              id="contactPhone" 
              value={settings.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultCurrency">Devise par défaut</Label>
            <Select 
              value={settings.defaultCurrency}
              onValueChange={(value) => handleChange('defaultCurrency', value)}
            >
              <SelectTrigger id="defaultCurrency">
                <SelectValue placeholder="Choisir une devise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">Euro (€)</SelectItem>
                <SelectItem value="USD">Dollar US ($)</SelectItem>
                <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                <SelectItem value="CAD">Dollar Canadien (C$)</SelectItem>
                <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weightUnit">Unité de poids</Label>
            <Select 
              value={settings.weightUnit}
              onValueChange={(value) => handleChange('weightUnit', value)}
            >
              <SelectTrigger id="weightUnit">
                <SelectValue placeholder="Choisir une unité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilogrammes (kg)</SelectItem>
                <SelectItem value="g">Grammes (g)</SelectItem>
                <SelectItem value="lb">Livres (lb)</SelectItem>
                <SelectItem value="oz">Onces (oz)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="distanceUnit">Unité de distance</Label>
            <Select 
              value={settings.distanceUnit}
              onValueChange={(value) => handleChange('distanceUnit', value)}
            >
              <SelectTrigger id="distanceUnit">
                <SelectValue placeholder="Choisir une unité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">Kilomètres (km)</SelectItem>
                <SelectItem value="mi">Miles (mi)</SelectItem>
                <SelectItem value="nm">Milles Nautiques (nm)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="enableNotifications" 
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => handleChange('enableNotifications', checked)}
            />
            <Label htmlFor="enableNotifications">Activer les notifications</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Envoyez des notifications automatiques pour les mises à jour d'expédition
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="defaultShippingTerms">Conditions de livraison par défaut</Label>
          <Textarea 
            id="defaultShippingTerms" 
            value={settings.defaultShippingTerms}
            onChange={(e) => handleChange('defaultShippingTerms', e.target.value)}
            placeholder="Saisissez les conditions de livraison par défaut qui apparaîtront sur vos documents"
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button onClick={handleSave} disabled={isSaving || isLoading}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FreightGeneralSettings;
