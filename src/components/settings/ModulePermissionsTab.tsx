
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';
import { modules } from '@/data/modules';
import { Loader2 } from 'lucide-react';

const ModulePermissionsTab = () => {
  const { employees, isLoading, updateEmployeePermissions } = useEmployeesPermissions();

  const handlePermissionChange = async (employeeId: string, moduleId: string, value: boolean) => {
    await updateEmployeePermissions(employeeId, moduleId, {
      view: value,
      create: value,
      edit: value,
      delete: value,
      export: value
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des permissions...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Utilisateur</TableHead>
              {modules.map(module => (
                <TableHead key={module.id} className="text-center">
                  {module.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                  </div>
                </TableCell>
                {modules.map(module => (
                  <TableCell key={`${employee.id}-${module.id}`} className="text-center">
                    <Checkbox
                      checked={employee.permissions?.[`module-${module.id}`]?.view || false}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(employee.id, `module-${module.id}`, checked as boolean)
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ModulePermissionsTab;
