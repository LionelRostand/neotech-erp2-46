
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useCollectionData } from "@/hooks/useCollectionData";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define the permission structure
interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

// Define the employee with permissions structure
interface EmployeeWithPermissions {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  department?: string;
  permissions?: {
    [key: string]: Permission;
  };
}

const FreightPermissionsSettings: React.FC = () => {
  const { employees, isLoading: isEmployeesLoading } = useEmployeeData();
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeWithPermissions[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Fetch existing freight permissions if available
  const { data: freightPermissions, isLoading: isPermissionsLoading } = useCollectionData(
    COLLECTIONS.USER_PERMISSIONS
  );
  
  // Define freight submodules for permissions
  const freightSubmodules = [
    { id: "freight-shipments", name: "Expéditions" },
    { id: "freight-containers", name: "Conteneurs" },
    { id: "freight-carriers", name: "Transporteurs" },
    { id: "freight-tracking", name: "Suivi" },
    { id: "freight-pricing", name: "Tarification" },
    { id: "freight-documents", name: "Documents" },
    { id: "freight-client-portal", name: "Portail client" }
  ];

  // Combine employees and permissions data
  useEffect(() => {
    if (!employees || isEmployeesLoading) return;

    const employeesWithPermissions = employees.map(employee => {
      const userPermission = freightPermissions?.find(
        (p: any) => p.userId === employee.id
      );
      
      return {
        ...employee,
        permissions: userPermission?.permissions || {}
      };
    });

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      setFilteredEmployees(
        employeesWithPermissions.filter(
          emp => 
            emp.firstName?.toLowerCase().includes(lowerSearchTerm) ||
            emp.lastName?.toLowerCase().includes(lowerSearchTerm) ||
            emp.email?.toLowerCase().includes(lowerSearchTerm) ||
            emp.role?.toLowerCase().includes(lowerSearchTerm) ||
            emp.department?.toLowerCase().includes(lowerSearchTerm)
        )
      );
    } else {
      setFilteredEmployees(employeesWithPermissions);
    }
  }, [employees, freightPermissions, searchTerm, isEmployeesLoading]);

  // Toggle individual permission
  const togglePermission = (
    employeeId: string, 
    moduleId: string, 
    permission: keyof Permission
  ) => {
    setFilteredEmployees(prevEmployees => 
      prevEmployees.map(emp => {
        if (emp.id === employeeId) {
          const currentPermissions = emp.permissions || {};
          const modulePermissions = currentPermissions[moduleId] || { 
            view: false, 
            create: false, 
            edit: false, 
            delete: false 
          };
          
          return {
            ...emp,
            permissions: {
              ...currentPermissions,
              [moduleId]: {
                ...modulePermissions,
                [permission]: !modulePermissions[permission]
              }
            }
          };
        }
        return emp;
      })
    );
  };

  // Set all permissions for a module
  const setAllPermissions = (employeeId: string, moduleId: string, value: boolean) => {
    setFilteredEmployees(prevEmployees => 
      prevEmployees.map(emp => {
        if (emp.id === employeeId) {
          const currentPermissions = emp.permissions || {};
          
          return {
            ...emp,
            permissions: {
              ...currentPermissions,
              [moduleId]: {
                view: value,
                create: value,
                edit: value,
                delete: value
              }
            }
          };
        }
        return emp;
      })
    );
  };

  // Save permissions to Firestore
  const savePermissions = async () => {
    setSaving(true);
    let successCount = 0;
    let errorCount = 0;
    
    try {
      for (const employee of filteredEmployees) {
        if (!employee.permissions) continue;
        
        const permissionRef = doc(db, COLLECTIONS.USER_PERMISSIONS, employee.id);
        
        try {
          // Check if permissions document exists for this user
          const existingPermission = freightPermissions?.find((p: any) => p.userId === employee.id);
          
          if (existingPermission) {
            // Update existing permissions
            await updateDoc(permissionRef, {
              permissions: employee.permissions
            });
          } else {
            // Create new permissions document
            await setDoc(permissionRef, {
              userId: employee.id,
              permissions: employee.permissions
            });
          }
          
          successCount++;
        } catch (error) {
          console.error(`Error saving permissions for ${employee.firstName} ${employee.lastName}:`, error);
          errorCount++;
        }
      }
      
      if (errorCount === 0) {
        toast.success(`Permissions enregistrées avec succès pour ${successCount} employés`);
      } else {
        toast.error(`Erreur lors de l'enregistrement des permissions pour ${errorCount} employés. ${successCount} employés mis à jour avec succès.`);
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement des permissions");
    } finally {
      setSaving(false);
    }
  };

  // Render loading state
  if (isEmployeesLoading || isPermissionsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Droits d'accès au Module Fret</h3>
            <Button onClick={savePermissions} disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un employé..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Employé</TableHead>
                  {freightSubmodules.map((module) => (
                    <TableHead key={module.id}>{module.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={freightSubmodules.length + 1} className="text-center py-4">
                      Aucun employé trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        <div>
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">{employee.email}</div>
                      </TableCell>
                      
                      {freightSubmodules.map((module) => {
                        const modulePermissions = employee.permissions?.[module.id] || {
                          view: false,
                          create: false,
                          edit: false,
                          delete: false
                        };
                        
                        return (
                          <TableCell key={`${employee.id}-${module.id}`}>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium">{module.name}</span>
                                <div className="space-x-1">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-6 text-xs"
                                    onClick={() => setAllPermissions(employee.id, module.id, true)}
                                  >
                                    Tous
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-6 text-xs"
                                    onClick={() => setAllPermissions(employee.id, module.id, false)}
                                  >
                                    Aucun
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`${employee.id}-${module.id}-view`}
                                    checked={modulePermissions.view}
                                    onCheckedChange={() => togglePermission(employee.id, module.id, "view")}
                                  />
                                  <label htmlFor={`${employee.id}-${module.id}-view`} className="text-xs">
                                    Lecture
                                  </label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`${employee.id}-${module.id}-create`}
                                    checked={modulePermissions.create}
                                    onCheckedChange={() => togglePermission(employee.id, module.id, "create")}
                                  />
                                  <label htmlFor={`${employee.id}-${module.id}-create`} className="text-xs">
                                    Création
                                  </label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`${employee.id}-${module.id}-edit`}
                                    checked={modulePermissions.edit}
                                    onCheckedChange={() => togglePermission(employee.id, module.id, "edit")}
                                  />
                                  <label htmlFor={`${employee.id}-${module.id}-edit`} className="text-xs">
                                    Modification
                                  </label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`${employee.id}-${module.id}-delete`}
                                    checked={modulePermissions.delete}
                                    onCheckedChange={() => togglePermission(employee.id, module.id, "delete")}
                                  />
                                  <label htmlFor={`${employee.id}-${module.id}-delete`} className="text-xs">
                                    Suppression
                                  </label>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreightPermissionsSettings;
