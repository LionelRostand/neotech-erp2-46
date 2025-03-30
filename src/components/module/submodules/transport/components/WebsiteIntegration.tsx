
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Copy, ArrowRight, Code, Globe, Check, X, PlusCircle, RefreshCw, ExternalLink } from "lucide-react";
import { WebBookingFormConfig, WebsiteIntegration as WebsiteIntegrationType } from '../types/integration-types';
import { generateIntegrationCode, createNewIntegration } from '../utils/website-integration';
import { toast } from "sonner";
import { getAddressString } from '../types/reservation-types';

// Mock des pages de site Web disponibles
const mockWebsitePages = [
  { id: 'home', name: 'Accueil', path: '/' },
  { id: 'services', name: 'Services', path: '/services' },
  { id: 'reservations', name: 'Réservations', path: '/reservations' },
  { id: 'contact', name: 'Contact', path: '/contact' }
];

// Mock de l'état d'installation du module Website
const mockWebsiteModuleInstalled = true;
const mockWebsiteModuleId = '11';

interface WebsiteIntegrationProps {
  onCreateIntegration?: (integration: WebsiteIntegrationType) => void;
  existingIntegrations?: WebsiteIntegrationType[];
}

const WebsiteIntegration: React.FC<WebsiteIntegrationProps> = ({ 
  onCreateIntegration,
  existingIntegrations = []
}) => {
  const [integrations, setIntegrations] = useState<WebsiteIntegrationType[]>(existingIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<WebsiteIntegrationType | null>(null);
  const [integrationCode, setIntegrationCode] = useState<string>('');
  const [codeType, setCodeType] = useState<'iframe' | 'javascript'>('iframe');
  const [customDomain, setCustomDomain] = useState<string>('');
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  
  // État pour afficher les dialogues
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  
  // Effet pour initialiser l'intégration sélectionnée
  useEffect(() => {
    if (integrations.length > 0 && !selectedIntegration) {
      setSelectedIntegration(integrations[0]);
    }
  }, [integrations, selectedIntegration]);
  
  // Effet pour mettre à jour le code d'intégration lorsque l'intégration ou le type de code change
  useEffect(() => {
    if (selectedIntegration) {
      const code = generateIntegrationCode(
        selectedIntegration, 
        codeType, 
        customDomain || 'votre-domaine.com'
      );
      setIntegrationCode(code);
    }
  }, [selectedIntegration, codeType, customDomain]);
  
  // Gestionnaire pour la création d'une nouvelle intégration
  const handleCreateIntegration = () => {
    if (!selectedPageId) {
      toast.error("Veuillez sélectionner une page pour l'intégration");
      return;
    }
    
    const newIntegration = createNewIntegration(mockWebsiteModuleId, selectedPageId);
    
    setIntegrations(prev => [...prev, newIntegration]);
    setSelectedIntegration(newIntegration);
    setShowCreateDialog(false);
    
    // Notifier le composant parent si nécessaire
    if (onCreateIntegration) {
      onCreateIntegration(newIntegration);
    }
    
    toast.success("Nouvelle intégration créée avec succès");
  };
  
  // Gestionnaire pour la copie du code d'intégration
  const handleCopyCode = () => {
    navigator.clipboard.writeText(integrationCode);
    toast.success("Code d'intégration copié dans le presse-papier");
  };
  
  // Si le module Website n'est pas installé, afficher un message
  if (!mockWebsiteModuleInstalled) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Intégration au site Web</CardTitle>
          <CardDescription>
            Le module Website n'est pas installé. Pour intégrer le système de réservation à votre site web, installez d'abord le module Website.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => window.location.href = '/applications'}>
            <Globe className="h-4 w-4" /> 
            Installer le module Website
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Afficher le dialogue de création d'intégration
  if (showCreateDialog) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nouvelle intégration</CardTitle>
          <CardDescription>
            Sélectionnez une page de votre site Web où intégrer le système de réservation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page-select">Page du site Web</Label>
            <Select value={selectedPageId} onValueChange={setSelectedPageId}>
              <SelectTrigger id="page-select">
                <SelectValue placeholder="Sélectionner une page" />
              </SelectTrigger>
              <SelectContent>
                {mockWebsitePages.map(page => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name} ({page.path})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
          <Button onClick={handleCreateIntegration}>
            <Check className="mr-2 h-4 w-4" />
            Créer l'intégration
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Intégration avec le Website</CardTitle>
            <CardDescription>
              Intégrez le système de réservation de transport à votre site Web.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle intégration
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {integrations.length === 0 ? (
          <div className="text-center py-8">
            <Globe className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">Aucune intégration configurée</h3>
            <p className="mt-2 text-sm text-gray-500">
              Créez une intégration pour afficher le formulaire de réservation sur votre site Web.
            </p>
            <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer une intégration
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label>Sélectionner une intégration</Label>
                <Select
                  value={selectedIntegration?.id || ''}
                  onValueChange={(value) => {
                    const integration = integrations.find(i => i.id === value);
                    if (integration) setSelectedIntegration(integration);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une intégration" />
                  </SelectTrigger>
                  <SelectContent>
                    {integrations.map(integration => {
                      const page = mockWebsitePages.find(p => p.id === integration.pageId);
                      return (
                        <SelectItem key={integration.id} value={integration.id}>
                          {page ? `${page.name} (${page.path})` : integration.id}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Statut</Label>
                <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
                  {selectedIntegration?.status === 'active' ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Actif</span>
                    </>
                  ) : selectedIntegration?.status === 'inactive' ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      <span>Inactif</span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                      <span>En attente</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="domain">Domaine personnalisé</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2" 
                    onClick={() => selectedIntegration && window.open(`https://${customDomain || 'votre-domaine.com'}/reservations-transport/${selectedIntegration.id}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="ml-1">Prévisualiser</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <span className="flex items-center bg-muted px-3 rounded-l-md border border-r-0">https://</span>
                <Input
                  id="domain"
                  placeholder="votre-domaine.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="rounded-l-none"
                />
              </div>
            </div>
            
            <div>
              <Label>Méthode d'intégration</Label>
              <RadioGroup 
                value={codeType} 
                onValueChange={(value) => setCodeType(value as 'iframe' | 'javascript')}
                className="mt-2"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="iframe" id="iframe" />
                  <Label htmlFor="iframe" className="flex-grow cursor-pointer">
                    <div className="font-medium">Iframe (Recommandé)</div>
                    <div className="text-sm text-muted-foreground">Intégration simple via un cadre iframe.</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 mt-2">
                  <RadioGroupItem value="javascript" id="javascript" />
                  <Label htmlFor="javascript" className="flex-grow cursor-pointer">
                    <div className="font-medium">JavaScript</div>
                    <div className="text-sm text-muted-foreground">Intégration avancée avec plus de flexibilité.</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Code d'intégration</Label>
                <Button variant="outline" size="sm" className="h-7" onClick={handleCopyCode}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copier
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">
                <pre className="whitespace-pre-wrap">{integrationCode}</pre>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WebsiteIntegration;
