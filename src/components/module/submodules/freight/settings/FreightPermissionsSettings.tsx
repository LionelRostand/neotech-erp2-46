
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirestore } from '@/hooks/useFirestore';
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';

// Define interfaces for our types
interface ModulePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface FreightPermissions {
  id?: string;
  permissions?: {
    [key: string]: ModulePermission;
  };
  updatedAt?: Date;
}

interface SubModule {
  id: string;
  name: string;
  description: string;
}

const FreightPermissionsSettings: React.FC = () => {
  const { employees, isLoading: isLoadingEmployees } = useEmployeesPermissions();
  
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<Record<string, ModulePermission>>({});
  
  // Submodules for freight
  const subModules: SubModule[] = [
    { id: 'shipments', name: 'Expéditions', description: 'Gestion des expéditions' },
    { id: 'packages', name: 'Colis', description: 'Gestion des colis' },
    { id: 'tracking', name: 'Suivi', description: 'Suivi des expéditions' },
    { id: 'carriers', name: 'Transporteurs', description: 'Gestion des transporteurs' },
    { id: 'routes', name: 'Itinéraires', description: 'Gestion des itinéraires' },
    { id: 'customers', name: 'Clients', description: 'Gestion des clients du module fret' },
  ];
  
  // Use the appropriate collection/document pattern
  const permissionsCollectionPath = COLLECTIONS.FREIGHT.PERMISSIONS.replace('freight/permissions', 'freight_permissions');
  const permissionsDocumentId = 'general';
  const firestore = useFirestore(permissionsCollectionPath);
  
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setIsLoading(true);
        const permissionsData = await firestore.getById(permissionsDocumentId);
        
        if (permissionsData && permissionsData.permissions) {
          setPermissions(permissionsData.permissions);
        } else {
          // Initialize empty permissions if none exist
          const initialPermissions: Record<string, ModulePermission> = {};
          subModules.forEach(module => {
            initialPermissions[module.id] = {
              view: true,
              create: false,
              edit: false,
              delete: false
            };
          });
          setPermissions(initialPermissions);
        }
      } catch (error) {
        console.error("Error loading freight permissions:", error);
        toast.error("Erreur lors du chargement des permissions");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPermissions();
  }, [firestore, subModules]);
  
  const savePermissions = async () => {
    try {
      setIsLoading(true);
      
      const permissionsData: FreightPermissions = {
        permissions,
        updatedAt: new Date()
      };
      
      await firestore.set(permissionsDocumentId, permissionsData);
      
      toast.success("Permissions enregistrées avec succès");
    } catch (error) {
      console.error("Error saving freight permissions:", error);
      toast.error(`Erreur lors de l'enregistrement des permissions: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePermissionChange = (moduleId: string, action: keyof ModulePermission, value: boolean) => {
    setPermissions(prev => {
      // Initialize the module permissions if they don't exist
      const modulePerm = prev[moduleId] || { view: false, create: false, edit: false, delete: false };
      
      return {
        ...prev,
        [moduleId]: {
          ...modulePerm,
          [action]: value,
          // Ensure view is always true if any other permission is true
          view: action === 'view' ? value : modulePerm.view || (action !== 'view' && value)
        }
      };
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions du module Fret</CardTitle>
        <CardDescription>
          Configurez les permissions d'accès aux différentes fonctionnalités du module Fret
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Module</TableHead>
                  <TableHead>Voir</TableHead>
                  <TableHead>Créer</TableHead>
                  <TableHead>Modifier</TableHead>
                  <TableHead>Supprimer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subModules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{module.name}</div>
                        <div className="text-sm text-muted-foreground">{module.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={permissions[module.id]?.view ?? false}
                        onCheckedChange={(checked) => handlePermissionChange(module.id, 'view', checked)}
                        disabled={isLoading}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={permissions[module.id]?.create ?? false}
                        onCheckedChange={(checked) => handlePermissionChange(module.id, 'create', checked)}
                        disabled={isLoading || !(permissions[module.id]?.view ?? false)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={permissions[module.id]?.edit ?? false}
                        onCheckedChange={(checked) => handlePermissionChange(module.id, 'edit', checked)}
                        disabled={isLoading || !(permissions[module.id]?.view ?? false)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={permissions[module.id]?.delete ?? false}
                        onCheckedChange={(checked) => handlePermissionChange(module.id, 'delete', checked)}
                        disabled={isLoading || !(permissions[module.id]?.view ?? false)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6 pt-4">
            {isLoadingEmployees ? (
              <div className="text-center py-4">Chargement des employés...</div>
            ) : (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Configurez les permissions par utilisateur dans l'onglet Utilisateurs du module Employés.
                </p>
                
                <div>
                  <h3 className="font-medium mb-4">Utilisateurs avec accès au module Fret</h3>
                  
                  {employees.filter(employee => employee.permissions?.freight?.view).length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Utilisateur</TableHead>
                          <TableHead>Rôle</TableHead>
                          <TableHead>Voir</TableHead>
                          <TableHead>Créer</TableHead>
                          <TableHead>Modifier</TableHead>
                          <TableHead>Supprimer</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees
                          .filter(employee => employee.permissions?.freight?.view)
                          .map(employee => (
                            <TableRow key={employee.id}>
                              <TableCell>
                                <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                                <div className="text-sm text-muted-foreground">{employee.email}</div>
                              </TableCell>
                              <TableCell>{employee.role || 'User'}</TableCell>
                              <TableCell>{employee.permissions?.freight?.view ? 'Oui' : 'Non'}</TableCell>
                              <TableCell>{employee.permissions?.freight?.create ? 'Oui' : 'Non'}</TableCell>
                              <TableCell>{employee.permissions?.freight?.edit ? 'Oui' : 'Non'}</TableCell>
                              <TableCell>{employee.permissions?.freight?.delete ? 'Oui' : 'Non'}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Aucun utilisateur n'a accès au module Fret actuellement.
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="flex justify-end">
          <Button 
            onClick={savePermissions} 
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer les permissions"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreightPermissionsSettings;
