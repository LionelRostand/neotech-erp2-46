
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Users, Building, Database } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PermissionsTab from './settings/PermissionsTab';

const CrmSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Paramètres CRM</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 mb-4 md:w-[600px]">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Général</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Entreprises</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Données</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Paramètres généraux</h2>
                <p className="text-muted-foreground">
                  Configurez les paramètres généraux du module CRM.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <PermissionsTab />
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Configuration des entreprises</h2>
                <p className="text-muted-foreground">
                  Gérez les paramètres des entreprises dans le CRM.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Gestion des données</h2>
                <p className="text-muted-foreground">
                  Importez, exportez et gérez les données du CRM.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CrmSettings;
