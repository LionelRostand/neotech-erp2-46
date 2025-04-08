
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, Package, FileText, Ship, Truck, Search, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ClientShipmentTracking from './client-portal/ClientShipmentTracking';
import ClientDocumentsList from './client-portal/ClientDocumentsList';

const FreightClientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const { toast } = useToast();

  const handleTrackingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      toast({
        title: "Numéro manquant",
        description: "Veuillez entrer un numéro de suivi ou une référence.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    setSearchInitiated(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Portail Client
          </CardTitle>
          <CardDescription>
            Interface d'accès client aux expéditions et services de fret
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="tracking" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="tracking">
                <MapPin className="mr-2 h-4 w-4" />
                Suivi d'Expédition
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="mr-2 h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tracking" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Suivi de votre expédition</CardTitle>
                  <CardDescription>
                    Entrez le numéro de suivi ou la référence de votre expédition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTrackingSearch} className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Numéro de suivi ou référence..."
                        className="pl-8"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={isSearching || !trackingNumber.trim()}>
                      {isSearching ? 'Recherche...' : 'Rechercher'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {searchInitiated && (
                <ClientShipmentTracking 
                  trackingNumber={trackingNumber} 
                  isLoading={isSearching}
                />
              )}
            </TabsContent>
            
            <TabsContent value="documents">
              <ClientDocumentsList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Suivi d'expédition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Suivez vos expéditions en temps réel avec des mises à jour automatiques sur la carte.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents et factures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Accès aux factures, connaissements et documents douaniers pour chaque expédition.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5" />
              Demandes de devis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Interface simple pour demander des devis pour de nouvelles expéditions internationales.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightClientPortal;
