
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Settings,
  Users,
  Edit,
  Trash,
  Plus,
  Check,
  Save,
  FileText,
  User,
  Bell,
  Shield,
  FormInput,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Type pour les champs personnalisés
interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
  section: 'personal' | 'professional' | 'administrative';
  enabled: boolean;
}

// Type pour les utilisateurs et leurs droits
interface UserPermission {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

const EmployeesSettings = () => {
  const [activeTab, setActiveTab] = useState('customFields');
  
  // État pour les champs personnalisés
  const [customFields, setCustomFields] = useState<CustomField[]>([
    {
      id: 'field-1',
      name: 'Numéro de sécurité sociale',
      type: 'text',
      required: true,
      section: 'administrative',
      enabled: true,
    },
    {
      id: 'field-2',
      name: 'Compétences',
      type: 'text',
      required: false,
      section: 'professional',
      enabled: true,
    },
    {
      id: 'field-3',
      name: 'Date de naissance',
      type: 'date',
      required: true,
      section: 'personal',
      enabled: true,
    },
    {
      id: 'field-4',
      name: 'Situation familiale',
      type: 'select',
      required: false,
      options: ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf/Veuve', 'Pacsé(e)'],
      section: 'personal',
      enabled: true,
    },
    {
      id: 'field-5',
      name: 'Permis de conduire',
      type: 'checkbox',
      required: false,
      section: 'personal',
      enabled: true,
    },
    {
      id: 'field-6',
      name: 'Années d\'expérience',
      type: 'number',
      required: false,
      section: 'professional',
      enabled: false,
    },
  ]);
  
  // État pour l'édition d'un champ personnalisé
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  
  // État pour les utilisateurs et leurs droits
  const [users, setUsers] = useState<UserPermission[]>([
    {
      id: 'user-1',
      name: 'Jean Martin',
      email: 'jean.martin@example.com',
      role: 'Administrateur RH',
      permissions: {
        view: true,
        create: true,
        edit: true,
        delete: true,
      },
    },
    {
      id: 'user-2',
      name: 'Marie Dubois',
      email: 'marie.dubois@example.com',
      role: 'Responsable RH',
      permissions: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
    },
    {
      id: 'user-3',
      name: 'Pierre Lefebvre',
      email: 'pierre.lefebvre@example.com',
      role: 'Assistant RH',
      permissions: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
    },
    {
      id: 'user-4',
      name: 'Sophie Moreau',
      email: 'sophie.moreau@example.com',
      role: 'Directeur',
      permissions: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
    },
    {
      id: 'user-5',
      name: 'Thomas Girard',
      email: 'thomas.girard@example.com',
      role: 'Responsable département',
      permissions: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
    },
  ]);

  // Fonctions pour gérer les champs personnalisés
  const handleEditField = (field: CustomField) => {
    setEditingField({ ...field });
    setShowFieldDialog(true);
  };

  const handleDeleteField = (fieldId: string) => {
    setCustomFields(customFields.filter(field => field.id !== fieldId));
    toast({
      title: "Champ supprimé",
      description: "Le champ personnalisé a été supprimé avec succès.",
    });
  };

  const handleToggleField = (fieldId: string) => {
    setCustomFields(customFields.map(field => 
      field.id === fieldId ? { ...field, enabled: !field.enabled } : field
    ));
  };

  const handleSaveField = () => {
    if (!editingField) return;
    
    if (editingField.id) {
      // Mise à jour d'un champ existant
      setCustomFields(customFields.map(field => 
        field.id === editingField.id ? editingField : field
      ));
      toast({
        title: "Champ mis à jour",
        description: "Le champ personnalisé a été mis à jour avec succès.",
      });
    } else {
      // Création d'un nouveau champ
      const newField = {
        ...editingField,
        id: `field-${customFields.length + 1}`,
        enabled: true,
      };
      setCustomFields([...customFields, newField]);
      toast({
        title: "Champ créé",
        description: "Le nouveau champ personnalisé a été créé avec succès.",
      });
    }
    
    setEditingField(null);
    setShowFieldDialog(false);
  };

  const handleNewField = () => {
    setEditingField({
      id: '',
      name: '',
      type: 'text',
      required: false,
      section: 'personal',
      enabled: true,
    });
    setShowFieldDialog(true);
  };

  // Fonctions pour gérer les droits d'accès
  const handleTogglePermission = (userId: string, permission: 'view' | 'create' | 'edit' | 'delete') => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          permissions: {
            ...user.permissions,
            [permission]: !user.permissions[permission],
          },
        };
      }
      return user;
    }));
  };

  const handleSetAllPermissions = (userId: string, value: boolean) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          permissions: {
            view: value,
            create: value,
            edit: value,
            delete: value,
          },
        };
      }
      return user;
    }));
  };

  // Sauvegarde des paramètres
  const handleSaveSettings = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Les paramètres ont été enregistrés avec succès.",
    });
  };

  // Rendu des sections et leurs champs
  const renderFieldsBySection = (section: string) => {
    const filteredFields = customFields.filter(field => field.section === section);
    
    if (filteredFields.length === 0) {
      return (
        <div className="text-gray-500 text-center py-4">
          Aucun champ personnalisé dans cette section
        </div>
      );
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du champ</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-center">Obligatoire</TableHead>
            <TableHead className="text-center">Statut</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFields.map(field => (
            <TableRow key={field.id}>
              <TableCell>{field.name}</TableCell>
              <TableCell>
                {field.type === 'text' && 'Texte'}
                {field.type === 'number' && 'Nombre'}
                {field.type === 'date' && 'Date'}
                {field.type === 'select' && 'Liste déroulante'}
                {field.type === 'checkbox' && 'Case à cocher'}
              </TableCell>
              <TableCell className="text-center">
                {field.required ? (
                  <Check className="h-4 w-4 mx-auto text-green-500" />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <button 
                    onClick={() => handleToggleField(field.id)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${field.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${field.enabled ? 'translate-x-6' : ''}`} />
                  </button>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditField(field)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteField(field.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paramètres Employés</h1>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customFields" className="flex items-center gap-2">
            <FormInput className="h-4 w-4" />
            <span>Champs personnalisés</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Droits d'accès</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet des champs personnalisés */}
        <TabsContent value="customFields" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Champs personnalisés</CardTitle>
                <CardDescription>
                  Configurez les champs personnalisés pour les fiches employés
                </CardDescription>
              </div>
              <Button onClick={handleNewField} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un champ
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
                {renderFieldsBySection('personal')}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Informations professionnelles</h3>
                {renderFieldsBySection('professional')}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Informations administratives</h3>
                {renderFieldsBySection('administrative')}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet des droits d'accès */}
        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Gestion des droits d'accès</CardTitle>
              <CardDescription>
                Attribuez les droits d'accès aux modules employés pour chaque utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-center">Visualisation</TableHead>
                    <TableHead className="text-center">Création</TableHead>
                    <TableHead className="text-center">Modification</TableHead>
                    <TableHead className="text-center">Suppression</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={user.permissions.view}
                          onCheckedChange={() => handleTogglePermission(user.id, 'view')}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={user.permissions.create}
                          onCheckedChange={() => handleTogglePermission(user.id, 'create')}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={user.permissions.edit}
                          onCheckedChange={() => handleTogglePermission(user.id, 'edit')}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={user.permissions.delete}
                          onCheckedChange={() => handleTogglePermission(user.id, 'delete')}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Select
                            onValueChange={(value) => {
                              if (value === "all") handleSetAllPermissions(user.id, true);
                              if (value === "none") handleSetAllPermissions(user.id, false);
                              if (value === "view") {
                                handleSetAllPermissions(user.id, false);
                                handleTogglePermission(user.id, 'view');
                              }
                            }}
                          >
                            <SelectTrigger className="h-8 w-[120px]">
                              <SelectValue placeholder="Actions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous les droits</SelectItem>
                              <SelectItem value="none">Aucun droit</SelectItem>
                              <SelectItem value="view">Lecture seule</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet des notifications */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Paramètres de notifications</CardTitle>
              <CardDescription>
                Configurez les notifications automatiques pour le module Employés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-start gap-2">
                    <Bell className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Contrats arrivant à échéance</h3>
                      <p className="text-sm text-gray-500">Notification envoyée X jours avant l'expiration d'un contrat</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" className="w-20" defaultValue="15" />
                    <Label>jours</Label>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-start gap-2">
                    <Bell className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Périodes d'essai</h3>
                      <p className="text-sm text-gray-500">Notification envoyée X jours avant la fin d'une période d'essai</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" className="w-20" defaultValue="7" />
                    <Label>jours</Label>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-start gap-2">
                    <Bell className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Anniversaires</h3>
                      <p className="text-sm text-gray-500">Notification pour les anniversaires des employés</p>
                    </div>
                  </div>
                  <Checkbox defaultChecked />
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-start gap-2">
                    <Bell className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Documents expirés</h3>
                      <p className="text-sm text-gray-500">Notification pour les documents d'identité ou permis expirés</p>
                    </div>
                  </div>
                  <Checkbox defaultChecked />
                </div>

                <div className="flex items-center justify-between pb-4">
                  <div className="flex items-start gap-2">
                    <Bell className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Évaluations annuelles</h3>
                      <p className="text-sm text-gray-500">Notification X jours avant la date prévue d'évaluation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="number" className="w-20" defaultValue="30" />
                    <Label>jours</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog d'édition de champ personnalisé */}
      <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingField?.id ? 'Modifier le champ' : 'Ajouter un nouveau champ'}
            </DialogTitle>
            <DialogDescription>
              Configurez les propriétés du champ personnalisé.
            </DialogDescription>
          </DialogHeader>
          
          {editingField && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nom</Label>
                <Input
                  id="name"
                  value={editingField.name}
                  onChange={(e) => setEditingField({ ...editingField, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select
                  value={editingField.type}
                  onValueChange={(value: any) => setEditingField({ ...editingField, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texte</SelectItem>
                    <SelectItem value="number">Nombre</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Liste déroulante</SelectItem>
                    <SelectItem value="checkbox">Case à cocher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="section" className="text-right">Section</Label>
                <Select
                  value={editingField.section}
                  onValueChange={(value: any) => setEditingField({ ...editingField, section: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Informations personnelles</SelectItem>
                    <SelectItem value="professional">Informations professionnelles</SelectItem>
                    <SelectItem value="administrative">Informations administratives</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {editingField.type === 'select' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="options" className="text-right">Options</Label>
                  <Input
                    id="options"
                    placeholder="Valeur1, Valeur2, Valeur3"
                    value={editingField.options?.join(', ') || ''}
                    onChange={(e) => setEditingField({ 
                      ...editingField, 
                      options: e.target.value.split(',').map(opt => opt.trim()) 
                    })}
                    className="col-span-3"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="required" className="text-right">Obligatoire</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="required"
                    checked={editingField.required}
                    onCheckedChange={(checked) => 
                      setEditingField({ ...editingField, required: checked as boolean })
                    }
                  />
                  <label htmlFor="required">Ce champ est obligatoire</label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFieldDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveField}>
              {editingField?.id ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesSettings;
