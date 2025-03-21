
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Settings, 
  PlusCircle, 
  Trash2, 
  Save, 
  Users, 
  FileText, 
  Tag, 
  Calendar,
  Percent,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pricing");

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Vos modifications ont été enregistrées avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Paramètres</h2>
      
      <Tabs defaultValue="pricing" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Tarifs & Promotions</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Utilisateurs & Droits</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Tarifs & Promotions */}
        <TabsContent value="pricing" className="space-y-6">
          {/* Configuration des tarifs par catégorie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                <span>Tarifs par catégorie de véhicule</span>
              </CardTitle>
              <CardDescription>
                Définissez les tarifs journaliers, hebdomadaires et mensuels pour chaque catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Tarif journalier</TableHead>
                      <TableHead>Tarif hebdomadaire</TableHead>
                      <TableHead>Tarif mensuel</TableHead>
                      <TableHead>Caution</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Économique</TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="45" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="270" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="900" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="800" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Compacte</TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="55" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="330" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="1100" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="1000" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>SUV</TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="75" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="450" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="1500" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="1500" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Premium</TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="120" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="720" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="2400" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="2000" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Utilitaire</TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="65" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="390" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="1300" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue="1200" className="w-24" />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-between">
                <Button variant="outline" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Ajouter une catégorie</span>
                </Button>
                <Button onClick={handleSaveSettings}>Enregistrer les tarifs</Button>
              </div>
            </CardContent>
          </Card>

          {/* Gestion des promotions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                <span>Gestion des promotions</span>
              </CardTitle>
              <CardDescription>
                Créez et gérez des promotions saisonnières ou pour des occasions spéciales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                        <h3 className="font-medium">Promotion d'été</h3>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="promo-name">Nom de la promotion</Label>
                        <Input id="promo-name" defaultValue="Promotion d'été" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promo-code">Code promo</Label>
                        <Input id="promo-code" defaultValue="ETE2023" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promo-discount">Réduction (%)</Label>
                        <Input id="promo-discount" type="number" defaultValue="15" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promo-limit">Limite d'utilisation</Label>
                        <Input id="promo-limit" type="number" defaultValue="100" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promo-start">Date de début</Label>
                        <Input id="promo-start" type="date" defaultValue="2023-06-01" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promo-end">Date de fin</Label>
                        <Input id="promo-end" type="date" defaultValue="2023-08-31" />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="promo-categories">Catégories applicables</Label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="cat-economic" checked />
                            <label htmlFor="cat-economic">Économique</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="cat-compact" checked />
                            <label htmlFor="cat-compact">Compacte</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="cat-suv" checked />
                            <label htmlFor="cat-suv">SUV</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="cat-premium" />
                            <label htmlFor="cat-premium">Premium</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="cat-utility" />
                            <label htmlFor="cat-utility">Utilitaire</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Planifiée</Badge>
                        <h3 className="font-medium">Promotion de Noël</h3>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="promo-name-2">Nom de la promotion</Label>
                        <Input id="promo-name-2" defaultValue="Promotion de Noël" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promo-code-2">Code promo</Label>
                        <Input id="promo-code-2" defaultValue="NOEL2023" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promo-discount-2">Réduction (%)</Label>
                        <Input id="promo-discount-2" type="number" defaultValue="20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promo-limit-2">Limite d'utilisation</Label>
                        <Input id="promo-limit-2" type="number" defaultValue="50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promo-start-2">Date de début</Label>
                        <Input id="promo-start-2" type="date" defaultValue="2023-12-15" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promo-end-2">Date de fin</Label>
                        <Input id="promo-end-2" type="date" defaultValue="2023-12-31" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Ajouter une promotion</span>
                  </Button>
                  <Button onClick={handleSaveSettings}>Enregistrer les promotions</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tarification saisonnière */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Tarification saisonnière</span>
              </CardTitle>
              <CardDescription>
                Ajustez automatiquement vos tarifs en fonction des saisons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 py-2">
                  <Switch id="seasonal-pricing" />
                  <div className="grid gap-0.5">
                    <Label htmlFor="seasonal-pricing">Activer la tarification saisonnière</Label>
                    <p className="text-sm text-muted-foreground">
                      Les tarifs seront automatiquement ajustés selon les périodes configurées
                    </p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Période</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Multiplicateur de tarif</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Haute saison (été)</TableCell>
                        <TableCell>15 juin - 31 août</TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="1.3" className="w-24" step="0.1" min="1" max="3" />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Saison moyenne (printemps)</TableCell>
                        <TableCell>1 avril - 14 juin</TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="1.1" className="w-24" step="0.1" min="1" max="3" />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Saison moyenne (automne)</TableCell>
                        <TableCell>1 sept - 31 oct</TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="1.1" className="w-24" step="0.1" min="1" max="3" />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Basse saison (hiver)</TableCell>
                        <TableCell>1 nov - 31 mars</TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="1.0" className="w-24" step="0.1" min="1" max="3" />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Ajouter une période</span>
                  </Button>
                  <Button onClick={handleSaveSettings}>Enregistrer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Utilisateurs & Droits */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Gestion des rôles et permissions</span>
              </CardTitle>
              <CardDescription>
                Définissez les droits d'accès pour chaque rôle d'utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Administrateur</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="font-medium">Véhicules</Label>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-vehicle-view" defaultChecked />
                            <label htmlFor="admin-vehicle-view" className="text-sm">Voir</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-vehicle-create" defaultChecked />
                            <label htmlFor="admin-vehicle-create" className="text-sm">Créer</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-vehicle-edit" defaultChecked />
                            <label htmlFor="admin-vehicle-edit" className="text-sm">Modifier</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-vehicle-delete" defaultChecked />
                            <label htmlFor="admin-vehicle-delete" className="text-sm">Supprimer</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="font-medium">Clients</Label>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-client-view" defaultChecked />
                            <label htmlFor="admin-client-view" className="text-sm">Voir</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-client-create" defaultChecked />
                            <label htmlFor="admin-client-create" className="text-sm">Créer</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-client-edit" defaultChecked />
                            <label htmlFor="admin-client-edit" className="text-sm">Modifier</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-client-delete" defaultChecked />
                            <label htmlFor="admin-client-delete" className="text-sm">Supprimer</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="font-medium">Réservations</Label>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-reservation-view" defaultChecked />
                            <label htmlFor="admin-reservation-view" className="text-sm">Voir</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-reservation-create" defaultChecked />
                            <label htmlFor="admin-reservation-create" className="text-sm">Créer</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-reservation-edit" defaultChecked />
                            <label htmlFor="admin-reservation-edit" className="text-sm">Modifier</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-reservation-cancel" defaultChecked />
                            <label htmlFor="admin-reservation-cancel" className="text-sm">Annuler</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="font-medium">Facturation</Label>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-billing-view" defaultChecked />
                            <label htmlFor="admin-billing-view" className="text-sm">Voir</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-billing-create" defaultChecked />
                            <label htmlFor="admin-billing-create" className="text-sm">Créer</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-billing-payment" defaultChecked />
                            <label htmlFor="admin-billing-payment" className="text-sm">Enregistrer paiements</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="admin-billing-refund" defaultChecked />
                            <label htmlFor="admin-billing-refund" className="text-sm">Remboursements</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Agent de réservation</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="font-medium">Véhicules</Label>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="agent-vehicle-view" defaultChecked />
                            <label htmlFor="agent-vehicle-view" className="text-sm">Voir</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="agent-vehicle-create" />
                            <label htmlFor="agent-vehicle-create" className="text-sm">Créer</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="agent-vehicle-edit" />
                            <label htmlFor="agent-vehicle-edit" className="text-sm">Modifier</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="agent-vehicle-delete" />
                            <label htmlFor="agent-vehicle-delete" className="text-sm">Supprimer</label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Continuer avec les autres sections pour l'agent */}
                      <div className="space-y-2">
                        <Label className="font-medium">Clients</Label>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="agent-client-view" defaultChecked />
                            <label htmlFor="agent-client-view" className="text-sm">Voir</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="agent-client-create" defaultChecked />
                            <label htmlFor="agent-client-create" className="text-sm">Créer</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="agent-client-edit" defaultChecked />
                            <label htmlFor="agent-client-edit" className="text-sm">Modifier</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="agent-client-delete" />
                            <label htmlFor="agent-client-delete" className="text-sm">Supprimer</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="font-medium">Réservations</Label>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="agent-reservation-view" defaultChecked />
                            <label htmlFor="agent-reservation-view" className="text-sm">Voir</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="agent-reservation-create" defaultChecked />
                            <label htmlFor="agent-reservation-create" className="text-sm">Créer</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="agent-reservation-edit" defaultChecked />
                            <label htmlFor="agent-reservation-edit" className="text-sm">Modifier</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="agent-reservation-cancel" defaultChecked />
                            <label htmlFor="agent-reservation-cancel" className="text-sm">Annuler</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Ajouter un rôle</span>
                  </Button>
                  <Button onClick={handleSaveSettings}>Enregistrer les permissions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Documents */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>Personnalisation des documents</span>
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence et le contenu des documents générés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Contrats de location */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Contrat de location</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contract-header">En-tête</Label>
                      <Input id="contract-header" defaultValue="CONTRAT DE LOCATION DE VÉHICULE" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contract-footer">Pied de page</Label>
                      <Input id="contract-footer" defaultValue="© 2023 - Ma Société de Location - Tous droits réservés" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contract-terms">Conditions générales</Label>
                      <textarea 
                        id="contract-terms" 
                        className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="1. Le véhicule doit être restitué dans le même état qu'à la livraison.
2. Le locataire est responsable de tous dommages causés au véhicule pendant la période de location.
3. Les frais de carburant sont à la charge du locataire.
4. Le véhicule ne peut être conduit que par les conducteurs désignés dans le contrat.
5. En cas d'accident, le locataire doit immédiatement prévenir la société de location."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Factures</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoice-prefix">Préfixe des factures</Label>
                      <Input id="invoice-prefix" defaultValue="FACT-" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoice-notes">Notes de bas de facture</Label>
                      <Input id="invoice-notes" defaultValue="Merci de votre confiance. Paiement à réception de facture." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoice-legal">Mentions légales</Label>
                      <Input id="invoice-legal" defaultValue="SIRET : 123 456 789 00012 - TVA Intracommunautaire : FR12345678900" />
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox id="invoice-logo" defaultChecked />
                      <label htmlFor="invoice-logo" className="text-sm">Inclure le logo de l'entreprise</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline">Prévisualiser les documents</Button>
                  <Button onClick={handleSaveSettings}>Enregistrer les modifications</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span>Configuration des notifications</span>
              </CardTitle>
              <CardDescription>
                Personnalisez les notifications automatiques envoyées aux clients et au personnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Notifications client</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center space-x-4">
                        <Switch id="notif-reservation" defaultChecked />
                        <div>
                          <label htmlFor="notif-reservation" className="font-medium">Confirmation de réservation</label>
                          <p className="text-sm text-muted-foreground mt-0.5">Envoyée après confirmation d'une réservation</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center space-x-4">
                        <Switch id="notif-reminder" defaultChecked />
                        <div>
                          <label htmlFor="notif-reminder" className="font-medium">Rappel de location</label>
                          <p className="text-sm text-muted-foreground mt-0.5">Envoyé 24h avant le début de la location</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center space-x-4">
                        <Switch id="notif-return" defaultChecked />
                        <div>
                          <label htmlFor="notif-return" className="font-medium">Rappel de retour</label>
                          <p className="text-sm text-muted-foreground mt-0.5">Envoyé 24h avant la fin de la location</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center space-x-4">
                        <Switch id="notif-invoice" defaultChecked />
                        <div>
                          <label htmlFor="notif-invoice" className="font-medium">Facture</label>
                          <p className="text-sm text-muted-foreground mt-0.5">Envoyée après génération d'une facture</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center space-x-4">
                        <Switch id="notif-payment" defaultChecked />
                        <div>
                          <label htmlFor="notif-payment" className="font-medium">Confirmation de paiement</label>
                          <p className="text-sm text-muted-foreground mt-0.5">Envoyée après réception d'un paiement</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Notifications internes</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center space-x-4">
                        <Switch id="notif-new-reservation" defaultChecked />
                        <div>
                          <label htmlFor="notif-new-reservation" className="font-medium">Nouvelle réservation</label>
                          <p className="text-sm text-muted-foreground mt-0.5">Envoyée lors d'une nouvelle réservation</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center space-x-4">
                        <Switch id="notif-maintenance" defaultChecked />
                        <div>
                          <label htmlFor="notif-maintenance" className="font-medium">Alerte d'entretien</label>
                          <p className="text-sm text-muted-foreground mt-0.5">Envoyée lorsqu'un entretien est nécessaire</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center space-x-4">
                        <Switch id="notif-late-return" defaultChecked />
                        <div>
                          <label htmlFor="notif-late-return" className="font-medium">Retour en retard</label>
                          <p className="text-sm text-muted-foreground mt-0.5">Envoyée lorsqu'un véhicule n'est pas rendu à temps</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Canaux de notification</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="channel-email" defaultChecked />
                      <label htmlFor="channel-email">Email</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="channel-sms" defaultChecked />
                      <label htmlFor="channel-sms">SMS</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="channel-app" />
                      <label htmlFor="channel-app">Notification application</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>Enregistrer les paramètres de notification</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
