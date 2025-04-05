
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Settings,
  RefreshCw,
  Users,
  Database,
  Globe,
  Mail,
  Bell,
  Filter,
  PlusCircle,
  Save,
  Trash2
} from 'lucide-react';
import { toast } from "sonner";
import SyncSettingsForm from '../../submodules/companies/settings/SyncSettingsForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CrmGeneralSettings, CrmLeadSource } from './types/crm-types';

const CrmSettings: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState<CrmGeneralSettings>({
    companyName: 'NeoTech',
    defaultCurrency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    leadExpirationDays: 30,
    opportunityExpirationDays: 90,
    defaultLanguage: 'fr',
    emailNotifications: true,
    smsNotifications: false,
    reminderNotifications: true,
  });

  const [leadSources, setLeadSources] = useState<CrmLeadSource[]>([
    { id: '1', name: 'Site web', isActive: true, description: 'Leads provenant du site web' },
    { id: '2', name: 'LinkedIn', isActive: true, description: 'Leads provenant de LinkedIn' },
    { id: '3', name: 'Salon', isActive: true, description: 'Leads provenant des salons' },
    { id: '4', name: 'Recommandation', isActive: true, description: 'Leads provenant de recommandations' },
    { id: '5', name: 'Appel entrant', isActive: true, description: 'Leads provenant d\'appels entrants' },
    { id: '6', name: 'Email', isActive: true, description: 'Leads provenant d\'emails' },
  ]);

  const [newSource, setNewSource] = useState<{name: string, description: string}>({ 
    name: '', 
    description: '' 
  });

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setGeneralSettings(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };

  const handleSaveGeneralSettings = () => {
    // In a real app, you would save to backend here
    console.log('Saving general settings:', generalSettings);
    toast.success("Paramètres généraux enregistrés avec succès");
  };

  const handleAddLeadSource = () => {
    if (newSource.name.trim() === '') {
      toast.error("Le nom de la source ne peut pas être vide");
      return;
    }

    const newId = (leadSources.length + 1).toString();
    setLeadSources(prev => [
      ...prev, 
      { id: newId, name: newSource.name, description: newSource.description, isActive: true }
    ]);
    setNewSource({ name: '', description: '' });
    toast.success("Source ajoutée avec succès");
  };

  const toggleLeadSourceActive = (id: string) => {
    setLeadSources(prev => 
      prev.map(source => 
        source.id === id 
          ? { ...source, isActive: !source.isActive } 
          : source
      )
    );
  };

  const handleDeleteLeadSource = (id: string) => {
    setLeadSources(prev => prev.filter(source => source.id !== id));
    toast.success("Source supprimée avec succès");
  };

  const users = [
    { id: 'u1', name: 'Thomas Dubois', email: 'thomas@neotech.com', role: 'admin' },
    { id: 'u2', name: 'Julie Martin', email: 'julie@neotech.com', role: 'manager' },
    { id: 'u3', name: 'Alexandre Chen', email: 'alex@neotech.com', role: 'user' },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Paramètres CRM</h2>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              Général
            </TabsTrigger>
            <TabsTrigger value="sources">
              <Filter className="h-4 w-4 mr-2" />
              Sources de prospects
            </TabsTrigger>
            <TabsTrigger value="sync">
              <RefreshCw className="h-4 w-4 mr-2" />
              Synchronisation
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="database">
              <Database className="h-4 w-4 mr-2" />
              Base de données
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <Users className="h-4 w-4 mr-2" />
              Permissions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Paramètres Généraux</CardTitle>
                <CardDescription>
                  Configurez les paramètres généraux de votre CRM.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nom de l'entreprise</Label>
                    <Input 
                      id="companyName"
                      name="companyName"
                      value={generalSettings.companyName}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                    <Select 
                      defaultValue={generalSettings.defaultCurrency} 
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, defaultCurrency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dollar US ($)</SelectItem>
                        <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                        <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Format de date</Label>
                    <Select 
                      defaultValue={generalSettings.dateFormat} 
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, dateFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">JJ/MM/AAAA</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/JJ/AAAA</SelectItem>
                        <SelectItem value="YYYY-MM-DD">AAAA-MM-JJ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                    <Select 
                      defaultValue={generalSettings.defaultLanguage} 
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, defaultLanguage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">Anglais</SelectItem>
                        <SelectItem value="es">Espagnol</SelectItem>
                        <SelectItem value="de">Allemand</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="leadExpirationDays">Expiration des leads (jours)</Label>
                    <Input 
                      id="leadExpirationDays"
                      name="leadExpirationDays"
                      type="number"
                      value={generalSettings.leadExpirationDays}
                      onChange={handleNumberChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="opportunityExpirationDays">Expiration des opportunités (jours)</Label>
                    <Input 
                      id="opportunityExpirationDays"
                      name="opportunityExpirationDays"
                      type="number"
                      value={generalSettings.opportunityExpirationDays}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveGeneralSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les paramètres
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sources">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Sources de prospects</CardTitle>
                <CardDescription>
                  Configurez les sources de prospects disponibles dans votre CRM.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Ajouter une nouvelle source</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sourceName">Nom</Label>
                      <Input 
                        id="sourceName"
                        value={newSource.name}
                        onChange={(e) => setNewSource(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Événement marketing"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sourceDescription">Description</Label>
                      <Input 
                        id="sourceDescription"
                        value={newSource.description}
                        onChange={(e) => setNewSource(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Ex: Leads issus d'événements marketing"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddLeadSource}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter cette source
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leadSources.map((source) => (
                        <TableRow key={source.id}>
                          <TableCell className="font-medium">{source.name}</TableCell>
                          <TableCell>{source.description}</TableCell>
                          <TableCell>
                            {source.isActive ? (
                              <Badge className="bg-green-500">Active</Badge>
                            ) : (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toggleLeadSourceActive(source.id)}
                              >
                                {source.isActive ? 'Désactiver' : 'Activer'}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteLeadSource(source.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sync">
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-6">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium">Synchronisation avec des services externes</h3>
              </div>

              <SyncSettingsForm 
                onSubmit={async (settings) => {
                  console.log('Saving CRM sync settings:', settings);
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  toast.success("Configuration de synchronisation enregistrée");
                }}
                defaultValues={{
                  syncFrequency: 'daily',
                  syncContacts: true,
                  syncCompanies: true,
                  syncDeals: true,
                  lastSyncedAt: new Date().toISOString()
                }}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Paramètres de notifications</CardTitle>
                <CardDescription>
                  Configurez les notifications envoyées par le CRM.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Notifications par email</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Nouveau prospect</p>
                        <p className="text-sm text-muted-foreground">Recevoir une notification à la création d'un prospect</p>
                      </div>
                      <Switch 
                        checked={generalSettings.emailNotifications}
                        onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Nouvelle opportunité</p>
                        <p className="text-sm text-muted-foreground">Recevoir une notification à la création d'une opportunité</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Opportunité gagnée</p>
                        <p className="text-sm text-muted-foreground">Recevoir une notification quand une opportunité est gagnée</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Opportunité perdue</p>
                        <p className="text-sm text-muted-foreground">Recevoir une notification quand une opportunité est perdue</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Notifications SMS</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Activer les notifications SMS</p>
                        <p className="text-sm text-muted-foreground">Envoyer des notifications par SMS</p>
                      </div>
                      <Switch 
                        checked={generalSettings.smsNotifications}
                        onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, smsNotifications: checked }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Notifications de rappels</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Activer les rappels</p>
                        <p className="text-sm text-muted-foreground">Envoyer des rappels pour les tâches et rendez-vous</p>
                      </div>
                      <Switch 
                        checked={generalSettings.reminderNotifications}
                        onCheckedChange={(checked) => setGeneralSettings(prev => ({ ...prev, reminderNotifications: checked }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveGeneralSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les paramètres
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="database">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Base de données CRM</CardTitle>
                <CardDescription>
                  Gérez les données de votre CRM et effectuez des opérations de maintenance.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Exporter les données</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline">
                        Exporter les prospects (CSV)
                      </Button>
                      <Button variant="outline">
                        Exporter les clients (CSV)
                      </Button>
                      <Button variant="outline">
                        Exporter les opportunités (CSV)
                      </Button>
                      <Button variant="outline">
                        Exporter toutes les données (JSON)
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Importer des données</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline">
                        Importer des prospects
                      </Button>
                      <Button variant="outline">
                        Importer des clients
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="font-medium">Maintenance</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline">
                        Nettoyer les doublons
                      </Button>
                      <Button variant="outline">
                        Vérifier l'intégrité des données
                      </Button>
                      <Button variant="destructive">
                        Archiver les prospects inactifs
                      </Button>
                      <Button variant="destructive">
                        Purger les données supprimées
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="permissions">
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Gestion des permissions</CardTitle>
                <CardDescription>
                  Configurez les droits d'accès aux différentes fonctionnalités du CRM pour vos utilisateurs.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Prospects</TableHead>
                        <TableHead>Opportunités</TableHead>
                        <TableHead>Clients</TableHead>
                        <TableHead>Rapports</TableHead>
                        <TableHead>Paramètres</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={user.role}>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Sélectionner un rôle" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="user">Utilisateur</SelectItem>
                                <SelectItem value="guest">Invité</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={user.role === 'admin' || user.role === 'manager' ? 'all' : 'read'}>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Tout</SelectItem>
                                <SelectItem value="edit">Modifier</SelectItem>
                                <SelectItem value="read">Lecture</SelectItem>
                                <SelectItem value="none">Aucun</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={user.role === 'admin' || user.role === 'manager' ? 'all' : 'read'}>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Tout</SelectItem>
                                <SelectItem value="edit">Modifier</SelectItem>
                                <SelectItem value="read">Lecture</SelectItem>
                                <SelectItem value="none">Aucun</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={user.role === 'admin' ? 'all' : user.role === 'manager' ? 'edit' : 'read'}>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Tout</SelectItem>
                                <SelectItem value="edit">Modifier</SelectItem>
                                <SelectItem value="read">Lecture</SelectItem>
                                <SelectItem value="none">Aucun</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={user.role === 'admin' || user.role === 'manager' ? 'read' : 'none'}>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="read">Lecture</SelectItem>
                                <SelectItem value="none">Aucun</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={user.role === 'admin' ? 'all' : 'none'}>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Tout</SelectItem>
                                <SelectItem value="none">Aucun</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="space-y-3 pt-4">
                  <Button className="mr-2">
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les permissions
                  </Button>
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un utilisateur
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CrmSettings;
