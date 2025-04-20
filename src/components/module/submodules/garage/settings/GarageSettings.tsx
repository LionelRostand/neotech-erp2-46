
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Settings, Shield, Bell } from "lucide-react";
import GaragePermissionsTab from './GaragePermissionsTab';
import GeneralSettingsTab from './GeneralSettingsTab';
import NotificationsTab from './NotificationsTab';

const GarageSettings = () => {
  const [activeTab, setActiveTab] = useState('permissions');

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paramètres du Garage</h1>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Général
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Droits d'accès
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettingsTab />
          </TabsContent>
          
          <TabsContent value="permissions">
            <GaragePermissionsTab />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default GarageSettings;
