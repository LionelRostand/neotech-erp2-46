
import React, { useState } from 'react';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Settings as SettingsIcon, ArrowRightLeft } from 'lucide-react';
import FreightSecuritySettings from './FreightSecuritySettings';
import FreightGeneralSettings from './settings/FreightGeneralSettings';
import FreightIntegrationsTab from './settings/FreightIntegrationsTab';

const FreightSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les options du module de gestion de fret
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-[500px] grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span>Général</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            <span>Intégrations</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="general" className="mt-0">
            <FreightGeneralSettings />
          </TabsContent>
          
          <TabsContent value="security" className="mt-0">
            <FreightSecuritySettings />
          </TabsContent>
          
          <TabsContent value="integrations" className="mt-0">
            <FreightIntegrationsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FreightSettings;
