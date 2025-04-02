
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import WebsiteIntegration from '../components/WebsiteIntegration';
import { useToast } from '@/hooks/use-toast';
import { WebsiteIntegration as WebsiteIntegrationType } from '../types/integration-types';
import BookingAnalytics from '../components/BookingAnalytics';

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
    <Tabs value={activeTab} className="w-full">
      <TabsContent value="integration">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Intégration sur votre site web</h3>
            <WebsiteIntegration onCreateIntegration={handleCreateIntegration} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="design">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Personnalisation du design</h3>
            <p className="text-muted-foreground">
              Personnalisez l'apparence du système de réservation en ligne pour correspondre 
              à l'identité visuelle de votre marque.
            </p>
            <div className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Couleur principale</label>
                  <div className="flex gap-2">
                    <input type="color" className="w-12 h-10 p-1 border rounded" defaultValue="#1E40AF" />
                    <input type="text" className="flex-1 border rounded px-3 py-2" defaultValue="#1E40AF" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Couleur secondaire</label>
                  <div className="flex gap-2">
                    <input type="color" className="w-12 h-10 p-1 border rounded" defaultValue="#60A5FA" />
                    <input type="text" className="flex-1 border rounded px-3 py-2" defaultValue="#60A5FA" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Couleur de texte</label>
                  <div className="flex gap-2">
                    <input type="color" className="w-12 h-10 p-1 border rounded" defaultValue="#111827" />
                    <input type="text" className="flex-1 border rounded px-3 py-2" defaultValue="#111827" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Couleur de fond</label>
                  <div className="flex gap-2">
                    <input type="color" className="w-12 h-10 p-1 border rounded" defaultValue="#FFFFFF" />
                    <input type="text" className="flex-1 border rounded px-3 py-2" defaultValue="#FFFFFF" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Police</label>
                  <select className="w-full border rounded px-3 py-2">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Montserrat</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Arrondi des bordures</label>
                  <select className="w-full border rounded px-3 py-2">
                    <option value="none">Aucun</option>
                    <option value="small">Petit (2px)</option>
                    <option value="medium">Moyen (4px)</option>
                    <option value="large">Grand (8px)</option>
                  </select>
                </div>
              </div>
              
              <button className="mt-6 bg-primary text-white px-4 py-2 rounded">
                Appliquer les changements
              </button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="analytics">
        <Card>
          <CardContent className="pt-6">
            <BookingAnalytics />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default WebBookingTabs;
