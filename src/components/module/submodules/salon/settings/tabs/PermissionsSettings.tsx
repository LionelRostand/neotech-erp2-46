
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, 
  PlusCircle, 
  Trash2, 
  Save, 
  Users,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PermissionsSettingsProps {
  onSave: () => void;
}

const PermissionsSettings: React.FC<PermissionsSettingsProps> = ({ onSave }) => {
  const { toast } = useToast();
  
  const [roles, setRoles] = useState([
    { 
      id: "1", 
      name: "Administrateur", 
      description: "Accès complet à toutes les fonctionnalités",
      permissions: {
        clients: { view: true, create: true, edit: true, delete: true },
        appointments: { view: true, create: true, edit: true, cancel: true },
        services: { view: true, create: true, edit: true, delete: true },
        products: { view: true, create: true, edit: true, delete: true },
        billing: { view: true, create: true, payment: true, refund: true },
        reports: { view: true },
        settings: { view: true, edit: true }
      }
    },
    { 
      id: "2", 
      name: "Réceptionniste", 
      description: "Gestion des clients et rendez-vous",
      permissions: {
        clients: { view: true, create: true, edit: true, delete: false },
        appointments: { view: true, create: true, edit: true, cancel: true },
        services: { view: true, create: false, edit: false, delete: false },
        products: { view: true, create: false, edit: false, delete: false },
        billing: { view: true, create: true, payment: true, refund: false },
        reports: { view: false },
        settings: { view: false, edit: false }
      }
    },
    { 
      id: "3", 
      name: "Coiffeur", 
      description: "Accès à ses rendez-vous et clients",
      permissions: {
        clients: { view: true, create: false, edit: false, delete: false },
        appointments: { view: true, create: false, edit: false, cancel: false },
        services: { view: true, create: false, edit: false, delete: false },
        products: { view: true, create: false, edit: false, delete: false },
        billing: { view: false, create: false, payment: false, refund: false },
        reports: { view: false },
        settings: { view: false, edit: false }
      }
    }
  ]);

  const [staffMembers, setStaffMembers] = useState([
    { 
      id: "1", 
      name: "Sophie Martin", 
      email: "sophie.martin@example.com",
      role: "1", // Administrateur
      active: true
    },
    { 
      id: "2", 
      name: "Thomas Bernard", 
      email: "thomas.bernard@example.com",
      role: "2", // Réceptionniste
      active: true
    },
    { 
      id: "3", 
      name: "Julie Dubois", 
      email: "julie.dubois@example.com",
      role: "3", // Coiffeur
      active: true
    },
    { 
      id: "4", 
      name: "Alexandre Petit", 
      email: "alexandre.petit@example.com",
      role: "3", // Coiffeur
      active: true
    }
  ]);

  const permissionSections = [
    { id: "clients", name: "Clients" },
    { id: "appointments", name: "Rendez-vous" },
    { id: "services", name: "Services" },
    { id: "products", name: "Produits" },
    { id: "billing", name: "Facturation" },
    { id: "reports", name: "Rapports" },
    { id: "settings", name: "Paramètres" }
  ];

  const permissionActions = {
    clients: ["view", "create", "edit", "delete"],
    appointments: ["view", "create", "edit", "cancel"],
    services: ["view", "create", "edit", "delete"],
    products: ["view", "create", "edit", "delete"],
    billing: ["view", "create", "payment", "refund"],
    reports: ["view"],
    settings: ["view", "edit"]
  };

  const getPermissionLabel = (action: string) => {
    switch(action) {
      case "view": return "Voir";
      case "create": return "Créer";
      case "edit": return "Modifier";
      case "delete": return "Supprimer";
      case "cancel": return "Annuler";
      case "payment": return "Paiements";
      case "refund": return "Remboursements";
      default: return action;
    }
  };

  const handleAddRole = () => {
    const newRole = {
      id: Date.now().toString(),
      name: "Nouveau rôle",
      description: "Description du rôle",
      permissions: {
        clients: { view: true, create: false, edit: false, delete: false },
        appointments: { view: true, create: false, edit: false, cancel: false },
        services: { view: true, create: false, edit: false, delete: false },
        products: { view: true, create: false, edit: false, delete: false },
        billing: { view: false, create: false, payment: false, refund: false },
        reports: { view: false },
        settings: { view: false, edit: false }
      }
    };
    
    setRoles([...roles, newRole]);
  };

  const updateRoleField = (roleId: string, field: 'name' | 'description', value: string) => {
    setRoles(roles.map(role => 
      role.id === roleId ? { ...role, [field]: value } : role
    ));
  };

  const updatePermission = (roleId: string, section: string, action: string, value: boolean) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [section]: {
              ...role.permissions[section as keyof typeof role.permissions],
              [action]: value
            }
          }
        };
      }
      return role;
    }));
  };

  const deleteRole = (roleId: string) => {
    // Check if role is assigned to any staff member
    const isRoleAssigned = staffMembers.some(member => member.role === roleId);
    
    if (isRoleAssigned) {
      toast({
        title: "Impossible de supprimer ce rôle",
        description: "Ce rôle est assigné à un ou plusieurs membres du personnel.",
        variant: "destructive"
      });
      return;
    }
    
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const handleAddStaffMember = () => {
    const newMember = {
      id: Date.now().toString(),
      name: "Nouveau membre",
      email: "email@example.com",
      role: roles[0]?.id || "",
      active: true
    };
    
    setStaffMembers([...staffMembers, newMember]);
  };

  const updateStaffMember = (memberId: string, field: keyof typeof staffMembers[0], value: string | boolean) => {
    setStaffMembers(staffMembers.map(member => 
      member.id === memberId ? { ...member, [field]: value } : member
    ));
  };

  const deleteStaffMember = (memberId: string) => {
    setStaffMembers(staffMembers.filter(member => member.id !== memberId));
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : "Rôle inconnu";
  };

  return (
    <div className="space-y-6">
      {/* Gestion des rôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>Rôles et Permissions</span>
          </CardTitle>
          <CardDescription>
            Définissez les différents rôles et leurs niveaux d'accès dans l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roles.map(role => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="space-y-1">
                    <Input
                      value={role.name}
                      onChange={(e) => updateRoleField(role.id, 'name', e.target.value)}
                      className="text-lg font-medium"
                    />
                    <Input
                      value={role.description}
                      onChange={(e) => updateRoleField(role.id, 'description', e.target.value)}
                      className="text-sm text-muted-foreground"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteRole(role.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {permissionSections.map(section => (
                    <div key={section.id} className="space-y-2">
                      <Label className="font-medium">{section.name}</Label>
                      <div className="space-y-1">
                        {permissionActions[section.id as keyof typeof permissionActions]?.map(action => (
                          <div key={action} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`${role.id}-${section.id}-${action}`}
                              checked={role.permissions[section.id as keyof typeof role.permissions][action as any]}
                              onCheckedChange={(checked) => updatePermission(role.id, section.id, action, !!checked)}
                            />
                            <label htmlFor={`${role.id}-${section.id}-${action}`} className="text-sm">
                              {getPermissionLabel(action)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleAddRole}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Ajouter un rôle</span>
              </Button>
              <Button onClick={onSave}>Enregistrer les rôles</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestion du personnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Gestion des Utilisateurs</span>
          </CardTitle>
          <CardDescription>
            Gérez les droits d'accès de votre personnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Actif</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Input 
                          value={member.name}
                          onChange={(e) => updateStaffMember(member.id, 'name', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="email"
                          value={member.email}
                          onChange={(e) => updateStaffMember(member.id, 'email', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={member.role}
                          onChange={(e) => updateStaffMember(member.id, 'role', e.target.value)}
                        >
                          {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={member.active}
                          onCheckedChange={(checked) => updateStaffMember(member.id, 'active', checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteStaffMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleAddStaffMember}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Ajouter un utilisateur</span>
              </Button>
              <Button onClick={onSave}>Enregistrer les utilisateurs</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <span>Paramètres Système</span>
          </CardTitle>
          <CardDescription>
            Paramètres globaux du système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="salon-name">Nom du salon</Label>
                <Input id="salon-name" defaultValue="Mon Salon de Coiffure" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salon-email">Email du salon</Label>
                <Input id="salon-email" type="email" defaultValue="contact@monsalon.fr" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salon-phone">Téléphone</Label>
                <Input id="salon-phone" defaultValue="01 23 45 67 89" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salon-address">Adresse</Label>
                <Input id="salon-address" defaultValue="123 rue du Salon, 75000 Paris" />
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label>Options générales</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="option-sms" defaultChecked />
                  <label htmlFor="option-sms">Activer les notifications par SMS</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="option-email" defaultChecked />
                  <label htmlFor="option-email">Activer les notifications par email</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="option-auto-confirm" defaultChecked />
                  <label htmlFor="option-auto-confirm">Confirmation automatique des rendez-vous</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="option-auto-remind" defaultChecked />
                  <label htmlFor="option-auto-remind">Rappel automatique 24h avant le rendez-vous</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="option-online-booking" defaultChecked />
                  <label htmlFor="option-online-booking">Activer la réservation en ligne</label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={onSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Enregistrer les paramètres</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsSettings;
