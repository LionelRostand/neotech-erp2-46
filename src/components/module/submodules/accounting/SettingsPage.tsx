
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';

// Import the PermissionsTab component correctly
import PermissionsTab from './components/PermissionsTab';
import { useToast } from '@/hooks/use-toast';

// Define interface for accounting settings
interface AccountingSettings {
  // General settings
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
  notificationEmails: string[];
  
  // Integration settings
  bankConnected: boolean;
  emailServiceConnected: boolean;
  crmConnected: boolean;
  erConnected: boolean;
}

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // State for accounting settings with default values
  const [settings, setSettings] = useState<AccountingSettings>({
    // General settings
    companyName: "Ma Société",
    address: "123 Rue Principale, 75000 Paris",
    phone: "+33 1 23 45 67 89",
    email: "contact@masociete.fr",
    website: "www.masociete.fr",
    taxIdNumber: "FR12345678901",
    defaultCurrency: "EUR",
    defaultPaymentTerms: "30",
    logo: "/logo.png",
    
    // Notification settings
    enableEmailNotifications: true,
    invoiceCreatedNotify: true,
    invoicePaidNotify: true,
    invoiceOverdueNotify: true,
    paymentReceivedNotify: true,
    weeklyReportNotify: false,
    monthlyReportNotify: true,
    reminderDaysBefore: 3,
    notificationEmails: ["comptabilite@masociete.fr"],
    
    // Integration settings
    bankConnected: false,
    emailServiceConnected: true,
    crmConnected: false,
    erConnected: false
  });
  
  // Mock function to update settings
  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres de comptabilité ont été mis à jour avec succès."
    });
  };
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paramètres de la Comptabilité</h1>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="database">Base de données</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Informations de l'entreprise</h3>
                  <p className="text-sm text-muted-foreground">
                    Ces informations apparaîtront sur vos factures et autres documents.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="text-sm font-medium">Nom de l'entreprise</label>
                    <input 
                      id="companyName"
                      name="companyName"
                      className="w-full p-2 border rounded-md"
                      value={settings.companyName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="taxIdNumber" className="text-sm font-medium">Numéro de TVA</label>
                    <input 
                      id="taxIdNumber"
                      name="taxIdNumber"
                      className="w-full p-2 border rounded-md"
                      value={settings.taxIdNumber}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">Adresse</label>
                    <input 
                      id="address"
                      name="address"
                      className="w-full p-2 border rounded-md"
                      value={settings.address}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Téléphone</label>
                    <input 
                      id="phone"
                      name="phone"
                      className="w-full p-2 border rounded-md"
                      value={settings.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input 
                      id="email"
                      name="email"
                      className="w-full p-2 border rounded-md"
                      value={settings.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium">Site Web</label>
                    <input 
                      id="website"
                      name="website"
                      className="w-full p-2 border rounded-md"
                      value={settings.website}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <h3 className="text-lg font-medium">Paramètres par défaut</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="defaultCurrency" className="text-sm font-medium">Devise par défaut</label>
                    <input 
                      id="defaultCurrency"
                      name="defaultCurrency"
                      className="w-full p-2 border rounded-md"
                      value={settings.defaultCurrency}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="defaultPaymentTerms" className="text-sm font-medium">Conditions de paiement (jours)</label>
                    <input 
                      id="defaultPaymentTerms"
                      name="defaultPaymentTerms"
                      className="w-full p-2 border rounded-md"
                      value={settings.defaultPaymentTerms}
                      onChange={handleChange}
                      type="number"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={handleSaveSettings}
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <PermissionsTab
            users={[
              { id: "1", displayName: "Admin User", email: "admin@masociete.fr", role: "Admin" },
              { id: "2", displayName: "Finance Manager", email: "finance@masociete.fr", role: "Manager" },
              { id: "3", displayName: "Accountant", email: "accountant@masociete.fr", role: "Staff" }
            ]}
            userPermissions={[
              {
                userId: "1",
                userName: "Admin User",
                userEmail: "admin@masociete.fr",
                userRole: "Admin",
                moduleId: "invoices",
                permissions: { canView: true, canCreate: true, canEdit: true, canDelete: true }
              },
              {
                userId: "2",
                userName: "Finance Manager",
                userEmail: "finance@masociete.fr",
                userRole: "Manager",
                moduleId: "invoices",
                permissions: { canView: true, canCreate: true, canEdit: true, canDelete: false }
              }
            ]}
            accountingSubmodules={[
              { id: "invoices", name: "Factures" },
              { id: "payments", name: "Paiements" },
              { id: "taxes", name: "Taxes" },
              { id: "reports", name: "Rapports" }
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
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Paramètres des notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Configurez quand et comment vous souhaitez recevoir des notifications.
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="enableEmailNotifications" 
                    name="enableEmailNotifications"
                    checked={settings.enableEmailNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="enableEmailNotifications" className="text-sm font-medium">
                    Activer les notifications par email
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="invoiceCreatedNotify" 
                      name="invoiceCreatedNotify"
                      checked={settings.invoiceCreatedNotify}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300"
                      disabled={!settings.enableEmailNotifications}
                    />
                    <label htmlFor="invoiceCreatedNotify" className="text-sm font-medium">
                      Facture créée
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="invoicePaidNotify" 
                      name="invoicePaidNotify"
                      checked={settings.invoicePaidNotify}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300"
                      disabled={!settings.enableEmailNotifications}
                    />
                    <label htmlFor="invoicePaidNotify" className="text-sm font-medium">
                      Facture payée
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="invoiceOverdueNotify" 
                      name="invoiceOverdueNotify"
                      checked={settings.invoiceOverdueNotify}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300"
                      disabled={!settings.enableEmailNotifications}
                    />
                    <label htmlFor="invoiceOverdueNotify" className="text-sm font-medium">
                      Facture en retard
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="paymentReceivedNotify" 
                      name="paymentReceivedNotify"
                      checked={settings.paymentReceivedNotify}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300"
                      disabled={!settings.enableEmailNotifications}
                    />
                    <label htmlFor="paymentReceivedNotify" className="text-sm font-medium">
                      Paiement reçu
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="weeklyReportNotify" 
                      name="weeklyReportNotify"
                      checked={settings.weeklyReportNotify}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300"
                      disabled={!settings.enableEmailNotifications}
                    />
                    <label htmlFor="weeklyReportNotify" className="text-sm font-medium">
                      Rapport hebdomadaire
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="monthlyReportNotify" 
                      name="monthlyReportNotify"
                      checked={settings.monthlyReportNotify}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300"
                      disabled={!settings.enableEmailNotifications}
                    />
                    <label htmlFor="monthlyReportNotify" className="text-sm font-medium">
                      Rapport mensuel
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <label htmlFor="reminderDaysBefore" className="text-sm font-medium">
                    Envoyer un rappel (jours avant l'échéance)
                  </label>
                  <input 
                    type="number" 
                    id="reminderDaysBefore" 
                    name="reminderDaysBefore"
                    value={settings.reminderDaysBefore}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    min="1"
                    max="30"
                    disabled={!settings.enableEmailNotifications}
                  />
                </div>
                
                <div className="space-y-2 mt-4">
                  <label htmlFor="notificationEmails" className="text-sm font-medium">
                    Emails de notification (séparés par des virgules)
                  </label>
                  <input 
                    type="text" 
                    id="notificationEmails" 
                    name="notificationEmails"
                    value={settings.notificationEmails.join(', ')}
                    onChange={(e) => setSettings({...settings, notificationEmails: e.target.value.split(',').map(email => email.trim())})}
                    className="w-full p-2 border rounded-md"
                    disabled={!settings.enableEmailNotifications}
                  />
                </div>
                
                <div className="flex justify-end mt-4">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={handleSaveSettings}
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Intégrations externes</h3>
                  <p className="text-sm text-muted-foreground">
                    Connectez votre système comptable à d'autres services.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Intégration bancaire</h4>
                        <p className="text-sm text-muted-foreground">Connectez vos comptes bancaires pour réconcilier automatiquement les transactions</p>
                      </div>
                      <button 
                        className={`px-3 py-1 rounded-md ${settings.bankConnected ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                        onClick={() => setSettings({...settings, bankConnected: !settings.bankConnected})}
                      >
                        {settings.bankConnected ? 'Déconnecter' : 'Connecter'}
                      </button>
                    </div>
                    {settings.bankConnected && (
                      <div className="mt-2 text-sm text-green-600">
                        Connecté à la Banque Nationale
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Service d'email</h4>
                        <p className="text-sm text-muted-foreground">Connectez votre service d'email pour envoyer des factures et des notifications</p>
                      </div>
                      <button 
                        className={`px-3 py-1 rounded-md ${settings.emailServiceConnected ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                        onClick={() => setSettings({...settings, emailServiceConnected: !settings.emailServiceConnected})}
                      >
                        {settings.emailServiceConnected ? 'Déconnecter' : 'Connecter'}
                      </button>
                    </div>
                    {settings.emailServiceConnected && (
                      <div className="mt-2 text-sm text-green-600">
                        Connecté à Gmail
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Intégration CRM</h4>
                        <p className="text-sm text-muted-foreground">Connectez votre CRM pour synchroniser les données clients</p>
                      </div>
                      <button 
                        className={`px-3 py-1 rounded-md ${settings.crmConnected ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                        onClick={() => setSettings({...settings, crmConnected: !settings.crmConnected})}
                      >
                        {settings.crmConnected ? 'Déconnecter' : 'Connecter'}
                      </button>
                    </div>
                    {settings.crmConnected && (
                      <div className="mt-2 text-sm text-green-600">
                        Connecté à Salesforce
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Système ERP</h4>
                        <p className="text-sm text-muted-foreground">Connectez votre ERP pour une gestion intégrée</p>
                      </div>
                      <button 
                        className={`px-3 py-1 rounded-md ${settings.erConnected ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                        onClick={() => setSettings({...settings, erConnected: !settings.erConnected})}
                      >
                        {settings.erConnected ? 'Déconnecter' : 'Connecter'}
                      </button>
                    </div>
                    {settings.erConnected && (
                      <div className="mt-2 text-sm text-green-600">
                        Connecté à SAP
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={handleSaveSettings}
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Database Tab */}
        <TabsContent value="database">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Gestion de la base de données</h3>
                  <p className="text-sm text-muted-foreground">
                    Gérez vos données comptables et effectuez des opérations de maintenance.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium">Sauvegarde et restauration</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Créez des sauvegardes de vos données ou restaurez à partir d'une sauvegarde existante.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        className="px-3 py-1 rounded-md bg-blue-600 text-white"
                        onClick={() => toast({
                          title: "Sauvegarde lancée",
                          description: "Une sauvegarde complète de vos données est en cours."
                        })}
                      >
                        Créer une sauvegarde
                      </button>
                      <button 
                        className="px-3 py-1 rounded-md border border-gray-300"
                        onClick={() => toast({
                          title: "Restauration",
                          description: "Veuillez sélectionner un fichier de sauvegarde."
                        })}
                      >
                        Restaurer
                      </button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium">Maintenance</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Optimisez votre base de données pour de meilleures performances.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        className="px-3 py-1 rounded-md bg-blue-600 text-white"
                        onClick={() => toast({
                          title: "Optimisation lancée",
                          description: "L'optimisation de la base de données est en cours."
                        })}
                      >
                        Optimiser la base de données
                      </button>
                      <button 
                        className="px-3 py-1 rounded-md border border-gray-300"
                        onClick={() => toast({
                          title: "Vérification lancée",
                          description: "La vérification de l'intégrité des données est en cours."
                        })}
                      >
                        Vérifier l'intégrité
                      </button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium">Exportation des données</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Exportez vos données dans différents formats pour utilisation externe.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        className="px-3 py-1 rounded-md border border-gray-300"
                        onClick={() => toast({
                          title: "Export CSV",
                          description: "Exportation des données au format CSV en cours."
                        })}
                      >
                        Exporter en CSV
                      </button>
                      <button 
                        className="px-3 py-1 rounded-md border border-gray-300"
                        onClick={() => toast({
                          title: "Export Excel",
                          description: "Exportation des données au format Excel en cours."
                        })}
                      >
                        Exporter en Excel
                      </button>
                      <button 
                        className="px-3 py-1 rounded-md border border-gray-300"
                        onClick={() => toast({
                          title: "Export PDF",
                          description: "Exportation des données au format PDF en cours."
                        })}
                      >
                        Exporter en PDF
                      </button>
                    </div>
                  </div>
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
