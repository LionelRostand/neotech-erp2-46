
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Save, RefreshCw, Trash2, Mail, Cloud, Bell, Briefcase, Link, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // États pour les paramètres généraux
  const [signature, setSignature] = useState('<p>Cordialement,</p><p>L\'équipe NeoTech</p>');
  const [defaultPriority, setDefaultPriority] = useState('normal');
  const [sendCopy, setSendCopy] = useState(true);
  const [autoArchive, setAutoArchive] = useState(true);
  const [autoArchiveDays, setAutoArchiveDays] = useState('30');
  
  // États pour les paramètres de notification
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [notifyOnNewMessage, setNotifyOnNewMessage] = useState(true);
  const [notifyOnMessageRead, setNotifyOnMessageRead] = useState(false);
  
  // États pour les paramètres d'intégration
  const [emailIntegration, setEmailIntegration] = useState('');
  const [crmIntegration, setCrmIntegration] = useState('none');
  const [webhookUrl, setWebhookUrl] = useState('');
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simuler la sauvegarde
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Paramètres enregistrés",
        description: "Vos paramètres ont été mis à jour avec succès."
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres des messages</CardTitle>
          <CardDescription>
            Configurez les paramètres de messagerie selon vos préférences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="integrations">Intégrations</TabsTrigger>
              <TabsTrigger value="templates">Modèles</TabsTrigger>
            </TabsList>
            
            {/* Paramètres généraux */}
            <TabsContent value="general" className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Signature de message</h3>
                <p className="text-sm text-muted-foreground">
                  Définissez une signature qui sera automatiquement ajoutée à la fin de vos messages.
                </p>
                <div className="mt-2">
                  <Textarea 
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Paramètres d'envoi</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="default-priority">Priorité par défaut</Label>
                  <Select 
                    value={defaultPriority} 
                    onValueChange={setDefaultPriority}
                  >
                    <SelectTrigger id="default-priority">
                      <SelectValue placeholder="Sélectionner une priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="normal">Normale</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="send-copy">M'envoyer une copie</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir une copie des messages que vous envoyez.
                    </p>
                  </div>
                  <Switch 
                    id="send-copy" 
                    checked={sendCopy}
                    onCheckedChange={setSendCopy}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Archivage automatique</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-archive">Activer l'archivage automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Archiver automatiquement les anciens messages après une période définie.
                    </p>
                  </div>
                  <Switch 
                    id="auto-archive" 
                    checked={autoArchive}
                    onCheckedChange={setAutoArchive}
                  />
                </div>
                
                {autoArchive && (
                  <div className="space-y-2">
                    <Label htmlFor="archive-days">Archiver après (jours)</Label>
                    <Input 
                      id="archive-days"
                      type="number" 
                      value={autoArchiveDays}
                      onChange={(e) => setAutoArchiveDays(e.target.value)}
                      min="1"
                      max="365"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Paramètres de notification */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canaux de notification</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications par email pour les nouveaux messages.
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="desktop-notifications">Notifications de bureau</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications sur votre navigateur.
                    </p>
                  </div>
                  <Switch 
                    id="desktop-notifications" 
                    checked={desktopNotifications}
                    onCheckedChange={setDesktopNotifications}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Événements de notification</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-new-message">Nouveaux messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Être notifié lorsque vous recevez un nouveau message.
                    </p>
                  </div>
                  <Switch 
                    id="notify-new-message" 
                    checked={notifyOnNewMessage}
                    onCheckedChange={setNotifyOnNewMessage}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-message-read">Lecture des messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Être notifié lorsque vos messages sont lus par les destinataires.
                    </p>
                  </div>
                  <Switch 
                    id="notify-message-read" 
                    checked={notifyOnMessageRead}
                    onCheckedChange={setNotifyOnMessageRead}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Paramètres d'intégration */}
            <TabsContent value="integrations" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Intégration email</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="email-integration">Adresse email à synchroniser</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="email-integration"
                      placeholder="exemple@domaine.com"
                      value={emailIntegration}
                      onChange={(e) => setEmailIntegration(e.target.value)}
                    />
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Connecter
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Synchronisez vos emails pour les gérer directement depuis l'application.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Intégration CRM</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="crm-integration">Plateforme CRM</Label>
                  <Select 
                    value={crmIntegration} 
                    onValueChange={setCrmIntegration}
                  >
                    <SelectTrigger id="crm-integration">
                      <SelectValue placeholder="Sélectionner une plateforme CRM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune</SelectItem>
                      <SelectItem value="odoo">Odoo</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="zoho">Zoho CRM</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {crmIntegration !== 'none' && (
                    <Button variant="outline" className="mt-2">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Configurer l'intégration {crmIntegration}
                    </Button>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Webhook</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">URL du webhook</Label>
                  <Input 
                    id="webhook-url"
                    placeholder="https://"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications en temps réel sur votre serveur via webhook.
                  </p>
                  
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      <Link className="h-4 w-4 mr-2" />
                      Tester le webhook
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Modèles de message */}
            <TabsContent value="templates" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Modèles de message</h3>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Nouveau modèle
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Créez et gérez des modèles pour vos messages fréquemment envoyés.
                </p>
                
                <div className="border rounded-md divide-y">
                  {['Bienvenue client', 'Suivi de commande', 'Demande d\'information'].map((template, index) => (
                    <div key={index} className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{template}</h4>
                        <p className="text-sm text-muted-foreground">
                          Dernière modification: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          Modifier
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">À propos des modèles</h4>
                <p className="text-sm text-muted-foreground">
                  Les modèles vous permettent de standardiser vos communications et de gagner du temps lors de la rédaction de messages récurrents. Vous pouvez inclure des variables qui seront remplacées automatiquement lors de l'envoi.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les paramètres
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
