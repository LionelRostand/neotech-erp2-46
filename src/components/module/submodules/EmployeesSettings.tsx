
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Users, Building, Calendar, Clock, Bell, Search, Shield, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Permission type definitions
interface UserPermission {
  moduleId: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface EmployeePermission {
  userId: string;
  permissions: UserPermission[];
}

const EmployeesSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Sample data for permissions tab
  const [employees] = useState([
    { id: '1', name: 'Thomas Martin', email: 'thomas.martin@example.com', role: 'Responsable Marketing' },
    { id: '2', name: 'Sophie Dubois', email: 'sophie.dubois@example.com', role: 'Développeuse Front-end' },
    { id: '3', name: 'Jean Dupont', email: 'jean.dupont@example.com', role: 'Directeur Financier' },
    { id: '4', name: 'Marie Lambert', email: 'marie.lambert@example.com', role: 'Responsable RH' },
    { id: '5', name: 'Pierre Durand', email: 'pierre.durand@example.com', role: 'Chef de projet technique' },
  ]);
  
  const [modules] = useState([
    { id: 'employees-profiles', name: 'Fiches employé' },
    { id: 'employees-badges', name: 'Badges et accès' },
    { id: 'employees-departments', name: 'Départements' },
    { id: 'employees-hierarchy', name: 'Hiérarchie' },
    { id: 'employees-attendance', name: 'Présences' },
    { id: 'employees-timesheet', name: 'Feuilles de temps' },
    { id: 'employees-leaves', name: 'Congés' },
    { id: 'employees-absences', name: 'Absences' },
    { id: 'employees-contracts', name: 'Contrats' },
    { id: 'employees-documents', name: 'Documents RH' },
    { id: 'employees-evaluations', name: 'Évaluations' },
    { id: 'employees-trainings', name: 'Formations' },
    { id: 'employees-salaries', name: 'Salaires' },
    { id: 'employees-recruitment', name: 'Recrutement' },
    { id: 'employees-reports', name: 'Rapports' },
  ]);
  
  // Initialize permissions for all employees and modules
  const [userPermissions, setUserPermissions] = useState<EmployeePermission[]>(
    employees.map(employee => ({
      userId: employee.id,
      permissions: modules.map(module => ({
        moduleId: module.id,
        canView: true,
        canCreate: employee.id === '1' || employee.id === '4', // Only admin and HR can create by default
        canEdit: employee.id === '1' || employee.id === '4',   // Only admin and HR can edit by default
        canDelete: employee.id === '1',                        // Only admin can delete by default
      })),
    }))
  );
  
  // Filtered employees based on search term
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get employee's permission for a module
  const getEmployeePermissionForModule = (userId: string, moduleId: string): UserPermission | undefined => {
    const employeePerm = userPermissions.find(p => p.userId === userId);
    if (!employeePerm) return undefined;
    
    return employeePerm.permissions.find(p => p.moduleId === moduleId);
  };
  
  // Update permission state
  const updatePermission = (userId: string, moduleId: string, permissionType: keyof Omit<UserPermission, 'moduleId'>, value: boolean) => {
    setUserPermissions(prev => {
      return prev.map(userPerm => {
        if (userPerm.userId === userId) {
          const updatedPermissions = userPerm.permissions.map(perm => {
            if (perm.moduleId === moduleId) {
              return { ...perm, [permissionType]: value };
            }
            return perm;
          });
          return { ...userPerm, permissions: updatedPermissions };
        }
        return userPerm;
      });
    });
  };
  
  // Set all permissions of a type for an employee
  const setAllPermissionsOfType = (userId: string, permissionType: keyof Omit<UserPermission, 'moduleId'>, value: boolean) => {
    setUserPermissions(prev => {
      return prev.map(userPerm => {
        if (userPerm.userId === userId) {
          const updatedPermissions = userPerm.permissions.map(perm => ({
            ...perm,
            [permissionType]: value
          }));
          return { ...userPerm, permissions: updatedPermissions };
        }
        return userPerm;
      });
    });
  };
  
