
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';
import { UserPlus, Search, Save, Shield, AlertTriangle, WifiOff } from 'lucide-react';

interface FreightPermissionsTabProps {
  isOffline?: boolean;
}

const FreightPermissionsTab: React.FC<FreightPermissionsTabProps> = ({ isOffline }) => {
  const { employees, isLoading, error, updateEmployeePermissions } = useEmployeesPermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle permission updates
  const handlePermissionChange = (employeeId: string, permissionType: 'view' | 'create' | 'edit' | 'delete', value: boolean) => {
    // Find the employee and update the permissions in the local state
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const currentPermissions = employee.permissions?.freight || {
        view: false,
        create: false,
        edit: false,
        delete: false
      };
      
      // Update the permission
      const updatedPermissions = {
        ...currentPermissions,
        [permissionType]: value
      };
      
      // Call the hook's update function
      updateEmployeePermissions(employeeId, 'freight', updatedPermissions);
    }
  };

  // Set all permissions of a certain type for an employee
  const setAllPermissions = (employeeId: string, value: boolean) => {
    const updatedPermissions = {
      view: value,
      create: value,
      edit: value,
      delete: value
    };
    
    updateEmployeePermissions(employeeId, 'freight', updatedPermissions);
  };

  // Handle save action
  const handleSave = async () => {
    setIsSaving(true);
    // In a real implementation, this would call a service function to save to Firebase
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  if (isOffline) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-10">
            <WifiOff className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Fonctionnalité non disponible hors ligne</h3>
            <p className="text-muted-foreground text-center max-w-md">
              La gestion des permissions utilisateurs nécessite une connexion internet.
              Veuillez vous reconnecter pour accéder à cette fonctionnalité.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="ml-2">Chargement des permissions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur lors du chargement des permissions</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <CardTitle>Permissions utilisateurs</CardTitle>
        </div>
        <CardDescription>
          Gérez les droits d'accès au module Fret pour les différents utilisateurs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun employé trouvé</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Aucun employé n'a été trouvé dans la base de données.
                Veuillez ajouter des employés pour pouvoir gérer leurs permissions.
              </p>
              <Button className="mt-4">
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un employé
              </Button>
            </div>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          {employee.firstName} {employee.lastName}
                          <div className="text-xs text-muted-foreground">{employee.email}</div>
                        </TableCell>
                        <TableCell>{employee.role || 'Utilisateur'}</TableCell>
                        <TableCell>
                          <Switch
                            checked={employee.permissions?.freight?.view || false}
                            onCheckedChange={(checked) => handlePermissionChange(employee.id, 'view', checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={employee.permissions?.freight?.create || false}
                            onCheckedChange={(checked) => handlePermissionChange(employee.id, 'create', checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={employee.permissions?.freight?.edit || false}
                            onCheckedChange={(checked) => handlePermissionChange(employee.id, 'edit', checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={employee.permissions?.freight?.delete || false}
                            onCheckedChange={(checked) => handlePermissionChange(employee.id, 'delete', checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setAllPermissions(employee.id, true)}
                            >
                              Tout
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setAllPermissions(employee.id, false)}
                            >
                              Aucun
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FreightPermissionsTab;
