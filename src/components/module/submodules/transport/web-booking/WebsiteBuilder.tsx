
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Eye, Save, Edit, Settings, Image, Undo, Redo, MessageSquare, Code, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WebBookingPreview from './WebBookingPreview';
import WebBookingEditorSidebar from './WebBookingEditorSidebar';
import SettingsForm from './SettingsForm';
import MediaManager from './MediaManager';
import CustomerContactForm from './CustomerContactForm';
import DevModePanel from '../../website/editor/DevModePanel';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { WebBookingConfig } from '../types/web-booking-types';
import PublishDialog from './PublishDialog';

const WebsiteBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [defaultLayout, setDefaultLayout] = useState([20, 80]);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [showDevMode, setShowDevMode] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const { toast } = useToast();
  
  // Sample initial config for the website
  const [webConfig, setWebConfig] = useState<WebBookingConfig>({
    title: "RentaCar - Location de véhicules",
    subtitle: "Location de véhicules de qualité",
    logo: "/logo.png",
    primaryColor: "#ff5f00",
    secondaryColor: "#003366",
    fontFamily: "Inter",
    headerBackground: "#ffffff",
    footerBackground: "#f5f5f5",
    banner: {
      enabled: true,
      text: "Réservez votre véhicule en quelques clics",
      background: "#003366",
      textColor: "#ffffff",
      position: "top"
    },
    contactInfo: {
      phone: "+33 1 23 45 67 89",
      email: "contact@rentacar.fr",
      address: "15 Avenue des Champs-Élysées, 75008 Paris"
    },
    socialLinks: {
      facebook: "https://facebook.com/rentacar",
      twitter: "https://twitter.com/rentacar",
      instagram: "https://instagram.com/rentacar",
      linkedin: "https://linkedin.com/company/rentacar"
    },
    bookingFormSettings: {
      requireLogin: false,
      showPrices: true,
      allowTimeSelection: true,
      requirePhoneNumber: true,
      allowComments: true,
      paymentOptions: ["credit-card", "paypal", "bank-transfer"],
      termsUrl: "/terms"
    },
    siteTitle: "RentaCar - Location de véhicules",
    enableBookingForm: true,
    requiredFields: ["pickup_location", "dropoff_location", "pickup_date", "dropoff_date"],
    menuItems: [
      { id: '1', label: 'Accueil', url: '/', isExternal: false, isActive: true },
      { id: '2', label: 'Nos Véhicules', url: '/vehicules', isExternal: false, isActive: true },
      { id: '3', label: 'Tarifs', url: '/tarifs', isExternal: false, isActive: true },
      { id: '4', label: 'Contact', url: '/contact', isExternal: false, isActive: true },
    ],
    bannerConfig: {
      title: "Réservez votre véhicule en quelques clics",
      subtitle: "Des tarifs compétitifs et un service de qualité pour tous vos déplacements",
      backgroundColor: "#003366",
      textColor: "#ffffff",
      backgroundImage: "/images/car1.jpg",
      buttonText: "Réserver maintenant",
      buttonLink: "#reservation",
      overlay: true,
      overlayOpacity: 50,
    }
  });

  // Load saved configuration from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('web-booking-config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setWebConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to parse saved config:', error);
      }
    }
  }, []);

  const handleSave = () => {
    setSavedMessage('Modifications enregistrées');
    toast({
      title: "Site sauvegardé",
      description: "Toutes vos modifications ont été enregistrées.",
      duration: 3000,
    });
    setTimeout(() => setSavedMessage(null), 3000);
    
    // Sauvegarder dans un stockage persistant
    localStorage.setItem('web-booking-config', JSON.stringify(webConfig));
  };

  const handlePublish = () => {
    setIsPublishDialogOpen(true);
  };

  const completePublish = (customDomain?: string) => {
    // Générer une URL publique (simulation)
    const domain = customDomain || `rentacar-${Math.floor(Math.random() * 1000)}.booking-demo.com`;
    setPublishedUrl(domain);
    setIsPublished(true);
    
    toast({
      title: "Site publié",
      description: "Votre site de réservation est maintenant accessible au public.",
      duration: 3000,
    });
    
    setIsPublishDialogOpen(false);
  };

  const toggleDevMode = () => {
    setShowDevMode(!showDevMode);
  };

  const updateConfig = (newConfig: Partial<WebBookingConfig>) => {
    setWebConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleSettingsUpdate = (updatedConfig: WebBookingConfig) => {
    setWebConfig(updatedConfig);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Éditeur de site de réservation</h3>
            {savedMessage && (
              <span className="text-sm text-green-600 ml-4 animate-in fade-in">
                {savedMessage}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant={isEditing ? "default" : "outline"} 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Éditer
            </Button>
            <Button 
              variant={!isEditing ? "default" : "outline"} 
              size="sm" 
              onClick={() => setIsEditing(false)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Prévisualiser
            </Button>
            <Button 
              variant={showDevMode ? "default" : "outline"} 
              size="sm" 
              onClick={toggleDevMode}
            >
              <Code className="h-4 w-4 mr-1" />
              Code
            </Button>
            <Button variant="outline" size="sm">
              <Undo className="h-4 w-4 mr-1" />
              Annuler
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="h-4 w-4 mr-1" />
              Rétablir
            </Button>
            <Button onClick={handleSave} variant="outline" size="sm">
              <Save className="h-4 w-4 mr-1" />
              Enregistrer
            </Button>
            <Button onClick={handlePublish}>
              Publier
            </Button>
            
            {isPublished && (
              <Button variant="outline" size="sm" onClick={() => window.open(publishedUrl, '_blank')}>
                <Globe className="h-4 w-4 mr-1" />
                Voir le site
              </Button>
            )}
          </div>
        </div>

        {/* Publier le site dialog */}
        <PublishDialog 
          isOpen={isPublishDialogOpen} 
          onClose={() => setIsPublishDialogOpen(false)}
          onPublish={completePublish}
          publishedUrl={publishedUrl}
          isPublished={isPublished}
        />

        {isEditing ? (
          <div className="border rounded-lg overflow-hidden h-[calc(100vh-280px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b px-4 py-2">
                <TabsList>
                  <TabsTrigger value="design" className="flex items-center">
                    <Edit className="h-4 w-4 mr-1" />
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    Paramètres
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center">
                    <Image className="h-4 w-4 mr-1" />
                    Médias
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contact
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="design" className="m-0 p-0 h-[calc(100vh-334px)]">
                <ResizablePanelGroup 
                  direction="horizontal" 
                  onLayout={(sizes) => setDefaultLayout(sizes as number[])}
                  className="h-full"
                >
                  <ResizablePanel defaultSize={defaultLayout[0]} minSize={15} maxSize={40} className="bg-background">
                    <div className="h-full overflow-y-auto p-4">
                      {showDevMode ? (
                        <DevModePanel onClose={toggleDevMode} />
                      ) : (
                        <WebBookingEditorSidebar config={webConfig} onConfigUpdate={updateConfig} />
                      )}
                    </div>
                  </ResizablePanel>
                  
                  <ResizableHandle withHandle />
                  
                  <ResizablePanel defaultSize={defaultLayout[1]} className="bg-background">
                    <div className="h-full overflow-y-auto p-4">
                      <WebBookingPreview isEditing={true} config={webConfig} />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </TabsContent>

              <TabsContent value="settings" className="h-[calc(100vh-334px)] p-4 overflow-y-auto">
                <SettingsForm initialConfig={webConfig} onSave={handleSettingsUpdate} />
              </TabsContent>

              <TabsContent value="media" className="h-[calc(100vh-334px)] p-4 overflow-y-auto">
                <MediaManager />
              </TabsContent>

              <TabsContent value="contact" className="h-[calc(100vh-334px)] p-4 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Formulaire de contact client</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ce formulaire permettra à vos clients de vous contacter directement depuis votre site de réservation.
                      Les messages seront transmis au service client.
                    </p>
                  </div>
                  <CustomerContactForm isEditable={true} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card className="h-[calc(100vh-280px)]">
            <CardHeader>
              <CardTitle>Prévisualisation du site</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100vh-356px)] overflow-auto">
              <WebBookingPreview isEditing={false} config={webConfig} />
            </CardContent>
            <CardFooter className="border-t p-4 flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Prévisualisez votre site tel qu'il apparaîtra aux clients.
                </p>
              </div>
              <Button onClick={() => setIsEditing(true)}>
                Retour à l'éditeur
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DndProvider>
  );
};

export default WebsiteBuilder;
