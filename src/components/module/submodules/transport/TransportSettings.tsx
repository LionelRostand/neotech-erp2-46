
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SubmoduleHeader from '@/components/module/submodules/SubmoduleHeader';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

const TransportSettings = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isAutoDispatchEnabled, setIsAutoDispatchEnabled] = useState(false);
  const [isClientPortalEnabled, setIsClientPortalEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, COLLECTIONS.TRANSPORT.SETTINGS, 'general'));
        
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setIsNotificationsEnabled(data.notificationsEnabled ?? true);
          setIsAutoDispatchEnabled(data.autoDispatchEnabled ?? false);
          setIsClientPortalEnabled(data.clientPortalEnabled ?? true);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSaveGeneral = async () => {
    try {
      await setDoc(doc(db, COLLECTIONS.TRANSPORT.SETTINGS, 'general'), {
        notificationsEnabled: isNotificationsEnabled,
        autoDispatchEnabled: isAutoDispatchEnabled,
        clientPortalEnabled: isClientPortalEnabled,
        updatedAt: new Date()
      });
      
      toast.success("Paramètres généraux enregistrés");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erreur lors de l'enregistrement des paramètres");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Paramètres Transport</h2>
          <p className="text-gray-500">Configurez les paramètres pour le module Transport</p>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="dispatch">Répartition</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres principaux du module de transport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <Label htmlFor="notifications" className="font-medium">
                    Notifications système
                  </Label>
                  <p className="text-sm text-gray-500">
                    Activez les notifications automatiques pour les événements importants
                  </p>
                </div>
                <Switch 
                  id="notifications"
                  checked={isNotificationsEnabled}
                  onCheckedChange={setIsNotificationsEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <Label htmlFor="auto-dispatch" className="font-medium">
                    Répartition automatique
                  </Label>
                  <p className="text-sm text-gray-500">
                    Assigne automatiquement les chauffeurs aux réservations en fonction de la disponibilité
                  </p>
                </div>
                <Switch 
                  id="auto-dispatch"
                  checked={isAutoDispatchEnabled}
                  onCheckedChange={setIsAutoDispatchEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <Label htmlFor="client-portal" className="font-medium">
                    Portail client
                  </Label>
                  <p className="text-sm text-gray-500">
                    Activer/désactiver le portail client pour les réservations en ligne
                  </p>
                </div>
                <Switch 
                  id="client-portal"
                  checked={isClientPortalEnabled}
                  onCheckedChange={setIsClientPortalEnabled}
                />
              </div>
              
              <Button onClick={handleSaveGeneral} className="mt-6">
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dispatch">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de répartition</CardTitle>
              <CardDescription>
                Configurez comment les réservations sont assignées aux chauffeurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Content would go here */}
              <p className="text-sm text-gray-500">Contenu à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notification</CardTitle>
              <CardDescription>
                Configurez les notifications automatiques pour les clients et les chauffeurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Content would go here */}
              <p className="text-sm text-gray-500">Contenu à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations</CardTitle>
              <CardDescription>
                Connectez vos services tiers pour étendre les fonctionnalités
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Content would go here */}
              <p className="text-sm text-gray-500">Contenu à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des accès</CardTitle>
              <CardDescription>
                Définir les permissions pour les utilisateurs du module Transport
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Content would go here */}
              <p className="text-sm text-gray-500">Contenu à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportSettings;
