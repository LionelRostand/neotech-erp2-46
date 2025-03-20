
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Save, UserPlus, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";
import { CompanyPermission, CompanyUserPermission } from './types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface User {
  id: string;
  displayName: string;
  email: string;
  role?: string;
}

const CompaniesSettings = () => {
  const [activeTab, setActiveTab] = useState("permissions");
  const [users, setUsers] = useState<User[]>([]);
  const [userPermissions, setUserPermissions] = useState<CompanyUserPermission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const usersFirestore = useFirestore(COLLECTIONS.USERS);
  const permissionsFirestore = useFirestore(COLLECTIONS.USER_PERMISSIONS);

  // Module submodules for permissions
  const companySubmodules = [
    { id: "companies-dashboard", name: "Tableau de bord" },
    { id: "companies-list", name: "Liste des entreprises" },
    { id: "companies-create", name: "Créer une entreprise" },
    { id: "companies-contacts", name: "Contacts" },
    { id: "companies-documents", name: "Documents" },
    { id: "companies-reports", name: "Rapports" },
    { id: "companies-settings", name: "Paramètres" },
  ];

  // Fetch users and their permissions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersData = await usersFirestore.getAll() as User[];
        setUsers(usersData);

        // Fetch permissions
        const permissionsData = await permissionsFirestore.getAll([
          // You could add a where clause to filter only company permissions
        ]);
        
        // Fix: Convert the fetched data to CompanyUserPermission[] type
        const typedPermissionsData: CompanyUserPermission[] = [];
        
        // If we have data, try to map it to the correct type
        if (permissionsData && permissionsData.length > 0) {
          for (const item of permissionsData) {
            // Check if the item has the required structure and properly map id to userId
            if (item && typeof item === 'object' && 'id' in item && 'permissions' in item) {
              // Verify that permissions is an array
              const permissions = Array.isArray(item.permissions) 
                ? item.permissions 
                : [];
              
              // Make sure each permission has the correct structure
              const validPermissions: CompanyPermission[] = permissions
                .filter((p: any) => p && typeof p === 'object' && 'moduleId' in p)
                .map((p: any) => ({
                  moduleId: p.moduleId,
                  canView: Boolean(p.canView),
                  canCreate: Boolean(p.canCreate),
                  canEdit: Boolean(p.canEdit),
                  canDelete: Boolean(p.canDelete)
                }));
                
              // Create a properly typed CompanyUserPermission using id as userId
              typedPermissionsData.push({
                userId: item.id as string,
                permissions: validPermissions
              });
            }
          }
        }

        // If no permissions found or they don't have the right structure, create default permissions for each user
        if (typedPermissionsData.length === 0) {
          const defaultPermissions: CompanyUserPermission[] = usersData.map(user => ({
            userId: user.id,
            permissions: companySubmodules.map(submodule => ({
              moduleId: submodule.id,
              canView: true,
              canCreate: false,
              canEdit: false,
              canDelete: false,
            })),
          }));
          setUserPermissions(defaultPermissions);
        } else {
          setUserPermissions(typedPermissionsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update permission state
  const updatePermission = (userId: string, moduleId: string, permissionType: keyof Omit<CompanyPermission, 'moduleId'>, value: boolean) => {
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

  // Set all permissions of a type for a user
  const setAllPermissionsOfType = (userId: string, permissionType: keyof Omit<CompanyPermission, 'moduleId'>, value: boolean) => {
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

  // Save permissions to database
  const savePermissions = async () => {
    setSaving(true);
    try {
      // For each user, update or create their permissions
      for (const userPerm of userPermissions) {
        await permissionsFirestore.set(userPerm.userId, {
          permissions: userPerm.permissions,
          updatedAt: new Date()
        });
      }
      toast.success("Permissions enregistrées avec succès");
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Erreur lors de l'enregistrement des permissions");
    } finally {
      setSaving(false);
    }
  };

  // Get user's permission for a module
  const getUserPermissionForModule = (userId: string, moduleId: string): CompanyPermission | undefined => {
    const userPerm = userPermissions.find(p => p.userId === userId);
    if (!userPerm) return undefined;
    
    return userPerm.permissions.find(p => p.moduleId === moduleId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Paramètres du module Entreprises</h2>
        <Button onClick={savePermissions} disabled={saving}>
          {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Enregistrer les modifications
        </Button>
      </div>

      <Tabs defaultValue="permissions" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="permissions">Permissions utilisateurs</TabsTrigger>
          <TabsTrigger value="crm-sync">Synchronisation CRM</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-4 pt-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Gestion des droits d'accès</h3>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  className="pl-9 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">Chargement des permissions...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Utilisateur</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead className="text-center">Visualisation</TableHead>
                    <TableHead className="text-center">Création</TableHead>
                    <TableHead className="text-center">Modification</TableHead>
                    <TableHead className="text-center">Suppression</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <React.Fragment key={user.id}>
                      {/* User row with "select all" options */}
                      <TableRow className="bg-muted/30">
                        <TableCell className="font-medium">
                          {user.displayName || user.email}
                          <div className="text-xs text-muted-foreground">{user.role || "Utilisateur"}</div>
                        </TableCell>
                        <TableCell className="font-medium">Tous les modules</TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={userPermissions.find(p => p.userId === user.id)?.permissions.every(p => p.canView)}
                            onCheckedChange={(checked) => setAllPermissionsOfType(user.id, 'canView', !!checked)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={userPermissions.find(p => p.userId === user.id)?.permissions.every(p => p.canCreate)}
                            onCheckedChange={(checked) => setAllPermissionsOfType(user.id, 'canCreate', !!checked)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={userPermissions.find(p => p.userId === user.id)?.permissions.every(p => p.canEdit)}
                            onCheckedChange={(checked) => setAllPermissionsOfType(user.id, 'canEdit', !!checked)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={userPermissions.find(p => p.userId === user.id)?.permissions.every(p => p.canDelete)}
                            onCheckedChange={(checked) => setAllPermissionsOfType(user.id, 'canDelete', !!checked)}
                          />
                        </TableCell>
                      </TableRow>

                      {/* Individual module permissions */}
                      {companySubmodules.map(module => {
                        const perm = getUserPermissionForModule(user.id, module.id);
                        return (
                          <TableRow key={`${user.id}-${module.id}`}>
                            <TableCell></TableCell>
                            <TableCell>{module.name}</TableCell>
                            <TableCell className="text-center">
                              <Checkbox 
                                checked={perm?.canView}
                                onCheckedChange={(checked) => updatePermission(user.id, module.id, 'canView', !!checked)}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox 
                                checked={perm?.canCreate}
                                onCheckedChange={(checked) => updatePermission(user.id, module.id, 'canCreate', !!checked)}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox 
                                checked={perm?.canEdit}
                                onCheckedChange={(checked) => updatePermission(user.id, module.id, 'canEdit', !!checked)}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Checkbox 
                                checked={perm?.canDelete}
                                onCheckedChange={(checked) => updatePermission(user.id, module.id, 'canDelete', !!checked)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="crm-sync" className="space-y-4 pt-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3 mb-6">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium">Synchronisation avec votre CRM</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">URL de l'API CRM</label>
                  <Input placeholder="https://api.votrecrm.com/v1" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Clé API</label>
                  <Input type="password" placeholder="Votre clé API secrète" />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Options de synchronisation</h4>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sync-contacts" />
                    <label htmlFor="sync-contacts" className="text-sm">Contacts</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sync-companies" />
                    <label htmlFor="sync-companies" className="text-sm">Entreprises</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sync-deals" />
                    <label htmlFor="sync-deals" className="text-sm">Opportunités</label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Fréquence de synchronisation</h4>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="sync-hourly" name="sync-frequency" />
                    <label htmlFor="sync-hourly" className="text-sm">Toutes les heures</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="sync-daily" name="sync-frequency" defaultChecked />
                    <label htmlFor="sync-daily" className="text-sm">Une fois par jour</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="sync-manual" name="sync-frequency" />
                    <label htmlFor="sync-manual" className="text-sm">Manuellement</label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer la configuration
                </Button>
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tester la connexion
                </Button>
              </div>
            </div>
          </Card>
          
          <div className="mt-6 text-sm text-muted-foreground">
            <p>La synchronisation avec votre CRM vous permet de maintenir vos contacts et entreprises à jour dans les deux systèmes.</p>
            <p className="mt-2">Pour plus d'informations sur l'intégration, consultez la documentation.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompaniesSettings;
