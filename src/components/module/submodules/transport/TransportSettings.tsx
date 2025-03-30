
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Shield } from "lucide-react";
import TransportPermissionsTab from './settings/TransportPermissionsTab';
import TransportGeneralTab from './settings/TransportGeneralTab';

const TransportSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Paramètres</h2>
      
      <Tabs defaultValue="general" className="w-full">
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
          <TransportGeneralTab />
        </TabsContent>
        
        <TabsContent value="permissions">
          <TransportPermissionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportSettings;
