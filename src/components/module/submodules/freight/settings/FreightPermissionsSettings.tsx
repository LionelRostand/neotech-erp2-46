
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select as PatchedSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/patched-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, User, Shield, Settings2, AlertCircle } from "lucide-react";
import { useEmployeesPermissions, EmployeeUser } from '@/hooks/useEmployeesPermissions';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { FreightAlert } from '../components/FreightAlert';

// Interface for permission settings
interface PermissionSetting {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

// Interface for module permissions
interface ModulePermissions {
  [key: string]: PermissionSetting;
}

// Interface for role permissions
interface RolePermission {
  id: string;
  name: string;
  description: string;
  permissions: {
    [key: string]: ModulePermissions;
  };
}

const FreightPermissionsSettings: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [activeTab, setActiveTab] = useState("roles");
  
  // Access employee data with permissions
  const { 
    employees, 
    isLoading: employeesLoading, 
    error: employeesError,
    updateEmployeePermissions
  } = useEmployeesPermissions();
  
  // Access role-based permissions data
  const firestore = useFirestore(COLLECTIONS.FREIGHT.PERMISSIONS);
  const [roles, setRoles] = useState<RolePermission[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  
  // State for permission editing
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editedPermissions, setEditedPermissions] = useState<ModulePermissions | null>(null);
  
