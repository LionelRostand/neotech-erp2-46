
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirestore } from '@/hooks/useFirestore';
import { useEmployeesPermissions, EmployeeUser } from '@/hooks/useEmployeesPermissions';

// Define the permissions interface
interface ModulePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface FreightPermissions {
  id?: string;
  permissions: {
    [userId: string]: ModulePermission;
  };
  updatedAt?: Date;
}

const FreightPermissionsSettings: React.FC = () => {
  const [permissions, setPermissions] = useState<{[userId: string]: ModulePermission}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const { employees, isLoading: isLoadingEmployees } = useEmployeesPermissions();
  
  // Use the appropriate collection path
  const permissionsCollectionPath = COLLECTIONS.FREIGHT.SETTINGS;
  const permissionsDocumentId = 'permissions';
  const firestore = useFirestore(permissionsCollectionPath);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setIsLoading(true);
        const permissionsData = await firestore.getById(permissionsDocumentId);
        
        if (permissionsData) {
          // Cast to our interface
          const data = permissionsData as FreightPermissions;
          setPermissions(data.permissions || {});
        }
      } catch (error) {
        console.error("Error loading freight permissions:", error);
        toast.error("Erreur lors du chargement des permissions");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPermissions();
  }, [firestore]);

  const togglePermission = (userId: string, action: keyof ModulePermission) => {
    setPermissions(prev => {
      // Create a copy of the previous state
      const newPermissions = { ...prev };
      
      // Ensure the user exists in the permissions object
      if (!newPermissions[userId]) {
        newPermissions[userId] = { view: false, create: false, edit: false, delete: false };
      }
      
      // Toggle the specific permission
      newPermissions[userId] = {
        ...newPermissions[userId],
        [action]: !newPermissions[userId][action]
      };
      
      // If view permission is turned off, turn off all other permissions as well
      if (action === "view" && !newPermissions[userId].view) {
        newPermissions[userId].create = false;
        newPermissions[userId].edit = false;
        newPermissions[userId].delete = false;
      }
      
      // If any other permission is turned on, ensure view is also turned on
      if (action !== "view" && newPermissions[userId][action]) {
        newPermissions[userId].view = true;
      }
      
      return newPermissions;
    });
  };

  const savePermissions = async () => {
    try {
      setIsSaving(true);
      
      const permissionsData: FreightPermissions = {
        permissions,
        updatedAt: new Date()
      };
      
      await firestore.set(permissionsDocumentId, permissionsData);
      
      toast.success("Permissions enregistrées avec succès");
    } catch (error) {
      console.error("Error saving freight permissions:", error);
      toast.error(`Erreur lors de l'enregistrement des permissions: ${(error as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Droits d'accès au Module Fret</CardTitle>
        <CardDescription>
          Gérez les permissions d'accès des utilisateurs au module Fret
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || isLoadingEmployees ? (
          <div className="text-center py-4">Chargement des données...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Utilisateur</TableHead>
                  <TableHead className="text-center">Voir</TableHead>
                  <TableHead className="text-center">Créer</TableHead>
                  <TableHead className="text-center">Modifier</TableHead>
                  <TableHead className="text-center">Supprimer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee: EmployeeUser) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                      <div className="text-sm text-muted-foreground">{employee.email}</div>
                    </TableCell>
                    
                    {(['view', 'create', 'edit', 'delete'] as const).map((action) => (
                      <TableCell key={action} className="text-center">
                        <Checkbox 
                          checked={!!permissions[employee.id]?.[action]}
                          onCheckedChange={() => togglePermission(employee.id, action)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <Separator className="my-6" />
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline" disabled={isSaving}>
                Annuler
              </Button>
              <Button 
                onClick={savePermissions} 
                disabled={isSaving}
              >
                {isSaving ? "Enregistrement..." : "Enregistrer les permissions"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FreightPermissionsSettings;
