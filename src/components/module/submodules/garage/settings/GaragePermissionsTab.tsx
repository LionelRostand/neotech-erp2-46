
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useGarageUsers } from '@/hooks/garage/useGarageUsers';
import GaragePermissionsTable from './GaragePermissionsTable';

const GaragePermissionsTab = () => {
  const { users, loading, updateUserPermissions } = useGarageUsers();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            updatePermission={updateUserPermissions}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GaragePermissionsTab;
