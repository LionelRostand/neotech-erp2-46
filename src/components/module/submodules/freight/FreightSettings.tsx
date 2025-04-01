
import React, { useState } from 'react';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Settings as SettingsIcon } from 'lucide-react';
import FreightSecuritySettings from './FreightSecuritySettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FreightSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('security');

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
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5v14" />
              <path d="M5 19h14" />
              <path d="M5 5h9" />
              <path d="M15 12H9" />
            </svg>
            <span>Intégrations</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="general" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>
                  Configurez les options générales du module de gestion de fret
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Les paramètres généraux sont en cours de développement
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-0">
            <FreightSecuritySettings />
          </TabsContent>
          
          <TabsContent value="integrations" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Intégrations</CardTitle>
                <CardDescription>
                  Configurez les intégrations avec d'autres systèmes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Les paramètres d'intégration sont en cours de développement
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FreightSettings;
