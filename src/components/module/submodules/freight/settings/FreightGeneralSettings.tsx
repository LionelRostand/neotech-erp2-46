
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Settings as SettingsIcon, Wifi, WifiOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirestore } from '@/hooks/useFirestore';

interface FreightGeneralSettingsProps {
  isAdmin: boolean;
  canEdit: boolean;
}

const FreightGeneralSettings: React.FC<FreightGeneralSettingsProps> = ({ isAdmin, canEdit }) => {
  const firestore = useFirestore(COLLECTIONS.FREIGHT.SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [settings, setSettings] = useState({
    companyName: "",
    contactEmail: "",
    phoneNumber: "",
    defaultCurrency: "EUR",
    address: "",
    enableCustomerPortal: true,
    enableTrackingNotifications: true,
    defaultPackageType: "standard",
    enableContainerTracking: true,
    trackingEmailTemplate: "",
    maxRecordsPerPage: 50,
    autoArchiveDelivered: true,
    archiveDaysThreshold: 30,
  });
  
  // Surveiller l'état de connexion
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Charger les paramètres depuis Firestore
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      
      try {
        // Essayer de récupérer les paramètres depuis Firestore
        const settingsRef = doc(db, COLLECTIONS.FREIGHT.SETTINGS, 'general');
        const settingsDoc = await getDoc(settingsRef);
        
        if (settingsDoc.exists()) {
          const settingsData = settingsDoc.data();
          setSettings({
            ...settings,
            ...settingsData
          });
        } else {
          // Si le document n'existe pas encore, on garde les valeurs par défaut
          console.log("Aucun paramètre trouvé, utilisation des valeurs par défaut");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres:", error);
        
        if (isOffline) {
          toast({
            title: "Mode hors ligne",
            description: "Vous êtes en mode hors ligne. Les modifications ne seront pas enregistrées.",
            variant: "warning"
          });
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les paramètres. Veuillez réessayer.",
            variant: "destructive"
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [isOffline]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
    setHasUnsavedChanges(true);
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setSettings({
      ...settings,
      [name]: value
    });
    setHasUnsavedChanges(true);
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({
      ...settings,
      [name]: checked
    });
    setHasUnsavedChanges(true);
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    
    // Vérifier que la valeur est un nombre valide
    if (!isNaN(numValue)) {
      setSettings({
        ...settings,
        [name]: numValue
      });
      setHasUnsavedChanges(true);
    }
  };
  
  const saveSettings = async () => {
    if (isOffline) {
      toast({
        title: "Mode hors ligne",
        description: "Vous êtes en mode hors ligne. Les modifications ne seront pas enregistrées.",
        variant: "warning"
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // Enregistrer les paramètres dans Firestore
      const settingsRef = doc(db, COLLECTIONS.FREIGHT.SETTINGS, 'general');
      await setDoc(settingsRef, settings, { merge: true });
      
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres ont été mis à jour avec succès.",
        variant: "success"
      });
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des paramètres:", error);
      
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const isEditable = (isAdmin || canEdit) && !loading;
  
  return (
    <div className="space-y-6">
      {isOffline && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3">
          <WifiOff className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Mode hors ligne</h3>
            <p className="text-sm text-amber-700">
              Vous êtes actuellement hors ligne. Les modifications ne seront pas enregistrées.
            </p>
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-blue-600" />
            <CardTitle>Paramètres généraux</CardTitle>
          </div>
          <CardDescription>
            Configurez les paramètres généraux du module Fret
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Chargement des paramètres...</span>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    value={settings.companyName} 
                    onChange={handleInputChange} 
                    disabled={!isEditable}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de contact</Label>
                  <Input 
                    id="contactEmail" 
                    name="contactEmail" 
                    type="email" 
                    value={settings.contactEmail} 
                    onChange={handleInputChange} 
                    disabled={!isEditable}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                  <Input 
                    id="phoneNumber" 
                    name="phoneNumber" 
                    value={settings.phoneNumber} 
                    onChange={handleInputChange} 
                    disabled={!isEditable}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                  <Select 
                    value={settings.defaultCurrency} 
                    onValueChange={(value) => handleSelectChange("defaultCurrency", value)}
                    disabled={!isEditable}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dollar américain ($)</SelectItem>
                      <SelectItem value="GBP">Livre sterling (£)</SelectItem>
                      <SelectItem value="CAD">Dollar canadien</SelectItem>
                      <SelectItem value="CHF">Franc suisse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea 
                  id="address" 
                  name="address" 
                  value={settings.address} 
                  onChange={handleInputChange} 
                  disabled={!isEditable}
                  rows={3}
                />
              </div>
              
              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-medium">Fonctionnalités</h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enableCustomerPortal" className="flex-1">Activer le portail client</Label>
                    <Switch 
                      id="enableCustomerPortal" 
                      checked={settings.enableCustomerPortal} 
                      onCheckedChange={(checked) => handleSwitchChange("enableCustomerPortal", checked)}
                      disabled={!isEditable}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enableTrackingNotifications" className="flex-1">Activer les notifications de suivi</Label>
                    <Switch 
                      id="enableTrackingNotifications" 
                      checked={settings.enableTrackingNotifications} 
                      onCheckedChange={(checked) => handleSwitchChange("enableTrackingNotifications", checked)}
                      disabled={!isEditable}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="enableContainerTracking" className="flex-1">Activer le suivi des conteneurs</Label>
                    <Switch 
                      id="enableContainerTracking" 
                      checked={settings.enableContainerTracking} 
                      onCheckedChange={(checked) => handleSwitchChange("enableContainerTracking", checked)}
                      disabled={!isEditable}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="autoArchiveDelivered" className="flex-1">Archivage automatique des livraisons</Label>
                    <Switch 
                      id="autoArchiveDelivered" 
                      checked={settings.autoArchiveDelivered} 
                      onCheckedChange={(checked) => handleSwitchChange("autoArchiveDelivered", checked)}
                      disabled={!isEditable}
                    />
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="defaultPackageType">Type de colis par défaut</Label>
                    <Select 
                      value={settings.defaultPackageType} 
                      onValueChange={(value) => handleSelectChange("defaultPackageType", value)}
                      disabled={!isEditable}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                        <SelectItem value="priority">Prioritaire</SelectItem>
                        <SelectItem value="economy">Économique</SelectItem>
                        <SelectItem value="heavy">Poids lourd</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxRecordsPerPage">Nombre d'enregistrements par page</Label>
                    <Input 
                      id="maxRecordsPerPage" 
                      name="maxRecordsPerPage" 
                      type="number" 
                      min="10" 
                      max="100" 
                      value={settings.maxRecordsPerPage} 
                      onChange={handleNumberChange} 
                      disabled={!isEditable}
                    />
                  </div>
                  
                  {settings.autoArchiveDelivered && (
                    <div className="space-y-2">
                      <Label htmlFor="archiveDaysThreshold">Délai d'archivage (jours)</Label>
                      <Input 
                        id="archiveDaysThreshold" 
                        name="archiveDaysThreshold" 
                        type="number" 
                        min="1" 
                        max="365" 
                        value={settings.archiveDaysThreshold} 
                        onChange={handleNumberChange} 
                        disabled={!isEditable}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trackingEmailTemplate">Modèle d'email de suivi</Label>
                  <Textarea 
                    id="trackingEmailTemplate" 
                    name="trackingEmailTemplate" 
                    value={settings.trackingEmailTemplate} 
                    onChange={handleInputChange} 
                    disabled={!isEditable}
                    placeholder="Exemple: Bonjour {client}, votre colis {tracking_code} est maintenant {status}."
                    rows={4}
                  />
                  <p className="text-sm text-gray-500">
                    Vous pouvez utiliser les variables suivantes : {'{client}'}, {'{tracking_code}'}, {'{status}'}, {'{date}'}, {'{heure}'}
                  </p>
                </div>
              </div>
              
              {isEditable && (
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={saveSettings}
                    disabled={saving || isOffline || !hasUnsavedChanges}
                    className="flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FreightGeneralSettings;
