
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Settings, Shield, Globe, Server, Plug, Activity } from 'lucide-react';
import FreightSecuritySettings from './FreightSecuritySettings';
import { fetchFreightCollection } from '@/hooks/fetchFreightCollectionData';
import FreightPermissionsTab from './settings/FreightPermissionsTab';

const FreightSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [apiKey, setApiKey] = useState('sk_test_51LZX9KJHyZNgUBQK72nBXP');
  const [freightApiEndpoint, setFreightApiEndpoint] = useState('https://api.freight-service.com/v1');
  
  const handleSaveSettings = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Les paramètres ont été mis à jour avec succès.",
      action: (
        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="h-5 w-5 text-white" />
        </div>
      )
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general" className="flex gap-2 items-center">
            <Settings className="h-4 w-4" />
            <span>Général</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2 items-center">
            <Shield className="h-4 w-4" />
            <span>Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 items-center">
            <Activity className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex gap-2 items-center">
            <Server className="h-4 w-4" />
            <span>API</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex gap-2 items-center">
            <Plug className="h-4 w-4" />
            <span>Intégrations</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Général */}
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux du module de transport de marchandises.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nom de l'entreprise</Label>
                  <Input id="company-name" defaultValue="NeoTech Logistics" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Numéro de TVA</Label>
                  <Input id="tax-id" defaultValue="FR123456789" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise par défaut</Label>
                  <Input id="currency" defaultValue="EUR" />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="tracking" defaultChecked />
                  <Label htmlFor="tracking">Activer le suivi en temps réel</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="auto-numbering" defaultChecked />
                  <Label htmlFor="auto-numbering">Numérotation automatique des expéditions</Label>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>Enregistrer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sécurité */}
        <TabsContent value="security" className="mt-6">
          <FreightPermissionsTab />
        </TabsContent>
        
        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notification</CardTitle>
              <CardDescription>
                Configurez les notifications pour les expéditions et événements liés au transport.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="email-notifications" 
                    checked={emailNotifications} 
                    onCheckedChange={() => setEmailNotifications(!emailNotifications)}
                  />
                  <Label htmlFor="email-notifications">Notifications par email</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sms-notifications" 
                    checked={smsNotifications}
                    onCheckedChange={() => setSmsNotifications(!smsNotifications)}
                  />
                  <Label htmlFor="sms-notifications">Notifications par SMS</Label>
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="notification-email">Email de notification</Label>
                  <Input id="notification-email" type="email" defaultValue="notifications@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sms-number">Numéro pour SMS</Label>
                  <Input id="sms-number" type="tel" defaultValue="+33123456789" />
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>Enregistrer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* API */}
        <TabsContent value="api" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'API</CardTitle>
              <CardDescription>
                Gérez les clés API et les points d'accès pour les intégrations externes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Clé API</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="api-key" 
                      value={apiKey} 
                      onChange={(e) => setApiKey(e.target.value)} 
                      type="password"
                    />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="api-endpoint">Point d'accès API</Label>
                  <Input 
                    id="api-endpoint" 
                    value={freightApiEndpoint} 
                    onChange={(e) => setFreightApiEndpoint(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="enable-api" defaultChecked />
                  <Label htmlFor="enable-api">Activer l'API</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="webhook" defaultChecked />
                  <Label htmlFor="webhook">Activer les webhooks</Label>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>Enregistrer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Intégrations */}
        <TabsContent value="integrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations</CardTitle>
              <CardDescription>
                Configurez les intégrations avec d'autres services et plateformes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span>Google Maps</span>
                  </div>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-green-600" />
                    <span>Système ERP</span>
                  </div>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    <span>Service SMS</span>
                  </div>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    <span>Service d'authentification</span>
                  </div>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>
              
              <Button onClick={handleSaveSettings}>Enregistrer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightSettings;
