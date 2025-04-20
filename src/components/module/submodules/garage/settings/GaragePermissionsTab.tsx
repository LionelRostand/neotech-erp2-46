
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { garageModule } from '@/data/modules/garage';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';

const GaragePermissionsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { permissions, isAdmin } = usePermissions();
  
  // Mock users data - in production this would come from your user management system
  const users = [
    { id: '1', name: 'Jean Dupont', role: 'Mécanicien', email: 'jean.dupont@garage.com' },
    { id: '2', name: 'Marie Martin', role: 'Responsable Service', email: 'marie.martin@garage.com' },
    { id: '3', name: 'Pierre Durant', role: 'Assistant', email: 'pierre.durant@garage.com' },
  ];

  const handlePermissionChange = (userId: string, moduleId: string, permission: string) => {
    // Ici, vous implementeriez la logique pour mettre à jour les permissions
    console.log(`Mise à jour des permissions pour l'utilisateur ${userId} sur ${moduleId}: ${permission}`);
    toast.success("Permissions mises à jour");
  };

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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-center">Lecture</TableHead>
              <TableHead className="text-center">Écriture</TableHead>
              <TableHead className="text-center">Suppression</TableHead>
              <TableHead className="text-center">Administration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              .filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      onCheckedChange={(checked) => 
                        handlePermissionChange(user.id, 'garage', 'read')
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      onCheckedChange={(checked) => 
                        handlePermissionChange(user.id, 'garage', 'write')
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      onCheckedChange={(checked) => 
                        handlePermissionChange(user.id, 'garage', 'delete')
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      onCheckedChange={(checked) => 
                        handlePermissionChange(user.id, 'garage', 'admin')
                      }
                      disabled={!isAdmin}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default GaragePermissionsTab;