  // Save permissions
  const savePermissions = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success("Permissions enregistrées avec succès");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Paramètres des Employés</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="fields">Champs personnalisés</TabsTrigger>
          <TabsTrigger value="departments">Départements</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Paramètres généraux</CardTitle>
              <CardDescription>Configuration générale du module Employés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Préférences de l'entreprise</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nom de l'entreprise</Label>
                    <Input id="companyName" defaultValue="Neotech Solutions" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select defaultValue="europe-paris">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un fuseau horaire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="europe-paris">Europe/Paris (UTC+1)</SelectItem>
                        <SelectItem value="europe-london">Europe/London (UTC+0)</SelectItem>
                        <SelectItem value="america-newyork">America/New_York (UTC-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Format de date</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un format de date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">DD/MM/YYYY (31/12/2025)</SelectItem>
                        <SelectItem value="us">MM/DD/YYYY (12/31/2025)</SelectItem>
                        <SelectItem value="iso">YYYY-MM-DD (2025-12-31)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Options du module</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoNumber">Numérotation automatique des employés</Label>
                      <p className="text-sm text-muted-foreground">
                        Générer automatiquement un ID unique pour chaque nouvel employé
                      </p>
                    </div>
                    <Switch id="autoNumber" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Notifications d'événements</Label>
                      <p className="text-sm text-muted-foreground">
                        Envoyer des notifications pour les événements importants
                      </p>
                    </div>
                    <Switch id="notifications" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Modules activés</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div className="flex items-start">
                    <Switch id="module-profiles" defaultChecked className="mt-0.5 mr-2" />
                    <div className="space-y-0.5">
                      <Label htmlFor="module-profiles" className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Profils
                      </Label>
                      <p className="text-xs text-muted-foreground">Gestion des fiches employés</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Switch id="module-departments" defaultChecked className="mt-0.5 mr-2" />
                    <div className="space-y-0.5">
                      <Label htmlFor="module-departments" className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        Départements
                      </Label>
                      <p className="text-xs text-muted-foreground">Structure organisationnelle</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Switch id="module-attendance" defaultChecked className="mt-0.5 mr-2" />
                    <div className="space-y-0.5">
                      <Label htmlFor="module-attendance" className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Présences
                      </Label>
                      <p className="text-xs text-muted-foreground">Suivi des présences</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Switch id="module-leaves" defaultChecked className="mt-0.5 mr-2" />
                    <div className="space-y-0.5">
                      <Label htmlFor="module-leaves" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Congés
                      </Label>
                      <p className="text-xs text-muted-foreground">Gestion des congés</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Enregistrer les paramètres</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fields">
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-center py-10">
                Cette section vous permet de configurer les champs personnalisés pour les fiches employés.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments">
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-center py-10">
                Cette section vous permet de gérer les départements de votre organisation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Gestion des droits d'accès</span>
              </CardTitle>
              <CardDescription>
                Attribuez les droits d'accès aux différentes fonctionnalités du module Employés pour chaque utilisateur.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-medium mb-1">Attribution des droits par module</h3>
                  <p className="text-sm text-muted-foreground">
                    Définissez qui peut voir, créer, modifier ou supprimer des données dans chaque module.
                  </p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher un employé..."
                    className="pl-9 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Employé</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead className="text-center">Visualisation</TableHead>
                    <TableHead className="text-center">Création</TableHead>
                    <TableHead className="text-center">Modification</TableHead>
                    <TableHead className="text-center">Suppression</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map(employee => (
                    <React.Fragment key={employee.id}>
                      {/* User row with "select all" options */}
                      <TableRow className="bg-muted/30">
                        <TableCell className="font-medium">
                          {employee.name}
                          <div className="text-xs text-muted-foreground">{employee.role}</div>
                        </TableCell>
                        <TableCell className="font-medium">Tous les modules</TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={userPermissions.find(p => p.userId === employee.id)?.permissions.every(p => p.canView)}
                            onCheckedChange={(checked) => setAllPermissionsOfType(employee.id, 'canView', !!checked)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={userPermissions.find(p => p.userId === employee.id)?.permissions.every(p => p.canCreate)}
                            onCheckedChange={(checked) => setAllPermissionsOfType(employee.id, 'canCreate', !!checked)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={userPermissions.find(p => p.userId === employee.id)?.permissions.every(p => p.canEdit)}
                            onCheckedChange={(checked) => setAllPermissionsOfType(employee.id, 'canEdit', !!checked)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={userPermissions.find(p => p.userId === employee.id)?.permissions.every(p => p.canDelete)}
                            onCheckedChange={(checked) => setAllPermissionsOfType(employee.id, 'canDelete', !!checked)}
                          />
                        </TableCell>
                      </TableRow>

                      {/* Individual module permissions */}
                      {modules.map(module => {
                        const perm = getEmployeePermissionForModule(employee.id, module.id);
                        return (
                          <TableRow key={`${employee.id}-${module.id}`}>
                            <TableCell></TableCell>
                            <TableCell>{module.name}</TableCell>
                            <TableCell className="text-center">
                              <Checkbox 
                                checked={perm?.canView}
                                onCheckedChange={(checked) => updatePermission(employee.id, module.id, 'canView', !!checked)}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox 
                                checked={perm?.canCreate}
                                onCheckedChange={(checked) => updatePermission(employee.id, module.id, 'canCreate', !!checked)}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox 
                                checked={perm?.canEdit}
                                onCheckedChange={(checked) => updatePermission(employee.id, module.id, 'canEdit', !!checked)}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox 
                                checked={perm?.canDelete}
                                onCheckedChange={(checked) => updatePermission(employee.id, module.id, 'canDelete', !!checked)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex justify-end">
                <Button onClick={savePermissions} disabled={saving}>
                  {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Enregistrer les modifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-center py-10">
                Cette section vous permet de configurer les intégrations avec d'autres services.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesSettings;
