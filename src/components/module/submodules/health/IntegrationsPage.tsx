import React, { useState, useEffect } from 'react';
import { Plus, Link2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import IntegrationEmptyState from './components/integrations/IntegrationEmptyState';
import AddIntegrationDialog from './components/integrations/AddIntegrationDialog';

interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'pending';
  lastSync?: string;
  description: string;
  icon?: string;
}

const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data, isLoading, error } = useCollectionData(
    COLLECTIONS.HEALTH.BILLING,
    []
  );

  useEffect(() => {
    setIntegrations([
      {
        id: '1',
        name: 'Système de Gestion d\'Assurance',
        type: 'insurance',
        status: 'active',
        lastSync: '2023-05-01T14:30:00',
        description: 'Synchronisation avec le système d\'assurance pour la vérification et le traitement des remboursements.',
        icon: '🔄'
      },
      {
        id: '2',
        name: 'Laboratoire Central',
        type: 'laboratory',
        status: 'active',
        lastSync: '2023-05-05T09:15:00',
        description: 'Échange de données avec le laboratoire pour les analyses et résultats.',
        icon: '🧪'
      },
      {
        id: '3',
        name: 'Pharmacie Connectée',
        type: 'pharmacy',
        status: 'inactive',
        lastSync: '2023-04-20T11:45:00',
        description: 'Envoi des ordonnances et vérification des disponibilités de médicaments.',
        icon: '💊'
      }
    ]);
  }, []);

  const toggleIntegrationStatus = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id ? { 
          ...integration, 
          status: integration.status === 'active' ? 'inactive' : 'active' 
        } : integration
      )
    );
  };

  const handleAddIntegration = () => {
    setIsAddDialogOpen(true);
  };

  const handleIntegrationAdded = (newIntegration: any) => {
    setIntegrations([...integrations, newIntegration]);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Link2 className="h-8 w-8 text-primary" />
          Intégrations
        </h1>
        <Button onClick={handleAddIntegration}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Intégration
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">Chargement des intégrations...</div>
      ) : error ? (
        <div className="text-red-500 p-4">Erreur de chargement : {error.toString()}</div>
      ) : integrations.length === 0 ? (
        <IntegrationEmptyState onAdd={handleAddIntegration} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map(integration => (
            <Card key={integration.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">{integration.icon}</div>
                    <CardTitle>{integration.name}</CardTitle>
                  </div>
                  <Badge className={integration.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                    {integration.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm">
                  <p className="flex justify-between text-muted-foreground">
                    <span>Dernière synchronisation:</span>
                    <span>{formatDate(integration.lastSync)}</span>
                  </p>
                  <p className="flex justify-between text-muted-foreground mt-1">
                    <span>Type:</span>
                    <span className="capitalize">{integration.type}</span>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`status-${integration.id}`}
                    checked={integration.status === 'active'}
                    onCheckedChange={() => toggleIntegrationStatus(integration.id)}
                  />
                  <Label htmlFor={`status-${integration.id}`}>Activer</Label>
                </div>
                <Button variant="outline" size="sm">Configurer</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <AddIntegrationDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onIntegrationAdded={handleIntegrationAdded}
      />
    </div>
  );
};

export default IntegrationsPage;
