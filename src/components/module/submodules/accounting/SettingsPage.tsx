
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Settings, Users, Bell, Database, Link } from 'lucide-react';
import { useAccountingPermissions } from './hooks/useAccountingPermissions';
import PermissionsTab from './components/PermissionsTab';

// Mock data for accounting submodules
const accountingSubmodules = [
  { id: 'accounting-invoices', name: 'Factures' },
  { id: 'accounting-payments', name: 'Paiements' },
  { id: 'accounting-taxes', name: 'Taxes & TVA' },
  { id: 'accounting-reports', name: 'Rapports' },
  { id: 'accounting-settings', name: 'Paramètres' }
];

const AccountingSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { 
    users,
    userPermissions, 
    loading, 
    saving, 
    searchTerm, 
    setSearchTerm, 
    updatePermission, 
    setAllPermissionsOfType, 
    savePermissions 
  } = useAccountingPermissions();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Paramètres de la Comptabilité</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Général</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            <span>Intégrations</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Base de données</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres généraux</h2>
            <p className="text-muted-foreground">Configurez les paramètres généraux de la comptabilité ici.</p>
            {/* General settings form would go here */}
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <PermissionsTab
            users={users}
            userPermissions={userPermissions}
            accountingSubmodules={accountingSubmodules}
            loading={loading}
            saving={saving}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            updatePermission={updatePermission}
            setAllPermissionsOfType={setAllPermissionsOfType}
            savePermissions={savePermissions}
          />
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres de notifications</h2>
            <p className="text-muted-foreground">Configurez les notifications pour la comptabilité.</p>
            {/* Notifications settings form would go here */}
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Intégrations</h2>
            <p className="text-muted-foreground">Gérez les intégrations avec d'autres systèmes.</p>
            {/* Integrations settings form would go here */}
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Base de données</h2>
            <p className="text-muted-foreground">Gérez les données de la comptabilité.</p>
            {/* Database management options would go here */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingSettingsPage;
