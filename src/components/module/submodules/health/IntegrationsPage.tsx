import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, ArrowRight, Gift, Database, DollarSign, Zap, Globe, Upload, User, Lock, LucideIcon } from 'lucide-react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import IntegrationEmptyState from './components/integrations/IntegrationEmptyState';

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  link: string;
  type: 'billing' | 'ehr' | 'communication';
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
}

const integrationLogos: { [key: string]: LucideIcon } = {
  Gift: Gift,
  Database: Database,
  DollarSign: DollarSign,
  Zap: Zap,
  Globe: Globe,
  Upload: Upload,
  User: User,
  Lock: Lock,
  ArrowRight: ArrowRight
};

const integrationTypes = [
  { value: 'billing', label: 'Facturation' },
  { value: 'ehr', label: 'Dossier médical électronique (DME)' },
  { value: 'communication', label: 'Communication' }
];

const IntegrationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('installed');
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  
  // Get billing integrations data
  const { 
    data: billingIntegrations, 
    isLoading: billingIntegrationsLoading, 
    error: billingIntegrationsError 
  } = useCollectionData(
    COLLECTIONS.HEALTH.BILLING, // Use the correct path
    []
  );

  const handleIntegrationToggle = async (integration: Integration, enabled: boolean) => {
    try {
      const integrationRef = doc(db, COLLECTIONS.HEALTH.BILLING, integration.id);
      await setDoc(integrationRef, { ...integration, enabled: enabled }, { merge: true });
      toast.success(`L'intégration ${integration.name} a été ${enabled ? 'activée' : 'désactivée'}.`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'intégration :", error);
      toast.error("Erreur lors de la mise à jour de l'intégration.");
    }
  };

  const handleIntegrationSettings = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIntegrationModalOpen(true);
  };

  const handleCloseIntegrationModal = () => {
    setSelectedIntegration(null);
    setIntegrationModalOpen(false);
  };

  const handleSaveIntegrationSettings = async (integration: Integration) => {
    try {
      const integrationRef = doc(db, COLLECTIONS.HEALTH.BILLING, integration.id);
      await setDoc(integrationRef, { ...integration }, { merge: true });
      toast.success(`Les paramètres de l'intégration ${integration.name} ont été enregistrés.`);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des paramètres de l'intégration :", error);
      toast.error("Erreur lors de l'enregistrement des paramètres de l'intégration.");
    } finally {
      handleCloseIntegrationModal();
    }
  };

  const installedIntegrations = billingIntegrations ? billingIntegrations.filter(integration => integration.enabled) : [];
  const availableIntegrations = billingIntegrations ? billingIntegrations.filter(integration => !integration.enabled) : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Intégrations</CardTitle>
          <CardDescription>
            Connectez votre système de santé à d'autres services pour automatiser les tâches et améliorer l'efficacité.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="installed">Installées</TabsTrigger>
              <TabsTrigger value="available">Disponibles</TabsTrigger>
            </TabsList>
            <TabsContent value="installed">
              {installedIntegrations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {installedIntegrations.map((integration) => (
                      <TableRow key={integration.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            {integration.logo && integrationLogos[integration.logo] && (
                              React.createElement(integrationLogos[integration.logo], { className: "w-4 h-4" })
                            )}
                            <span>{integration.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {integrationTypes.find(type => type.value === integration.type)?.label || 'Inconnu'}
                        </TableCell>
                        <TableCell>
                          <Label htmlFor={`integration-toggle-${integration.id}`} className="cursor-pointer">
                            <Switch
                              id={`integration-toggle-${integration.id}`}
                              checked={integration.enabled}
                              onCheckedChange={(checked) => handleIntegrationToggle(integration, checked)}
                            />
                          </Label>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleIntegrationSettings(integration)}>
                            Paramètres
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <IntegrationEmptyState message="Aucune intégration installée." />
              )}
            </TabsContent>
            <TabsContent value="available">
              {availableIntegrations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableIntegrations.map((integration) => (
                      <TableRow key={integration.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            {integration.logo && integrationLogos[integration.logo] && (
                              React.createElement(integrationLogos[integration.logo], { className: "w-4 h-4" })
                            )}
                            <span>{integration.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {integrationTypes.find(type => type.value === integration.type)?.label || 'Inconnu'}
                        </TableCell>
                        <TableCell>{integration.description}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={integration.link} target="_blank">
                              En savoir plus <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <IntegrationEmptyState message="Aucune intégration disponible." />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Settings Modal */}
      {integrationModalOpen && selectedIntegration && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50">
          <div className="relative w-full max-w-md mx-auto mt-20">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de l'intégration {selectedIntegration.name}</CardTitle>
                <CardDescription>
                  Configurez les paramètres de l'intégration pour l'adapter à vos besoins.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Clé API</Label>
                  <Input
                    id="api-key"
                    type="text"
                    value={selectedIntegration.apiKey || ''}
                    onChange={(e) => setSelectedIntegration({ ...selectedIntegration, apiKey: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-secret">Secret API</Label>
                  <Input
                    id="api-secret"
                    type="password"
                    value={selectedIntegration.apiSecret || ''}
                    onChange={(e) => setSelectedIntegration({ ...selectedIntegration, apiSecret: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="secondary" onClick={handleCloseIntegrationModal}>
                    Annuler
                  </Button>
                  <Button onClick={() => handleSaveIntegrationSettings(selectedIntegration)}>
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage;

// Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ ...props }) => {
  return (
    <input
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
};
