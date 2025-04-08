
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirestore } from '@/hooks/useFirestore';
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define an interface for our settings to ensure type safety
interface FreightSettings {
  id?: string;
  autoTrackingUpdates: boolean;
  clientPortalEnabled: boolean;
  defaultCurrency: string;
  weightUnit: string;
  dimensionUnit: string;
  updatedAt?: Date;
}

const FreightGeneralSettings: React.FC = () => {
  const [autoTrackingUpdates, setAutoTrackingUpdates] = useState(true);
  const [clientPortalEnabled, setClientPortalEnabled] = useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState("EUR");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [dimensionUnit, setDimensionUnit] = useState("cm");
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Use the appropriate collection/document pattern
  const settingsCollectionPath = COLLECTIONS.FREIGHT.SETTINGS;
  const settingsDocumentId = 'general';
  const firestore = useFirestore(settingsCollectionPath);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setIsOffline(false);
      const settingsData = await firestore.getById(settingsDocumentId);
      
      if (settingsData) {
        // Cast the returned data to our interface to ensure type safety
        const settings = settingsData as FreightSettings;
        
        // Use optional chaining and nullish coalescing to safely access potentially undefined properties
        setAutoTrackingUpdates(settings.autoTrackingUpdates ?? true);
        setClientPortalEnabled(settings.clientPortalEnabled ?? true);
        setDefaultCurrency(settings.defaultCurrency || "EUR");
        setWeightUnit(settings.weightUnit || "kg");
        setDimensionUnit(settings.dimensionUnit || "cm");
      }
    } catch (error: any) {
      console.error("Error loading freight settings:", error);
      
      // Check if error is related to offline status
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        setIsOffline(true);
        toast.error("Vous êtes hors ligne. Les paramètres par défaut sont affichés.");
      } else {
        toast.error("Erreur lors du chargement des paramètres");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [firestore]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadSettings();
  };

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      
      const settingsData: FreightSettings = {
        autoTrackingUpdates,
        clientPortalEnabled,
        defaultCurrency,
        weightUnit,
        dimensionUnit,
        updatedAt: new Date()
      };
      
      await firestore.set(settingsDocumentId, settingsData);
      
      toast.success("Paramètres enregistrés avec succès");
      setIsOffline(false);
    } catch (error: any) {
      console.error("Error saving freight settings:", error);
      
      // Check if error is related to offline status
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        setIsOffline(true);
        toast.error("Impossible d'enregistrer les paramètres en mode hors ligne");
      } else {
        toast.error(`Erreur lors de l'enregistrement des paramètres: ${(error as Error).message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres généraux</CardTitle>
        <CardDescription>
          Configurez les paramètres généraux du module Fret
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isOffline && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Vous êtes actuellement hors ligne. Les modifications ne seront pas enregistrées.</span>
              <Button variant="outline" size="sm" onClick={handleRetry} className="ml-2 flex items-center gap-1">
                <RefreshCw className="h-3 w-3" /> Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoTrackingUpdates" className="font-medium">
                Mises à jour automatiques du tracking
              </Label>
              <p className="text-sm text-muted-foreground">
                Activer les mises à jour automatiques du statut des expéditions
              </p>
            </div>
            <Switch
              id="autoTrackingUpdates"
              checked={autoTrackingUpdates}
              onCheckedChange={setAutoTrackingUpdates}
              disabled={isLoading || isOffline}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="clientPortalEnabled" className="font-medium">
                Portail client
              </Label>
              <p className="text-sm text-muted-foreground">
                Activer le portail client pour le suivi des expéditions
              </p>
            </div>
            <Switch
              id="clientPortalEnabled"
              checked={clientPortalEnabled}
              onCheckedChange={setClientPortalEnabled}
              disabled={isLoading || isOffline}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Unités par défaut</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Devise par défaut</Label>
              <Input
                id="defaultCurrency"
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                disabled={isLoading || isOffline}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weightUnit">Unité de poids</Label>
              <Input
                id="weightUnit"
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                disabled={isLoading || isOffline}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dimensionUnit">Unité de dimension</Label>
              <Input
                id="dimensionUnit"
                value={dimensionUnit}
                onChange={(e) => setDimensionUnit(e.target.value)}
                disabled={isLoading || isOffline}
              />
            </div>
          </div>
        </div>

        <Separator />
        
        <div className="flex justify-end">
          <Button 
            onClick={saveSettings} 
            disabled={isLoading || isOffline}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer les paramètres"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreightGeneralSettings;
