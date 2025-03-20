
import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Shield, Save, RefreshCw } from "lucide-react";
import { AccountingPermission, AccountingUserPermission } from '../../../projects/types/project-types';
import AccountingPermissionsTable from './AccountingPermissionsTable';

interface PermissionsTabProps {
  users: { id: string; displayName: string; email: string; role?: string; }[];
  userPermissions: AccountingUserPermission[];
  accountingSubmodules: { id: string; name: string; }[];
  loading: boolean;
  saving: boolean;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  updatePermission: (userId: string, moduleId: string, permissionType: keyof Omit<AccountingPermission, 'moduleId'>, value: boolean) => void;
  setAllPermissionsOfType: (userId: string, permissionType: keyof Omit<AccountingPermission, 'moduleId'>, value: boolean) => void;
  savePermissions: () => Promise<void>;
}

const PermissionsTab: React.FC<PermissionsTabProps> = ({
  users,
  userPermissions,
  accountingSubmodules,
  loading,
  saving,
  searchTerm,
  setSearchTerm,
  updatePermission,
  setAllPermissionsOfType,
  savePermissions
}) => {
  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Gestion des droits d'accès</h3>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher un utilisateur..."
            className="pl-9 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement des permissions...</div>
      ) : (
        <AccountingPermissionsTable
          users={filteredUsers}
          userPermissions={userPermissions}
          accountingSubmodules={accountingSubmodules}
          updatePermission={updatePermission}
          setAllPermissionsOfType={setAllPermissionsOfType}
        />
      )}

      <div className="mt-4 flex justify-end">
        <Button onClick={savePermissions} disabled={saving}>
          {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Enregistrer les modifications
        </Button>
      </div>
    </Card>
  );
};

export default PermissionsTab;
