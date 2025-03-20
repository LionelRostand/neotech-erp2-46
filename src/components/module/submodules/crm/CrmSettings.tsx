
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import SyncSettingsForm from '../../submodules/companies/settings/SyncSettingsForm';
import { Settings, RefreshCw, Users } from 'lucide-react';

const CrmSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Paramètres CRM</h2>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              Général
            </TabsTrigger>
            <TabsTrigger value="sync">
              <RefreshCw className="h-4 w-4 mr-2" />
              Synchronisation
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <Users className="h-4 w-4 mr-2" />
              Permissions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Paramètres Généraux</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configurez les paramètres généraux de votre CRM.
              </p>
              
              {/* À implémenter ultérieurement */}
              <div className="text-center py-8 text-muted-foreground">
                Configuration générale à venir
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="sync">
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-6">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Synchronisation avec des services externes</h3>
              </div>

              <SyncSettingsForm 
                onSubmit={async (settings) => {
                  console.log('Saving CRM sync settings:', settings);
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }}
                defaultValues={{
                  syncFrequency: 'daily',
                  syncContacts: true,
                  syncCompanies: true,
                  syncDeals: false,
                  lastSyncedAt: new Date().toISOString()
                }}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="permissions">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Permissions Utilisateurs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Gérez qui peut accéder et modifier les données du CRM.
              </p>
              
              {/* À implémenter ultérieurement */}
              <div className="text-center py-8 text-muted-foreground">
                Gestion des permissions à venir
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CrmSettings;
