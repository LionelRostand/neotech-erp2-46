
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Save, RefreshCw } from "lucide-react";
import { useGarageEmployees } from '@/hooks/garage/useGarageEmployees';
import { useGaragePermissionsManager, GARAGE_SUBMODULES } from '@/hooks/garage/useGaragePermissionsManager';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const GaragePermissionsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { employees, loading: loadingEmployees } = useGarageEmployees();
  const { 
    permissions, 
    loading: loadingPermissions, 
    saving,
    getUserPermissions,
    updatePermission,
    saveAllPermissions 
  } = useGaragePermissionsManager();

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredEmployees = employees?.filter(employee => 
    employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loading = loadingEmployees || loadingPermissions;

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
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button 
              onClick={saveAllPermissions} 
              disabled={saving}
              className="ml-auto"
            >
              {saving ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Enregistrer les modifications
            </Button>
          </div>

          <div className="rounded-md border">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Chargement des employés et des permissions...</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Aucun employé trouvé
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Employé</TableHead>
                      <TableHead className="w-[200px]">Sous-module</TableHead>
                      <TableHead className="text-center">Voir</TableHead>
                      <TableHead className="text-center">Créer</TableHead>
                      <TableHead className="text-center">Modifier</TableHead>
                      <TableHead className="text-center">Supprimer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <React.Fragment key={employee.id}>
                        {GARAGE_SUBMODULES.map((submodule, submoduleIndex) => {
                          const userPermissions = getUserPermissions(employee.id);
                          const submodulePermission = userPermissions.find(p => p.id === submodule.id);
                          
                          return (
                            <TableRow key={`${employee.id}-${submodule.id}`}>
                              {submoduleIndex === 0 ? (
                                <TableCell rowSpan={GARAGE_SUBMODULES.length} className="align-top border-r">
                                  <div className="space-y-1">
                                    <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                                    <p className="text-sm text-muted-foreground">{employee.email}</p>
                                    {employee.position && (
                                      <p className="text-xs text-muted-foreground">{employee.position}</p>
                                    )}
                                  </div>
                                </TableCell>
                              ) : null}
                              <TableCell className="font-medium">{submodule.name}</TableCell>
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={submodulePermission?.permissions.view || false}
                                  onCheckedChange={(checked) => {
                                    updatePermission(employee.id, submodule.id, 'view', !!checked);
                                  }}
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={submodulePermission?.permissions.create || false}
                                  onCheckedChange={(checked) => {
                                    updatePermission(employee.id, submodule.id, 'create', !!checked);
                                  }}
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={submodulePermission?.permissions.edit || false}
                                  onCheckedChange={(checked) => {
                                    updatePermission(employee.id, submodule.id, 'edit', !!checked);
                                  }}
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={submodulePermission?.permissions.delete || false}
                                  onCheckedChange={(checked) => {
                                    updatePermission(employee.id, submodule.id, 'delete', !!checked);
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GaragePermissionsTab;
