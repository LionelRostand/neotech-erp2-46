
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { usePermissions } from '@/hooks/usePermissions';
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';
import { toast } from 'sonner';

const ApplicationPermissionsTab = () => {
  const { employees, isLoading, updateEmployeePermissions } = useEmployeesPermissions();
  const { isAdmin } = usePermissions();

  const handlePermissionChange = async (employeeId: string, value: boolean) => {
    try {
      await updateEmployeePermissions(employeeId, 'applications', {
        view: value,
        create: value,
        edit: value,
        delete: value,
        modify: value
      });
      toast.success('Permissions mises à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des permissions:', error);
      toast.error('Erreur lors de la mise à jour des permissions');
    }
  };

  if (isLoading) {
    return <div className="p-4">Chargement des permissions...</div>;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-center">Accès aux applications</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                  </div>
                </TableCell>
                <TableCell>{employee.role || 'Utilisateur'}</TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={employee.permissions?.applications?.modify || false}
                    onCheckedChange={(checked) => handlePermissionChange(employee.id, checked as boolean)}
                    disabled={!isAdmin}
                  />
                </TableCell>
              </TableRow>
            ))}
            {employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ApplicationPermissionsTab;
