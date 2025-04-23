
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Save, RefreshCw } from "lucide-react";
import { useGarageUsers } from '@/hooks/garage/useGarageUsers';
import GaragePermissionsTable from './GaragePermissionsTable';
import { toast } from 'sonner';

const GaragePermissionsTab = () => {
  const { users, loading, updateUserPermissions } = useGarageUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdatePermission = async (
    userId: string, 
    moduleId: string, 
    action: 'view' | 'create' | 'edit' | 'delete', 
    value: boolean
  ) => {
    try {
      setSaving(true);
      await updateUserPermissions(userId, {
        ...users.find(u => u.id === userId)?.permissions,
        [moduleId]: {
          ...users.find(u => u.id === userId)?.permissions?.[moduleId],
          [action]: value
        }
      });
      toast.success('Permissions mises à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des permissions:', error);
      toast.error('Erreur lors de la mise à jour des permissions');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des permissions...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
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
            updatePermission={handleUpdatePermission}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GaragePermissionsTab;
