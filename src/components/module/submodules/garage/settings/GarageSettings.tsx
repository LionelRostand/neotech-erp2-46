
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Bell } from 'lucide-react';
import GeneralSettingsTab from './GeneralSettingsTab';
import NotificationsTab from './NotificationsTab';
import GaragePermissionsTab from './GaragePermissionsTab';

const GarageSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h2 className="text-3xl font-bold">Paramètres du Garage</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 max-w-[600px]">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Droits d'accès
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <GeneralSettingsTab />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <NotificationsTab />
        </TabsContent>
        
        <TabsContent value="permissions" className="mt-6">
          <GaragePermissionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GarageSettings;
