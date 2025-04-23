
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGaragePermissions } from '@/hooks/garage/useGaragePermissions';
import { useGarageUsers } from '@/hooks/garage/useGarageUsers';
import { Search, Save, RefreshCw } from "lucide-react";

const GaragePermissionsTab: React.FC = () => {
  const { users, loading: usersLoading } = useGarageUsers();
  const { garageSubmodules, updatePermission, isUpdating } = useGaragePermissions();
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (usersLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3">Chargement des utilisateurs...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Gestion des permissions utilisateurs</h3>
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
        
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun utilisateur trouvé
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Utilisateur</TableHead>
                  {garageSubmodules.map(module => (
                    <TableHead key={module.id} className="text-center">
                      {module.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    {garageSubmodules.map(module => {
                      const moduleId = module.id;
                      
                      // Vérifier si l'utilisateur a déjà des permissions pour ce module
                      const hasPermissionView = user.permissions?.[moduleId]?.view || false;
                      const hasPermissionCreate = user.permissions?.[moduleId]?.create || false;
                      const hasPermissionEdit = user.permissions?.[moduleId]?.edit || false;
                      const hasPermissionDelete = user.permissions?.[moduleId]?.delete || false;
                      
                      return (
                        <TableCell key={`${user.id}-${moduleId}`} className="text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                id={`${user.id}-${moduleId}-view`}
                                checked={hasPermissionView}
                                onCheckedChange={(checked) => 
                                  updatePermission(user.id, moduleId, 'view', checked as boolean)
                                }
                              />
                              <label htmlFor={`${user.id}-${moduleId}-view`} className="text-xs">Voir</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                id={`${user.id}-${moduleId}-create`}
                                checked={hasPermissionCreate}
                                onCheckedChange={(checked) => 
                                  updatePermission(user.id, moduleId, 'create', checked as boolean)
                                }
                              />
                              <label htmlFor={`${user.id}-${moduleId}-create`} className="text-xs">Créer</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                id={`${user.id}-${moduleId}-edit`}
                                checked={hasPermissionEdit}
                                onCheckedChange={(checked) => 
                                  updatePermission(user.id, moduleId, 'edit', checked as boolean)
                                }
                              />
                              <label htmlFor={`${user.id}-${moduleId}-edit`} className="text-xs">Modifier</label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                id={`${user.id}-${moduleId}-delete`}
                                checked={hasPermissionDelete}
                                onCheckedChange={(checked) => 
                                  updatePermission(user.id, moduleId, 'delete', checked as boolean)
                                }
                              />
                              <label htmlFor={`${user.id}-${moduleId}-delete`} className="text-xs">Supprimer</label>
                            </div>
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <Button disabled={isUpdating}>
            {isUpdating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les permissions
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GaragePermissionsTab;
