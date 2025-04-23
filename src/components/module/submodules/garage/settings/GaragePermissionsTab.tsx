
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGarageUsers } from '@/hooks/garage/useGarageUsers';
import { garageModule } from '@/data/modules/garage';
import { toast } from 'sonner';

const GaragePermissionsTab = () => {
  const { users, loading, updateUserPermissions } = useGarageUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermissionChange = (userId: string, moduleId: string, permissionType: 'view' | 'create' | 'edit' | 'delete', value: boolean) => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return;

    const updatedUsers = [...users];
    const user = { ...updatedUsers[userIndex] };

    if (!user.permissions) {
      user.permissions = {};
    }

    if (!user.permissions[moduleId]) {
      user.permissions[moduleId] = {
        view: false,
        create: false,
        edit: false,
        delete: false
      };
    }

    user.permissions[moduleId] = {
      ...user.permissions[moduleId],
      [permissionType]: value
    };

    updatedUsers[userIndex] = user;
  };

  const handleSavePermissions = async () => {
    setSaving(true);
    try {
      await Promise.all(users.map(user => 
        updateUserPermissions(user.id, user.permissions || {})
      ));
      toast.success('Permissions mises à jour avec succès');
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Erreur lors de la mise à jour des permissions');
    } finally {
      setSaving(false);
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
    <Card className="p-4">
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
          <Button onClick={handleSavePermissions} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Utilisateur</TableHead>
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
                  <TableRow key={`${user.id}-${submodule.id}`} className={index === 0 ? "bg-muted/50" : ""}>
                    {index === 0 && (
                      <TableCell rowSpan={garageModule.submodules.length} className="align-top">
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          {user.role && (
                            <div className="text-xs text-muted-foreground mt-1">{user.role}</div>
                          )}
                        </div>
                      </TableCell>
                    )}
                    <TableCell>{submodule.name}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={user.permissions?.[submodule.id]?.view || false}
                        onCheckedChange={(checked) => handlePermissionChange(user.id, submodule.id, 'view', !!checked)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={user.permissions?.[submodule.id]?.create || false}
                        onCheckedChange={(checked) => handlePermissionChange(user.id, submodule.id, 'create', !!checked)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={user.permissions?.[submodule.id]?.edit || false}
                        onCheckedChange={(checked) => handlePermissionChange(user.id, submodule.id, 'edit', !!checked)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={user.permissions?.[submodule.id]?.delete || false}
                        onCheckedChange={(checked) => handlePermissionChange(user.id, submodule.id, 'delete', !!checked)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default GaragePermissionsTab;
