
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { PermissionsTab } from './components/PermissionsTab';
import { AlertCircle, Database, FileText, Mail, RefreshCw, Settings2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Define interfaces for our settings data
interface AccountingSettings {
  id?: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxIdNumber: string;
  defaultCurrency: string;
  defaultPaymentTerms: string;
  logo: string;
  
  // Notifications
  enableEmailNotifications: boolean;
  invoiceCreatedNotify: boolean;
  invoicePaidNotify: boolean;
  invoiceOverdueNotify: boolean;
  paymentReceivedNotify: boolean;
  weeklyReportNotify: boolean;
  monthlyReportNotify: boolean;
  reminderDaysBefore: number;
  notificationEmails: string;
  
  // Integrations
  bankConnected: boolean;
  emailServiceConnected: boolean;
  crmConnected: boolean;
  erpConnected: boolean;
}

const SettingsPage = () => {
  const { toast } = useToast();
  const { data: settingsData, isLoading } = useCollectionData(COLLECTIONS.ACCOUNTING.SETTINGS);
  
  // Create default settings if we don't have any
  const defaultSettings: AccountingSettings = {
    companyName: 'Ma Société',
    address: '123 Rue Principale, 75000 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@masociete.fr',
    website: 'www.masociete.fr',
    taxIdNumber: 'FR12345678901',
    defaultCurrency: 'EUR',
    defaultPaymentTerms: 'Net 30',
    logo: '',
    
    // Notifications
    enableEmailNotifications: true,
    invoiceCreatedNotify: true,
    invoicePaidNotify: true,
    invoiceOverdueNotify: true,
    paymentReceivedNotify: true,
    weeklyReportNotify: false,
    monthlyReportNotify: true,
    reminderDaysBefore: 3,
    notificationEmails: 'finance@masociete.fr',
    
    // Integrations
    bankConnected: false,
    emailServiceConnected: true,
    crmConnected: false,
    erpConnected: false
  };
  
  // Get the first settings document or use defaults
  const settings = settingsData && settingsData.length > 0 ? settingsData[0] : defaultSettings;
  
  const [formData, setFormData] = useState<AccountingSettings>(defaultSettings);
  
  useEffect(() => {
    if (settings) {
      setFormData(settings as AccountingSettings);
    }
  }, [settings]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleSaveSettings = () => {
    // Here you would save the settings to your database
    toast({
      title: "Paramètres enregistrés",
      description: "Les paramètres de comptabilité ont été mis à jour avec succès."
    });
  };
  
  const handleDatabaseOperation = (operation: string) => {
    toast({
      title: `${operation} terminée`,
      description: `L'opération ${operation.toLowerCase()} a été effectuée avec succès.`
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paramètres de Comptabilité</h1>
        <Button onClick={handleSaveSettings}>Enregistrer les modifications</Button>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="database">Base de données</TabsTrigger>
        </TabsList>
        
        {/* Onglet Général */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>
                Ces informations apparaîtront sur vos factures et autres documents comptables.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxIdNumber">Numéro SIRET</Label>
                  <Input
                    id="taxIdNumber"
                    name="taxIdNumber"
                    value={formData.taxIdNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo (URL)</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                  <Input
                    id="defaultCurrency"
                    name="defaultCurrency"
                    value={formData.defaultCurrency}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultPaymentTerms">Conditions de paiement par défaut</Label>
                  <Input
                    id="defaultPaymentTerms"
                    name="defaultPaymentTerms"
                    value={formData.defaultPaymentTerms}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Permissions */}
        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>
        
        {/* Onglet Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notifications</CardTitle>
              <CardDescription>
                Configurez quand et comment vous souhaitez recevoir des notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Activer les notifications par email</h3>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications par email pour les événements importants
                    </p>
                  </div>
                  <Switch 
                    checked={formData.enableEmailNotifications}
                    onCheckedChange={(checked) => handleSwitchChange('enableEmailNotifications', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="invoiceCreatedNotify"
                      checked={formData.invoiceCreatedNotify}
                      onCheckedChange={(checked) => handleSwitchChange('invoiceCreatedNotify', checked)}
                      disabled={!formData.enableEmailNotifications}
                    />
                    <Label htmlFor="invoiceCreatedNotify">Nouvelle facture créée</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="invoicePaidNotify"
                      checked={formData.invoicePaidNotify}
                      onCheckedChange={(checked) => handleSwitchChange('invoicePaidNotify', checked)}
                      disabled={!formData.enableEmailNotifications}
                    />
                    <Label htmlFor="invoicePaidNotify">Facture payée</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="invoiceOverdueNotify"
                      checked={formData.invoiceOverdueNotify}
                      onCheckedChange={(checked) => handleSwitchChange('invoiceOverdueNotify', checked)}
                      disabled={!formData.enableEmailNotifications}
                    />
                    <Label htmlFor="invoiceOverdueNotify">Facture en retard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="paymentReceivedNotify"
                      checked={formData.paymentReceivedNotify}
                      onCheckedChange={(checked) => handleSwitchChange('paymentReceivedNotify', checked)}
                      disabled={!formData.enableEmailNotifications}
                    />
                    <Label htmlFor="paymentReceivedNotify">Paiement reçu</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="weeklyReportNotify"
                      checked={formData.weeklyReportNotify}
                      onCheckedChange={(checked) => handleSwitchChange('weeklyReportNotify', checked)}
                      disabled={!formData.enableEmailNotifications}
                    />
                    <Label htmlFor="weeklyReportNotify">Rapport hebdomadaire</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="monthlyReportNotify"
                      checked={formData.monthlyReportNotify}
                      onCheckedChange={(checked) => handleSwitchChange('monthlyReportNotify', checked)}
                      disabled={!formData.enableEmailNotifications}
                    />
                    <Label htmlFor="monthlyReportNotify">Rapport mensuel</Label>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="reminderDaysBefore">Jours de rappel avant échéance</Label>
                  <Input 
                    id="reminderDaysBefore" 
                    name="reminderDaysBefore"
                    type="number" 
                    value={formData.reminderDaysBefore}
                    onChange={handleInputChange}
                    disabled={!formData.enableEmailNotifications} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notificationEmails">Emails de notification (séparés par des virgules)</Label>
                  <Input 
                    id="notificationEmails" 
                    name="notificationEmails"
                    value={formData.notificationEmails}
                    onChange={handleInputChange}
                    disabled={!formData.enableEmailNotifications} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Intégrations */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations de services externes</CardTitle>
              <CardDescription>
                Connectez votre système comptable à d'autres services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Settings2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Intégration bancaire</h3>
                      <p className="text-sm text-muted-foreground">
                        Synchronisez vos comptes bancaires pour un suivi automatique
                      </p>
                    </div>
                  </div>
                  <Button variant={formData.bankConnected ? "default" : "outline"}>
                    {formData.bankConnected ? "Configuré" : "Connecter"}
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Service d'emails</h3>
                      <p className="text-sm text-muted-foreground">
                        Pour l'envoi automatique de factures et rappels
                      </p>
                    </div>
                  </div>
                  <Button variant={formData.emailServiceConnected ? "default" : "outline"}>
                    {formData.emailServiceConnected ? "Configuré" : "Connecter"}
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">CRM</h3>
                      <p className="text-sm text-muted-foreground">
                        Lier les clients du CRM à la comptabilité
                      </p>
                    </div>
                  </div>
                  <Button variant={formData.crmConnected ? "default" : "outline"}>
                    {formData.crmConnected ? "Configuré" : "Connecter"}
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">ERP</h3>
                      <p className="text-sm text-muted-foreground">
                        Intégrer avec votre système ERP
                      </p>
                    </div>
                  </div>
                  <Button variant={formData.erpConnected ? "default" : "outline"}>
                    {formData.erpConnected ? "Configuré" : "Connecter"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Base de données */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Gestion de la base de données</CardTitle>
              <CardDescription>
                Effectuez des opérations de maintenance sur la base de données comptable.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Database className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Sauvegarde de données</h3>
                      <p className="text-sm text-muted-foreground">
                        Créez une sauvegarde de toutes vos données comptables
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => handleDatabaseOperation('Sauvegarde')}>
                    Lancer une sauvegarde
                  </Button>
                </div>
                
                <div className="rounded-lg border p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <RefreshCw className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Optimisation</h3>
                      <p className="text-sm text-muted-foreground">
                        Optimisez la base de données pour de meilleures performances
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => handleDatabaseOperation('Optimisation')}>
                    Optimiser
                  </Button>
                </div>
                
                <div className="rounded-lg border bg-amber-50 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-2 rounded-full">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Réinitialisation des données</h3>
                      <p className="text-sm text-red-500">
                        Attention: cette action est irréversible et supprimera toutes vos données
                      </p>
                    </div>
                  </div>
                  <Button variant="destructive" onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données? Cette action est irréversible.')) {
                      handleDatabaseOperation('Réinitialisation');
                    }
                  }}>
                    Réinitialiser
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
