
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DashboardLayout from "@/components/DashboardLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Settings } from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';

const UserPermissions = () => {
  const { employees, isLoading } = useEmployeesPermissions();

  const modules = [
    { id: 'dashboard', name: 'Tableau de bord' },
    { id: 'employees', name: 'Employés' },
    { id: 'companies', name: 'Entreprises' },
    { id: 'documents', name: 'Documents' },
    { id: 'messages', name: 'Messages' },
    { id: 'settings', name: 'Paramètres' }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Droits utilisateurs</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attribution des droits d'accès</CardTitle>
            <CardDescription>
              Gérez les permissions d'accès aux différents modules pour chaque utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-8">
                {employees.map((employee) => (
                  <div key={employee.id} className="border rounded-lg p-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-lg">{employee.firstName} {employee.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {modules.map((module) => (
                        <div key={`${employee.id}-${module.id}`} className="space-y-4">
                          <h4 className="font-medium">{module.name}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`${employee.id}-${module.id}-view`} />
                              <label htmlFor={`${employee.id}-${module.id}-view`} className="text-sm">
                                Visualisation
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`${employee.id}-${module.id}-create`} />
                              <label htmlFor={`${employee.id}-${module.id}-create`} className="text-sm">
                                Création
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`${employee.id}-${module.id}-edit`} />
                              <label htmlFor={`${employee.id}-${module.id}-edit`} className="text-sm">
                                Modification
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`${employee.id}-${module.id}-delete`} />
                              <label htmlFor={`${employee.id}-${module.id}-delete`} className="text-sm">
                                Suppression
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" className="mr-2">Réinitialiser</Button>
                      <Button>Enregistrer</Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserPermissions;
