
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';
import { useRentalPermissions } from '../hooks/useRentalPermissions';
import { Loader2 } from 'lucide-react';

const RentalPermissionsTab = () => {
  const { employees, isLoading: employeesLoading } = useEmployeesPermissions();
  const { permissions, updatePermission, isLoading: permissionsLoading } = useRentalPermissions();

  if (employeesLoading || permissionsLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead className="text-center">Visualiser</TableHead>
              <TableHead className="text-center">Créer</TableHead>
              <TableHead className="text-center">Modifier</TableHead>
              <TableHead className="text-center">Supprimer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => {
              const userPermissions = permissions?.find(p => p.userId === employee.id);
              return (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                      <p className="text-sm text-gray-500">{employee.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={userPermissions?.permissions.view || false}
                      onCheckedChange={(checked) => 
                        updatePermission(employee.id, 'view', checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={userPermissions?.permissions.create || false}
                      onCheckedChange={(checked) => 
                        updatePermission(employee.id, 'create', checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={userPermissions?.permissions.edit || false}
                      onCheckedChange={(checked) => 
                        updatePermission(employee.id, 'edit', checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={userPermissions?.permissions.delete || false}
                      onCheckedChange={(checked) => 
                        updatePermission(employee.id, 'delete', checked as boolean)
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RentalPermissionsTab;
