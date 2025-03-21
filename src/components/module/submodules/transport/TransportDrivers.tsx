
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import DriversHeader from './components/drivers/DriversHeader';
import DriversTable from './components/drivers/DriversTable';
import DriverPerformance from './components/drivers/DriverPerformance';
import DriverAvailability from './components/drivers/DriverAvailability';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const TransportDrivers = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNetworkError, setIsNetworkError] = useState(false);
  
  // Use the safe firestore hook for better error handling
  const driversCollection = useSafeFirestore('drivers');

  // Handle network connectivity issues
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Attempt to reconnect if there's a network error
        if (isNetworkError) {
          const success = await driversCollection.reconnectAndRefetch();
          if (success) {
            setIsNetworkError(false);
            toast.success("Connexion rétablie avec succès");
          }
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };

    checkConnection();
    
    // Check connection when tab is activated
    const handleVisibilityChange = () => {
      if (!document.hidden && isNetworkError) {
        checkConnection();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isNetworkError, driversCollection]);

  // Handle retry attempts when network errors occur
  const handleRetryConnection = async () => {
    toast.info("Tentative de reconnexion...");
    try {
      const success = await driversCollection.reconnectAndRefetch();
      if (success) {
        setIsNetworkError(false);
        toast.success("Connexion rétablie avec succès");
      } else {
        toast.error("Échec de la reconnexion. Veuillez réessayer ultérieurement.");
      }
    } catch (error) {
      console.error("Error during retry:", error);
      toast.error("Une erreur est survenue lors de la tentative de reconnexion");
    }
  };

  // Detect network errors from the collection
  useEffect(() => {
    if (driversCollection.networkError) {
      setIsNetworkError(true);
    }
  }, [driversCollection.networkError]);

  return (
    <div className="space-y-6">
      <DriversHeader />
      
      {isNetworkError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Problème de connexion</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Impossible de se connecter à la base de données. Certaines fonctionnalités pourraient être limitées.</span>
            <Button variant="outline" size="sm" onClick={handleRetryConnection}>
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un chauffeur..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nouveau chauffeur</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Gestion des chauffeurs</CardTitle>
            <TabsList className="grid w-[400px] grid-cols-3">
              <TabsTrigger value="list" onClick={() => setActiveTab('list')}>Liste</TabsTrigger>
              <TabsTrigger value="performance" onClick={() => setActiveTab('performance')}>Performance</TabsTrigger>
              <TabsTrigger value="availability" onClick={() => setActiveTab('availability')}>Disponibilité</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="list" className="mt-0">
              <DriversTable searchTerm={searchTerm} />
            </TabsContent>
            <TabsContent value="performance" className="mt-0">
              <DriverPerformance />
            </TabsContent>
            <TabsContent value="availability" className="mt-0">
              <DriverAvailability />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportDrivers;
