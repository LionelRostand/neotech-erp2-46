
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useGaragePermissions } from '@/hooks/garage/useGaragePermissions';
import { Checkbox } from "@/components/ui/checkbox";

const GaragePermissionsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { users, loading, updatePermission } = useGaragePermissions();

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users?.filter(user => 
    user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des droits d'accès</CardTitle>
      </CardHeader>
      <CardContent>
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
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Chargement des permissions...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Aucun utilisateur trouvé
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Utilisateur</th>
                    <th className="text-center p-4 font-medium">Voir</th>
                    <th className="text-center p-4 font-medium">Créer</th>
                    <th className="text-center p-4 font-medium">Modifier</th>
                    <th className="text-center p-4 font-medium">Supprimer</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.userId} className="border-b">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{user.userName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </td>
                      <td className="text-center p-4">
                        <Checkbox
                          checked={user.permissions?.view || false}
                          onCheckedChange={(checked) => updatePermission(user.userId, 'garage', 'view', !!checked)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="text-center p-4">
                        <Checkbox
                          checked={user.permissions?.create || false}
                          onCheckedChange={(checked) => updatePermission(user.userId, 'garage', 'create', !!checked)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="text-center p-4">
                        <Checkbox
                          checked={user.permissions?.edit || false}
                          onCheckedChange={(checked) => updatePermission(user.userId, 'garage', 'edit', !!checked)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="text-center p-4">
                        <Checkbox
                          checked={user.permissions?.delete || false}
                          onCheckedChange={(checked) => updatePermission(user.userId, 'garage', 'delete', !!checked)}
                          className="h-4 w-4"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GaragePermissionsTab;
