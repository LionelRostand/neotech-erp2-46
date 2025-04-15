
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Save, UserPlus, ShieldCheck } from "lucide-react";
import { useEmployeesPermissions, EmployeeUser } from '@/hooks/useEmployeesPermissions';
import { usePermissions } from '@/hooks/usePermissions';
import { employeesModule } from '@/data/modules/employees';

type PermissionLevel = 'none' | 'read' | 'write' | 'full';

const permissionLevelOptions = [
  { label: 'Aucun accès', value: 'none' },
  { label: 'Lecture seule', value: 'read' },
  { label: 'Lecture/Écriture', value: 'write' },
  { label: 'Accès complet', value: 'full' },
];

const PermissionsSettings: React.FC = () => {
  const { employees, isLoading, error, updateEmployeePermissions } = useEmployeesPermissions();
  const { isAdmin } = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  const handlePermissionChange = async (
    employeeId: string,
    moduleId: string,
    level: PermissionLevel
  ) => {
    // Convertir le niveau de permission en permissions spécifiques
    const permissions = {
      view: level !== 'none',
      create: level === 'write' || level === 'full',
      edit: level === 'write' || level === 'full',
      delete: level === 'full',
    };

    await updateEmployeePermissions(employeeId, moduleId, permissions);
  };

  const handleSavePermissions = async () => {
    setSaving(true);
    try {
      // Ici on simulerait la sauvegarde vers le backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Permissions enregistrées avec succès');
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Erreur lors de l\'enregistrement des permissions');
    } finally {
      setSaving(false);
    }
  };

  const getPermissionLevel = (employee: EmployeeUser, moduleId: string): PermissionLevel => {
    const modulePermissions = employee.permissions?.[moduleId];
    if (!modulePermissions) return 'none';
    
    if (modulePermissions.delete) return 'full';
    if (modulePermissions.edit || modulePermissions.create) return 'write';
    if (modulePermissions.view) return 'read';
    return 'none';
  };

  const filteredEmployees = employees.filter(employee => {
    if (!searchTerm) return true;
    
    // Vérifier que les valeurs ne sont pas undefined avant d'appeler toLowerCase()
    const firstName = employee.firstName?.toLowerCase() || '';
    const lastName = employee.lastName?.toLowerCase() || '';
    const email = employee.email?.toLowerCase() || '';
    const role = employee.role?.toLowerCase() || '';
    
    const search = searchTerm.toLowerCase();
    return firstName.includes(search) || 
           lastName.includes(search) || 
           email.includes(search) || 
           role.includes(search);
  });

  // Liste des modules à gérer
  const submodules = employeesModule.submodules;

  if (isLoading) {
    return <div className="p-4">Chargement des permissions...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erreur: {error.message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          <CardTitle>Gestion des droits d'accès</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher un employé..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" disabled={!isAdmin} className="ml-2">
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </div>

          <Tabs defaultValue="modules">
            <TabsList>
              <TabsTrigger value="modules">Par module</TabsTrigger>
              <TabsTrigger value="employees">Par employé</TabsTrigger>
            </TabsList>
            
            <TabsContent value="modules" className="space-y-4">
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      {filteredEmployees.map(employee => (
                        <TableHead key={employee.id}>
                          {employee.firstName} {employee.lastName}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submodules.map(submodule => (
                      <TableRow key={submodule.id}>
                        <TableCell className="font-medium">
                          {submodule.name}
                        </TableCell>
                        {filteredEmployees.map(employee => (
                          <TableCell key={`${submodule.id}-${employee.id}`}>
                            <Select
                              value={getPermissionLevel(employee, submodule.id)}
                              onValueChange={(value) => 
                                handlePermissionChange(
                                  employee.id, 
                                  submodule.id, 
                                  value as PermissionLevel
                                )
                              }
                              disabled={!isAdmin}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Sélectionner..." />
                              </SelectTrigger>
                              <SelectContent>
                                {permissionLevelOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="employees" className="space-y-4">
              {filteredEmployees.map(employee => (
                <Card key={employee.id}>
                  <CardHeader>
                    <CardTitle>
                      {employee.firstName} {employee.lastName}
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        {employee.role || 'Employé'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Module</TableHead>
                          <TableHead>Niveau d'accès</TableHead>
                          <TableHead>Détails</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submodules.map(submodule => (
                          <TableRow key={`${employee.id}-${submodule.id}`}>
                            <TableCell>{submodule.name}</TableCell>
                            <TableCell>
                              <Select
                                value={getPermissionLevel(employee, submodule.id)}
                                onValueChange={(value) => 
                                  handlePermissionChange(
                                    employee.id, 
                                    submodule.id, 
                                    value as PermissionLevel
                                  )
                                }
                                disabled={!isAdmin}
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue placeholder="Sélectionner..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {permissionLevelOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {getPermissionLevel(employee, submodule.id) === 'full' && 
                                'Lecture, écriture et suppression'}
                              {getPermissionLevel(employee, submodule.id) === 'write' && 
                                'Lecture et écriture'}
                              {getPermissionLevel(employee, submodule.id) === 'read' && 
                                'Lecture seule'}
                              {getPermissionLevel(employee, submodule.id) === 'none' && 
                                'Aucun accès'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSavePermissions} 
              disabled={saving || !isAdmin}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsSettings;
