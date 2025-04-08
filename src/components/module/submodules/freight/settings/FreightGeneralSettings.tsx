
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirestore } from '@/hooks/useFirestore';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
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

// Default settings to use when offline or when settings haven't been loaded yet
const DEFAULT_SETTINGS: FreightSettings = {
  autoTrackingUpdates: true,
  clientPortalEnabled: true,
  defaultCurrency: "EUR",
  weightUnit: "kg",
  dimensionUnit: "cm",
};

const FreightGeneralSettings: React.FC = () => {
  // State for form fields
  const [autoTrackingUpdates, setAutoTrackingUpdates] = useState(DEFAULT_SETTINGS.autoTrackingUpdates);
  const [clientPortalEnabled, setClientPortalEnabled] = useState(DEFAULT_SETTINGS.clientPortalEnabled);
  const [defaultCurrency, setDefaultCurrency] = useState(DEFAULT_SETTINGS.defaultCurrency);
  const [weightUnit, setWeightUnit] = useState(DEFAULT_SETTINGS.weightUnit);
  const [dimensionUnit, setDimensionUnit] = useState(DEFAULT_SETTINGS.dimensionUnit);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Use a proper document reference structure - Firestore needs even number of segments
  const settingsCollectionPath = 'freight_settings';
  const settingsDocumentId = 'general';
  const firestore = useFirestore(settingsCollectionPath);

  // Check for changes to enable/disable the save button
  useEffect(() => {
    if (!settingsLoaded) return;
    
    // Check if any settings have been changed from what was loaded
    const currentSettings = {
      autoTrackingUpdates,
      clientPortalEnabled,
      defaultCurrency,
      weightUnit,
      dimensionUnit
    };

    // Compare with defaults or previous loaded settings
    setHasUnsavedChanges(true);
    
  }, [autoTrackingUpdates, clientPortalEnabled, defaultCurrency, weightUnit, dimensionUnit, settingsLoaded]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      if (isOffline) {
        setIsOffline(false);
        toast.success("Connexion internet rétablie");
        // Reload settings when we get back online
        loadSettings();
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.warning("Mode hors ligne actif. Les modifications ne seront pas enregistrées.");
    };

    // Set initial state
    setIsOffline(!navigator.onLine);
    
    // Add listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Remove listeners on cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOffline]);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Getting document reference for freight_settings/general');
      
      if (!navigator.onLine) {
        setIsOffline(true);
        setIsLoading(false);
        toast.warning("Mode hors ligne. Utilisation des paramètres par défaut.");
        return;
      }

      const settingsData = await firestore.getById(settingsDocumentId);
      
      if (settingsData) {
        // Cast the returned data to our interface to ensure type safety
        const settings = settingsData as FreightSettings;
        
        // Use optional chaining and nullish coalescing to safely access potentially undefined properties
        setAutoTrackingUpdates(settings.autoTrackingUpdates ?? DEFAULT_SETTINGS.autoTrackingUpdates);
        setClientPortalEnabled(settings.clientPortalEnabled ?? DEFAULT_SETTINGS.clientPortalEnabled);
        setDefaultCurrency(settings.defaultCurrency || DEFAULT_SETTINGS.defaultCurrency);
        setWeightUnit(settings.weightUnit || DEFAULT_SETTINGS.weightUnit);
        setDimensionUnit(settings.dimensionUnit || DEFAULT_SETTINGS.dimensionUnit);
        
        setSettingsLoaded(true);
        setHasUnsavedChanges(false);
      } else {
        // No settings found, use defaults
        resetToDefaults();
        
        if (navigator.onLine) {
          // Create default settings if we're online
          await saveSettings(true);
        }
      }
      
      setIsOffline(false);
    } catch (error: any) {
      console.error("Error loading freight settings:", error);
      
      // Check if error is related to offline status
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        setIsOffline(true);
        toast.warning("Vous êtes hors ligne. Les paramètres par défaut sont affichés.");
      } else {
        toast.error("Erreur lors du chargement des paramètres");
      }
      
      // Use default values in case of error
      resetToDefaults();
    } finally {
      setIsLoading(false);
    }
  }, [firestore, settingsDocumentId]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const resetToDefaults = () => {
    setAutoTrackingUpdates(DEFAULT_SETTINGS.autoTrackingUpdates);
    setClientPortalEnabled(DEFAULT_SETTINGS.clientPortalEnabled);
    setDefaultCurrency(DEFAULT_SETTINGS.defaultCurrency);
    setWeightUnit(DEFAULT_SETTINGS.weightUnit);
    setDimensionUnit(DEFAULT_SETTINGS.dimensionUnit);
    setSettingsLoaded(true);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadSettings();
  };

  const saveSettings = async (isInitialSave = false) => {
    if (isOffline) {
      toast.error("Impossible d'enregistrer les paramètres en mode hors ligne");
      return;
    }
    
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
      
      if (!isInitialSave) {
        toast.success("Paramètres enregistrés avec succès");
      }
      
      setHasUnsavedChanges(false);
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Paramètres généraux</CardTitle>
            <CardDescription>
              Configurez les paramètres généraux du module Fret
            </CardDescription>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            {isOffline ? (
              <div className="flex items-center gap-1 text-amber-500">
                <WifiOff className="h-4 w-4" />
                <span>Hors ligne</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-green-500">
                <Wifi className="h-4 w-4" />
                <span>En ligne</span>
              </div>
            )}
          </div>
        </div>
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
            onClick={() => saveSettings()}
            disabled={isLoading || isOffline || !hasUnsavedChanges}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer les paramètres"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreightGeneralSettings;
