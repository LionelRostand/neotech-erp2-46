
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, Settings as SettingsIcon } from 'lucide-react';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Employee } from '@/types/employee';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EmployeesSettings: React.FC = () => {
  const { employees, isLoading } = useHrModuleData();
  const [activeTab, setActiveTab] = useState("permissions");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Paramètres RH</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="permissions" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Droits d'accès
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Général
          </TabsTrigger>
        </TabsList>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des droits d'accès</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Configurez les droits d'accès aux différentes fonctionnalités du module Employés.
                  </p>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Poste</TableHead>
                        <TableHead>Département</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee: Employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.firstName} {employee.lastName}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                        </TableRow>
                      ))}
                      {employees.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            Aucun employé trouvé
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Configuration des utilisateurs et de leurs accès.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Préférences d'affichage</h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between space-x-2">
                      <label htmlFor="show-inactive" className="flex flex-col space-y-1">
                        <span>Afficher les employés inactifs</span>
                        <span className="text-sm text-muted-foreground">Inclure les employés inactifs dans les listes et rapports</span>
                      </label>
                      <Switch id="show-inactive" />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <label htmlFor="show-photos" className="flex flex-col space-y-1">
                        <span>Afficher les photos</span>
                        <span className="text-sm text-muted-foreground">Montrer les photos des employés dans les listes</span>
                      </label>
                      <Switch id="show-photos" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between space-x-2">
                      <label htmlFor="email-notifications" className="flex flex-col space-y-1">
                        <span>Notifications par email</span>
                        <span className="text-sm text-muted-foreground">Envoyer des notifications par email</span>
                      </label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <label htmlFor="birthday-notifications" className="flex flex-col space-y-1">
                        <span>Rappels d'anniversaires</span>
                        <span className="text-sm text-muted-foreground">Envoyer des rappels pour les anniversaires</span>
                      </label>
                      <Switch id="birthday-notifications" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Format des dates</h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="date-format" className="text-sm font-medium">
                        Format de date
                      </label>
                      <select id="date-format" className="w-full rounded-md border border-input bg-background px-3 py-2">
                        <option value="DD/MM/YYYY">JJ/MM/AAAA</option>
                        <option value="MM/DD/YYYY">MM/JJ/AAAA</option>
                        <option value="YYYY-MM-DD">AAAA-MM-JJ</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="time-format" className="text-sm font-medium">
                        Format d'heure
                      </label>
                      <select id="time-format" className="w-full rounded-md border border-input bg-background px-3 py-2">
                        <option value="24h">24h</option>
                        <option value="12h">12h (AM/PM)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Enregistrer les paramètres</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesSettings;
