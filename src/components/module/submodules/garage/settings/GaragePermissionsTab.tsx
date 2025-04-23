
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useGarageUsers, GarageUser } from '@/hooks/garage/useGarageUsers';
import { garageModule } from '@/data/modules/garage';
import { Shield, Search, Save } from 'lucide-react';
import { toast } from 'sonner';

const GaragePermissionsTab = () => {
  const { users, loading, updateUserPermissions } = useGarageUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [modifiedUsers, setModifiedUsers] = useState<GarageUser[]>([]);

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer les changements de permissions
  const handlePermissionChange = (userId: string, moduleId: string, permission: 'view' | 'create' | 'edit' | 'delete', value: boolean) => {
    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) return;

    const user = { ...updatedUsers[userIndex] };
    if (!user.permissions) {
      user.permissions = {};
    }
    if (!user.permissions[moduleId]) {
      user.permissions[moduleId] = { view: false, create: false, edit: false, delete: false };
    }
    
    user.permissions[moduleId] = {
      ...user.permissions[moduleId],
      [permission]: value
    };

    updatedUsers[userIndex] = user;
    setModifiedUsers(prev => {
      const filtered = prev.filter(u => u.id !== userId);
      return [...filtered, user];
    });
  };

  // Sauvegarder toutes les modifications
  const handleSaveChanges = async () => {
    try {
      await Promise.all(
        modifiedUsers.map(user => 
          updateUserPermissions(user.id, user.permissions || {})
        )
      );
      toast.success('Les permissions ont été mises à jour avec succès');
      setModifiedUsers([]);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des permissions:', error);
      toast.error('Erreur lors de la mise à jour des permissions');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Gestion des droits d'accès</h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[300px]"
              />
            </div>
            {modifiedUsers.length > 0 && (
              <Button onClick={handleSaveChanges} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Enregistrer les modifications
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Utilisateur</TableHead>
                <TableHead>Module</TableHead>
                <TableHead className="text-center">Visualiser</TableHead>
                <TableHead className="text-center">Créer</TableHead>
                <TableHead className="text-center">Modifier</TableHead>
                <TableHead className="text-center">Supprimer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <React.Fragment key={user.id}>
                  {garageModule.submodules.map((submodule, index) => (
                    <TableRow key={`${user.id}-${submodule.id}`} 
                      className={index === 0 ? "bg-muted/50" : ""}>
                      {index === 0 && (
                        <TableCell rowSpan={garageModule.submodules.length} className="align-top">
                          <div className="space-y-1">
                            <div className="font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                            {user.role && (
                              <div className="text-xs text-muted-foreground">
                                {user.role}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>{submodule.name}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={user.permissions?.[submodule.id]?.view || false}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(user.id, submodule.id, 'view', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={user.permissions?.[submodule.id]?.create || false}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(user.id, submodule.id, 'create', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={user.permissions?.[submodule.id]?.edit || false}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(user.id, submodule.id, 'edit', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={user.permissions?.[submodule.id]?.delete || false}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(user.id, submodule.id, 'delete', !!checked)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GaragePermissionsTab;
