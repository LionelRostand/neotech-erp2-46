
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Bell, Database } from "lucide-react";
import PermissionsSettings from '../employees/settings/PermissionsSettings';
import GeneralSettings from '../employees/settings/GeneralSettings';
import NotificationsSettings from '../employees/settings/NotificationsSettings';
import DataSettings from '../employees/settings/DataSettings';

const EmployeesSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paramètres du module Employés</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 max-w-[600px]">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            Données
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="permissions" className="mt-6">
          <PermissionsSettings />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <NotificationsSettings />
        </TabsContent>
        
        <TabsContent value="data" className="mt-6">
          <DataSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesSettings;
