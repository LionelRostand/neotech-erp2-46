
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CompanyPermission, CompanyUserPermission } from '../types';

interface CompanyPermissionsTableProps {
  users: { id: string; displayName: string; email: string; role?: string; }[];
  userPermissions: CompanyUserPermission[];
  companySubmodules: { id: string; name: string; }[];
  updatePermission: (userId: string, moduleId: string, permissionType: keyof Omit<CompanyPermission, 'moduleId'>, value: boolean) => void;
  setAllPermissionsOfType: (userId: string, permissionType: keyof Omit<CompanyPermission, 'moduleId'>, value: boolean) => void;
}

const CompanyPermissionsTable: React.FC<CompanyPermissionsTableProps> = ({
  users,
  userPermissions,
  companySubmodules,
  updatePermission,
  setAllPermissionsOfType
}) => {
  // Get user's permission for a module
  const getUserPermissionForModule = (userId: string, moduleId: string): CompanyPermission | undefined => {
    const userPerm = userPermissions.find(p => p.userId === userId);
    if (!userPerm) return undefined;
    
    return userPerm.permissions.find(p => p.moduleId === moduleId);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Utilisateur</TableHead>
          <TableHead>Module</TableHead>
          <TableHead className="text-center">Visualisation</TableHead>
          <TableHead className="text-center">Création</TableHead>
          <TableHead className="text-center">Modification</TableHead>
          <TableHead className="text-center">Suppression</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <React.Fragment key={user.id}>
            {/* User row with "select all" options */}
            <TableRow className="bg-muted/30">
              <TableCell className="font-medium">
                {user.displayName || user.email}
                <div className="text-xs text-muted-foreground">{user.role || "Utilisateur"}</div>
              </TableCell>
              <TableCell className="font-medium">Tous les modules</TableCell>
              <TableCell className="text-center">
                <Checkbox 
                  checked={userPermissions.find(p => p.userId === user.id)?.permissions.every(p => p.canView)}
                  onCheckedChange={(checked) => setAllPermissionsOfType(user.id, 'canView', !!checked)}
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox 
                  checked={userPermissions.find(p => p.userId === user.id)?.permissions.every(p => p.canCreate)}
                  onCheckedChange={(checked) => setAllPermissionsOfType(user.id, 'canCreate', !!checked)}
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox 
                  checked={userPermissions.find(p => p.userId === user.id)?.permissions.every(p => p.canEdit)}
                  onCheckedChange={(checked) => setAllPermissionsOfType(user.id, 'canEdit', !!checked)}
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox 
                  checked={userPermissions.find(p => p.userId === user.id)?.permissions.every(p => p.canDelete)}
                  onCheckedChange={(checked) => setAllPermissionsOfType(user.id, 'canDelete', !!checked)}
                />
              </TableCell>
            </TableRow>

            {/* Individual module permissions */}
            {companySubmodules.map(module => {
              const perm = getUserPermissionForModule(user.id, module.id);
              return (
                <TableRow key={`${user.id}-${module.id}`}>
                  <TableCell></TableCell>
                  <TableCell>{module.name}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={perm?.canView}
                      onCheckedChange={(checked) => updatePermission(user.id, module.id, 'canView', !!checked)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={perm?.canCreate}
                      onCheckedChange={(checked) => updatePermission(user.id, module.id, 'canCreate', !!checked)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={perm?.canEdit}
                      onCheckedChange={(checked) => updatePermission(user.id, module.id, 'canEdit', !!checked)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={perm?.canDelete}
                      onCheckedChange={(checked) => updatePermission(user.id, module.id, 'canDelete', !!checked)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default CompanyPermissionsTable;
