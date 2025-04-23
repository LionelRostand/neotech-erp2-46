
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type { GarageUser } from '@/hooks/garage/useGarageUsers';
import { garageModule } from '@/data/modules/garage';

interface GaragePermissionsTableProps {
  users: GarageUser[];
  updatePermission: (userId: string, moduleId: string, action: 'view' | 'create' | 'edit' | 'delete', value: boolean) => void;
}

const GaragePermissionsTable = ({ users, updatePermission }: GaragePermissionsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Utilisateur</TableHead>
          <TableHead className="w-[200px]">Sous-menu</TableHead>
          <TableHead className="text-center">Visualiser</TableHead>
          <TableHead className="text-center">Créer</TableHead>
          <TableHead className="text-center">Modifier</TableHead>
          <TableHead className="text-center">Supprimer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <React.Fragment key={user.id}>
            {garageModule.submodules.map((submodule, moduleIndex) => (
              <TableRow key={`${user.id}-${submodule.id}`} className={moduleIndex === 0 ? 'border-t-2' : ''}>
                {moduleIndex === 0 && (
                  <TableCell rowSpan={garageModule.submodules.length} className="align-top border-r">
                    <div className="space-y-1">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                )}
                <TableCell className="font-medium">{submodule.name}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={user.permissions?.[submodule.id]?.view || false}
                      onCheckedChange={(checked) => 
                        updatePermission(user.id, submodule.id, 'view', !!checked)
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={user.permissions?.[submodule.id]?.create || false}
                      onCheckedChange={(checked) => 
                        updatePermission(user.id, submodule.id, 'create', !!checked)
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={user.permissions?.[submodule.id]?.edit || false}
                      onCheckedChange={(checked) => 
                        updatePermission(user.id, submodule.id, 'edit', !!checked)
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={user.permissions?.[submodule.id]?.delete || false}
                      onCheckedChange={(checked) => 
                        updatePermission(user.id, submodule.id, 'delete', !!checked)
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default GaragePermissionsTable;
