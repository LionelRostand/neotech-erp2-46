
import React from 'react';
import { Users, Bell, Settings, Layers, CheckCircle, XCircle, AlertCircle, Link, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FreightClientPortal: React.FC = () => {
  // Sample data for clients with portal access
  const clients = [
    { id: 1, name: 'Acme Corp', email: 'contact@acmecorp.com', lastLogin: '2023-10-15 14:32', status: 'Actif' },
    { id: 2, name: 'Tech Solutions', email: 'support@techsolutions.com', lastLogin: '2023-10-14 09:15', status: 'Actif' },
    { id: 3, name: 'Global Logistics', email: 'info@globallogistics.com', lastLogin: '2023-10-10 16:45', status: 'Inactif' },
    { id: 4, name: 'Rapid Delivery', email: 'contact@rapiddelivery.com', lastLogin: 'Jamais', status: 'En attente' },
    { id: 5, name: 'Express Shipping', email: 'support@expressshipping.com', lastLogin: '2023-10-12 11:20', status: 'Actif' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'Inactif':
        return 'bg-red-100 text-red-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-gray-500">+3 depuis le mois dernier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'utilisation</CardTitle>
            <Layers className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-gray-500">+12% depuis le mois dernier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut du portail</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">En ligne</div>
            <p className="text-xs text-gray-500">Dernière vérification il y a 5 minutes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="access">Accès</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Utilisateurs du portail client</CardTitle>
                <CardDescription>Gérez les accès des clients au portail en ligne</CardDescription>
              </div>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Inviter un client
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Input
                  type="search"
                  placeholder="Rechercher un client..."
                  className="max-w-sm"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Accès</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.lastLogin}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch checked={client.status === 'Actif'} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Gérer</Button>
                        <Button variant="ghost" size="sm">Réinitialiser</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Permissions et accès</CardTitle>
              <CardDescription>
                Configurez les niveaux d'accès et les permissions pour le portail client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Rôles d'utilisateurs</h3>
                    
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">Administrateur</h4>
                        <p className="text-sm text-gray-500">Accès complet au compte</p>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">Utilisateur standard</h4>
                        <p className="text-sm text-gray-500">Peut suivre les expéditions et voir les factures</p>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">Lecture seule</h4>
                        <p className="text-sm text-gray-500">Peut uniquement consulter</p>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Créer un nouveau rôle
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Fonctionnalités disponibles</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <span>Suivi des expéditions</span>
                        </label>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <span>Consultation des factures</span>
                        </label>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <span>Création de nouvelles expéditions</span>
                        </label>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <span>Gestion des paiements</span>
                        </label>
                        <Switch checked={false} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <span>Rapports et statistiques</span>
                        </label>
                        <Switch checked={false} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="flex items-center">
                          <span>Documents personnalisés</span>
                        </label>
                        <Switch checked={true} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du portail</CardTitle>
              <CardDescription>
                Configurez l'apparence et les fonctionnalités du portail client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Apparence</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm">Logo de l'entreprise</label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-32 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-sm text-gray-500">Logo</span>
                      </div>
                      <Button variant="outline" size="sm">Changer</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm">Couleur principale</label>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-blue-600 rounded-full"></div>
                      <Input type="text" value="#2563EB" className="w-32" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm">Nom du portail</label>
                    <Input type="text" value="Espace Client Transport" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notifications</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        <span>Notifications par email</span>
                      </label>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        <span>Notifications dans l'application</span>
                      </label>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        <span>Notifications par SMS</span>
                      </label>
                      <Switch checked={false} />
                    </div>
                  </div>
                  
                  <h3 className="font-medium mt-6">Intégration</h3>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium flex items-center">
                        <Link className="h-4 w-4 mr-2" />
                        Lien d'accès public
                      </h4>
                      <p className="text-sm text-gray-500">URL du portail client</p>
                    </div>
                    <Button variant="outline" size="sm">Copier</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium flex items-center">
                        <Link className="h-4 w-4 mr-2" />
                        Widget pour votre site
                      </h4>
                      <p className="text-sm text-gray-500">Intégrez le suivi sur votre site web</p>
                    </div>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button>Enregistrer les paramètres</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightClientPortal;
