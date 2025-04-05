
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AccountingUserPermission } from '../hooks/useAccountingPermissions';

interface AccountingPermissionsTableProps {
  users: { id: string; displayName: string; email: string; role?: string }[];
  userPermissions: AccountingUserPermission[];
  accountingSubmodules: { id: string; name: string }[];
  updatePermission: (userId: string, moduleId: string, permissionType: "canView" | "canCreate" | "canEdit" | "canDelete", value: boolean) => void;
  setAllPermissionsOfType: (userId: string, permissionType: string, value: boolean) => void;
}

const AccountingPermissionsTable: React.FC<AccountingPermissionsTableProps> = ({
  users,
  userPermissions,
  accountingSubmodules,
  updatePermission,
  setAllPermissionsOfType
}) => {
  // Get permissions for a specific user and module
  const getUserModulePermissions = (userId: string, moduleId: string) => {
    const permission = userPermissions.find(
      p => p.userId === userId && p.moduleId === moduleId
    );
    
    return permission?.permissions || {
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false
    };
  };

  // Check if all permissions are enabled for a user and module
  const areAllPermissionsEnabled = (userId: string, moduleId: string) => {
    const permissions = getUserModulePermissions(userId, moduleId);
    return permissions.canView && permissions.canCreate && permissions.canEdit && permissions.canDelete;
  };

  // Handle toggle for the "All" checkbox
  const handleToggleAll = (userId: string, moduleId: string) => {
    const newValue = !areAllPermissionsEnabled(userId, moduleId);
    setAllPermissionsOfType(userId, moduleId, newValue);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Module</TableHead>
            <TableHead className="text-center">Voir</TableHead>
            <TableHead className="text-center">Créer</TableHead>
            <TableHead className="text-center">Modifier</TableHead>
            <TableHead className="text-center">Supprimer</TableHead>
            <TableHead className="text-center">Tous</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Aucun utilisateur trouvé
              </TableCell>
            </TableRow>
          ) : (
            users.flatMap(user => 
              accountingSubmodules.map(module => (
                <TableRow key={`${user.id}-${module.id}`}>
                  {accountingSubmodules.indexOf(module) === 0 ? (
                    <TableCell className="font-medium" rowSpan={accountingSubmodules.length}>
                      <div>
                        <div className="font-semibold">{user.displayName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        {user.role && <div className="text-xs text-muted-foreground mt-1">{user.role}</div>}
                      </div>
                    </TableCell>
                  ) : null}
                  <TableCell>{module.name}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={getUserModulePermissions(user.id, module.id).canView}
                      onCheckedChange={(checked) => 
                        updatePermission(user.id, module.id, "canView", !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={getUserModulePermissions(user.id, module.id).canCreate}
                      onCheckedChange={(checked) => 
                        updatePermission(user.id, module.id, "canCreate", !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={getUserModulePermissions(user.id, module.id).canEdit}
                      onCheckedChange={(checked) => 
                        updatePermission(user.id, module.id, "canEdit", !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={getUserModulePermissions(user.id, module.id).canDelete}
                      onCheckedChange={(checked) => 
                        updatePermission(user.id, module.id, "canDelete", !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={areAllPermissionsEnabled(user.id, module.id)}
                      onCheckedChange={() => handleToggleAll(user.id, module.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AccountingPermissionsTable;
