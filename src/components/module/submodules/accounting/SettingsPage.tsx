
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Settings, Users, Bell, Database, Link } from 'lucide-react';
import { useAccountingPermissions } from './hooks/useAccountingPermissions';
import PermissionsTab from './components/PermissionsTab';
import { useAccountingSettingsCollection } from './hooks/useAccountingCollection';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Liste des sous-modules de comptabilité
const accountingSubmodules = [
  { id: 'accounting-invoices', name: 'Factures' },
  { id: 'accounting-payments', name: 'Paiements' },
  { id: 'accounting-taxes', name: 'Taxes & TVA' },
  { id: 'accounting-reports', name: 'Rapports' },
  { id: 'accounting-settings', name: 'Paramètres' }
];

// Schéma de validation pour les paramètres généraux
const generalSettingsSchema = z.object({
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal('')),
  website: z.string().optional(),
  taxIdNumber: z.string().optional(),
  defaultCurrency: z.string().min(1, "La devise par défaut est requise"),
  defaultPaymentTerms: z.string().min(1, "Les conditions de paiement par défaut sont requises"),
  logo: z.string().optional()
});

// Schéma de validation pour les paramètres de notification
const notificationSettingsSchema = z.object({
  enableEmailNotifications: z.boolean().default(true),
  invoiceCreatedNotify: z.boolean().default(true),
  invoicePaidNotify: z.boolean().default(true),
  invoiceOverdueNotify: z.boolean().default(true),
  paymentReceivedNotify: z.boolean().default(true),
  weeklyReportNotify: z.boolean().default(false),
  monthlyReportNotify: z.boolean().default(true),
  reminderDaysBefore: z.string().min(1, "Le nombre de jours est requis"),
  notificationEmails: z.string().optional()
});

const AccountingSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
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
  } = useAccountingPermissions();
  
  const { toast } = useToast();
  const firestore = useFirestore(COLLECTIONS.ACCOUNTING.SETTINGS);
  
  // Récupération des paramètres depuis Firestore
  const { data: settings, isLoading: settingsLoading } = useAccountingSettingsCollection();

  // Form pour les paramètres généraux
  const generalForm = useForm({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: settings?.companyName || "",
      address: settings?.address || "",
      phone: settings?.phone || "",
      email: settings?.email || "",
      website: settings?.website || "",
      taxIdNumber: settings?.taxIdNumber || "",
      defaultCurrency: settings?.defaultCurrency || "EUR",
      defaultPaymentTerms: settings?.defaultPaymentTerms || "30",
      logo: settings?.logo || ""
    }
  });

  // Form pour les paramètres de notification
  const notificationForm = useForm({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      enableEmailNotifications: settings?.enableEmailNotifications !== false,
      invoiceCreatedNotify: settings?.invoiceCreatedNotify !== false,
      invoicePaidNotify: settings?.invoicePaidNotify !== false,
      invoiceOverdueNotify: settings?.invoiceOverdueNotify !== false,
      paymentReceivedNotify: settings?.paymentReceivedNotify !== false,
      weeklyReportNotify: settings?.weeklyReportNotify || false,
      monthlyReportNotify: settings?.monthlyReportNotify !== false,
      reminderDaysBefore: settings?.reminderDaysBefore || "3",
      notificationEmails: settings?.notificationEmails || ""
    }
  });

  // État pour les intégrations
  const [integrations, setIntegrations] = useState({
    bankConnected: settings?.bankConnected || false,
    emailServiceConnected: settings?.emailServiceConnected || false,
    crmConnected: settings?.crmConnected || false,
    erConnected: settings?.erConnected || false,
  });

  // Fonction pour enregistrer les paramètres généraux
  const onSaveGeneralSettings = async (data) => {
    try {
      await firestore.set('general', data);
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres généraux ont été enregistrés avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des paramètres:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paramètres.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour enregistrer les paramètres de notification
  const onSaveNotificationSettings = async (data) => {
    try {
      await firestore.set('notifications', data);
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres de notification ont été enregistrés avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des paramètres:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paramètres.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour connecter une intégration
  const handleToggleIntegration = async (key) => {
    const newIntegrations = { ...integrations, [key]: !integrations[key] };
    setIntegrations(newIntegrations);
    
    try {
      await firestore.set('integrations', newIntegrations);
      toast({
        title: newIntegrations[key] ? "Intégration activée" : "Intégration désactivée",
        description: `L'intégration a été ${newIntegrations[key] ? "activée" : "désactivée"} avec succès.`
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'intégration:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'intégration.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour exporter la base de données
  const handleExportDatabase = () => {
    toast({
      title: "Export en cours",
      description: "L'export de la base de données va commencer..."
    });

    // Simulation d'un délai pour l'export
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: "L'export de la base de données a été réalisé avec succès."
      });
    }, 2000);
  };

  // Fonction pour importer des données
  const handleImportData = () => {
    // Cette fonction serait appelée lors du clic sur le bouton d'import
    toast({
      title: "Import non disponible",
      description: "La fonctionnalité d'import sera disponible prochainement."
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Paramètres de la Comptabilité</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Général</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            <span>Intégrations</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Base de données</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres généraux</h2>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(onSaveGeneralSettings)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={generalForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'entreprise</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'entreprise" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="taxIdNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de TVA</FormLabel>
                        <FormControl>
                          <Input placeholder="FR12345678900" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="Adresse complète" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={generalForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 1 23 45 67 89" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@entreprise.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site web</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.entreprise.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <FormField
                    control={generalForm.control}
                    name="defaultCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Devise par défaut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une devise" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="USD">Dollar US ($)</SelectItem>
                            <SelectItem value="GBP">Livre sterling (£)</SelectItem>
                            <SelectItem value="CHF">Franc suisse (CHF)</SelectItem>
                            <SelectItem value="CAD">Dollar canadien (CAD)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalForm.control}
                    name="defaultPaymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conditions de paiement par défaut (jours)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le délai" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Paiement immédiat</SelectItem>
                            <SelectItem value="7">7 jours</SelectItem>
                            <SelectItem value="15">15 jours</SelectItem>
                            <SelectItem value="30">30 jours</SelectItem>
                            <SelectItem value="45">45 jours</SelectItem>
                            <SelectItem value="60">60 jours</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="mt-6">Enregistrer les paramètres</Button>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
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
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres de notifications</h2>
            <Form {...notificationForm}>
              <form onSubmit={notificationForm.handleSubmit(onSaveNotificationSettings)} className="space-y-4">
                <FormField
                  control={notificationForm.control}
                  name="enableEmailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Notifications par email</FormLabel>
                        <FormDescription>
                          Activer l'envoi de notifications par email
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={notificationForm.control}
                    name="invoiceCreatedNotify"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                        <div className="space-y-0.5">
                          <FormLabel>Création de facture</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="invoicePaidNotify"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                        <div className="space-y-0.5">
                          <FormLabel>Facture payée</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="invoiceOverdueNotify"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                        <div className="space-y-0.5">
                          <FormLabel>Facture en retard</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="paymentReceivedNotify"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                        <div className="space-y-0.5">
                          <FormLabel>Paiement reçu</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={notificationForm.control}
                    name="weeklyReportNotify"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                        <div className="space-y-0.5">
                          <FormLabel>Rapport hebdomadaire</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="monthlyReportNotify"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                        <div className="space-y-0.5">
                          <FormLabel>Rapport mensuel</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={notificationForm.control}
                    name="reminderDaysBefore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jours de rappel avant échéance</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le nombre de jours" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 jour</SelectItem>
                            <SelectItem value="3">3 jours</SelectItem>
                            <SelectItem value="5">5 jours</SelectItem>
                            <SelectItem value="7">7 jours</SelectItem>
                            <SelectItem value="14">14 jours</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Envoyer un rappel avant l'échéance de la facture
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="notificationEmails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emails supplémentaires pour les notifications</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Entrez les adresses email séparées par des virgules" 
                            {...field} 
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Ces adresses recevront également les notifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="mt-6">Enregistrer les paramètres</Button>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Intégrations</h2>
            <p className="text-muted-foreground mb-6">Gérez les intégrations avec d'autres systèmes.</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="space-y-1">
                  <h3 className="font-medium">Connecter à votre banque</h3>
                  <p className="text-sm text-muted-foreground">Synchroniser automatiquement les transactions bancaires</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${integrations.bankConnected ? 'text-green-500' : 'text-gray-500'}`}>
                    {integrations.bankConnected ? 'Connecté' : 'Non connecté'}
                  </span>
                  <Switch 
                    checked={integrations.bankConnected} 
                    onCheckedChange={() => handleToggleIntegration('bankConnected')}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="space-y-1">
                  <h3 className="font-medium">Service d'emails</h3>
                  <p className="text-sm text-muted-foreground">Configurer un service d'envoi d'emails (Mailjet, SendGrid, etc.)</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${integrations.emailServiceConnected ? 'text-green-500' : 'text-gray-500'}`}>
                    {integrations.emailServiceConnected ? 'Connecté' : 'Non connecté'}
                  </span>
                  <Switch 
                    checked={integrations.emailServiceConnected} 
                    onCheckedChange={() => handleToggleIntegration('emailServiceConnected')}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="space-y-1">
                  <h3 className="font-medium">CRM</h3>
                  <p className="text-sm text-muted-foreground">Intégrer avec le module CRM pour la gestion des clients</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${integrations.crmConnected ? 'text-green-500' : 'text-gray-500'}`}>
                    {integrations.crmConnected ? 'Connecté' : 'Non connecté'}
                  </span>
                  <Switch 
                    checked={integrations.crmConnected} 
                    onCheckedChange={() => handleToggleIntegration('crmConnected')}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="space-y-1">
                  <h3 className="font-medium">ERP</h3>
                  <p className="text-sm text-muted-foreground">Synchroniser avec un système ERP externe</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${integrations.erConnected ? 'text-green-500' : 'text-gray-500'}`}>
                    {integrations.erConnected ? 'Connecté' : 'Non connecté'}
                  </span>
                  <Switch 
                    checked={integrations.erConnected} 
                    onCheckedChange={() => handleToggleIntegration('erConnected')}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion de la base de données</h2>
            <p className="text-muted-foreground mb-6">Gérez les données de la comptabilité.</p>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sauvegarde et restauration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Exporter les données</h4>
                    <p className="text-sm text-muted-foreground mb-4">Téléchargez une copie complète de vos données comptables</p>
                    <div className="flex space-x-2">
                      <Button onClick={handleExportDatabase}>
                        Exporter (CSV)
                      </Button>
                      <Button variant="outline" onClick={handleExportDatabase}>
                        Exporter (Excel)
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Importer des données</h4>
                    <p className="text-sm text-muted-foreground mb-4">Importez des données à partir d'un fichier</p>
                    <div className="flex space-x-2">
                      <Button onClick={handleImportData}>
                        Importer
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Maintenance de la base de données</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Nettoyage des données</h4>
                    <p className="text-sm text-muted-foreground mb-4">Supprimer les données temporaires et obsolètes</p>
                    <Button variant="outline">
                      Nettoyer les données
                    </Button>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">Vérification d'intégrité</h4>
                    <p className="text-sm text-muted-foreground mb-4">Vérifier l'intégrité de la base de données</p>
                    <Button variant="outline">
                      Vérifier
                    </Button>
                  </Card>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Statistiques de la base</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Factures</p>
                    <p className="text-2xl font-bold">243</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Paiements</p>
                    <p className="text-2xl font-bold">187</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Clients</p>
                    <p className="text-2xl font-bold">84</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                    <p className="text-2xl font-bold">1,243</p>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingSettingsPage;
