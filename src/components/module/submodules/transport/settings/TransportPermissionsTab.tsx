
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Shield, Save, RefreshCw, User, Users } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { usePermissions } from '@/hooks/usePermissions';
import { TransportPermission, TransportUserPermission, PermissionLevel } from '../types/permission-types';

const TransportPermissionsTab: React.FC = () => {
  // Mock data for users and clients - would be fetched from API in production
  const [employees, setEmployees] = useState<{id: string; displayName: string; email: string; role: string;}[]>([
    { id: "emp1", displayName: "Jean Dupont", email: "jean.dupont@example.com", role: "Chauffeur" },
    { id: "emp2", displayName: "Marie Martin", email: "marie.martin@example.com", role: "Répartiteur" },
    { id: "emp3", displayName: "Lucas Bernard", email: "lucas.bernard@example.com", role: "Administrateur" },
  ]);
  
  const [clients, setClients] = useState<{id: string; displayName: string; email: string; type: string;}[]>([
    { id: "client1", displayName: "Entreprise ABC", email: "contact@abc.com", type: "Entreprise" },
    { id: "client2", displayName: "Sophie Petit", email: "sophie.petit@example.com", type: "Particulier" },
    { id: "client3", displayName: "Hôtel Luxe", email: "reservations@hotel-luxe.com", type: "Hôtel" },
  ]);
  
  const transportSubmodules = [
    { id: "transport-dashboard", name: "Tableau de bord" },
    { id: "transport-reservations", name: "Réservations" },
    { id: "transport-planning", name: "Planning" },
    { id: "transport-fleet", name: "Flotte" },
    { id: "transport-drivers", name: "Chauffeurs" },
    { id: "transport-geolocation", name: "Géolocalisation" },
    { id: "transport-payments", name: "Paiements" },
    { id: "transport-customer-service", name: "Service Client" },
    { id: "transport-loyalty", name: "Fidélité" },
    { id: "transport-web-booking", name: "Réservation Web" },
  ];
  
  const [employeePermissions, setEmployeePermissions] = useState<TransportUserPermission[]>([]);
  const [clientPermissions, setClientPermissions] = useState<TransportUserPermission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const { isAdmin } = usePermissions("transport");
  
  // Initialize permissions
  useEffect(() => {
    // This would be fetched from the backend in a real implementation
    const initEmployeePerms = employees.map(emp => ({
      userId: emp.id,
      permissions: transportSubmodules.map(module => ({
        moduleId: module.id,
        canView: true,
        canCreate: emp.role === "Administrateur",
        canEdit: emp.role === "Administrateur" || emp.role === "Répartiteur",
        canDelete: emp.role === "Administrateur"
      }))
    }));
    
    const initClientPerms = clients.map(client => ({
      userId: client.id,
      permissions: transportSubmodules.map(module => ({
        moduleId: module.id,
        canView: module.id === "transport-web-booking",
        canCreate: module.id === "transport-web-booking",
        canEdit: false,
        canDelete: false
      }))
    }));
    
    setEmployeePermissions(initEmployeePerms);
    setClientPermissions(initClientPerms);
  }, []);
  
  // Convert permission level to individual permissions
  const getPermissionsFromLevel = (level: PermissionLevel): { canView: boolean, canCreate: boolean, canEdit: boolean, canDelete: boolean } => {
    switch (level) {
      case 'none':
        return { canView: false, canCreate: false, canEdit: false, canDelete: false };
      case 'readonly':
        return { canView: true, canCreate: false, canEdit: false, canDelete: false };
      case 'readwrite':
        return { canView: true, canCreate: true, canEdit: true, canDelete: false };
      case 'full':
        return { canView: true, canCreate: true, canEdit: true, canDelete: true };
      default:
        return { canView: false, canCreate: false, canEdit: false, canDelete: false };
    }
  };

  // Get permission level from individual permissions
  const getPermissionLevel = (permission: TransportPermission): PermissionLevel => {
    const { canView, canCreate, canEdit, canDelete } = permission;
    
    if (canDelete) return 'full';
    if (canEdit && canCreate && canView) return 'readwrite';
    if (canView && !canCreate && !canEdit) return 'readonly';
    if (!canView) return 'none';
    
    // Custom state that doesn't fit standard levels
    return 'readonly';
  };

  // Update permissions based on selected level
  const updatePermissionLevel = (
    userType: 'employee' | 'client',
    userId: string, 
    moduleId: string, 
    level: PermissionLevel
  ) => {
    const newPermissions = getPermissionsFromLevel(level);
    
    if (userType === 'employee') {
      setEmployeePermissions(prev => prev.map(p => {
        if (p.userId === userId) {
          return {
            ...p,
            permissions: p.permissions.map(mod => {
              if (mod.moduleId === moduleId) {
                return { ...mod, ...newPermissions };
              }
              return mod;
            })
          };
        }
        return p;
      }));
    } else {
      setClientPermissions(prev => prev.map(p => {
        if (p.userId === userId) {
          return {
            ...p,
            permissions: p.permissions.map(mod => {
              if (mod.moduleId === moduleId) {
                return { ...mod, ...newPermissions };
              }
              return mod;
            })
          };
        }
        return p;
      }));
    }
  };
  
  // Set all permissions for a user
  const setAllPermissionsToLevel = (
    userType: 'employee' | 'client',
    userId: string, 
    level: PermissionLevel
  ) => {
    const newPermissions = getPermissionsFromLevel(level);
    
    if (userType === 'employee') {
      setEmployeePermissions(prev => prev.map(p => {
        if (p.userId === userId) {
          return {
            ...p,
            permissions: p.permissions.map(mod => ({
              ...mod,
              ...newPermissions
            }))
          };
        }
        return p;
      }));
    } else {
      setClientPermissions(prev => prev.map(p => {
        if (p.userId === userId) {
          return {
            ...p,
            permissions: p.permissions.map(mod => ({
              ...mod,
              ...newPermissions
            }))
          };
        }
        return p;
      }));
    }
  };
  
  // Save permissions
  const savePermissions = async () => {
    if (!isAdmin) {
      toast.error("Vous n'avez pas les droits pour effectuer cette action");
      return;
    }
    
    try {
      setSaving(true);
      
      // In a real app, this would save to a backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Droits d'accès mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des droits d'accès:", error);
      toast.error("Erreur lors de la sauvegarde des droits d'accès");
    } finally {
      setSaving(false);
    }
  };
  
  // Filter users based on search term
  const filteredEmployees = employees.filter(emp => 
    emp.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredClients = clients.filter(client => 
    client.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Common permission table component with dropdowns
  const PermissionsTable = ({ userType, users, userPermissions }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Nom</TableHead>
          <TableHead>Module</TableHead>
          <TableHead className="text-center">Niveau d'accès</TableHead>
          <TableHead className="text-center">Détails</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <React.Fragment key={user.id}>
            {/* User row with "select all" options */}
            <TableRow className="bg-muted/30">
              <TableCell className="font-medium">
                {user.displayName || user.email}
                <div className="text-xs text-muted-foreground">{user.role || user.type || "Utilisateur"}</div>
              </TableCell>
              <TableCell className="font-medium">Tous les modules</TableCell>
              <TableCell className="text-center">
                <Select 
                  onValueChange={(value) => setAllPermissionsToLevel(userType, user.id, value as PermissionLevel)}
                >
                  <SelectTrigger className="w-[180px] mx-auto">
                    <SelectValue placeholder="Choisir un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun accès</SelectItem>
                    <SelectItem value="readonly">Lecture seule</SelectItem>
                    <SelectItem value="readwrite">Lecture/Écriture</SelectItem>
                    <SelectItem value="full">Accès complet</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-around text-xs">
                  <div>Lecture</div>
                  <div>Création</div>
                  <div>Édition</div>
                  <div>Suppression</div>
                </div>
              </TableCell>
            </TableRow>

            {/* Individual module permissions */}
            {transportSubmodules.map(module => {
              const perm = userPermissions
                .find(p => p.userId === user.id)
                ?.permissions.find(p => p.moduleId === module.id);
              
              const currentLevel = perm ? getPermissionLevel(perm) : 'none';
              
              return (
                <TableRow key={`${user.id}-${module.id}`}>
                  <TableCell></TableCell>
                  <TableCell>{module.name}</TableCell>
                  <TableCell className="text-center">
                    <Select 
                      value={currentLevel}
                      onValueChange={(value) => updatePermissionLevel(userType, user.id, module.id, value as PermissionLevel)}
                    >
                      <SelectTrigger className="w-[180px] mx-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucun accès</SelectItem>
                        <SelectItem value="readonly">Lecture seule</SelectItem>
                        <SelectItem value="readwrite">Lecture/Écriture</SelectItem>
                        <SelectItem value="full">Accès complet</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-around">
                      <Checkbox 
                        checked={perm?.canView || false}
                        disabled={true}
                        className="opacity-100"
                      />
                      <Checkbox 
                        checked={perm?.canCreate || false}
                        disabled={true}
                        className="opacity-100"
                      />
                      <Checkbox 
                        checked={perm?.canEdit || false}
                        disabled={true}
                        className="opacity-100"
                      />
                      <Checkbox 
                        checked={perm?.canDelete || false}
                        disabled={true}
                        className="opacity-100"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
  
  return (
    <Card className="p-4">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span>Gestion des droits d'accès</span>
        </CardTitle>
        <CardDescription>
          Configurez qui peut accéder et modifier les données du module Transport
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex items-center justify-between mb-4">
          <Tabs defaultValue="employees" className="w-full">
            <TabsList>
              <TabsTrigger value="employees" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Employés</span>
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Clients</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex justify-end my-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  className="pl-9 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="employees">
              {loading ? (
                <div className="text-center py-8">Chargement des permissions...</div>
              ) : (
                <PermissionsTable 
                  userType="employee"
                  users={filteredEmployees} 
                  userPermissions={employeePermissions}
                />
              )}
            </TabsContent>
            
            <TabsContent value="clients">
              {loading ? (
                <div className="text-center py-8">Chargement des permissions...</div>
              ) : (
                <PermissionsTable 
                  userType="client"
                  users={filteredClients} 
                  userPermissions={clientPermissions}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={savePermissions} disabled={saving}>
            {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Enregistrer les modifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransportPermissionsTab;
