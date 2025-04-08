
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

const FreightGeneralSettings: React.FC = () => {
  const [autoTrackingUpdates, setAutoTrackingUpdates] = useState(true);
  const [clientPortalEnabled, setClientPortalEnabled] = useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState("EUR");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [dimensionUnit, setDimensionUnit] = useState("cm");
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the appropriate collection/document pattern
  // Instead of 'freight/settings/general', we'll use 'freight_settings' collection with 'general' document
  const settingsCollectionPath = 'freight_settings';
  const settingsDocumentId = 'general';
  const firestore = useFirestore(settingsCollectionPath);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const settings = await firestore.getById(settingsDocumentId);
        
        if (settings) {
          setAutoTrackingUpdates(settings.autoTrackingUpdates ?? true);
          setClientPortalEnabled(settings.clientPortalEnabled ?? true);
          setDefaultCurrency(settings.defaultCurrency || "EUR");
          setWeightUnit(settings.weightUnit || "kg");
          setDimensionUnit(settings.dimensionUnit || "cm");
        }
      } catch (error) {
        console.error("Error loading freight settings:", error);
        toast.error("Erreur lors du chargement des paramètres");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [firestore]);

  const saveSettings = async () => {
    try {
      setIsLoading(true);
      
      await firestore.set(settingsDocumentId, {
        autoTrackingUpdates,
        clientPortalEnabled,
        defaultCurrency,
        weightUnit,
        dimensionUnit,
        updatedAt: new Date()
      });
      
      toast.success("Paramètres enregistrés avec succès");
    } catch (error) {
      console.error("Error saving freight settings:", error);
      toast.error(`Erreur lors de l'enregistrement des paramètres: ${error.message}`);
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
              disabled={isLoading}
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
              disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weightUnit">Unité de poids</Label>
              <Input
                id="weightUnit"
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dimensionUnit">Unité de dimension</Label>
              <Input
                id="dimensionUnit"
                value={dimensionUnit}
                onChange={(e) => setDimensionUnit(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <Separator />
        
        <div className="flex justify-end">
          <Button 
            onClick={saveSettings} 
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer les paramètres"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreightGeneralSettings;
