
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirestore } from '@/hooks/useFirestore';
import { Users, Shield } from 'lucide-react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  department?: string;
}

interface PermissionSettings {
  [userId: string]: {
    [submodule: string]: {
      read: boolean;
      write: boolean;
      edit: boolean;
      delete: boolean;
    }
  }
}

const freightSubmodules = [
  { id: 'dashboard', name: 'Tableau de bord' },
  { id: 'shipments', name: 'Expéditions' },
  { id: 'carriers', name: 'Transporteurs' },
  { id: 'tracking', name: 'Suivi' },
  { id: 'packages', name: 'Colis' },
  { id: 'containers', name: 'Conteneurs' },
  { id: 'pricing', name: 'Tarification' },
  { id: 'documents', name: 'Documents' },
  { id: 'client-portal', name: 'Portail client' },
  { id: 'settings', name: 'Paramètres' }
];

const FreightPermissionsSettings: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [permissions, setPermissions] = useState<PermissionSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  // Use the user_permissions collection directly - this is already a valid collection/document pattern
  const permissionsFirestore = useFirestore(COLLECTIONS.USER_PERMISSIONS);
  const employeesFirestore = useFirestore(COLLECTIONS.HR.EMPLOYEES);

  // Load employees and permissions
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load employees
        const employeesData = await employeesFirestore.getAll();
        setEmployees(employeesData as Employee[]);
        
        // Load permissions
        const permissionsDoc = await permissionsFirestore.getById('freight');
        if (permissionsDoc) {
          setPermissions(permissionsDoc.permissions || {});
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [employeesFirestore, permissionsFirestore]);

  // Initialize permissions for an employee if they don't exist
  const initializeUserPermissions = (userId: string) => {
    if (!permissions[userId]) {
      const newPermissions = { ...permissions };
      
      newPermissions[userId] = {};
      freightSubmodules.forEach(submodule => {
        newPermissions[userId][submodule.id] = {
          read: false,
          write: false,
          edit: false,
          delete: false
        };
      });
      
      setPermissions(newPermissions);
    }
  };

  // Ensure all employees have initialized permissions
  useEffect(() => {
    employees.forEach(employee => {
      initializeUserPermissions(employee.id);
    });
  }, [employees]);

  // Handle permission change
  const handlePermissionChange = (userId: string, submodule: string, permission: 'read' | 'write' | 'edit' | 'delete', value: boolean) => {
    setPermissions(prev => {
      const newPermissions = { ...prev };
      
      // Initialize if not already done
      if (!newPermissions[userId]) {
        newPermissions[userId] = {};
      }
      
      if (!newPermissions[userId][submodule]) {
        newPermissions[userId][submodule] = {
          read: false,
          write: false,
          edit: false,
          delete: false
        };
      }
      
      newPermissions[userId][submodule][permission] = value;
      
      // If a higher permission is granted, grant lower permissions too
      if (permission === 'delete' && value) {
        newPermissions[userId][submodule].edit = true;
        newPermissions[userId][submodule].write = true;
        newPermissions[userId][submodule].read = true;
      } else if (permission === 'edit' && value) {
        newPermissions[userId][submodule].write = true;
        newPermissions[userId][submodule].read = true;
      } else if (permission === 'write' && value) {
        newPermissions[userId][submodule].read = true;
      }
      
      // If a lower permission is revoked, revoke higher permissions too
      if (permission === 'read' && !value) {
        newPermissions[userId][submodule].write = false;
        newPermissions[userId][submodule].edit = false;
        newPermissions[userId][submodule].delete = false;
      } else if (permission === 'write' && !value) {
        newPermissions[userId][submodule].edit = false;
        newPermissions[userId][submodule].delete = false;
      } else if (permission === 'edit' && !value) {
        newPermissions[userId][submodule].delete = false;
      }
      
      return newPermissions;
    });
  };

  // Save permissions
  const savePermissions = async () => {
    try {
      setIsLoading(true);
      
      await permissionsFirestore.set('freight', {
        permissions,
        updatedAt: new Date()
      });
      
      toast.success("Droits d'accès enregistrés avec succès");
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error(`Erreur lors de l'enregistrement des droits d'accès: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && employees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Droits d'accès</CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Droits d'accès</CardTitle>
          <CardDescription>
            Gérer les droits d'accès des utilisateurs aux différentes fonctionnalités du module Fret
          </CardDescription>
        </div>
        <Button onClick={savePermissions} disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </CardHeader>
      <CardContent>
        {employees.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun employé trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Vous devez ajouter des employés dans le module RH pour pouvoir configurer leurs droits d'accès.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Employé</TableHead>
                  {freightSubmodules.map(submodule => (
                    <TableHead key={submodule.id}>{submodule.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.firstName} {employee.lastName}
                      <div className="text-xs text-muted-foreground">
                        {employee.position || 'N/A'}
                      </div>
                    </TableCell>
                    
                    {freightSubmodules.map(submodule => {
                      // Initialize permissions for this user if they don't exist
                      initializeUserPermissions(employee.id);
                      
                      const userSubmodulePermissions = permissions[employee.id]?.[submodule.id] || {
                        read: false,
                        write: false,
                        edit: false,
                        delete: false
                      };
                      
                      return (
                        <TableCell key={`${employee.id}-${submodule.id}`} className="text-center">
                          <div className="flex flex-col space-y-1.5 items-center">
                            <div className="flex items-center space-x-1">
                              <span className="text-xs font-medium mr-1">Lecture</span>
                              <Checkbox
                                checked={userSubmodulePermissions.read}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(employee.id, submodule.id, 'read', !!checked)
                                }
                              />
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs font-medium mr-1">Écriture</span>
                              <Checkbox
                                checked={userSubmodulePermissions.write}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(employee.id, submodule.id, 'write', !!checked)
                                }
                              />
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs font-medium mr-1">Édition</span>
                              <Checkbox
                                checked={userSubmodulePermissions.edit}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(employee.id, submodule.id, 'edit', !!checked)
                                }
                              />
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs font-medium mr-1">Suppression</span>
                              <Checkbox
                                checked={userSubmodulePermissions.delete}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(employee.id, submodule.id, 'delete', !!checked)
                                }
                              />
                            </div>
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FreightPermissionsSettings;
