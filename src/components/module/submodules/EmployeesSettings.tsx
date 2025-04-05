
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, Settings as SettingsIcon, UserPlus, Search } from 'lucide-react';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Employee } from '@/types/employee';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getAllUsers } from '@/services/userService';
import { toast } from 'sonner';
import { User } from '@/types/user';

const EmployeesSettings: React.FC = () => {
  const { employees, isLoading } = useHrModuleData();
  const [activeTab, setActiveTab] = useState("permissions");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        toast.error("Impossible de charger les utilisateurs");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher un utilisateur..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nouvel utilisateur
                  </Button>
                </div>

                {isLoadingUsers ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Dernière connexion</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800' 
                                : user.role === 'manager' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role === 'admin' 
                                ? 'Administrateur' 
                                : user.role === 'manager' 
                                  ? 'Manager' 
                                  : 'Utilisateur'}
                            </span>
                          </TableCell>
                          <TableCell>{user.department || '-'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : user.status === 'inactive' 
                                  ? 'bg-gray-100 text-gray-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.status === 'active' 
                                ? 'Actif' 
                                : user.status === 'inactive' 
                                  ? 'Inactif' 
                                  : 'En attente'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin 
                              ? new Date(user.lastLogin).toLocaleDateString('fr-FR') 
                              : 'Jamais connecté'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Éditer</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            {searchQuery ? 'Aucun utilisateur trouvé pour cette recherche' : 'Aucun utilisateur trouvé'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
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
