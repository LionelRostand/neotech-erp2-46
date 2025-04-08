
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Users, Shield, Save, Search, Check, Lock, Unlock, UserPlus } from "lucide-react";
import { toast } from "sonner";

const WebsiteSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Sample users data - in a real app, this would come from your database
  const [users, setUsers] = useState([
    { id: "1", name: "Admin User", email: "admin@example.com", role: "Admin" },
    { id: "2", name: "Manager User", email: "manager@example.com", role: "Manager" },
    { id: "3", name: "Regular User", email: "user@example.com", role: "User" },
  ]);
  
  // Sample permissions data
  const [permissions, setPermissions] = useState([
    { id: "1", userId: "1", module: "dashboard", view: true, create: true, edit: true, delete: true },
    { id: "2", userId: "1", module: "users", view: true, create: true, edit: true, delete: true },
    { id: "3", userId: "1", module: "settings", view: true, create: true, edit: true, delete: true },
    { id: "4", userId: "2", module: "dashboard", view: true, create: true, edit: true, delete: false },
    { id: "5", userId: "2", module: "users", view: true, create: true, edit: false, delete: false },
    { id: "6", userId: "2", module: "settings", view: true, create: false, edit: false, delete: false },
    { id: "7", userId: "3", module: "dashboard", view: true, create: false, edit: false, delete: false },
    { id: "8", userId: "3", module: "users", view: false, create: false, edit: false, delete: false },
    { id: "9", userId: "3", module: "settings", view: false, create: false, edit: false, delete: false },
  ]);
  
  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Mon Application",
    siteUrl: "https://example.com",
    contactEmail: "contact@example.com",
    enableNotifications: true,
    darkModeDefault: false,
    maintenanceMode: false,
  });
  
  // Handle general settings change
  const handleGeneralSettingsChange = (field: string, value: string | boolean) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle permission toggle
  const handlePermissionToggle = (userId: string, module: string, permission: string, value: boolean) => {
    setPermissions(prev => prev.map(p => {
      if (p.userId === userId && p.module === module) {
        return { ...p, [permission]: value };
      }
      return p;
    }));
  };
  
  // Save settings
  const saveSettings = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success("Paramètres enregistrés avec succès");
    }, 1000);
  };
  
  // Filter users by search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Paramètres</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Droits d'accès
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Nom du site</Label>
                  <Input 
                    id="site-name" 
                    value={generalSettings.siteName} 
                    onChange={(e) => handleGeneralSettingsChange("siteName", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-url">URL du site</Label>
                  <Input 
                    id="site-url" 
                    value={generalSettings.siteUrl} 
                    onChange={(e) => handleGeneralSettingsChange("siteUrl", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email de contact</Label>
                  <Input 
                    id="contact-email" 
                    type="email"
                    value={generalSettings.contactEmail} 
                    onChange={(e) => handleGeneralSettingsChange("contactEmail", e.target.value)}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-notifications">Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Activer les notifications par email
                      </p>
                    </div>
                    <Switch 
                      id="enable-notifications"
                      checked={generalSettings.enableNotifications}
                      onCheckedChange={(checked) => handleGeneralSettingsChange("enableNotifications", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Mode sombre par défaut</Label>
                      <p className="text-sm text-muted-foreground">
                        Afficher l'interface en mode sombre par défaut
                      </p>
                    </div>
                    <Switch 
                      id="dark-mode"
                      checked={generalSettings.darkModeDefault}
                      onCheckedChange={(checked) => handleGeneralSettingsChange("darkModeDefault", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">Mode maintenance</Label>
                      <p className="text-sm text-muted-foreground">
                        Activer le mode maintenance
                      </p>
                    </div>
                    <Switch 
                      id="maintenance-mode"
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) => handleGeneralSettingsChange("maintenanceMode", checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={saveSettings} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestion des droits d'accès</CardTitle>
                <CardDescription>
                  Configurez les droits d'accès pour chaque utilisateur
                </CardDescription>
              </div>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Ajouter un utilisateur
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Voir</TableHead>
                      <TableHead>Créer</TableHead>
                      <TableHead>Modifier</TableHead>
                      <TableHead>Supprimer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map(user => (
                      <>
                        {permissions
                          .filter(p => p.userId === user.id)
                          .map((permission, index) => (
                            <TableRow key={permission.id}>
                              {index === 0 ? (
                                <>
                                  <TableCell rowSpan={permissions.filter(p => p.userId === user.id).length} className="align-top">
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                  </TableCell>
                                  <TableCell rowSpan={permissions.filter(p => p.userId === user.id).length} className="align-top">
                                    {user.role}
                                  </TableCell>
                                </>
                              ) : null}
                              <TableCell className="font-medium capitalize">
                                {permission.module}
                              </TableCell>
                              <TableCell>
                                <Switch 
                                  checked={permission.view}
                                  onCheckedChange={(checked) => handlePermissionToggle(user.id, permission.module, "view", checked)}
                                />
                              </TableCell>
                              <TableCell>
                                <Switch 
                                  checked={permission.create}
                                  onCheckedChange={(checked) => handlePermissionToggle(user.id, permission.module, "create", checked)}
                                />
                              </TableCell>
                              <TableCell>
                                <Switch 
                                  checked={permission.edit}
                                  onCheckedChange={(checked) => handlePermissionToggle(user.id, permission.module, "edit", checked)}
                                />
                              </TableCell>
                              <TableCell>
                                <Switch 
                                  checked={permission.delete}
                                  onCheckedChange={(checked) => handlePermissionToggle(user.id, permission.module, "delete", checked)}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={saveSettings} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteSettings;
