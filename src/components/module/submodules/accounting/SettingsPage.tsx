
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import PermissionsTab from "./components/PermissionsTab";
import { toast } from "sonner";

interface AccountingSettings {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxIdNumber: string;
  defaultCurrency: string;
  defaultPaymentTerms: string;
  logo: string;
  // Notification settings
  enableEmailNotifications: boolean;
  invoiceCreatedNotify: boolean;
  invoicePaidNotify: boolean;
  invoiceOverdueNotify: boolean;
  paymentReceivedNotify: boolean;
  weeklyReportNotify: boolean;
  monthlyReportNotify: boolean;
  reminderDaysBefore: number;
  notificationEmails: string;
  // Integration settings
  bankConnected: boolean;
  emailServiceConnected: boolean;
  crmConnected: boolean;
  erConnected: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  
  // Settings data state
  const [settings, setSettings] = useState<AccountingSettings>({
    companyName: "Ma Société",
    address: "123 Rue Principale, 75000 Paris",
    phone: "+33 1 23 45 67 89",
    email: "contact@masociete.fr",
    website: "www.masociete.fr",
    taxIdNumber: "FR12345678901",
    defaultCurrency: "EUR",
    defaultPaymentTerms: "30",
    logo: "",
    // Notification settings
    enableEmailNotifications: true,
    invoiceCreatedNotify: true,
    invoicePaidNotify: true,
    invoiceOverdueNotify: true,
    paymentReceivedNotify: true,
    weeklyReportNotify: false,
    monthlyReportNotify: true,
    reminderDaysBefore: 3,
    notificationEmails: "finance@masociete.fr, direction@masociete.fr",
    // Integration settings
    bankConnected: false,
    emailServiceConnected: true,
    crmConnected: true,
    erConnected: false
  });

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Paramètres sauvegardés avec succès");
    }, 1000);
  };
  
  const handleChange = (field: keyof AccountingSettings, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Paramètres de Comptabilité</h1>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Sauvegarde..." : "Sauvegarder les modifications"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="database">Base de données</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nom de l'entreprise</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea
                      id="address"
                      value={settings.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      value={settings.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="taxIdNumber">Numéro de TVA</Label>
                    <Input
                      id="taxIdNumber"
                      value={settings.taxIdNumber}
                      onChange={(e) => handleChange('taxIdNumber', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                    <Select
                      value={settings.defaultCurrency}
                      onValueChange={(value) => handleChange('defaultCurrency', value)}
                    >
                      <SelectTrigger id="defaultCurrency">
                        <SelectValue placeholder="Sélectionner une devise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="USD">Dollar américain (USD)</SelectItem>
                        <SelectItem value="GBP">Livre sterling (GBP)</SelectItem>
                        <SelectItem value="CHF">Franc suisse (CHF)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultPaymentTerms">Délai de paiement par défaut (jours)</Label>
                    <Select
                      value={settings.defaultPaymentTerms}
                      onValueChange={(value) => handleChange('defaultPaymentTerms', value)}
                    >
                      <SelectTrigger id="defaultPaymentTerms">
                        <SelectValue placeholder="Sélectionner un délai" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 jours</SelectItem>
                        <SelectItem value="14">14 jours</SelectItem>
                        <SelectItem value="30">30 jours</SelectItem>
                        <SelectItem value="45">45 jours</SelectItem>
                        <SelectItem value="60">60 jours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsTab 
            users={[
              { id: '1', displayName: 'Admin Utilisateur', email: 'admin@masociete.fr', role: 'Administrateur' },
              { id: '2', displayName: 'Comptable Principal', email: 'comptable@masociete.fr', role: 'Comptable' },
              { id: '3', displayName: 'Assistant Comptable', email: 'assistant@masociete.fr', role: 'Assistant' }
            ]}
            userPermissions={[]}
            accountingSubmodules={[
              { id: 'accounting-invoices', name: 'Factures' },
              { id: 'accounting-payments', name: 'Paiements' },
              { id: 'accounting-taxes', name: 'Taxes & TVA' },
              { id: 'accounting-reports', name: 'Rapports' },
              { id: 'accounting-settings', name: 'Paramètres' }
            ]}
            loading={false}
            saving={false}
            searchTerm=""
            setSearchTerm={() => {}}
            updatePermission={() => {}}
            setAllPermissionsOfType={() => {}}
            savePermissions={async () => {}}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableNotifications" className="text-base">Activer les notifications par e-mail</Label>
                    <p className="text-sm text-muted-foreground">Envoyer des notifications automatiques aux clients et à l'équipe</p>
                  </div>
                  <Switch
                    id="enableNotifications"
                    checked={settings.enableEmailNotifications}
                    onCheckedChange={(checked) => handleChange('enableEmailNotifications', checked)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Notifications des factures</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="invoiceCreated"
                        checked={settings.invoiceCreatedNotify}
                        onCheckedChange={(checked) => handleChange('invoiceCreatedNotify', checked)}
                        disabled={!settings.enableEmailNotifications}
                      />
                      <Label htmlFor="invoiceCreated">Quand une facture est créée</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="invoicePaid"
                        checked={settings.invoicePaidNotify}
                        onCheckedChange={(checked) => handleChange('invoicePaidNotify', checked)}
                        disabled={!settings.enableEmailNotifications}
                      />
                      <Label htmlFor="invoicePaid">Quand une facture est payée</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="invoiceOverdue"
                        checked={settings.invoiceOverdueNotify}
                        onCheckedChange={(checked) => handleChange('invoiceOverdueNotify', checked)}
                        disabled={!settings.enableEmailNotifications}
                      />
                      <Label htmlFor="invoiceOverdue">Quand une facture est en retard</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Notifications de reporting</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="weeklyReport"
                        checked={settings.weeklyReportNotify}
                        onCheckedChange={(checked) => handleChange('weeklyReportNotify', checked)}
                        disabled={!settings.enableEmailNotifications}
                      />
                      <Label htmlFor="weeklyReport">Rapport hebdomadaire</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="monthlyReport"
                        checked={settings.monthlyReportNotify}
                        onCheckedChange={(checked) => handleChange('monthlyReportNotify', checked)}
                        disabled={!settings.enableEmailNotifications}
                      />
                      <Label htmlFor="monthlyReport">Rapport mensuel</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reminderDays">Rappeler les factures avant échéance (jours)</Label>
                      <Input
                        id="reminderDays"
                        type="number"
                        min="1"
                        max="30"
                        value={settings.reminderDaysBefore}
                        onChange={(e) => handleChange('reminderDaysBefore', parseInt(e.target.value))}
                        disabled={!settings.enableEmailNotifications}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notificationEmails">Emails pour les notifications internes (séparés par des virgules)</Label>
                  <Textarea
                    id="notificationEmails"
                    value={settings.notificationEmails}
                    onChange={(e) => handleChange('notificationEmails', e.target.value)}
                    disabled={!settings.enableEmailNotifications}
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">Intégration bancaire</h3>
                        <p className="text-sm text-muted-foreground">Connectez votre compte bancaire pour synchroniser automatiquement les transactions</p>
                      </div>
                      <Switch
                        checked={settings.bankConnected}
                        onCheckedChange={(checked) => handleChange('bankConnected', checked)}
                      />
                    </div>
                    {settings.bankConnected ? (
                      <p className="mt-4 text-sm text-green-600">Connecté</p>
                    ) : (
                      <Button className="mt-4" variant="outline" size="sm">Configurer</Button>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">Service d'emails</h3>
                        <p className="text-sm text-muted-foreground">Configurer le service d'email pour l'envoi automatique des factures</p>
                      </div>
                      <Switch
                        checked={settings.emailServiceConnected}
                        onCheckedChange={(checked) => handleChange('emailServiceConnected', checked)}
                      />
                    </div>
                    {settings.emailServiceConnected ? (
                      <p className="mt-4 text-sm text-green-600">Connecté à SMTP</p>
                    ) : (
                      <Button className="mt-4" variant="outline" size="sm">Configurer</Button>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">CRM</h3>
                        <p className="text-sm text-muted-foreground">Intégrer avec le module CRM pour partager les données clients</p>
                      </div>
                      <Switch
                        checked={settings.crmConnected}
                        onCheckedChange={(checked) => handleChange('crmConnected', checked)}
                      />
                    </div>
                    {settings.crmConnected ? (
                      <p className="mt-4 text-sm text-green-600">Connecté au CRM interne</p>
                    ) : (
                      <Button className="mt-4" variant="outline" size="sm">Configurer</Button>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">Logiciel ERP</h3>
                        <p className="text-sm text-muted-foreground">Intégrer avec votre système ERP existant</p>
                      </div>
                      <Switch
                        checked={settings.erConnected}
                        onCheckedChange={(checked) => handleChange('erConnected', checked)}
                      />
                    </div>
                    {settings.erConnected ? (
                      <p className="mt-4 text-sm text-green-600">Connecté</p>
                    ) : (
                      <Button className="mt-4" variant="outline" size="sm">Configurer</Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Gestion de la base de données</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium">Taille de la base</h4>
                      <p className="text-2xl font-bold mt-2">257 MB</p>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium">Dernière sauvegarde</h4>
                      <p className="text-2xl font-bold mt-2">Aujourd'hui 08:30</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline">
                      Sauvegarder maintenant
                    </Button>
                    <Button variant="outline">
                      Restaurer une sauvegarde
                    </Button>
                    <Button variant="outline" className="text-red-500 hover:text-red-600">
                      Optimiser la base
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Données archivées</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span>Factures antérieures à 2023</span>
                      <span className="text-sm text-muted-foreground">127 Entrées</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Paiements antérieurs à 2023</span>
                      <span className="text-sm text-muted-foreground">89 Entrées</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Rapports archivés</span>
                      <span className="text-sm text-muted-foreground">45 Entrées</span>
                    </div>
                  </div>
                  
                  <Button variant="secondary" size="sm">
                    Gérer les archives
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
