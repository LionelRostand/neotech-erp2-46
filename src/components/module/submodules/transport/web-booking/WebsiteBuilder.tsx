
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Eye, Save, Edit, Settings, Image, Undo, Redo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WebBookingPreview from './WebBookingPreview';
import WebBookingEditorSidebar from './WebBookingEditorSidebar';
import SettingsForm from './SettingsForm';

const WebsiteBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [defaultLayout, setDefaultLayout] = useState([20, 80]);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const { toast } = useToast();

  const handleSave = () => {
    setSavedMessage('Modifications enregistrées');
    toast({
      title: "Site sauvegardé",
      description: "Toutes vos modifications ont été enregistrées.",
      duration: 3000,
    });
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handlePublish = () => {
    toast({
      title: "Site publié",
      description: "Votre site de réservation est maintenant accessible au public.",
      duration: 3000,
    });
  };

  return (
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
        </div>
      </div>

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
                    <WebBookingEditorSidebar />
                  </div>
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={defaultLayout[1]} className="bg-background">
                  <div className="h-full overflow-y-auto p-4">
                    <WebBookingPreview isEditing={true} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </TabsContent>

            <TabsContent value="settings" className="h-[calc(100vh-334px)] p-4 overflow-y-auto">
              <SettingsForm />
            </TabsContent>

            <TabsContent value="media" className="h-[calc(100vh-334px)] p-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des médias</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Gérez les images, vidéos et autres médias utilisés sur votre site de réservation.
                  </p>
                  <div className="mt-6">
                    <p className="text-center text-muted-foreground">
                      La gestion des médias sera disponible prochainement.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Card className="h-[calc(100vh-280px)]">
          <CardHeader>
            <CardTitle>Prévisualisation du site</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100vh-356px)] overflow-auto">
            <WebBookingPreview isEditing={false} />
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
  );
};

export default WebsiteBuilder;