  // Load roles from Firestore
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setRolesLoading(true);
        const rolesData = await firestore.getAll();
        setRoles(rolesData as RolePermission[]);
      } catch (error) {
        console.error("Erreur lors du chargement des rôles:", error);
        toast.error("Impossible de charger les rôles et permissions");
      } finally {
        setRolesLoading(false);
      }
    };
    
    loadRoles();
  }, []);
  
  // Start editing a role's permissions
  const handleEditRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setEditingRoleId(roleId);
      setEditedPermissions(role.permissions.freight || {});
    }
  };
  
  // Cancel editing a role
  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setEditedPermissions(null);
  };
  
  // Save edited role permissions
  const handleSaveRolePermissions = async () => {
    if (!editingRoleId || !editedPermissions) return;
    
    try {
      const roleToUpdate = roles.find(r => r.id === editingRoleId);
      if (!roleToUpdate) return;
      
      const updatedRole = {
        ...roleToUpdate,
        permissions: {
          ...roleToUpdate.permissions,
          freight: editedPermissions
        }
      };
      
      await firestore.update(editingRoleId, updatedRole);
      
      // Update local state
      setRoles(roles.map(role => 
        role.id === editingRoleId ? updatedRole : role
      ));
      
      toast.success("Permissions mises à jour avec succès");
      setEditingRoleId(null);
      setEditedPermissions(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des permissions:", error);
      toast.error("Impossible de mettre à jour les permissions");
    }
  };
  
  // Toggle a specific permission for the role being edited
  const togglePermission = (resource: string, action: keyof PermissionSetting) => {
    if (!editedPermissions) return;
    
    setEditedPermissions({
      ...editedPermissions,
      [resource]: {
        ...(editedPermissions[resource] || { view: false, create: false, edit: false, delete: false }),
        [action]: !(editedPermissions[resource]?.[action] || false)
      }
    });
  };
  
  // Handle updating user permissions
  const handleUpdateUserPermission = async (userId: string, permission: string, value: string) => {
    try {
      // Find the employee to update
      const employee = employees.find(emp => emp.id === userId);
      if (!employee) return;
      
      // Get current permissions or initialize
      const currentPermissions = employee.permissions?.freight || {
        view: false,
        create: false,
        edit: false,
        delete: false
      };
      
      // Create updated permissions based on the selected value
      let updatedPermissions;
      
      switch (value) {
        case "no_access":
          updatedPermissions = {
            view: false,
            create: false,
            edit: false,
            delete: false
          };
          break;
        case "view_only":
          updatedPermissions = {
            view: true,
            create: false,
            edit: false,
            delete: false
          };
          break;
        case "contributor":
          updatedPermissions = {
            view: true,
            create: true,
            edit: true,
            delete: false
          };
          break;
        case "admin":
          updatedPermissions = {
            view: true,
            create: true,
            edit: true,
            delete: true
          };
          break;
        default:
          updatedPermissions = currentPermissions;
      }
      
      // Update the permission
      await updateEmployeePermissions(userId, "freight", updatedPermissions);
      toast.success(`Permissions mises à jour pour ${employee.firstName} ${employee.lastName}`);
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour des permissions:", error);
      toast.error("Impossible de mettre à jour les permissions de l'utilisateur");
    }
  };
  
  // Helper to determine user's permission level
  const getUserPermissionLevel = (employee: EmployeeUser): string => {
    const permissions = employee.permissions?.freight;
    if (!permissions) return "no_access";
    
    if (permissions.delete) return "admin";
    if (permissions.edit && permissions.create) return "contributor";
    if (permissions.view) return "view_only";
    return "no_access";
  };
  
  // Render loading state
  if (rolesLoading && activeTab === "roles") {
    return (
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Gestion des droits d'accès</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (employeesError && activeTab === "users") {
    return (
      <div className="p-6">
        <FreightAlert
          variant="destructive"
          title="Erreur lors du chargement des utilisateurs"
        >
          Impossible de récupérer la liste des utilisateurs. Veuillez réessayer plus tard.
        </FreightAlert>
      </div>
    );
  }
  
  // Render roles tab content
  const renderRolesTab = () => {
    return (
      <div className="space-y-6">
        {roles.length === 0 ? (
          <FreightAlert
            variant="warning"
            title="Aucun rôle défini"
          >
            Aucun rôle n'est actuellement défini dans le système. Créez un rôle pour commencer à configurer les permissions.
          </FreightAlert>
        ) : (
          <>
            {!isAdmin && (
              <FreightAlert variant="warning" title="Accès limité">
                Vous avez un accès en lecture seule aux rôles et permissions. Seuls les administrateurs peuvent modifier les rôles.
              </FreightAlert>
            )}
            
            <div className="grid gap-4">
              {roles.map(role => (
                <Card key={role.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </div>
                      {isAdmin && editingRoleId !== role.id && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditRole(role.id)}
                        >
                          Configurer les permissions
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  {editingRoleId === role.id ? (
                    <CardContent>
                      <div className="space-y-4">
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-1/3">Ressource</TableHead>
                                <TableHead>Voir</TableHead>
                                <TableHead>Créer</TableHead>
                                <TableHead>Modifier</TableHead>
                                <TableHead>Supprimer</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {['shipments', 'carriers', 'tracking', 'documents', 'pricing'].map(resource => (
                                <TableRow key={resource}>
                                  <TableCell className="font-medium capitalize">
                                    {resource.replace('_', ' ')}
                                  </TableCell>
                                  <TableCell>
                                    <Checkbox 
                                      checked={editedPermissions?.[resource]?.view || false}
                                      onCheckedChange={() => togglePermission(resource, 'view')}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Checkbox 
                                      checked={editedPermissions?.[resource]?.create || false}
                                      onCheckedChange={() => togglePermission(resource, 'create')}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Checkbox 
                                      checked={editedPermissions?.[resource]?.edit || false}
                                      onCheckedChange={() => togglePermission(resource, 'edit')}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Checkbox 
                                      checked={editedPermissions?.[resource]?.delete || false}
                                      onCheckedChange={() => togglePermission(resource, 'delete')}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={handleCancelEdit}>
                            Annuler
                          </Button>
                          <Button onClick={handleSaveRolePermissions}>
                            Enregistrer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['shipments', 'carriers', 'tracking', 'documents', 'pricing'].map(resource => {
                          const resourcePerms = role.permissions?.freight?.[resource];
                          if (!resourcePerms) return null;
                          
                          let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
                          let badgeText = "Aucun accès";
                          
                          if (resourcePerms.delete) {
                            badgeVariant = "default";
                            badgeText = "Accès complet";
                          } else if (resourcePerms.edit) {
                            badgeVariant = "secondary";
                            badgeText = "Modification";
                          } else if (resourcePerms.view) {
                            badgeVariant = "outline";
                            badgeText = "Lecture seule";
                          }
                          
                          return (
                            <div key={resource} className="flex flex-col gap-1">
                              <span className="text-xs text-gray-500 capitalize">
                                {resource.replace('_', ' ')}
                              </span>
                              <Badge variant={badgeVariant}>{badgeText}</Badge>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
        
        {isAdmin && !editingRoleId && (
          <div className="flex justify-end">
            <Button className="mt-2">
              Ajouter un rôle
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  // Render users tab content
  const renderUsersTab = () => {
    return (
      <div className="space-y-6">
        {employeesLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-slate-200 rounded"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        ) : (
          <>
            {!isAdmin && (
              <FreightAlert variant="warning" title="Accès limité">
                Vous avez un accès en lecture seule aux utilisateurs et leurs permissions. Seuls les administrateurs peuvent modifier les accès.
              </FreightAlert>
            )}
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Niveau d'accès au module Fret</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => {
                    // Get the current permission level as a string
                    const permissionLevel = getUserPermissionLevel(employee);
                    
                    return (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </TableCell>
                        <TableCell>{employee.role || 'Utilisateur'}</TableCell>
                        <TableCell>{employee.department || '-'}</TableCell>
                        <TableCell>
                          {isAdmin ? (
                            <PatchedSelect
                              onValueChange={(value) => handleUpdateUserPermission(employee.id, 'freight', value)}
                              defaultValue={permissionLevel as string}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="no_access">Aucun accès</SelectItem>
                                <SelectItem value="view_only">Lecture seule</SelectItem>
                                <SelectItem value="contributor">Contributeur</SelectItem>
                                <SelectItem value="admin">Administrateur</SelectItem>
                              </SelectContent>
                            </PatchedSelect>
                          ) : (
                            <Badge>
                              {permissionLevel === 'no_access' && 'Aucun accès'}
                              {permissionLevel === 'view_only' && 'Lecture seule'}
                              {permissionLevel === 'contributor' && 'Contributeur'}
                              {permissionLevel === 'admin' && 'Administrateur'}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            {!employees || employees.length === 0 && (
              <FreightAlert variant="warning" title="Aucun utilisateur">
                Aucun utilisateur n'est disponible pour la configuration des permissions.
              </FreightAlert>
            )}
          </>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des droits d'accès
          </CardTitle>
          <CardDescription>
            Configurez les permissions des utilisateurs et des rôles pour le module Fret
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="roles" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Rôles
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2" disabled={!isAdmin}>
                <Settings2 className="h-4 w-4" />
                Paramètres
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="roles">
              {renderRolesTab()}
            </TabsContent>
            
            <TabsContent value="users">
              {renderUsersTab()}
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="space-y-4">
                <FreightAlert
                  variant="warning"
                  title="Fonctionnalité en développement"
                >
                  Les paramètres avancés des permissions seront disponibles dans une prochaine mise à jour.
                </FreightAlert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreightPermissionsSettings;
