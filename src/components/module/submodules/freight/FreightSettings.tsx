
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Bell, Shield, Globe, FileText, DollarSign, Truck } from 'lucide-react';
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';

interface FreightSettings {
  id: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  defaultCurrency: string;
  weightUnit: 'kg' | 'lb';
  dimensionUnit: 'cm' | 'in';
  distanceUnit: 'km' | 'mi';
  trackingEnabled: boolean;
  notificationsEnabled: boolean;
  autoInvoiceGeneration: boolean;
  customsDocumentsRequired: boolean;
  autoRouteOptimization: boolean;
  lastUpdated: string;
}

interface NotificationSetting {
  id: string;
  event: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  recipients: string[];
}

const FreightSettings: React.FC = () => {
  const [settings, setSettings] = useState<FreightSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();

  // Fetch settings data
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        // Fetch general settings
        const settingsData = await fetchFreightCollectionData<FreightSettings>('SETTINGS');
        if (settingsData.length > 0) {
          setSettings(settingsData[0]);
        }
        
        // Simulate notification settings (usually would be in the same collection)
        setNotificationSettings([
          {
            id: '1',
            event: 'shipment_created',
            emailEnabled: true,
            smsEnabled: false,
            pushEnabled: true,
            recipients: ['admin@example.com']
          },
          {
            id: '2',
            event: 'shipment_in_transit',
            emailEnabled: true,
            smsEnabled: true,
            pushEnabled: true,
            recipients: ['admin@example.com', 'operations@example.com']
          },
          {
            id: '3',
            event: 'shipment_delivered',
            emailEnabled: true,
            smsEnabled: false,
            pushEnabled: false,
            recipients: ['admin@example.com']
          },
          {
            id: '4',
            event: 'shipment_delayed',
            emailEnabled: true,
            smsEnabled: true,
            pushEnabled: true,
            recipients: ['admin@example.com', 'operations@example.com']
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les paramètres. Veuillez réessayer.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [toast]);

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos paramètres ont été enregistrés avec succès.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventName = (eventKey: string) => {
    const eventNames: Record<string, string> = {
      'shipment_created': 'Création d\'expédition',
      'shipment_in_transit': 'Expédition en transit',
      'shipment_delivered': 'Expédition livrée',
      'shipment_delayed': 'Expédition retardée'
    };
    
    return eventNames[eventKey] || eventKey;
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Chargement des paramètres...</div>;
  }

  if (!settings) {
    return (
      <div className="flex justify-center p-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Paramètres non trouvés</CardTitle>
            <CardDescription>
              Les paramètres de l'application n'ont pas été configurés.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Initialiser les paramètres</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Globe className="mr-2 h-4 w-4" />
            Intégrations
          </TabsTrigger>
          <TabsTrigger value="carriers">
            <Truck className="mr-2 h-4 w-4" />
            Transporteurs
          </TabsTrigger>
          <TabsTrigger value="billing">
            <DollarSign className="mr-2 h-4 w-4" />
            Facturation
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="mr-2 h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux du module de gestion de fret
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Dernière mise à jour: {formatDate(settings.lastUpdated)}
                </p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium">Nom de l'entreprise</label>
                  <Input id="companyName" defaultValue={settings.companyName} />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="contactEmail" className="text-sm font-medium">Email de contact</label>
                  <Input id="contactEmail" type="email" defaultValue={settings.contactEmail} />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="contactPhone" className="text-sm font-medium">Téléphone de contact</label>
                  <Input id="contactPhone" defaultValue={settings.contactPhone} />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="defaultCurrency" className="text-sm font-medium">Devise par défaut</label>
                  <Select defaultValue={settings.defaultCurrency}>
                    <SelectTrigger id="defaultCurrency">
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dollar US ($)</SelectItem>
                      <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                      <SelectItem value="JPY">Yen (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Unités de mesure</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="weightUnit" className="text-sm font-medium">Unité de poids</label>
                    <Select defaultValue={settings.weightUnit}>
                      <SelectTrigger id="weightUnit">
                        <SelectValue placeholder="Sélectionner une unité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogrammes (kg)</SelectItem>
                        <SelectItem value="lb">Livres (lb)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="dimensionUnit" className="text-sm font-medium">Unité de dimension</label>
                    <Select defaultValue={settings.dimensionUnit}>
                      <SelectTrigger id="dimensionUnit">
                        <SelectValue placeholder="Sélectionner une unité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">Centimètres (cm)</SelectItem>
                        <SelectItem value="in">Pouces (in)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="distanceUnit" className="text-sm font-medium">Unité de distance</label>
                    <Select defaultValue={settings.distanceUnit}>
                      <SelectTrigger id="distanceUnit">
                        <SelectValue placeholder="Sélectionner une unité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="km">Kilomètres (km)</SelectItem>
                        <SelectItem value="mi">Miles (mi)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Fonctionnalités</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="trackingEnabled" className="text-sm font-medium">Suivi des expéditions</label>
                      <p className="text-sm text-muted-foreground">
                        Activer le suivi en temps réel des expéditions
                      </p>
                    </div>
                    <Switch id="trackingEnabled" checked={settings.trackingEnabled} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="notificationsEnabled" className="text-sm font-medium">Notifications</label>
                      <p className="text-sm text-muted-foreground">
                        Activer les notifications automatiques
                      </p>
                    </div>
                    <Switch id="notificationsEnabled" checked={settings.notificationsEnabled} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="autoInvoiceGeneration" className="text-sm font-medium">Génération automatique de factures</label>
                      <p className="text-sm text-muted-foreground">
                        Générer automatiquement des factures à la création d'expéditions
                      </p>
                    </div>
                    <Switch id="autoInvoiceGeneration" checked={settings.autoInvoiceGeneration} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="customsDocumentsRequired" className="text-sm font-medium">Documents douaniers requis</label>
                      <p className="text-sm text-muted-foreground">
                        Exiger des documents douaniers pour les expéditions internationales
                      </p>
                    </div>
                    <Switch id="customsDocumentsRequired" checked={settings.customsDocumentsRequired} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="autoRouteOptimization" className="text-sm font-medium">Optimisation automatique des itinéraires</label>
                      <p className="text-sm text-muted-foreground">
                        Optimiser automatiquement les itinéraires des expéditions
                      </p>
                    </div>
                    <Switch id="autoRouteOptimization" checked={settings.autoRouteOptimization} />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>Enregistrer les modifications</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notifications</CardTitle>
              <CardDescription>
                Configurez comment et quand vous souhaitez recevoir des notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationSettings.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium">{getEventName(notification.event)}</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id={`email-${notification.id}`} checked={notification.emailEnabled} />
                      <label htmlFor={`email-${notification.id}`}>Email</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id={`sms-${notification.id}`} checked={notification.smsEnabled} />
                      <label htmlFor={`sms-${notification.id}`}>SMS</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id={`push-${notification.id}`} checked={notification.pushEnabled} />
                      <label htmlFor={`push-${notification.id}`}>Notification push</label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destinataires</label>
                    <Textarea defaultValue={notification.recipients.join(', ')} />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>Enregistrer les modifications</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres des documents</CardTitle>
              <CardDescription>
                Configurez les options relatives aux documents d'expédition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Cette section est en cours de développement.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations</CardTitle>
              <CardDescription>
                Gérez les intégrations avec des services externes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Cette section est en cours de développement.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="carriers">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres des transporteurs</CardTitle>
              <CardDescription>
                Configurez les options par défaut pour les transporteurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Cette section est en cours de développement.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de facturation</CardTitle>
              <CardDescription>
                Configurez les options de facturation automatique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Cette section est en cours de développement.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Gérez les permissions d'accès au module de gestion de fret
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Cette section est en cours de développement.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightSettings;
