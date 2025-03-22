
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Users, Wrench, Calendar, Settings, Receipt, Package, CreditCard, RefreshCw, Globe, Lock, Link, QrCode } from 'lucide-react';

type ServiceType = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number;
  active: boolean;
  category: string;
}

type EmployeeRole = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const sampleServiceTypes: ServiceType[] = [
  {
    id: "SRV001",
    name: "Vidange standard",
    description: "Changement d'huile et filtre à huile",
    basePrice: 89.99,
    duration: 60,
    active: true,
    category: "Entretien"
  },
  {
    id: "SRV002",
    name: "Révision complète",
    description: "Vérification complète du véhicule avec remplacement des filtres",
    basePrice: 199.99,
    duration: 120,
    active: true,
    category: "Entretien"
  },
  {
    id: "SRV003",
    name: "Changement plaquettes de frein",
    description: "Remplacement des plaquettes de frein avant ou arrière",
    basePrice: 129.99,
    duration: 90,
    active: true,
    category: "Freinage"
  },
  {
    id: "SRV004",
    name: "Diagnostic électronique",
    description: "Analyse complète des systèmes électroniques du véhicule",
    basePrice: 49.99,
    duration: 45,
    active: true,
    category: "Diagnostic"
  },
  {
    id: "SRV005",
    name: "Changement batterie",
    description: "Remplacement de la batterie (hors pièce)",
    basePrice: 39.99,
    duration: 30,
    active: true,
    category: "Électricité"
  }
];

const sampleEmployeeRoles: EmployeeRole[] = [
  {
    id: "ROLE001",
    name: "Administrateur",
    description: "Accès complet à tous les modules et fonctionnalités",
    permissions: ["all"]
  },
  {
    id: "ROLE002",
    name: "Gérant",
    description: "Accès à la gestion, aux finances et aux rapports",
    permissions: ["clients.view", "clients.edit", "vehicles.view", "vehicles.edit", "appointments.view", "appointments.edit", "repairs.view", "repairs.edit", "invoices.view", "invoices.edit", "suppliers.view", "suppliers.edit", "inventory.view", "inventory.edit", "loyalty.view", "loyalty.edit", "settings.view"]
  },
  {
    id: "ROLE003",
    name: "Mécanicien",
    description: "Accès aux réparations et à l'inventaire",
    permissions: ["clients.view", "vehicles.view", "appointments.view", "repairs.view", "repairs.edit", "inventory.view"]
  },
  {
    id: "ROLE004",
    name: "Réceptionniste",
    description: "Accès aux clients, véhicules et rendez-vous",
    permissions: ["clients.view", "clients.edit", "vehicles.view", "vehicles.edit", "appointments.view", "appointments.edit", "invoices.view"]
  }
];

