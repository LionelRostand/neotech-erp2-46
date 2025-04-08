
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Search, UserPlus, Save, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from 'sonner';
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';

// List of Freight submodules for permissions
const freightModules = [
  { id: 'freight-shipments', name: 'Expéditions' },
  { id: 'freight-packages', name: 'Colis' },
  { id: 'freight-tracking', name: 'Suivi' },
  { id: 'freight-documents', name: 'Documents' },
  { id: 'freight-carriers', name: 'Transporteurs' },
  { id: 'freight-pricing', name: 'Tarification' },
  { id: 'freight-client-portal', name: 'Portail Client' },
  { id: 'freight-settings', name: 'Paramètres' },
];

const FreightPermissionsSettings: React.FC = () => {
  const { employees, isLoading, error, updateEmployeePermissions } = useEmployeesPermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  // Filter employees by search term
  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.role && emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle permission change
  const handlePermissionChange = (employeeId: string, moduleId: string, action: 'view' | 'create' | 'edit' | 'delete', checked: boolean) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    const currentPermissions = employee.permissions?.[moduleId] || { view: false, create: false, edit: false, delete: false };
    updateEmployeePermissions(employeeId, moduleId, {
      ...currentPermissions,
      [action]: checked
    });
  };

  // Handle save all permissions
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Toutes les permissions ont été enregistrées');
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement des permissions');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin mr-2 h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        <span>Chargement des données employés...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle>Gestion des droits d'accès</CardTitle>
          </div>
          <CardDescription>
            Configurez les permissions des utilisateurs pour le module de gestion de fret
          </CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun employé trouvé</h3>
              <p className="text-center text-muted-foreground mb-4">
                Aucun employé n'a été trouvé dans la base de données.
                Ajoutez des employés pour commencer à configurer les accès.
              </p>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un employé
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un employé..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="ml-4">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Employé</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead className="text-center">Visualisation</TableHead>
                      <TableHead className="text-center">Création</TableHead>
                      <TableHead className="text-center">Modification</TableHead>
                      <TableHead className="text-center">Suppression</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          Aucun employé trouvé avec ces critères de recherche
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <React.Fragment key={employee.id}>
                          {/* Employee row */}
                          <TableRow className="bg-muted/30">
                            <TableCell className="font-medium">
                              {employee.firstName} {employee.lastName}
                              <div className="text-xs text-muted-foreground">
                                {employee.email} • {employee.role || "Utilisateur"}
                              </div>
                            </TableCell>
                            <TableCell colSpan={5}></TableCell>
                          </TableRow>

                          {/* Module rows */}
                          {freightModules.map(module => {
                            const permissions = employee.permissions?.[module.id] || { 
                              view: false, 
                              create: false, 
                              edit: false, 
                              delete: false 
                            };
                            
                            return (
                              <TableRow key={`${employee.id}-${module.id}`}>
                                <TableCell></TableCell>
                                <TableCell>{module.name}</TableCell>
                                <TableCell className="text-center">
                                  <Checkbox 
                                    checked={permissions.view}
                                    onCheckedChange={(checked) => 
                                      handlePermissionChange(employee.id, module.id, 'view', !!checked)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Checkbox 
                                    checked={permissions.create}
                                    onCheckedChange={(checked) => 
                                      handlePermissionChange(employee.id, module.id, 'create', !!checked)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Checkbox 
                                    checked={permissions.edit}
                                    onCheckedChange={(checked) => 
                                      handlePermissionChange(employee.id, module.id, 'edit', !!checked)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <Checkbox 
                                    checked={permissions.delete}
                                    onCheckedChange={(checked) => 
                                      handlePermissionChange(employee.id, module.id, 'delete', !!checked)
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </React.Fragment>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveAll} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FreightPermissionsSettings;
