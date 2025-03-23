
import React, { useState } from 'react';
import { Settings, Truck, Link2, ToggleLeft, Shield, Users, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const FreightSettings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoTrackingEnabled, setAutoTrackingEnabled] = useState(true);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState('EUR');
  const [defaultWeightUnit, setDefaultWeightUnit] = useState('kg');
  const [defaultDistanceUnit, setDefaultDistanceUnit] = useState('km');
  
  // Intégrations
  const [integrations, setIntegrations] = useState([
    { 
      id: 'maps', 
      name: 'Google Maps', 
      description: 'Intégration pour l\'affichage des cartes et calcul des itinéraires', 
      status: 'connected', 
      icon: <Link2 className="h-6 w-6 text-blue-500" /> 
    },
    { 
      id: 'customs', 
      name: 'Douanes Express', 
      description: 'Interface avec les systèmes douaniers pour faciliter le dédouanement', 
      status: 'disconnected', 
      icon: <Shield className="h-6 w-6 text-red-500" /> 
    },
    { 
      id: 'carriers', 
      name: 'API Transporteurs', 
      description: 'Connexion aux API des transporteurs partenaires', 
      status: 'partial', 
      icon: <Truck className="h-6 w-6 text-amber-500" /> 
    },
    { 
      id: 'tracking', 
      name: 'TrackEverything', 
      description: 'Service centralisé de suivi des expéditions internationales', 
      status: 'disconnected', 
      icon: <Link2 className="h-6 w-6 text-gray-500" /> 
    },
  ]);
  
  const getIntegrationStatusBadge = (status: string) => {
    switch(status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connecté</Badge>;
      case 'disconnected':
        return <Badge className="bg-red-100 text-red-800">Non connecté</Badge>;
      case 'partial':
        return <Badge className="bg-amber-100 text-amber-800">Partiel</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  const handleSaveGeneralSettings = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Les paramètres généraux ont été mis à jour avec succès."
    });
  };
  
  const handleConfigureIntegration = (integrationId: string) => {
    toast({
      title: "Configuration",
      description: `Configuration de l'intégration ${integrationId} en cours...`
    });
  };
  
  const handleConnectIntegration = (integrationId: string) => {
    // Update the status of the integration
    setIntegrations(integrations.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'connected' } 
        : integration
    ));
    
    toast({
      title: "Intégration connectée",
      description: `L'intégration a été connectée avec succès.`
    });
  };
  
  const handleSaveIntegrationSettings = () => {
    toast({
      title: "Paramètres d'intégration enregistrés",
      description: "Les paramètres d'intégration ont été mis à jour avec succès."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Général</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            <span>Intégrations</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Utilisateurs</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Général */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux du module de gestion des expéditions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-y-2">
                <div>
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-gray-500">Recevoir des notifications sur les mises à jour d'expédition</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between space-y-2">
                <div>
                  <Label htmlFor="auto-tracking">Suivi automatique</Label>
                  <p className="text-sm text-gray-500">Mettre à jour automatiquement le statut des expéditions</p>
                </div>
                <Switch
                  id="auto-tracking"
                  checked={autoTrackingEnabled}
                  onCheckedChange={setAutoTrackingEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between space-y-2">
                <div>
                  <Label htmlFor="auto-assign">Assignation automatique</Label>
                  <p className="text-sm text-gray-500">Assigner automatiquement les transporteurs aux expéditions</p>
                </div>
                <Switch
                  id="auto-assign"
                  checked={autoAssignEnabled}
                  onCheckedChange={setAutoAssignEnabled}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="default-currency">Devise par défaut</Label>
                  <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                    <SelectTrigger id="default-currency">
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dollar US ($)</SelectItem>
                      <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                      <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-weight">Unité de poids</Label>
                  <Select value={defaultWeightUnit} onValueChange={setDefaultWeightUnit}>
                    <SelectTrigger id="default-weight">
                      <SelectValue placeholder="Sélectionner une unité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogrammes (kg)</SelectItem>
                      <SelectItem value="lb">Livres (lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-distance">Unité de distance</Label>
                  <Select value={defaultDistanceUnit} onValueChange={setDefaultDistanceUnit}>
                    <SelectTrigger id="default-distance">
                      <SelectValue placeholder="Sélectionner une unité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilomètres (km)</SelectItem>
                      <SelectItem value="mi">Miles (mi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneralSettings}>Enregistrer les paramètres</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Intégrations */}
        <TabsContent value="integrations" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations externes</CardTitle>
              <CardDescription>
                Gérez les connexions avec les services externes et les API partenaires.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {integration.icon}
                    <div>
                      <h3 className="font-medium">{integration.name}</h3>
                      <p className="text-sm text-gray-500">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getIntegrationStatusBadge(integration.status)}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConfigureIntegration(integration.id)}
                    >
                      <Wrench className="mr-1 h-4 w-4" />
                      Configurer
                    </Button>
                    {integration.status !== 'connected' && (
                      <Button 
                        size="sm"
                        onClick={() => handleConnectIntegration(integration.id)}
                      >
                        <Link2 className="mr-1 h-4 w-4" />
                        Connecter
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveIntegrationSettings}>Enregistrer les paramètres</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Sécurité */}
        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>
                Configurez les options de sécurité et d'accès pour votre module d'expédition.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Ces paramètres contrôlent qui peut accéder aux différentes fonctionnalités du module d'expédition et quelles actions ils peuvent effectuer.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Utilisateurs */}
        <TabsContent value="users" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>
                Gérez les utilisateurs qui ont accès au module d'expédition.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Ces paramètres vous permettent de gérer les utilisateurs qui ont accès au module d'expédition, ainsi que leurs rôles et permissions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightSettings;
