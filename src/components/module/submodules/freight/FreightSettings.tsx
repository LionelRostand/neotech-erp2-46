
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, WifiOff, Settings, Shield, TruckIcon, UserCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FreightGeneralSettings from './settings/FreightGeneralSettings';
import FreightSecuritySettings from './FreightSecuritySettings';
import { checkFreightCollectionExists } from '@/hooks/fetchFreightCollectionData';

const FreightSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        // Try to fetch data to check if we're online
        const exists = await checkFreightCollectionExists('SETTINGS');
        setIsOffline(false);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error checking connection status:', err);
        if (err.code === 'unavailable' || err.message?.includes('offline')) {
          setIsOffline(true);
          toast({
            title: "Mode hors ligne",
            description: "Certaines fonctionnalités peuvent être limitées en raison de problèmes de connexion.",
            variant: "destructive"
          });
        }
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [toast]);

  // Retry connection
  const handleRetryConnection = async () => {
    setIsLoading(true);
    try {
      const exists = await checkFreightCollectionExists('SETTINGS');
      setIsOffline(false);
      toast({
        title: "Connexion rétablie",
        description: "Vous êtes à nouveau connecté au serveur.",
      });
    } catch (err) {
      setIsOffline(true);
      toast({
        title: "Toujours hors ligne",
        description: "Vérifiez votre connexion internet et réessayez.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isOffline && (
        <Alert variant="destructive" className="mb-6">
          <WifiOff className="h-4 w-4 mr-2" />
          <AlertTitle>Mode hors ligne</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>Vous êtes actuellement en mode hors ligne. Certaines fonctionnalités peuvent être limitées.</span>
            <button 
              onClick={handleRetryConnection}
              className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90 transition-colors"
            >
              Réessayer
            </button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center">
            <UserCog className="h-4 w-4 mr-2" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <FreightGeneralSettings isOffline={isOffline} />
        </TabsContent>
        
        <TabsContent value="security">
          <FreightSecuritySettings />
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permissions utilisateurs</CardTitle>
              <CardDescription>
                Gérez les droits d'accès au module Fret pour les différents utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isOffline ? (
                <div className="p-6 text-center">
                  <WifiOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Fonctionnalité non disponible hors ligne</h3>
                  <p className="text-muted-foreground">
                    Vous devez être connecté à internet pour gérer les permissions utilisateurs.
                  </p>
                </div>
              ) : (
                <p>Contenu des permissions</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightSettings;
