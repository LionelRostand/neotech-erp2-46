
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EmployeesSettings: React.FC = () => {
  const { employees, isLoading } = useEmployeesPermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  // Safely filter employees - adding null checks to prevent toLowerCase() on undefined
  const filteredEmployees = employees.filter(emp => {
    const searchMatches = !searchTerm || 
      (emp.firstName && emp.firstName.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (emp.lastName && emp.lastName.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (emp.role && emp.role.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return searchMatches;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
      </div>
      
      <Tabs defaultValue="permissions" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="general">Général</TabsTrigger>
        </TabsList>
        
        <TabsContent value="permissions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des droits utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filtrer par module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les modules</SelectItem>
                    <SelectItem value="employees">Employés</SelectItem>
                    <SelectItem value="accounting">Comptabilité</SelectItem>
                    <SelectItem value="crm">CRM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">Chargement des données...</div>
              ) : filteredEmployees.length === 0 ? (
                <div className="text-center py-8">Aucun utilisateur trouvé</div>
              ) : (
                <div className="space-y-6">
                  {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="border rounded-md p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                          <h3 className="font-medium text-lg">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{employee.email}</p>
                          <p className="text-sm text-gray-500">Rôle: {employee.role || 'Utilisateur'}</p>
                        </div>
                        <Button variant="outline" className="mt-2 md:mt-0">
                          Gérer les permissions
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Authentification à deux facteurs (2FA)</h3>
                    <p className="text-sm text-gray-500">Exiger l'authentification à deux facteurs pour tous les utilisateurs</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="2fa" />
                    <Label htmlFor="2fa">Activé</Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Complexité du mot de passe</h3>
                    <p className="text-sm text-gray-500">Exiger des mots de passe forts avec des caractères spéciaux</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="password-complexity" />
                    <Label htmlFor="password-complexity">Activé</Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Durée de session</h3>
                    <p className="text-sm text-gray-500">Temps avant déconnexion automatique</p>
                  </div>
                  <Select defaultValue="60">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                      <SelectItem value="240">4 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notifications par email</h3>
                    <p className="text-sm text-gray-500">Envoyer des notifications par email</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="email-notifications" />
                    <Label htmlFor="email-notifications">Activé</Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notifications dans l'application</h3>
                    <p className="text-sm text-gray-500">Afficher des notifications dans l'application</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="app-notifications" defaultChecked />
                    <Label htmlFor="app-notifications">Activé</Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Résumé journalier</h3>
                    <p className="text-sm text-gray-500">Envoyer un résumé des activités quotidiennes</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="daily-summary" />
                    <Label htmlFor="daily-summary">Activé</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger id="language" className="mt-1">
                        <SelectValue placeholder="Sélectionner une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select defaultValue="europe-paris">
                      <SelectTrigger id="timezone" className="mt-1">
                        <SelectValue placeholder="Sélectionner un fuseau horaire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="europe-paris">Europe/Paris</SelectItem>
                        <SelectItem value="europe-london">Europe/London</SelectItem>
                        <SelectItem value="america-new_york">America/New_York</SelectItem>
                        <SelectItem value="asia-tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="date-format">Format de date</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger id="date-format" className="mt-1">
                      <SelectValue placeholder="Sélectionner un format de date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Mode sombre</h3>
                    <p className="text-sm text-gray-500">Activer le thème sombre</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="dark-mode" />
                    <Label htmlFor="dark-mode">Activé</Label>
                  </div>
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