const GarageSettings = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>(sampleServiceTypes);
  const [employeeRoles, setEmployeeRoles] = useState<EmployeeRole[]>(sampleEmployeeRoles);
  const [isNewServiceDialogOpen, setIsNewServiceDialogOpen] = useState(false);
  const [isNewRoleDialogOpen, setIsNewRoleDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleNewService = () => {
    setIsNewServiceDialogOpen(true);
  };

  const handleNewRole = () => {
    setIsNewRoleDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Paramètres</h2>
      </div>

      {/* Tabs for different settings sections */}
      <Tabs defaultValue="general" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="roles">Rôles & Permissions</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informations du garage</CardTitle>
              <CardDescription>Informations générales sur votre entreprise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="garageName">Nom du garage</Label>
                    <Input id="garageName" defaultValue="Auto Mécanique Plus" />
                  </div>
                  <div>
                    <Label htmlFor="garagePhone">Téléphone</Label>
                    <Input id="garagePhone" defaultValue="01 23 45 67 89" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="garageAddress">Adresse</Label>
                  <Input id="garageAddress" defaultValue="123 Avenue de la Mécanique, 75001 Paris" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="garageEmail">Email</Label>
                    <Input id="garageEmail" type="email" defaultValue="contact@automecanique.fr" />
                  </div>
                  <div>
                    <Label htmlFor="garageWebsite">Site web</Label>
                    <Input id="garageWebsite" defaultValue="https://www.automecanique.fr" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="businessHours">Horaires d'ouverture</Label>
                  <textarea 
                    id="businessHours" 
                    rows={3} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue="Lundi - Vendredi: 8h00 - 18h00&#10;Samedi: 9h00 - 16h00&#10;Dimanche: Fermé"
                  />
                </div>
                <div className="pt-4 border-t">
                  <Button>Enregistrer les modifications</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Paramètres fiscaux</CardTitle>
              <CardDescription>Informations fiscales et de facturation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vatNumber">Numéro de TVA</Label>
                    <Input id="vatNumber" defaultValue="FR12345678901" />
                  </div>
                  <div>
                    <Label htmlFor="siretNumber">Numéro SIRET</Label>
                    <Input id="siretNumber" defaultValue="12345678901234" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultVatRate">Taux de TVA par défaut (%)</Label>
                    <Input id="defaultVatRate" type="number" min="0" step="0.1" defaultValue="20" />
                  </div>
                  <div>
                    <Label htmlFor="currency">Devise</Label>
                    <select id="currency" className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar américain ($)</option>
                      <option value="GBP">Livre sterling (£)</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button>Enregistrer les modifications</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Types de services</CardTitle>
                <CardDescription>Gérez les types de services proposés par votre garage</CardDescription>
              </div>
              <Button onClick={handleNewService}>
                <Plus className="h-4 w-4 mr-1" />
                Nouveau service
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Prix de base</TableHead>
                    <TableHead>Durée (min)</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceTypes.map(service => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>{service.basePrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                      <TableCell>{service.duration}</TableCell>
                      <TableCell>{service.category}</TableCell>
                      <TableCell>
                        {service.active ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactif</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">Modifier</Button>
                          <Switch checked={service.active} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Statuts de réparation</CardTitle>
              <CardDescription>Personnalisez les statuts pour les réparations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                    <span className="ml-4">Réparation planifiée mais pas encore commencée</span>
                  </div>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <Badge className="bg-blue-100 text-blue-800">Diagnostic</Badge>
                    <span className="ml-4">Phase de diagnostic et établissement du devis</span>
                  </div>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <Badge className="bg-purple-100 text-purple-800">En attente de pièces</Badge>
                    <span className="ml-4">Devis validé, en attente de pièces détachées</span>
                  </div>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <Badge className="bg-orange-100 text-orange-800">En cours</Badge>
                    <span className="ml-4">Réparation en cours de réalisation</span>
                  </div>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <Badge className="bg-green-100 text-green-800">Terminée</Badge>
                    <span className="ml-4">Réparation terminée, prête pour remise au client</span>
                  </div>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <Badge className="bg-red-100 text-red-800">Annulée</Badge>
                    <span className="ml-4">Réparation annulée par le client ou le garage</span>
                  </div>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un statut
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Rôles et permissions</CardTitle>
                <CardDescription>Gérez les rôles et les autorisations des employés</CardDescription>
              </div>
              <Button onClick={handleNewRole}>
                <Plus className="h-4 w-4 mr-1" />
                Nouveau rôle
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du rôle</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeRoles.map(role => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.includes('all') ? (
                            <Badge variant="outline">Toutes les permissions</Badge>
                          ) : (
                            <>
                              {role.permissions.length > 3 ? (
                                <>
                                  {role.permissions.slice(0, 3).map((perm, index) => (
                                    <Badge key={index} variant="outline">{perm}</Badge>
                                  ))}
                                  <Badge variant="outline">+{role.permissions.length - 3}</Badge>
                                </>
                              ) : (
                                role.permissions.map((perm, index) => (
                                  <Badge key={index} variant="outline">{perm}</Badge>
                                ))
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">Modifier</Button>
                          {role.id !== "ROLE001" && ( // Prevent deletion of Admin role
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                              Supprimer
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Gestion des accès API</CardTitle>
              <CardDescription>Gérez les clés d'API pour les applications tierces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">API Mobile</h3>
                      <p className="text-sm text-muted-foreground mt-1">Clé d'API pour l'application mobile</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                    <Input type="password" value="api_key_1234567890abcdef" className="font-mono" />
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Régénérer
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">API Web</h3>
                      <p className="text-sm text-muted-foreground mt-1">Clé d'API pour l'intégration web</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                    <Input type="password" value="api_web_0987654321fedcba" className="font-mono" />
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Régénérer
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvelle clé API
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Receipt className="h-5 w-5" />
                  <CardTitle>Comptabilité</CardTitle>
                </div>
                <CardDescription>Intégration avec les systèmes comptables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <img src="https://via.placeholder.com/30" alt="QuickBooks" className="h-8 w-8 rounded" />
                      <div>
                        <h3 className="font-medium">QuickBooks</h3>
                        <p className="text-xs text-muted-foreground">Synchronisation des factures et paiements</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <img src="https://via.placeholder.com/30" alt="Sage" className="h-8 w-8 rounded" />
                      <div>
                        <h3 className="font-medium">Sage</h3>
                        <p className="text-xs text-muted-foreground">Exportation des données comptables</p>
                      </div>
                    </div>
                    <Switch checked={false} />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Configurer une nouvelle intégration
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <CardTitle>Paiement</CardTitle>
                </div>
                <CardDescription>Intégration avec les systèmes de paiement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <img src="https://via.placeholder.com/30" alt="Stripe" className="h-8 w-8 rounded" />
                      <div>
                        <h3 className="font-medium">Stripe</h3>
                        <p className="text-xs text-muted-foreground">Paiement en ligne des factures</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <img src="https://via.placeholder.com/30" alt="PayPal" className="h-8 w-8 rounded" />
                      <div>
                        <h3 className="font-medium">PayPal</h3>
                        <p className="text-xs text-muted-foreground">Paiement alternatif</p>
                      </div>
                    </div>
                    <Switch checked={false} />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un mode de paiement
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <CardTitle>Calendrier</CardTitle>
                </div>
                <CardDescription>Intégration avec les systèmes de calendrier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <img src="https://via.placeholder.com/30" alt="Google Calendar" className="h-8 w-8 rounded" />
                      <div>
                        <h3 className="font-medium">Google Calendar</h3>
                        <p className="text-xs text-muted-foreground">Synchronisation des rendez-vous</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <img src="https://via.placeholder.com/30" alt="Outlook" className="h-8 w-8 rounded" />
                      <div>
                        <h3 className="font-medium">Outlook</h3>
                        <p className="text-xs text-muted-foreground">Synchronisation avec Microsoft</p>
                      </div>
                    </div>
                    <Switch checked={false} />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un calendrier
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <CardTitle>API & Webhooks</CardTitle>
                </div>
                <CardDescription>Configuration des webhooks et API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Link className="h-8 w-8 p-1.5 bg-gray-100 rounded" />
                      <div>
                        <h3 className="font-medium">Webhook: Nouvelle facture</h3>
                        <p className="text-xs text-muted-foreground">Déclenché à chaque nouvelle facture</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Link className="h-8 w-8 p-1.5 bg-gray-100 rounded" />
                      <div>
                        <h3 className="font-medium">Webhook: Nouveau rendez-vous</h3>
                        <p className="text-xs text-muted-foreground">Déclenché à chaque nouveau rendez-vous</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter un webhook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <QrCode className="h-5 w-5" />
                <CardTitle>Intégrations IoT et QR Codes</CardTitle>
              </div>
              <CardDescription>Configuration des outils de diagnostic et codes QR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">QR Codes pour véhicules</h3>
                      <p className="text-sm text-muted-foreground mt-1">Génération automatique de QR codes pour chaque véhicule enregistré</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Intégration avec outils diagnostic OBD</h3>
                      <p className="text-sm text-muted-foreground mt-1">Connexion avec les appareils de diagnostic OBD2</p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Suivi des pièces par QR code</h3>
                      <p className="text-sm text-muted-foreground mt-1">Génération de QR codes pour les pièces en inventaire</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres des notifications</CardTitle>
              <CardDescription>Gérez comment et quand les notifications sont envoyées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Notifications par email</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="emailRepairStatus" className="font-normal">Changement de statut des réparations</Label>
                      </div>
                      <Switch id="emailRepairStatus" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="emailAppointmentReminder" className="font-normal">Rappel de rendez-vous</Label>
                      </div>
                      <Switch id="emailAppointmentReminder" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="emailInvoice" className="font-normal">Nouvelles factures</Label>
                      </div>
                      <Switch id="emailInvoice" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="emailInventoryAlert" className="font-normal">Alertes de stock</Label>
                      </div>
                      <Switch id="emailInventoryAlert" checked={true} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Notifications par SMS</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="smsRepairStatus" className="font-normal">Changement de statut des réparations</Label>
                      </div>
                      <Switch id="smsRepairStatus" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="smsAppointmentReminder" className="font-normal">Rappel de rendez-vous</Label>
                      </div>
                      <Switch id="smsAppointmentReminder" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="smsInvoice" className="font-normal">Nouvelles factures</Label>
                      </div>
                      <Switch id="smsInvoice" checked={false} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Notifications push</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="pushNewClient" className="font-normal">Nouveau client</Label>
                      </div>
                      <Switch id="pushNewClient" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="pushNewAppointment" className="font-normal">Nouveau rendez-vous</Label>
                      </div>
                      <Switch id="pushNewAppointment" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="pushLowStock" className="font-normal">Alerte stock bas</Label>
                      </div>
                      <Switch id="pushLowStock" checked={true} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button>Enregistrer les modifications</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Modèles de messages</CardTitle>
              <CardDescription>Personnalisez les modèles pour les communications automatiques</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-medium">Confirmation de rendez-vous</h3>
                  <p className="text-sm text-muted-foreground mt-1">Email envoyé lors de la prise de rendez-vous</p>
                </div>
                <div className="p-4 border rounded-md hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-medium">Rappel de rendez-vous</h3>
                  <p className="text-sm text-muted-foreground mt-1">SMS envoyé 24h avant le rendez-vous</p>
                </div>
                <div className="p-4 border rounded-md hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-medium">Mise à jour de réparation</h3>
                  <p className="text-sm text-muted-foreground mt-1">Email/SMS envoyé à chaque changement de statut</p>
                </div>
                <div className="p-4 border rounded-md hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-medium">Facture</h3>
                  <p className="text-sm text-muted-foreground mt-1">Email avec la facture en pièce jointe</p>
                </div>
                <div className="p-4 border rounded-md hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-medium">Rappel d'échéance</h3>
                  <p className="text-sm text-muted-foreground mt-1">Email pour rappeler les contrôles techniques</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Nouveau modèle
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Service dialog */}
      <Dialog open={isNewServiceDialogOpen} onOpenChange={setIsNewServiceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau type de service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="serviceName">Nom du service</Label>
              <Input id="serviceName" placeholder="Ex: Vidange complète" />
            </div>
            <div>
              <Label htmlFor="serviceDescription">Description</Label>
              <textarea 
                id="serviceDescription" 
                rows={3} 
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Description détaillée du service..."
              />
            </div>
            <div>
              <Label htmlFor="serviceCategory">Catégorie</Label>
              <select id="serviceCategory" className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option value="Entretien">Entretien</option>
                <option value="Freinage">Freinage</option>
                <option value="Électricité">Électricité</option>
                <option value="Diagnostic">Diagnostic</option>
                <option value="Moteur">Moteur</option>
                <option value="Pneumatiques">Pneumatiques</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="servicePrice">Prix de base (€)</Label>
                <Input id="servicePrice" type="number" min="0" step="0.01" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="serviceDuration">Durée (min)</Label>
                <Input id="serviceDuration" type="number" min="0" step="5" placeholder="60" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="serviceActive" checked={true} />
              <Label htmlFor="serviceActive" className="font-normal">Service actif</Label>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsNewServiceDialogOpen(false)}>Annuler</Button>
            <Button>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Role dialog */}
      <Dialog open={isNewRoleDialogOpen} onOpenChange={setIsNewRoleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau rôle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="roleName">Nom du rôle</Label>
              <Input id="roleName" placeholder="Ex: Chef d'atelier" />
            </div>
            <div>
              <Label htmlFor="roleDescription">Description</Label>
              <textarea 
                id="roleDescription" 
                rows={2} 
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Description du rôle et responsabilités..."
              />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Clients</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-clients-view" className="rounded border-gray-300" checked />
                      <Label htmlFor="perm-clients-view" className="font-normal text-sm">Afficher</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-clients-edit" className="rounded border-gray-300" checked />
                      <Label htmlFor="perm-clients-edit" className="font-normal text-sm">Modifier</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-clients-delete" className="rounded border-gray-300" />
                      <Label htmlFor="perm-clients-delete" className="font-normal text-sm">Supprimer</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Véhicules</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-vehicles-view" className="rounded border-gray-300" checked />
                      <Label htmlFor="perm-vehicles-view" className="font-normal text-sm">Afficher</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-vehicles-edit" className="rounded border-gray-300" checked />
                      <Label htmlFor="perm-vehicles-edit" className="font-normal text-sm">Modifier</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-vehicles-delete" className="rounded border-gray-300" />
                      <Label htmlFor="perm-vehicles-delete" className="font-normal text-sm">Supprimer</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Rendez-vous</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-appt-view" className="rounded border-gray-300" checked />
                      <Label htmlFor="perm-appt-view" className="font-normal text-sm">Afficher</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-appt-edit" className="rounded border-gray-300" checked />
                      <Label htmlFor="perm-appt-edit" className="font-normal text-sm">Modifier</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-appt-delete" className="rounded border-gray-300" />
                      <Label htmlFor="perm-appt-delete" className="font-normal text-sm">Supprimer</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Factures</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-invoices-view" className="rounded border-gray-300" checked />
                      <Label htmlFor="perm-invoices-view" className="font-normal text-sm">Afficher</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-invoices-edit" className="rounded border-gray-300" />
                      <Label htmlFor="perm-invoices-edit" className="font-normal text-sm">Modifier</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-invoices-delete" className="rounded border-gray-300" />
                      <Label htmlFor="perm-invoices-delete" className="font-normal text-sm">Supprimer</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Réparations</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-repairs-view" className="rounded border-gray-300" checked />
                      <Label htmlFor="perm-repairs-view" className="font-normal text-sm">Afficher</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-repairs-edit" className="rounded border-gray-300" checked />
                      <Label htmlFor="perm-repairs-edit" className="font-normal text-sm">Modifier</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-repairs-delete" className="rounded border-gray-300" />
                      <Label htmlFor="perm-repairs-delete" className="font-normal text-sm">Supprimer</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Inventaire</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-inventory-view" className="rounded border-gray-300" checked />
                      <Label htmlFor="perm-inventory-view" className="font-normal text-sm">Afficher</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-inventory-edit" className="rounded border-gray-300" />
                      <Label htmlFor="perm-inventory-edit" className="font-normal text-sm">Modifier</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="perm-inventory-delete" className="rounded border-gray-300" />
                      <Label htmlFor="perm-inventory-delete" className="font-normal text-sm">Supprimer</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsNewRoleDialogOpen(false)}>Annuler</Button>
            <Button>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GarageSettings;
