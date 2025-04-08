
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Shield, Users } from "lucide-react";
import FreightGeneralSettings from './settings/FreightGeneralSettings';
import FreightPermissionsSettings from './settings/FreightPermissionsSettings';

const FreightSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Paramètres du Module Fret</h2>
      
      <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Droits d'accès
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <FreightGeneralSettings />
        </TabsContent>
        
        <TabsContent value="permissions">
          <FreightPermissionsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightSettings;
