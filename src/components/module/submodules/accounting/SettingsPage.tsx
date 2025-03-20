import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  PlusCircle, 
  Save, 
  Trash2, 
  CreditCard, 
  Landmark, 
  Euro, 
  Globe,
  FileText,
  Users,
  ShieldCheck
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import PermissionsTab from './components/PermissionsTab';
import { useAccountingPermissions } from './hooks/useAccountingPermissions';

const SettingsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('general');
  
  const accountingSubmodules = [
    { id: "accounting-dashboard", name: "Tableau de bord" },
    { id: "accounting-invoices", name: "Factures" },
    { id: "accounting-payments", name: "Paiements" },
    { id: "accounting-taxes", name: "Taxes & TVA" },
    { id: "accounting-reports", name: "Rapports" },
    { id: "accounting-settings", name: "Paramètres" },
  ];

  const {
    users,
    userPermissions,
    loading,
    saving,
    searchTerm,
    setSearchTerm,
    updatePermission,
    setAllPermissionsOfType,
    savePermissions
  } = useAccountingPermissions(accountingSubmodules);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres comptabilité</h1>
      
      <Tabs defaultValue="general" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-5 w-[750px]">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="bank">Comptes bancaires</TabsTrigger>
          <TabsTrigger value="automation">Automatisation</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configuration de base du module comptabilité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nom de l'entreprise</Label>
                  <Input id="company-name" defaultValue="ACME SAS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Numéro de TVA intracommunautaire</Label>
                  <Input id="tax-id" defaultValue="FR12345678901" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiscal-year">Début de l'année fiscale</Label>
                  <Select defaultValue="january">
                    <SelectTrigger id="fiscal-year">
                      <SelectValue placeholder="Mois de début" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">Janvier</SelectItem>
                      <SelectItem value="february">Février</SelectItem>
                      <SelectItem value="march">Mars</SelectItem>
                      <SelectItem value="april">Avril</SelectItem>
                      <SelectItem value="may">Mai</SelectItem>
                      <SelectItem value="june">Juin</SelectItem>
                      <SelectItem value="july">Juillet</SelectItem>
                      <SelectItem value="august">Août</SelectItem>
                      <SelectItem value="september">Septembre</SelectItem>
                      <SelectItem value="october">Octobre</SelectItem>
                      <SelectItem value="november">Novembre</SelectItem>
                      <SelectItem value="december">Décembre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-currency">Devise par défaut</Label>
                  <Select defaultValue="EUR">
                    <SelectTrigger id="default-currency">
                      <SelectValue placeholder="Devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dollar US ($)</SelectItem>
                      <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                      <SelectItem value="CAD">Dollar canadien (CA$)</SelectItem>
                      <SelectItem value="CHF">Franc suisse (CHF)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-plan">Plan comptable</Label>
                <Select defaultValue="french">
                  <SelectTrigger id="account-plan">
                    <SelectValue placeholder="Plan comptable" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="french">Plan comptable général français</SelectItem>
                    <SelectItem value="ifrs">IFRS - International</SelectItem>
                    <SelectItem value="custom">Plan personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Configuration TVA</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vat-regime">Régime de TVA</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger id="vat-regime">
                        <SelectValue placeholder="Régime" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                        <SelectItem value="quarterly">Trimestriel</SelectItem>
                        <SelectItem value="simplified">Simplifié</SelectItem>
                        <SelectItem value="none">Non assujetti</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-vat">Taux de TVA par défaut</Label>
                    <Select defaultValue="20">
                      <SelectTrigger id="default-vat">
                        <SelectValue placeholder="Taux" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="5.5">5.5%</SelectItem>
                        <SelectItem value="2.1">2.1%</SelectItem>
                        <SelectItem value="0">0% (Exonéré)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Label htmlFor="analytics-enabled" className="block mb-1">Statistiques avancées</Label>
                  <div className="text-sm text-muted-foreground">
                    Activer les tableaux de bord et analyses détaillées
                  </div>
                </div>
                <Switch id="analytics-enabled" defaultChecked />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button>
                  <Save className="h-4 w-4 mr-2" /> Enregistrer les paramètres
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres des factures</CardTitle>
              <CardDescription>
                Numérotation, modèles et paramètres d'envoi des factures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix">Préfixe des factures</Label>
                  <Input id="invoice-prefix" defaultValue="FACT-2023-" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="next-invoice">Prochain numéro</Label>
                  <Input id="next-invoice" type="number" defaultValue="0052" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Délai de paiement par défaut</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="payment-terms">
                      <SelectValue placeholder="Délai" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Paiement immédiat</SelectItem>
                      <SelectItem value="15">15 jours</SelectItem>
                      <SelectItem value="30">30 jours</SelectItem>
                      <SelectItem value="45">45 jours</SelectItem>
                      <SelectItem value="60">60 jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-template">Modèle de facture</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger id="invoice-template">
                      <SelectValue placeholder="Modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="professional">Professionnel</SelectItem>
                      <SelectItem value="minimal">Minimaliste</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoice-notes">Notes et conditions par défaut</Label>
                <Input id="invoice-notes" placeholder="Conditions de paiement, mentions légales..." />
              </div>
              
              <div className="space-y-2">
                <Label>Méthodes de paiement acceptées</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="payment-bank" defaultChecked />
                    <Label htmlFor="payment-bank" className="font-normal">
                      <Landmark className="h-4 w-4 inline mr-1" /> Virement bancaire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="payment-card" defaultChecked />
                    <Label htmlFor="payment-card" className="font-normal">
                      <CreditCard className="h-4 w-4 inline mr-1" /> Carte bancaire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="payment-check" defaultChecked />
                    <Label htmlFor="payment-check" className="font-normal">
                      <FileText className="h-4 w-4 inline mr-1" /> Chèque
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="payment-cash" />
                    <Label htmlFor="payment-cash" className="font-normal">
                      <Euro className="h-4 w-4 inline mr-1" /> Espèces
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Label htmlFor="auto-send" className="block mb-1">Envoi automatique</Label>
                  <div className="text-sm text-muted-foreground">
                    Envoyer automatiquement les factures par email à la création
                  </div>
                </div>
                <Switch id="auto-send" defaultChecked />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button>
                  <Save className="h-4 w-4 mr-2" /> Enregistrer les paramètres
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bank">
          <Card>
            <CardHeader>
              <CardTitle>Comptes bancaires</CardTitle>
              <CardDescription>
                Gestion des comptes et connexions bancaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Nom du compte</TableHead>
                    <TableHead>IBAN / Numéro</TableHead>
                    <TableHead>Banque</TableHead>
                    <TableHead>Devise</TableHead>
                    <TableHead>Solde actuel</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Compte principal
                      <Badge variant="outline" className="ml-2">Par défaut</Badge>
                    </TableCell>
                    <TableCell>FR76 1234 5678 9101 1121 3141 516</TableCell>
                    <TableCell>Crédit Mutuel</TableCell>
                    <TableCell>EUR</TableCell>
                    <TableCell>32 540,80 €</TableCell>
                    <TableCell>
                      <Badge variant="success">Connecté</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Compte épargne</TableCell>
                    <TableCell>FR76 1234 5678 9101 1121 3141 517</TableCell>
                    <TableCell>Crédit Mutuel</TableCell>
                    <TableCell>EUR</TableCell>
                    <TableCell>45 780,00 €</TableCell>
                    <TableCell>
                      <Badge variant="success">Connecté</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Compte USD</TableCell>
                    <TableCell>US12 3456 7891 0111 2131</TableCell>
                    <TableCell>Wise</TableCell>
                    <TableCell>USD</TableCell>
                    <TableCell>5 280,00 $</TableCell>
                    <TableCell>
                      <Badge variant="outline">Manuel</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline">
                  <Globe className="h-4 w-4 mr-2" /> Synchroniser avec la banque
                </Button>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" /> Ajouter un compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automatisation</CardTitle>
              <CardDescription>
                Configurer les actions et rappels automatiques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-medium">Rappels de paiement</h3>
                
                <div className="border rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Rappel avant échéance</div>
                      <div className="text-sm text-muted-foreground">
                        Envoyer un rappel avant l'échéance de la facture
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="before-due">Jours avant échéance</Label>
                      <Select defaultValue="3">
                        <SelectTrigger id="before-due">
                          <SelectValue placeholder="Jours" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 jour</SelectItem>
                          <SelectItem value="3">3 jours</SelectItem>
                          <SelectItem value="5">5 jours</SelectItem>
                          <SelectItem value="7">7 jours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="before-template">Modèle d'email</Label>
                      <Select defaultValue="reminder">
                        <SelectTrigger id="before-template">
                          <SelectValue placeholder="Modèle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reminder">Rappel standard</SelectItem>
                          <SelectItem value="friendly">Rappel amical</SelectItem>
                          <SelectItem value="custom">Personnalisé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Rappel après échéance</div>
                      <div className="text-sm text-muted-foreground">
                        Envoyer un rappel lorsque la facture est en retard
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="after-due">Jours après échéance</Label>
                      <Input id="after-due" type="text" defaultValue="1, 7, 15, 30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="after-template">Modèle d'email</Label>
                      <Select defaultValue="overdue">
                        <SelectTrigger id="after-template">
                          <SelectValue placeholder="Modèle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="overdue">Retard de paiement</SelectItem>
                          <SelectItem value="urgent">Retard urgent</SelectItem>
                          <SelectItem value="custom">Personnalisé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-6">
                <h3 className="text-base font-medium">Rapprochement bancaire</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-reconcile" className="block mb-1">Rapprochement automatique</Label>
                    <div className="text-sm text-muted-foreground">
                      Associer automatiquement les paiements aux factures
                    </div>
                  </div>
                  <Switch id="auto-reconcile" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-categorize" className="block mb-1">Catégorisation automatique</Label>
                    <div className="text-sm text-muted-foreground">
                      Catégoriser les transactions récurrentes automatiquement
                    </div>
                  </div>
                  <Switch id="auto-categorize" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4 pt-6">
                <h3 className="text-base font-medium">Intégrations</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Intégration CRM</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Synchroniser les clients et factures avec le CRM
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Intégration bancaire</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Synchroniser automatiquement les relevés bancaires
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button>
                  <Save className="h-4 w-4 mr-2" /> Enregistrer les paramètres
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  Gestion des permissions
                </CardTitle>
                <CardDescription>
                  Gérez qui peut accéder et modifier les différentes fonctionnalités du module comptabilité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PermissionsTab
                  users={users}
                  userPermissions={userPermissions}
                  accountingSubmodules={accountingSubmodules}
                  loading={loading}
                  saving={saving}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  updatePermission={updatePermission}
                  setAllPermissionsOfType={setAllPermissionsOfType}
                  savePermissions={savePermissions}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
