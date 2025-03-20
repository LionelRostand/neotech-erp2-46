
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Database, 
  FileText, 
  BarChart2, 
  Workflow, 
  Smartphone, 
  Paperclip, 
  Check, 
  AlertCircle,
  ArrowRight,
  RefreshCw,
  TestTube,
  Building,
  MessageSquare,
  UserPlus
} from "lucide-react";
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  lastSync?: string;
  category: 'data' | 'api' | 'device' | 'module';
  icon: React.ReactNode;
}

interface ConnectionConfig {
  apiKey: string;
  baseUrl: string;
  username?: string;
  password?: string;
  identifiant?: string;
}

const IntegrationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configData, setConfigData] = useState<ConnectionConfig>({
    apiKey: '',
    baseUrl: '',
    username: '',
    password: '',
    identifiant: ''
  });

  const { getAll } = useFirestore(COLLECTIONS.HEALTH_BILLING);

  // Liste des intégrations disponibles
  const integrations: Integration[] = [
    {
      id: 'sesam-vitale',
      name: 'SESAM-Vitale',
      description: 'Connexion à l\'Assurance Maladie pour la gestion des cartes Vitale et FSE',
      status: 'active',
      lastSync: '2023-06-15T10:30:00',
      category: 'data',
      icon: <Database className="h-8 w-8 text-blue-500" />
    },
    {
      id: 'mssante',
      name: 'MSSanté',
      description: 'Messagerie sécurisée de santé pour les échanges entre professionnels',
      status: 'inactive',
      category: 'api',
      icon: <MessageSquare className="h-8 w-8 text-green-500" />
    },
    {
      id: 'dmp',
      name: 'DMP',
      description: 'Dossier Médical Partagé pour l\'accès aux antécédents patients',
      status: 'pending',
      category: 'data',
      icon: <FileText className="h-8 w-8 text-indigo-500" />
    },
    {
      id: 'biologie',
      name: 'Laboratoire Biologie',
      description: 'Échange de données avec les laboratoires d\'analyses médicales',
      status: 'active',
      lastSync: '2023-06-10T08:15:00',
      category: 'api',
      icon: <TestTube className="h-8 w-8 text-purple-500" />
    },
    {
      id: 'insi',
      name: 'INSi',
      description: 'Téléservice d\'identification nationale des patients',
      status: 'active',
      lastSync: '2023-06-12T14:45:00',
      category: 'api',
      icon: <UserPlus className="h-8 w-8 text-cyan-500" />
    },
    {
      id: 'scanner',
      name: 'Scanner documents',
      description: 'Intégration de scanner pour les documents patients',
      status: 'inactive',
      category: 'device',
      icon: <Paperclip className="h-8 w-8 text-amber-500" />
    },
    {
      id: 'analytics',
      name: 'Analytics Santé',
      description: 'Analyse statistique des données de santé',
      status: 'inactive',
      category: 'module',
      icon: <BarChart2 className="h-8 w-8 text-rose-500" />
    },
    {
      id: 'hopital',
      name: 'Connexion Hôpital',
      description: 'Échange de données avec les systèmes hospitaliers',
      status: 'pending',
      category: 'data',
      icon: <Building className="h-8 w-8 text-emerald-500" />
    },
    {
      id: 'crm',
      name: 'Module CRM',
      description: 'Synchronisation avec le module CRM',
      status: 'active',
      lastSync: '2023-06-14T16:20:00',
      category: 'module',
      icon: <Workflow className="h-8 w-8 text-orange-500" />
    },
    {
      id: 'mobile',
      name: 'Application Mobile',
      description: 'Connexion avec l\'application mobile du cabinet',
      status: 'active',
      lastSync: '2023-06-15T09:10:00',
      category: 'device',
      icon: <Smartphone className="h-8 w-8 text-blue-600" />
    }
  ];

  const filteredIntegrations = activeTab === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === activeTab);

  const handleToggleStatus = (integration: Integration) => {
    // Simule le changement d'état
    toast.success(`${integration.name} ${integration.status === 'active' ? 'désactivé' : 'activé'}`);
  };

  const handleSync = (integration: Integration) => {
    toast.promise(
      // Simule une synchronisation asynchrone
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: `Synchronisation en cours avec ${integration.name}...`,
        success: `Synchronisation avec ${integration.name} effectuée avec succès`,
        error: `Échec de la synchronisation avec ${integration.name}`
      }
    );
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    // Charger les configurations existantes (fictif pour le moment)
    setConfigData({
      apiKey: integration.id === 'sesam-vitale' ? 'sv_k3y_1234567890' : '',
      baseUrl: integration.id === 'sesam-vitale' ? 'https://api.sesam-vitale.fr/v1' : '',
      username: '',
      password: '',
      identifiant: integration.id === 'sesam-vitale' ? '123456789' : ''
    });
  };

  const handleSaveConfig = () => {
    if (!selectedIntegration) return;
    
    toast.promise(
      // Simule l'enregistrement des configurations
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Enregistrement des paramètres pour ${selectedIntegration.name}...`,
        success: `Configuration de ${selectedIntegration.name} mise à jour`,
        error: `Échec de la mise à jour pour ${selectedIntegration.name}`
      }
    );
    
    setSelectedIntegration(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Intégrations</h2>
          <p className="text-muted-foreground">
            Gérez les connexions avec d'autres systèmes et modules
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="device">Appareils</TabsTrigger>
          <TabsTrigger value="module">Modules</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    {integration.icon}
                    <Badge
                      variant={
                        integration.status === 'active'
                          ? 'default'
                          : integration.status === 'pending'
                          ? 'outline'
                          : 'secondary'
                      }
                    >
                      {integration.status === 'active' ? 'Active' : 
                       integration.status === 'pending' ? 'En attente' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  {integration.lastSync && (
                    <div className="text-sm text-muted-foreground flex items-center space-x-1">
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      <span>Dernière synchro : {new Date(integration.lastSync).toLocaleString('fr-FR')}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={integration.status === 'active'} 
                      onCheckedChange={() => handleToggleStatus(integration)} 
                    />
                    <Label>{integration.status === 'active' ? 'Activé' : 'Désactivé'}</Label>
                  </div>
                  <div className="space-x-2">
                    {integration.status === 'active' && (
                      <Button variant="outline" size="sm" onClick={() => handleSync(integration)}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Sync
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleConfigure(integration)}>
                      <Settings className="h-4 w-4 mr-1" />
                      Config
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                {selectedIntegration.icon}
                <div>
                  <CardTitle>Configuration de {selectedIntegration.name}</CardTitle>
                  <CardDescription>Paramètres de connexion et d'intégration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Clé API</Label>
                  <Input 
                    id="apiKey" 
                    value={configData.apiKey} 
                    onChange={e => setConfigData({...configData, apiKey: e.target.value})}
                    placeholder="Entrez la clé API" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baseUrl">URL de base</Label>
                  <Input 
                    id="baseUrl" 
                    value={configData.baseUrl} 
                    onChange={e => setConfigData({...configData, baseUrl: e.target.value})}
                    placeholder="https://api.exemple.com" 
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Identifiant</Label>
                  <Input 
                    id="username" 
                    value={configData.username} 
                    onChange={e => setConfigData({...configData, username: e.target.value})}
                    placeholder="Nom d'utilisateur" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={configData.password} 
                    onChange={e => setConfigData({...configData, password: e.target.value})}
                    placeholder="••••••••" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="identifiant">Identifiant spécifique</Label>
                <Input 
                  id="identifiant" 
                  value={configData.identifiant} 
                  onChange={e => setConfigData({...configData, identifiant: e.target.value})}
                  placeholder="Identifiant spécifique (ex: numéro structure)" 
                />
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Information</p>
                  <p>Les identifiants d'accès sont stockés de manière sécurisée. Pour les systèmes sensibles, 
                  une double authentification peut être requise.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedIntegration(null)}>Annuler</Button>
              <Button onClick={handleSaveConfig}>
                <Check className="h-4 w-4 mr-1" />
                Enregistrer
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage;
