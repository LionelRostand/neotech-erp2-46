
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';
import FreightPermissionsSettings from './FreightPermissionsSettings';

const FreightPermissionsTab: React.FC = () => {
  const { employees, isLoading, error, updateEmployeePermissions } = useEmployeesPermissions();
  const [activeTab, setActiveTab] = useState('roles');

  // Module permissions for freight
  const freightModules = [
    { id: 'freight-shipments', name: 'Expéditions' },
    { id: 'freight-containers', name: 'Conteneurs' },
    { id: 'freight-carriers', name: 'Transporteurs' },
    { id: 'freight-tracking', name: 'Suivi' },
    { id: 'freight-pricing', name: 'Tarification' },
    { id: 'freight-documents', name: 'Documents' },
    { id: 'freight-client-portal', name: 'Portail client' },
    { id: 'freight-settings', name: 'Paramètres' }
  ];

  const handlePermissionChange = (employeeId: string, moduleId: string, field: string, value: boolean) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    // Get current permissions or initialize
    const currentPerms = employee.permissions?.[moduleId] || {
      view: false,
      create: false,
      edit: false,
      delete: false
    };

    // Update the specific permission
    const updatedPerms = {
      ...currentPerms,
      [field]: value
    };

    // Save to database
    updateEmployeePermissions(employeeId, moduleId, updatedPerms);
  };

  if (isLoading) {
    return <div className="p-4">Chargement des permissions...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="roles" className="flex-1">Par rôles</TabsTrigger>
          <TabsTrigger value="users" className="flex-1">Par utilisateurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="mt-6">
          <FreightPermissionsSettings />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          {employees && employees.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-2 bg-slate-100 border">Utilisateur</th>
                        {freightModules.map(module => (
                          <th key={module.id} className="text-left p-2 bg-slate-100 border">
                            {module.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(employee => (
                        <tr key={employee.id}>
                          <td className="p-2 border">
                            <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                            <div className="text-xs text-gray-500">{employee.role || 'Utilisateur'}</div>
                          </td>
                          {freightModules.map(module => (
                            <td key={`${employee.id}-${module.id}`} className="p-2 border">
                              <Select
                                value={employee.permissions?.[module.id]?.view 
                                  ? employee.permissions[module.id].edit 
                                    ? "write" 
                                    : "read" 
                                  : "none_permission"
                                }
                                onValueChange={(value) => {
                                  const permissions = {
                                    view: value !== "none_permission",
                                    create: value === "write",
                                    edit: value === "write",
                                    delete: value === "write",
                                  };
                                  updateEmployeePermissions(employee.id, module.id, permissions);
                                }}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Permissions" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="write">Lecture/Écriture</SelectItem>
                                  <SelectItem value="read">Lecture seule</SelectItem>
                                  <SelectItem value="none_permission">Aucun accès</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8">
              {error ? (
                <div className="text-red-500">Erreur: {error.message}</div>
              ) : (
                <p>Aucun utilisateur trouvé</p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightPermissionsTab;
