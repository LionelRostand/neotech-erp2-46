
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, RefreshCw, Truck, ArrowRightLeft, Globe, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FreightIntegrationsTab: React.FC = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("api");
  
  // State for API integration
  const [apiEnabled, setApiEnabled] = useState(true);
  const [apiKey, setApiKey] = useState("frt_api_8b4c2p1d9e7f6g3h");
  const [apiEndpoint, setApiEndpoint] = useState("https://api.neotech.com/freight/v1");
  const [webhookUrl, setWebhookUrl] = useState("https://webhook.neotech.com/freight/events");
  
  // State for carrier integrations
  const [carrierIntegrations, setCarrierIntegrations] = useState({
    fedex: { enabled: true, accountId: "FDX98765", apiKey: "fdx_api_key_12345" },
    dhl: { enabled: true, accountId: "DHL54321", apiKey: "dhl_api_key_67890" },
    ups: { enabled: false, accountId: "", apiKey: "" }
  });
  
  // State for customs integration
  const [customsEnabled, setCustomsEnabled] = useState(false);
  const [customsApiKey, setCustomsApiKey] = useState("");
  const [customsAccountId, setCustomsAccountId] = useState("");
  
  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Paramètres d'intégration enregistrés",
        description: "Les paramètres d'intégration ont été mis à jour avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'enregistrement",
        description: "Une erreur s'est produite lors de l'enregistrement des paramètres d'intégration.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setSaving(false);
    }
  };
  
  const updateCarrierIntegration = (carrier: 'fedex' | 'dhl' | 'ups', field: 'enabled' | 'accountId' | 'apiKey', value: boolean | string) => {
    setCarrierIntegrations(prev => ({
      ...prev,
      [carrier]: {
        ...prev[carrier],
        [field]: value
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-blue-600" />
          <CardTitle>Intégrations</CardTitle>
        </div>
        <CardDescription>
          Configurez les intégrations avec d'autres systèmes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              API & Webhooks
            </TabsTrigger>
            <TabsTrigger value="carriers" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Transporteurs
            </TabsTrigger>
            <TabsTrigger value="customs" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Douanes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="api" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="api-enabled">API Freight</Label>
                <p className="text-sm text-muted-foreground">
                  Activer l'API pour l'intégration avec d'autres systèmes
                </p>
              </div>
              <Switch 
                id="api-enabled"
                checked={apiEnabled}
                onCheckedChange={setApiEnabled}
              />
            </div>
            
            {apiEnabled && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Clé API</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="api-key" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline">
                      Générer une nouvelle clé
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-endpoint">Point de terminaison API</Label>
                  <Input 
                    id="api-endpoint" 
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">URL du Webhook</Label>
                  <Input 
                    id="webhook-url" 
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://votre-serveur.com/webhook"
                  />
                  <p className="text-sm text-muted-foreground">
                    Cette URL recevra les notifications d'événements d'expédition
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhook-events">Événements du Webhook</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="event-creation" defaultChecked />
                      <Label htmlFor="event-creation">Création d'expédition</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="event-status" defaultChecked />
                      <Label htmlFor="event-status">Changement de statut</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="event-delivery" defaultChecked />
                      <Label htmlFor="event-delivery">Livraison</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="event-exception" defaultChecked />
                      <Label htmlFor="event-exception">Exception de livraison</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="carriers" className="space-y-6">
            {/* FedEx Integration */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-purple-100 flex items-center justify-center rounded">
                    <span className="font-bold text-purple-700">Fx</span>
                  </div>
                  <div>
                    <h3 className="font-medium">FedEx</h3>
                    <p className="text-sm text-muted-foreground">Intégration avec l'API FedEx</p>
                  </div>
                </div>
                <Switch 
                  checked={carrierIntegrations.fedex.enabled}
                  onCheckedChange={(value) => updateCarrierIntegration('fedex', 'enabled', value)}
                />
              </div>
              
              {carrierIntegrations.fedex.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="fedex-account">Identifiant de compte</Label>
                    <Input 
                      id="fedex-account" 
                      value={carrierIntegrations.fedex.accountId}
                      onChange={(e) => updateCarrierIntegration('fedex', 'accountId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fedex-api-key">Clé API</Label>
                    <Input 
                      id="fedex-api-key" 
                      type="password"
                      value={carrierIntegrations.fedex.apiKey}
                      onChange={(e) => updateCarrierIntegration('fedex', 'apiKey', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* DHL Integration */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-yellow-100 flex items-center justify-center rounded">
                    <span className="font-bold text-yellow-700">DH</span>
                  </div>
                  <div>
                    <h3 className="font-medium">DHL</h3>
                    <p className="text-sm text-muted-foreground">Intégration avec l'API DHL</p>
                  </div>
                </div>
                <Switch 
                  checked={carrierIntegrations.dhl.enabled}
                  onCheckedChange={(value) => updateCarrierIntegration('dhl', 'enabled', value)}
                />
              </div>
              
              {carrierIntegrations.dhl.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="dhl-account">Identifiant de compte</Label>
                    <Input 
                      id="dhl-account" 
                      value={carrierIntegrations.dhl.accountId}
                      onChange={(e) => updateCarrierIntegration('dhl', 'accountId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dhl-api-key">Clé API</Label>
                    <Input 
                      id="dhl-api-key" 
                      type="password"
                      value={carrierIntegrations.dhl.apiKey}
                      onChange={(e) => updateCarrierIntegration('dhl', 'apiKey', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* UPS Integration */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-brown-100 flex items-center justify-center rounded">
                    <span className="font-bold text-amber-700">UP</span>
                  </div>
                  <div>
                    <h3 className="font-medium">UPS</h3>
                    <p className="text-sm text-muted-foreground">Intégration avec l'API UPS</p>
                  </div>
                </div>
                <Switch 
                  checked={carrierIntegrations.ups.enabled}
                  onCheckedChange={(value) => updateCarrierIntegration('ups', 'enabled', value)}
                />
              </div>
              
              {carrierIntegrations.ups.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="ups-account">Identifiant de compte</Label>
                    <Input 
                      id="ups-account" 
                      value={carrierIntegrations.ups.accountId}
                      onChange={(e) => updateCarrierIntegration('ups', 'accountId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ups-api-key">Clé API</Label>
                    <Input 
                      id="ups-api-key" 
                      type="password"
                      value={carrierIntegrations.ups.apiKey}
                      onChange={(e) => updateCarrierIntegration('ups', 'apiKey', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="customs" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="customs-enabled">Intégration Douanes</Label>
                <p className="text-sm text-muted-foreground">
                  Activer l'intégration avec les services douaniers
                </p>
              </div>
              <Switch 
                id="customs-enabled"
                checked={customsEnabled}
                onCheckedChange={setCustomsEnabled}
              />
            </div>
            
            {customsEnabled && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="customs-account-id">Identifiant de compte</Label>
                  <Input 
                    id="customs-account-id" 
                    value={customsAccountId}
                    onChange={(e) => setCustomsAccountId(e.target.value)}
                    placeholder="Entrez votre identifiant de compte douanier"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customs-api-key">Clé API</Label>
                  <Input 
                    id="customs-api-key" 
                    type="password"
                    value={customsApiKey}
                    onChange={(e) => setCustomsApiKey(e.target.value)}
                    placeholder="Entrez votre clé API douanière"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customs-notes">Notes spéciales</Label>
                  <Textarea 
                    id="customs-notes" 
                    placeholder="Instructions supplémentaires pour le traitement douanier"
                    rows={3}
                  />
                </div>
                
                <div className="border p-4 rounded-md bg-amber-50 text-amber-800">
                  <p className="text-sm">
                    <strong>Note :</strong> L'intégration des services douaniers nécessite une vérification préalable 
                    de votre entreprise. Merci de contacter le service client pour plus d'informations.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="pt-6 flex justify-end">
          <Button onClick={saveSettings} disabled={saving} className="px-6">
            {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Enregistrer les modifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreightIntegrationsTab;
