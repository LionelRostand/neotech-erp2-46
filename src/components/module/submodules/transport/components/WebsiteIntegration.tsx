
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { WebsiteIntegration as WebsiteIntegrationType } from '../types/integration-types';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { generateIntegrationCode } from '../utils/website-integration';

interface WebsiteIntegrationProps {
  onCreateIntegration?: (integration: WebsiteIntegrationType) => void;
}

const WebsiteIntegrationComponent: React.FC<WebsiteIntegrationProps> = ({ onCreateIntegration }) => {
  const [integrationCode, setIntegrationCode] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedIntegrationType, setSelectedIntegrationType] = useState('script');
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      websiteUrl: '',
      integrationMethod: 'script',
      autoResize: true,
      language: 'fr',
    },
  });

  const handleGenerateCode = () => {
    const newIntegration: WebsiteIntegrationType = {
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
    
    const code = generateIntegrationCode(newIntegration);
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
    if (onCreateIntegration) {
      const newIntegration: WebsiteIntegrationType = {
        id: `integration-${Date.now()}`,
        moduleId: 'transport',
        pageId: 'booking',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        formConfig: {
          fields: [
            { 
              name: 'name', 
              label: 'Nom', 
              type: 'text', 
              required: true, 
              visible: true 
            },
            { 
              name: 'email', 
              label: 'Email', 
              type: 'email', 
              required: true, 
              visible: true 
            },
            { 
              name: 'phone', 
              label: 'Téléphone', 
              type: 'tel', 
              required: true, 
              visible: true 
            },
            { 
              name: 'service', 
              label: 'Service', 
              type: 'select', 
              required: true, 
              visible: true,
              options: [
                { value: 'airport', label: 'Transfert aéroport' },
                { value: 'dayRent', label: 'Location journée' },
                { value: 'touristic', label: 'Visite touristique' }
              ]
            },
          ],
          services: [
            { id: 'airport', name: 'Transfert aéroport', price: 50 },
            { id: 'dayRent', name: 'Location journée', price: 120 },
            { id: 'touristic', name: 'Visite touristique', price: 80 }
          ],
          submitButtonText: 'Réserver maintenant',
          successMessage: 'Réservation effectuée avec succès',
          termsAndConditionsText: 'J\'accepte les termes et conditions'
        },
        designConfig: {
          primaryColor: '#1E40AF',
          secondaryColor: '#60A5FA',
          backgroundColor: '#FFFFFF',
          textColor: '#111827',
          borderRadius: '0.375rem',
          buttonStyle: 'rounded',
          fontFamily: 'Inter, sans-serif',
          formWidth: '100%'
        }
      };
      
      onCreateIntegration(newIntegration);
      toast({
        title: "Intégration enregistrée",
        description: "Votre configuration d'intégration a été sauvegardée avec succès."
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="code">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="code">Code d'intégration</TabsTrigger>
          <TabsTrigger value="preview">Prévisualisation</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Form {...form}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL de votre site web</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="integrationMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Méthode d'intégration</FormLabel>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedIntegrationType(value);
                          }} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choisir une méthode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="script">Script JavaScript</SelectItem>
                              <SelectItem value="iframe">iFrame</SelectItem>
                              <SelectItem value="api">API REST</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="autoResize"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-3">
                          <div>
                            <FormLabel>Redimensionnement automatique</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Ajuster automatiquement la taille du formulaire
                            </p>
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
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Langue</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choisir une langue" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="en">Anglais</SelectItem>
                              <SelectItem value="es">Espagnol</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button onClick={handleGenerateCode} className="mt-6">
                    Générer le code d'intégration
                  </Button>
                </Form>
                
                {integrationCode && (
                  <div className="space-y-2 mt-6">
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
                  <div className="flex w-full space-x-2">
                    <Input 
                      id="previewUrl"
                      placeholder="https://votresite.com"
                      value={previewUrl}
                      onChange={(e) => setPreviewUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit">
                      Prévisualiser
                    </Button>
                  </div>
                </div>
                
                {previewUrl && (
                  <div className="mt-6">
                    <Label>Prévisualisation</Label>
                    <div className="border rounded-md h-[400px] mt-2 flex flex-col items-center justify-center bg-muted">
                      <iframe 
                        src={previewUrl.startsWith('http') ? previewUrl : `https://${previewUrl}`}
                        className="w-full h-full border-0"
                        title="Prévisualisation du widget"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  </div>
                )}
              </form>
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="primary-color">Couleur principale</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        id="primary-color" 
                        type="color" 
                        defaultValue="#1E40AF" 
                        className="w-12 h-10 p-1"
                      />
                      <Input defaultValue="#1E40AF" className="flex-1" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondary-color">Couleur secondaire</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        id="secondary-color" 
                        type="color" 
                        defaultValue="#60A5FA" 
                        className="w-12 h-10 p-1"
                      />
                      <Input defaultValue="#60A5FA" className="flex-1" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="font-family">Police d'écriture</Label>
                    <Select defaultValue="inter">
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Choisir une police" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="opensans">Open Sans</SelectItem>
                        <SelectItem value="montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="border-radius">Arrondi des bordures</Label>
                    <Select defaultValue="md">
                      <SelectTrigger id="border-radius">
                        <SelectValue placeholder="Choisir un style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucun</SelectItem>
                        <SelectItem value="sm">Petit (2px)</SelectItem>
                        <SelectItem value="md">Moyen (4px)</SelectItem>
                        <SelectItem value="lg">Grand (8px)</SelectItem>
                        <SelectItem value="full">Complet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="font-medium mb-2">Options de formulaire</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div>
                        <Label>Champ Nom</Label>
                        <p className="text-sm text-muted-foreground">Afficher le champ nom</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div>
                        <Label>Champ Email</Label>
                        <p className="text-sm text-muted-foreground">Afficher le champ email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div>
                        <Label>Champ Téléphone</Label>
                        <p className="text-sm text-muted-foreground">Afficher le champ téléphone</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Button className="mt-4">
                  Sauvegarder les paramètres
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteIntegrationComponent;
