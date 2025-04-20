
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { usePermissions } from '@/hooks/usePermissions';
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ApplicationPermissionsTab = () => {
  const { employees, isLoading, updateEmployeePermissions } = useEmployeesPermissions();
  const { isAdmin } = usePermissions();
  const [updating, setUpdating] = useState<{[key: string]: boolean}>({});

  const handlePermissionChange = async (employeeId: string, value: boolean) => {
    try {
      setUpdating({...updating, [employeeId]: true});
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
    } finally {
      setUpdating({...updating, [employeeId]: false});
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des permissions...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="text-center">Accès aux applications</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{employee.role || 'Utilisateur'}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center">
                        {updating[employee.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Checkbox
                            checked={employee.permissions?.applications?.modify || false}
                            onCheckedChange={(checked) => handlePermissionChange(employee.id, checked as boolean)}
                            disabled={!isAdmin}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationPermissionsTab;
