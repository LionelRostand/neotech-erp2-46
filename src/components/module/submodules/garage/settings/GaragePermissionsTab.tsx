
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useGarageUsers } from '@/hooks/garage/useGarageUsers';
import GaragePermissionsTable from './GaragePermissionsTable';
import { useToast } from "@/hooks/use-toast";

const GaragePermissionsTab = () => {
  const { users, loading, updateUserPermissions } = useGarageUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermissionUpdate = async (userId: string, moduleId: string, action: 'view' | 'create' | 'edit' | 'delete', value: boolean) => {
    try {
      await updateUserPermissions(userId, moduleId, { [action]: value });
      toast({
        title: "Permission mise à jour",
        description: "Les droits d'accès ont été modifiés avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les permissions.",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Permissions</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <GaragePermissionsTable 
              users={filteredUsers}
              updatePermission={handlePermissionUpdate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GaragePermissionsTab;
