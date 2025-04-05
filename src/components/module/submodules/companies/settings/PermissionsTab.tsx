
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { UserPlus, Search, Save, Shield, AlertTriangle } from "lucide-react";
import { CompanyPermission, CompanyUserPermission } from '../types/company-settings-types';

interface PermissionsTabProps {
  users: { id: string; displayName: string; email: string; role: string }[];
  userPermissions: CompanyUserPermission[];
  companySubmodules: { id: string; name: string }[];
  loading: boolean;
  saving: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  updatePermission: (userId: string, moduleId: string, permissionType: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', value: boolean) => void;
  setAllPermissionsOfType: (userId: string, permissionType: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', value: boolean) => void;
  savePermissions: () => Promise<void>;
}

const PermissionsTab: React.FC<PermissionsTabProps> = ({
  users,
  userPermissions,
  companySubmodules,
  loading,
  saving,
  searchTerm,
  setSearchTerm,
  updatePermission,
  setAllPermissionsOfType,
  savePermissions,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des permissions...</p>
      </div>
    );
  }

  const filteredUsers = userPermissions.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Gestion des permissions</h3>
        </div>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      {userPermissions.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune permission configurée</h3>
            <p className="text-center text-muted-foreground mb-4">
              Aucun utilisateur n'a encore de permissions pour les entreprises.
              Ajoutez des utilisateurs pour commencer à configurer les accès.
            </p>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Voir</TableHead>
                  <TableHead>Créer</TableHead>
                  <TableHead>Modifier</TableHead>
                  <TableHead>Supprimer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <React.Fragment key={user.userId}>
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={2} className="font-medium">
                        {user.userName} <span className="text-muted-foreground">({user.userEmail})</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAllPermissionsOfType(user.userId, 'canView', true)}
                        >
                          Tout
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAllPermissionsOfType(user.userId, 'canCreate', true)}
                        >
                          Tout
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAllPermissionsOfType(user.userId, 'canEdit', true)}
                        >
                          Tout
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAllPermissionsOfType(user.userId, 'canDelete', true)}
                        >
                          Tout
                        </Button>
                      </TableCell>
                    </TableRow>
                    {user.permissions.map((permission) => (
                      <TableRow key={`${user.userId}-${permission.moduleId}`}>
                        <TableCell colSpan={2} className="pl-8">
                          {permission.name}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={permission.canView}
                            onCheckedChange={(checked) =>
                              updatePermission(user.userId, permission.moduleId, 'canView', checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={permission.canCreate}
                            onCheckedChange={(checked) =>
                              updatePermission(user.userId, permission.moduleId, 'canCreate', checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={permission.canEdit}
                            onCheckedChange={(checked) =>
                              updatePermission(user.userId, permission.moduleId, 'canEdit', checked)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={permission.canDelete}
                            onCheckedChange={(checked) =>
                              updatePermission(user.userId, permission.moduleId, 'canDelete', checked)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button onClick={savePermissions} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PermissionsTab;
