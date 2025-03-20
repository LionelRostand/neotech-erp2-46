
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import PermissionsTab from './settings/PermissionsTab';
import CrmSyncTab from './settings/CrmSyncTab';
import { useCompanyPermissions } from './settings/useCompanyPermissions';

const CompaniesSettings = () => {
  const [activeTab, setActiveTab] = useState("permissions");

  // Module submodules for permissions
  const companySubmodules = [
    { id: "companies-dashboard", name: "Tableau de bord" },
    { id: "companies-list", name: "Liste des entreprises" },
    { id: "companies-create", name: "Créer une entreprise" },
    { id: "companies-contacts", name: "Contacts" },
    { id: "companies-documents", name: "Documents" },
    { id: "companies-reports", name: "Rapports" },
    { id: "companies-settings", name: "Paramètres" },
  ];

  // Use the custom hook for permission management
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
  } = useCompanyPermissions(companySubmodules);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Paramètres du module Entreprises</h2>
        <Button onClick={savePermissions} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>

      <Tabs defaultValue="permissions" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="permissions">Permissions utilisateurs</TabsTrigger>
          <TabsTrigger value="crm-sync">Synchronisation CRM</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-4 pt-4">
          <PermissionsTab
            users={users}
            userPermissions={userPermissions}
            companySubmodules={companySubmodules}
            loading={loading}
            saving={saving}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            updatePermission={updatePermission}
            setAllPermissionsOfType={setAllPermissionsOfType}
            savePermissions={savePermissions}
          />
        </TabsContent>

        <TabsContent value="crm-sync" className="space-y-4 pt-4">
          <CrmSyncTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompaniesSettings;
