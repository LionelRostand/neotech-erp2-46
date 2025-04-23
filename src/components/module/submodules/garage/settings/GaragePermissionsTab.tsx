
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { toast } from 'sonner';
import { useGaragePermissions } from '@/hooks/garage/useGaragePermissions';
import { useGarageUsers } from '@/hooks/garage/useGarageUsers';
import { Loader2 } from 'lucide-react';
import { getUserPermissions } from '@/components/module/submodules/employees/services/permissionService';

const GaragePermissionsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { garageSubmodules, isAdmin, updatePermission } = useGaragePermissions();
  const { users, loading } = useGarageUsers();
  const [userPermissions, setUserPermissions] = useState<{[userId: string]: any}>({});
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  // Récupérer les permissions de chaque utilisateur
  useEffect(() => {
    const fetchAllUserPermissions = async () => {
      if (users.length === 0) return;
      
      setLoadingPermissions(true);
      const permissions: {[userId: string]: any} = {};
      
      for (const user of users) {
        try {
          const userPerm = await getUserPermissions(user.id);
          permissions[user.id] = userPerm?.permissions || {};
        } catch (error) {
          console.error(`Erreur lors de la récupération des permissions pour ${user.id}:`, error);
        }
      }
      
      setUserPermissions(permissions);
      setLoadingPermissions(false);
    };
    
    fetchAllUserPermissions();
  }, [users]);

  const handlePermissionChange = async (userId: string, submoduleId: string, action: 'view' | 'create' | 'edit' | 'delete', checked: boolean) => {
    const success = await updatePermission(userId, submoduleId, action, checked);
    
    if (success) {
      // Mettre à jour l'état local après une mise à jour réussie
      setUserPermissions(prevState => ({
        ...prevState,
        [userId]: {
          ...prevState[userId],
          [`garage-${submoduleId}`]: {
            ...(prevState[userId]?.[`garage-${submoduleId}`] || {}),
            [action]: checked
          }
        }
      }));
    }
  };

  if (loading || loadingPermissions) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="animate-spin h-6 w-6 mr-2" />
          <span>Chargement des utilisateurs et de leurs permissions...</span>
        </CardContent>
      </Card>
    );
  }

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              className="w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Utilisateur</TableHead>
                <TableHead className="w-[120px]">Sous-module</TableHead>
                <TableHead className="text-center">Visualiser</TableHead>
                <TableHead className="text-center">Créer</TableHead>
                <TableHead className="text-center">Modifier</TableHead>
                <TableHead className="text-center">Supprimer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  garageSubmodules.map((submodule) => (
                    <TableRow key={`${user.id}-${submodule.id}`}>
                      {submodule.id === garageSubmodules[0].id && (
                        <TableCell rowSpan={garageSubmodules.length} className="align-top pt-4">
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">{user.role}</p>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <span className="text-sm">{submodule.name}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={!!userPermissions[user.id]?.[`garage-${submodule.id}`]?.view}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(user.id, submodule.id, 'view', !!checked)
                          }
                          disabled={!isAdmin}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={!!userPermissions[user.id]?.[`garage-${submodule.id}`]?.create}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(user.id, submodule.id, 'create', !!checked)
                          }
                          disabled={!isAdmin}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={!!userPermissions[user.id]?.[`garage-${submodule.id}`]?.edit}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(user.id, submodule.id, 'edit', !!checked)
                          }
                          disabled={!isAdmin}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={!!userPermissions[user.id]?.[`garage-${submodule.id}`]?.delete}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(user.id, submodule.id, 'delete', !!checked)
                          }
                          disabled={!isAdmin}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GaragePermissionsTab;
