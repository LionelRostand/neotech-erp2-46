
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import WebsiteIntegration from '../components/WebsiteIntegration';
import { useToast } from '@/hooks/use-toast';
import { WebsiteIntegration as WebsiteIntegrationType } from '../types/integration-types';

interface WebsiteTabsProps {
  activeTab: string;
}

const WebBookingTabs: React.FC<WebsiteTabsProps> = ({ activeTab }) => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<WebsiteIntegrationType[]>([]);
  
  const handleCreateIntegration = (integration: WebsiteIntegrationType) => {
    setIntegrations(prev => [...prev, integration]);
    toast({
      title: "Intégration créée",
      description: "L'intégration a été créée avec succès.",
    });
  };

  return (
    <>
      <TabsContent value="integration" className={activeTab === 'integration' ? '' : 'hidden'}>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Intégration sur votre site web</h3>
            <WebsiteIntegration onCreateIntegration={handleCreateIntegration} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="design" className={activeTab === 'design' ? '' : 'hidden'}>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Personnalisation du design</h3>
            <p className="text-muted-foreground">
              Personnalisez l'apparence du système de réservation en ligne pour correspondre 
              à l'identité visuelle de votre marque.
            </p>
            <div className="py-8 text-center text-muted-foreground">
              La personnalisation du design sera disponible prochainement.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="analytics" className={activeTab === 'analytics' ? '' : 'hidden'}>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Statistiques de réservation</h3>
            <p className="text-muted-foreground">
              Suivez les performances de votre système de réservation en ligne.
            </p>
            <div className="py-8 text-center text-muted-foreground">
              Les statistiques de réservation seront disponibles prochainement.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

export default WebBookingTabs;
