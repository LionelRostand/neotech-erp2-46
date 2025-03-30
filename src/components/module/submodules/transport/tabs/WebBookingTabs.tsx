
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, Calendar, Users } from 'lucide-react';
import WebsiteIntegration from '../components/WebsiteIntegration';
import { WebsiteIntegration as WebsiteIntegrationType } from '../types/integration-types';

interface WebBookingTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const WebBookingTabs: React.FC<WebBookingTabsProps> = ({ activeTab, setActiveTab }) => {
  // Gestionnaire pour la création d'une nouvelle intégration
  const handleCreateIntegration = (integration: WebsiteIntegrationType) => {
    console.log('Nouvelle intégration créée:', integration);
    // Ici, vous pourriez enregistrer l'intégration dans Firebase ou un autre store
  };

  return (
    <Tabs 
      defaultValue="configuration" 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="configuration">
          <Settings className="mr-2 h-4 w-4" />
          Configuration
        </TabsTrigger>
        <TabsTrigger value="formulaire">
          <Globe className="mr-2 h-4 w-4" />
          Formulaire
        </TabsTrigger>
        <TabsTrigger value="reservations">
          <Calendar className="mr-2 h-4 w-4" />
          Réservations
        </TabsTrigger>
        <TabsTrigger value="integration">
          <Users className="mr-2 h-4 w-4" />
          Intégration
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="configuration" className="space-y-6">
        {/* Contenu existant pour l'onglet configuration */}
      </TabsContent>
      
      <TabsContent value="formulaire" className="space-y-6">
        {/* Contenu existant pour l'onglet formulaire */}
      </TabsContent>
      
      <TabsContent value="reservations" className="space-y-6">
        {/* Contenu existant pour l'onglet réservations */}
      </TabsContent>
      
      <TabsContent value="integration" className="space-y-6">
        <WebsiteIntegration onCreateIntegration={handleCreateIntegration} />
      </TabsContent>
    </Tabs>
  );
};

export default WebBookingTabs;
