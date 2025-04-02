
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';
import { WebsiteIntegration as WebsiteIntegrationType } from '../types/integration-types';
import { v4 as uuidv4 } from 'uuid';

interface WebsiteIntegrationProps {
  onCreateIntegration: (integration: WebsiteIntegrationType) => void;
}

const WebsiteIntegration: React.FC<WebsiteIntegrationProps> = ({ onCreateIntegration }) => {
  const [activeTab, setActiveTab] = useState('embed');
  const [copied, setCopied] = useState(false);
  const [customization, setCustomization] = useState({
    hideHeader: false,
    hideFooter: false,
    autoHeight: true,
    darkMode: false,
    customColors: false
  });

  // Code d'intégration pour l'iframe
  const embedCode = `<iframe 
  src="https://booking.example.com/transport?hide_header=${customization.hideHeader}&hide_footer=${customization.hideFooter}&auto_height=${customization.autoHeight}&dark_mode=${customization.darkMode}" 
  style="width:100%; height:600px; border:none; border-radius:4px;" 
  title="Réservation de transport" 
  allow="geolocation">
</iframe>`;

  // Code pour l'API
  const apiCode = `// Exemple d'utilisation de l'API de réservation
fetch('https://api.example.com/transport/booking', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    origin: '123 Rue Principale, Paris',
    destination: 'Aéroport Charles de Gaulle',
    date: '2023-06-15',
    time: '14:30',
    passengers: 2,
    vehicle_type: 'standard'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateIntegration = () => {
    // Créer une nouvelle intégration
    const newIntegration: WebsiteIntegrationType = {
      id: uuidv4(),
      moduleId: 'transport',
      pageId: 'booking',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      formConfig: {
        fields: [
          { name: 'origin', label: 'Départ', type: 'text', required: true, visible: true },
          { name: 'destination', label: 'Destination', type: 'text', required: true, visible: true },
          { name: 'date', label: 'Date', type: 'date', required: true, visible: true },
          { name: 'time', label: 'Heure', type: 'time', required: true, visible: true },
          { name: 'passengers', label: 'Passagers', type: 'select', required: true, visible: true, 
            options: [
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4+' }
            ] 
          },
        ],
        services: [
          { id: '1', name: 'Standard' },
          { id: '2', name: 'Premium' },
          { id: '3', name: 'Van' }
        ],
        submitButtonText: 'Réserver maintenant',
        successMessage: 'Votre réservation a été effectuée avec succès !',
        termsAndConditionsText: 'En réservant, vous acceptez nos conditions générales.'
      },
      designConfig: {
        primaryColor: '#1E40AF',
        secondaryColor: '#60A5FA',
        backgroundColor: '#FFFFFF',
        textColor: '#111827',
        borderRadius: 'medium',
        buttonStyle: 'rounded',
        fontFamily: 'Inter',
        formWidth: '100%',
      }
    };
    
    onCreateIntegration(newIntegration);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="embed">Code d'intégration</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="direct-link">Lien direct</TabsTrigger>
        </TabsList>

        <TabsContent value="embed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-base font-medium mb-2">Options d'intégration</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-header">Masquer l'en-tête</Label>
                  <Switch 
                    id="hide-header" 
                    checked={customization.hideHeader} 
                    onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, hideHeader: checked }))} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-footer">Masquer le pied de page</Label>
                  <Switch 
                    id="hide-footer" 
                    checked={customization.hideFooter}
                    onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, hideFooter: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-height">Hauteur automatique</Label>
                  <Switch 
                    id="auto-height" 
                    checked={customization.autoHeight}
                    onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, autoHeight: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Mode sombre</Label>
                  <Switch 
                    id="dark-mode" 
                    checked={customization.darkMode}
                    onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, darkMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="custom-colors">Utiliser couleurs personnalisées</Label>
                  <Switch 
                    id="custom-colors" 
                    checked={customization.customColors}
                    onCheckedChange={(checked) => setCustomization(prev => ({ ...prev, customColors: checked }))}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-base font-medium mb-2">Code à intégrer</h4>
              <div className="relative">
                <div className="bg-gray-50 border rounded-md p-3 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{embedCode}</pre>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2" 
                  onClick={() => handleCopy(embedCode)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Copiez ce code et collez-le dans la section appropriée de votre site web.
              </p>
            </div>
          </div>

          <Card className="mt-6">
            <CardContent className="pt-6">
              <h4 className="text-base font-medium mb-2">Aperçu de l'intégration</h4>
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <Code className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Aperçu de l'intégration</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleCreateIntegration}>
              Créer l'intégration
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <div>
            <h4 className="text-base font-medium mb-2">API de réservation</h4>
            <p className="text-muted-foreground mb-4">
              Utilisez notre API pour intégrer les fonctionnalités de réservation directement dans votre application.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key">Clé API</Label>
                <div className="flex mt-1">
                  <Input id="api-key" value="••••••••••••••••••••••••••••••" readOnly className="rounded-r-none" />
                  <Button variant="outline" className="rounded-l-none border-l-0" onClick={() => handleCopy("YOUR_API_KEY")}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ne partagez jamais votre clé API publiquement.
                </p>
              </div>

              <div>
                <Label>Exemple de code</Label>
                <div className="relative mt-1">
                  <div className="bg-gray-50 border rounded-md p-3 font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{apiCode}</pre>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute top-2 right-2" 
                    onClick={() => handleCopy(apiCode)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Documentation API
              </Button>
              <Button variant="outline">
                Régénérer la clé API
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="direct-link" className="space-y-4">
          <div>
            <h4 className="text-base font-medium mb-2">Lien direct vers le système de réservation</h4>
            <p className="text-muted-foreground mb-4">
              Partagez ce lien pour permettre à vos clients d'accéder directement au système de réservation.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="booking-link">URL de réservation</Label>
                <div className="flex mt-1">
                  <Input id="booking-link" value="https://booking.example.com/transport" readOnly className="rounded-r-none" />
                  <Button variant="outline" className="rounded-l-none border-l-0" onClick={() => handleCopy("https://booking.example.com/transport")}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="custom-slug">Personnaliser l'URL</Label>
                <div className="flex items-center mt-1">
                  <div className="bg-gray-50 border border-r-0 rounded-l-md px-3 py-2 text-muted-foreground">
                    https://booking.example.com/
                  </div>
                  <Input id="custom-slug" placeholder="mon-service" className="rounded-l-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <Button>
                Mettre à jour l'URL
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir dans un nouvel onglet
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteIntegration;
