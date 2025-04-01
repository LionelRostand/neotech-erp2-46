
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { WebsiteIntegration } from '../types/integration-types';

interface WebsiteIntegrationProps {
  // Add the missing prop
  onCreateIntegration?: (integration: WebsiteIntegration) => void;
}

const WebsiteIntegrationComponent: React.FC<WebsiteIntegrationProps> = ({ onCreateIntegration }) => {
  const [integrationCode, setIntegrationCode] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { toast } = useToast();

  const generateIntegrationCode = () => {
    const code = `<script src="https://transport.example.com/widget.js"></script>
<div id="transport-booking-widget" data-api-key="YOUR_API_KEY"></div>`;
    
    setIntegrationCode(code);
    toast({
      title: "Code d'intégration généré",
      description: "Copiez ce code dans le HTML de votre site web."
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(integrationCode);
    toast({
      title: "Copié!",
      description: "Le code a été copié dans le presse-papier."
    });
  };

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Use URL object to validate URL
    try {
      new URL(previewUrl);
      toast({
        title: "Prévisualisation",
        description: "Chargement de la prévisualisation de l'intégration..."
      });
    } catch (error) {
      toast({
        title: "URL invalide",
        description: "Veuillez entrer une URL valide.",
        variant: "destructive"
      });
    }
  };

  const handleSaveIntegration = () => {
    // Create and save the integration object
    if (onCreateIntegration) {
      const newIntegration: WebsiteIntegration = {
        id: `integration-${Date.now()}`,
        moduleId: 'transport',
        pageId: 'booking',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        formConfig: {
          fields: [],
          services: [],
          submitButtonText: 'Réserver maintenant',
          successMessage: 'Réservation effectuée avec succès',
          termsAndConditionsText: 'J\'accepte les termes et conditions'
        },
        designConfig: {
          primaryColor: '#1E40AF',
          secondaryColor: '#60A5FA',
          backgroundColor: '#FFFFFF',
          textColor: '#111827',
          borderRadius: '0.25rem',
          buttonStyle: 'rounded',
          fontFamily: 'Inter, sans-serif',
          formWidth: '100%'
        }
      };
      
      onCreateIntegration(newIntegration);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="code">
        <TabsList>
          <TabsTrigger value="code">Code d'intégration</TabsTrigger>
          <TabsTrigger value="preview">Prévisualisation</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Générez un code d'intégration pour ajouter la fonctionnalité de réservation sur votre site web.
                  </p>
                  <Button onClick={generateIntegrationCode}>
                    Générer le code
                  </Button>
                </div>
                
                {integrationCode && (
                  <div className="space-y-2">
                    <Label htmlFor="integration-code">Code d'intégration</Label>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                        {integrationCode}
                      </pre>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={handleCopyCode}
                      >
                        Copier
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Copiez ce code et collez-le dans votre site web où vous souhaitez afficher le widget de réservation.
                    </p>
                  </div>
                )}
                
                <Button onClick={handleSaveIntegration} className="mt-4">
                  Enregistrer l'intégration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handlePreviewSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="previewUrl">URL de votre site</Label>
                  <Input 
                    id="previewUrl"
                    placeholder="https://votresite.com"
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                  />
                </div>
                
                <Button type="submit">
                  Prévisualiser l'intégration
                </Button>
              </form>
              
              {previewUrl && (
                <div className="mt-6">
                  <Label>Prévisualisation</Label>
                  <div className="border rounded-md h-[400px] mt-2 flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground">
                      Prévisualisation de l'intégration sur {previewUrl}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Configurez l'apparence et le comportement du widget de réservation.
              </p>
              
              <div className="space-y-4">
                <p>Configuration non disponible pour le moment.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteIntegrationComponent;
