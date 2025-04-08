
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/firebase-collections";

interface FreightSettings {
  id?: string;
  defaultTrackingEmail: string;
  defaultCarrier: string;
  enableAutomaticNotifications: boolean;
  clientPortalAccess: boolean;
  defaultShippingMethod: string;
  weightUnit: 'kg' | 'lb';
  distanceUnit: 'km' | 'mi';
  requireShippingInsurance: boolean;
  requireSignatureOnDelivery: boolean;
  updatedAt?: Date;
}

const FreightGeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState<FreightSettings>({
    defaultTrackingEmail: '',
    defaultCarrier: '',
    enableAutomaticNotifications: true,
    clientPortalAccess: true,
    defaultShippingMethod: 'standard',
    weightUnit: 'kg',
    distanceUnit: 'km',
    requireShippingInsurance: false,
    requireSignatureOnDelivery: true
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const settingsDoc = await getDoc(doc(db, COLLECTIONS.FREIGHT.SETTINGS, 'general'));
        
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as FreightSettings);
        }
      } catch (error) {
        console.error('Error fetching freight settings:', error);
        toast.error('Erreur lors du chargement des paramètres');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Handle input changes
  const handleChange = (field: keyof FreightSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Save settings
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      await setDoc(doc(db, COLLECTIONS.FREIGHT.SETTINGS, 'general'), {
        ...settings,
        updatedAt: new Date()
      });
      
      toast.success('Paramètres enregistrés avec succès');
    } catch (error) {
      console.error('Error saving freight settings:', error);
      toast.error('Erreur lors de l\'enregistrement des paramètres');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={e => { e.preventDefault(); saveSettings(); }} className="space-y-6">
          {/* Email and Carrier Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Paramètres généraux</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultTrackingEmail">Email par défaut pour le suivi</Label>
                <Input
                  id="defaultTrackingEmail"
                  type="email"
                  value={settings.defaultTrackingEmail}
                  onChange={e => handleChange('defaultTrackingEmail', e.target.value)}
                  placeholder="suivi@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultCarrier">Transporteur par défaut</Label>
                <Input
                  id="defaultCarrier"
                  value={settings.defaultCarrier}
                  onChange={e => handleChange('defaultCarrier', e.target.value)}
                  placeholder="Nom du transporteur"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Shipping Methods */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Méthode d'expédition</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultShippingMethod">Méthode d'expédition par défaut</Label>
                <Select
                  value={settings.defaultShippingMethod}
                  onValueChange={value => handleChange('defaultShippingMethod', value)}
                >
                  <SelectTrigger id="defaultShippingMethod">
                    <SelectValue placeholder="Sélectionner une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="priority">Prioritaire</SelectItem>
                    <SelectItem value="economy">Économique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weightUnit">Unité de poids</Label>
                  <Select
                    value={settings.weightUnit}
                    onValueChange={value => handleChange('weightUnit', value)}
                  >
                    <SelectTrigger id="weightUnit">
                      <SelectValue placeholder="Sélectionner une unité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogrammes (kg)</SelectItem>
                      <SelectItem value="lb">Livres (lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Notifications and Portal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications et portail client</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableAutomaticNotifications" className="text-base">
                    Activer les notifications automatiques
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Envoyer des notifications automatiques aux clients lors des changements de statut
                  </p>
                </div>
                <Switch
                  id="enableAutomaticNotifications"
                  checked={settings.enableAutomaticNotifications}
                  onCheckedChange={value => handleChange('enableAutomaticNotifications', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="clientPortalAccess" className="text-base">
                    Accès au portail client
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux clients d'accéder au portail de suivi des expéditions
                  </p>
                </div>
                <Switch
                  id="clientPortalAccess"
                  checked={settings.clientPortalAccess}
                  onCheckedChange={value => handleChange('clientPortalAccess', value)}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Shipping Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Exigences d'expédition</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireShippingInsurance" className="text-base">
                    Assurance obligatoire
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Exiger une assurance pour toutes les expéditions
                  </p>
                </div>
                <Switch
                  id="requireShippingInsurance"
                  checked={settings.requireShippingInsurance}
                  onCheckedChange={value => handleChange('requireShippingInsurance', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireSignatureOnDelivery" className="text-base">
                    Signature à la livraison
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Exiger une signature à la livraison pour toutes les expéditions
                  </p>
                </div>
                <Switch
                  id="requireSignatureOnDelivery"
                  checked={settings.requireSignatureOnDelivery}
                  onCheckedChange={value => handleChange('requireSignatureOnDelivery', value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FreightGeneralSettings;
