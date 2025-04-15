
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings, Shield, Globe, Bell, Database } from "lucide-react";
import PermissionsSettings from './PermissionsSettings';

const EmployeesSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('permissions');

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paramètres du module Employés</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 max-w-[600px]">
          <TabsTrigger value="permissions" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Général
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
        
        <TabsContent value="permissions" className="mt-6">
          <PermissionsSettings />
        </TabsContent>
        
        <TabsContent value="general" className="mt-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Paramètres généraux</h2>
            <p className="text-gray-500 mb-6">Configurez les options générales du module employés.</p>
            
            {/* Contenu à implémenter ultérieurement */}
            <div className="text-center py-8 text-gray-400">
              Fonctionnalité en cours de développement
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Paramètres de notifications</h2>
            <p className="text-gray-500 mb-6">Gérez les notifications envoyées aux employés et managers.</p>
            
            {/* Contenu à implémenter ultérieurement */}
            <div className="text-center py-8 text-gray-400">
              Fonctionnalité en cours de développement
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="mt-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gestion des données</h2>
            <p className="text-gray-500 mb-6">Configurez les options d'importation et d'exportation des données.</p>
            
            {/* Contenu à implémenter ultérieurement */}
            <div className="text-center py-8 text-gray-400">
              Fonctionnalité en cours de développement
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesSettings;
