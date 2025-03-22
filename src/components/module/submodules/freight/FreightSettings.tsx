
import React, { useState } from 'react';
import { Settings, Lock, Globe, Database, Bell, FileText, Mail, CreditCard, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

const FreightSettings: React.FC = () => {
  const [staffRoles, setStaffRoles] = useState([
    { id: "1", name: "Administrateur" },
    { id: "2", name: "Manager" },
    { id: "3", name: "Opérateur" },
    { id: "4", name: "Comptable" },
    { id: "5", name: "Lecture seule" }
  ]);

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { 
      id: "1", 
      name: "Jean Dupont", 
      email: "jean@neotech-transport.com",
      role: "1", // Administrateur
      active: true
    },
    { 
      id: "2", 
      name: "Marie Martin", 
      email: "marie@neotech-transport.com",
      role: "2", // Réceptionniste
      active: true
    },
    { 
      id: "3", 
      name: "Pierre Dubois", 
      email: "pierre@neotech-transport.com",
      role: "3", // Opérateur
      active: true
    },
    { 
      id: "4", 
      name: "Sophie Legrand", 
      email: "sophie@neotech-transport.com",
      role: "3", // Comptable
      active: true
    }
  ]);

  // Add state for editing modal
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [memberToRevoke, setMemberToRevoke] = useState<StaffMember | null>(null);
  
  // Handle edit user
  const handleEditUser = (member: StaffMember) => {
    setEditingMember({...member});
    setIsEditModalOpen(true);
  };
  
  // Handle save edited user
  const handleSaveEditedUser = () => {
    if (editingMember) {
      setStaffMembers(staffMembers.map(member => 
        member.id === editingMember.id ? editingMember : member
      ));
      setIsEditModalOpen(false);
      toast.success(`Les informations de ${editingMember.name} ont été mises à jour`);
    }
  };
  
  // Handle revoke access
  const handleRevokeAccess = (member: StaffMember) => {
    setMemberToRevoke(member);
    setIsRevokeModalOpen(true);
  };
  
  // Confirm revoke access
  const confirmRevokeAccess = () => {
    if (memberToRevoke) {
      setStaffMembers(staffMembers.filter(member => member.id !== memberToRevoke.id));
      setIsRevokeModalOpen(false);
      toast.success(`L'accès de ${memberToRevoke.name} a été révoqué`);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les informations générales du module de gestion de fret
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations de l'entreprise</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nom de l'entreprise</Label>
                    <Input id="company-name" defaultValue="NeoTech Transport" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-id">Numéro SIREN</Label>
                    <Input id="company-id" defaultValue="123456789" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vat-number">Numéro TVA</Label>
                    <Input id="vat-number" defaultValue="FR12345678900" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transport-license">Licence de transport</Label>
                    <Input id="transport-license" defaultValue="LT-2023-12345" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Coordonnées</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" defaultValue="123 Rue de la Logistique" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input id="city" defaultValue="Paris" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Code postal</Label>
                    <Input id="postal-code" defaultValue="75001" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Select defaultValue="france">
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Sélectionner un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="france">France</SelectItem>
                        <SelectItem value="belgium">Belgique</SelectItem>
                        <SelectItem value="switzerland">Suisse</SelectItem>
                        <SelectItem value="germany">Allemagne</SelectItem>
                        <SelectItem value="spain">Espagne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email de contact</Label>
                    <Input id="email" type="email" defaultValue="contact@neotech-transport.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" defaultValue="+33 1 23 45 67 89" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Préférences système</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="unit-system">Système d'unités</Label>
                    <Select defaultValue="metric">
                      <SelectTrigger id="unit-system" className="w-[180px]">
                        <SelectValue placeholder="Système d'unités" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Métrique (kg, cm)</SelectItem>
                        <SelectItem value="imperial">Impérial (lb, in)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="currency">Devise par défaut</Label>
                    <Select defaultValue="eur">
                      <SelectTrigger id="currency" className="w-[180px]">
                        <SelectValue placeholder="Devise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eur">Euro (€)</SelectItem>
                        <SelectItem value="usd">Dollar US ($)</SelectItem>
                        <SelectItem value="gbp">Livre Sterling (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="date-format">Format de date</Label>
                    <Select defaultValue="dmy">
                      <SelectTrigger id="date-format" className="w-[180px]">
                        <SelectValue placeholder="Format de date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dmy">JJ/MM/AAAA</SelectItem>
                        <SelectItem value="mdy">MM/JJ/AAAA</SelectItem>
                        <SelectItem value="ymd">AAAA-MM-JJ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-numbering">Numérotation automatique</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="auto-numbering-toggle" className="text-sm text-gray-500">
                        Activer pour les nouvelles expéditions
                      </Label>
                      <Switch id="auto-numbering-toggle" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Enregistrer les paramètres</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notifications</CardTitle>
              <CardDescription>
                Configurez les notifications pour les événements liés au fret
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications par email</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <Label>Nouvelle expédition créée</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <Label>Changement de statut d'expédition</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <Label>Retard d'expédition</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <Label>Nouvelle facture</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <Label>Rappel de paiement</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications système</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-gray-500" />
                        <Label>Alertes de tableau de bord</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-gray-500" />
                        <Label>Rapports quotidiens</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-gray-500" />
                        <Label>Alertes de maintenance</Label>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Configuration des destinataires</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email administrateur</Label>
                    <Input id="admin-email" type="email" defaultValue="admin@neotech-transport.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cc-email">Emails en copie (CC)</Label>
                    <Input id="cc-email" type="text" defaultValue="operations@neotech-transport.com, support@neotech-transport.com" />
                    <p className="text-xs text-gray-500">Séparez les adresses email par des virgules</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Enregistrer les paramètres</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations</CardTitle>
              <CardDescription>
                Configurez les intégrations avec d'autres systèmes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">APIs et services tiers</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        <Globe className="h-6 w-6 mr-3 text-blue-500" />
                        <div>
                          <h4 className="font-medium">API de suivi des transporteurs</h4>
                          <p className="text-sm text-gray-500">Intégration avec les services de suivi des transporteurs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 font-medium">Connecté</span>
                        <Button variant="outline" size="sm">Configurer</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        <CreditCard className="h-6 w-6 mr-3 text-purple-500" />
                        <div>
                          <h4 className="font-medium">Passerelle de paiement</h4>
                          <p className="text-sm text-gray-500">Pour les paiements en ligne des clients</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">Déconnecté</span>
                        <Button variant="outline" size="sm">Connecter</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-6 w-6 mr-3 text-amber-500" />
                        <div>
                          <h4 className="font-medium">Système de comptabilité</h4>
                          <p className="text-sm text-gray-500">Synchronisation avec votre logiciel comptable</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 font-medium">Connecté</span>
                        <Button variant="outline" size="sm">Configurer</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        <Database className="h-6 w-6 mr-3 text-red-500" />
                        <div>
                          <h4 className="font-medium">Système ERP</h4>
                          <p className="text-sm text-gray-500">Intégration avec votre système de gestion</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">Déconnecté</span>
                        <Button variant="outline" size="sm">Connecter</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Paramètres API</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">Clé API</Label>
                    <div className="flex">
                      <Input id="api-key" type="password" value="•••••••••••••••••••••••••" readOnly className="flex-1" />
                      <Button variant="outline" className="ml-2">Afficher</Button>
                      <Button variant="outline" className="ml-2">Régénérer</Button>
                    </div>
                    <p className="text-xs text-gray-500">Utilisée pour les intégrations avec d'autres systèmes</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">URL Webhook</Label>
                    <div className="flex">
                      <Input id="webhook-url" defaultValue="https://api.neotech-transport.com/webhooks/freight" className="flex-1" />
                      <Button variant="outline" className="ml-2">Copier</Button>
                    </div>
                    <p className="text-xs text-gray-500">Pour recevoir des notifications d'événements</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Enregistrer les paramètres</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Gérez les accès et permissions des utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Rôles utilisateurs</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left p-3">Fonctionnalité</th>
                          <th className="text-center p-3">Administrateur</th>
                          <th className="text-center p-3">Manager</th>
                          <th className="text-center p-3">Opérateur</th>
                          <th className="text-center p-3">Comptable</th>
                          <th className="text-center p-3">Lecture seule</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3">Tableau de bord</td>
                          <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                          <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                          <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                          <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                          <td className="text-center p-3"><Switch defaultChecked disabled /></td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">Créer expédition</td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch /></td>
                          <td className="text-center p-3"><Switch /></td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">Modifier expédition</td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch /></td>
                          <td className="text-center p-3"><Switch /></td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">Supprimer expédition</td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch /></td>
                          <td className="text-center p-3"><Switch /></td>
                          <td className="text-center p-3"><Switch /></td>
                          <td className="text-center p-3"><Switch /></td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">Gérer transporteurs</td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch /></td>
                          <td className="text-center p-3"><Switch /></td>
                          <td className="text-center p-3"><Switch /></td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">Accès tarification</td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch /></td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch /></td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">Paramètres</td>
                          <td className="text-center p-3"><Switch defaultChecked /></td>
                          <td className="text-center p-3"><Switch /></td>
                          <td className="text-center p-3"><Switch /></td>
                          <td className="text-center p-3"><Switch /></td>
                          <td className="text-center p-3"><Switch /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau rôle
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Utilisateurs assignés</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left p-3">Utilisateur</th>
                          <th className="text-left p-3">Email</th>
                          <th className="text-left p-3">Rôle</th>
                          <th className="text-right p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffMembers.map(member => (
                          <tr key={member.id} className="border-b">
                            <td className="p-3">{member.name}</td>
                            <td className="p-3">{member.email}</td>
                            <td className="p-3">{member.role === "1" ? "Administrateur" : 
                                                member.role === "2" ? "Manager" : 
                                                member.role === "3" ? "Opérateur" : "Comptable"}</td>
                            <td className="text-right p-3">
                              <Button variant="ghost" size="sm" onClick={() => handleEditUser(member)}>Modifier</Button>
                              <Button variant="ghost" size="sm" onClick={() => handleRevokeAccess(member)}>Révoquer</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Inviter un utilisateur
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres avancés</CardTitle>
              <CardDescription>
                Configuration avancée du module de gestion de fret
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Stockage et rétention des données</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Conservation des documents (années)</Label>
                      <Select defaultValue="5">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 an</SelectItem>
                          <SelectItem value="3">3 ans</SelectItem>
                          <SelectItem value="5">5 ans</SelectItem>
                          <SelectItem value="7">7 ans</SelectItem>
                          <SelectItem value="10">10 ans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Archivage automatique</Label>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Purge des données expirées</Label>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Sauvegarde automatique</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sécurité</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Authentification à deux facteurs</Label>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Délai d'expiration de session (minutes)</Label>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="120">120 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Journalisation des activités</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Gestion du système</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <h4 className="font-medium text-amber-800 mb-2">Actions système</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">Vider le cache</Button>
                        <Button variant="outline" size="sm">Vérifier les erreurs</Button>
                        <Button variant="outline" size="sm">Reconstruire les index</Button>
                        <Button variant="outline" size="sm">Exporter configuration</Button>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <h4 className="font-medium text-red-800 mb-2">Zone dangereuse</h4>
                      <p className="text-sm text-red-600 mb-4">
                        Ces actions sont irréversibles. Procédez avec précaution.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="destructive" size="sm">Réinitialiser aux paramètres d'usine</Button>
                        <Button variant="destructive" size="sm">Supprimer toutes les données</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Enregistrer les paramètres</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier un utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations et permissions de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          
          {editingMember && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Nom</Label>
                <Input 
                  id="user-name" 
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input 
                  id="user-email" 
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-role">Rôle</Label>
                <Select 
                  value={editingMember.role}
                  onValueChange={(value) => setEditingMember({...editingMember, role: value})}
                >
                  <SelectTrigger id="user-role">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Administrateur</SelectItem>
                    <SelectItem value="2">Manager</SelectItem>
                    <SelectItem value="3">Opérateur</SelectItem>
                    <SelectItem value="4">Comptable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="user-active" 
                  checked={editingMember.active}
                  onCheckedChange={(checked) => setEditingMember({...editingMember, active: checked})}
                />
                <Label htmlFor="user-active">Utilisateur actif</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveEditedUser}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Access Modal */}
      <Dialog open={isRevokeModalOpen} onOpenChange={setIsRevokeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Révoquer l'accès</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir révoquer l'accès de cet utilisateur ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          
          {memberToRevoke && (
            <div className="py-4">
              <div className="p-3 border rounded-md bg-gray-50">
                <p><strong>Utilisateur :</strong> {memberToRevoke.name}</p>
                <p><strong>Email :</strong> {memberToRevoke.email}</p>
                <p><strong>Rôle :</strong> {
                  memberToRevoke.role === "1" ? "Administrateur" : 
                  memberToRevoke.role === "2" ? "Manager" : 
                  memberToRevoke.role === "3" ? "Opérateur" : "Comptable"
                }</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevokeModalOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmRevokeAccess}>Révoquer l'accès</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FreightSettings;
