
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Eye, Save, Code, Settings, Undo, Redo, Layout, MoreVertical } from 'lucide-react';
import EditorSidebar from './editor/EditorSidebar';
import WebsitePreview from './website-preview/WebsitePreview';

const WebsiteEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('design');
  const [defaultLayout, setDefaultLayout] = useState([20, 80]);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSave = () => {
    setSavedMessage('Modifications enregistrées');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Éditeur de site web</h1>
          {savedMessage && (
            <span className="text-sm text-green-600 ml-4 animate-in fade-in">
              {savedMessage}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Undo className="h-4 w-4 mr-1" />
            Annuler
          </Button>
          <Button variant="outline" size="sm">
            <Redo className="h-4 w-4 mr-1" />
            Rétablir
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Prévisualiser
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Enregistrer
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="design" className="flex items-center">
              <Layout className="h-4 w-4 mr-1" />
              Conception
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center">
              <Code className="h-4 w-4 mr-1" />
              Code
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-1" />
              Paramètres
            </TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <TabsContent value="design" className="mt-4">
          <div className="border rounded-lg overflow-hidden h-[calc(100vh-280px)]">
            <ResizablePanelGroup 
              direction="horizontal" 
              onLayout={(sizes) => setDefaultLayout(sizes as number[])}
            >
              <ResizablePanel defaultSize={defaultLayout[0]} minSize={15} maxSize={40} className="bg-background">
                <div className="h-full overflow-y-auto">
                  <EditorSidebar />
                </div>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={defaultLayout[1]} className="bg-background">
                <div className="h-full overflow-y-auto p-4">
                  <WebsitePreview previewMode={false} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          <div className="h-[calc(100vh-280px)] border rounded-lg flex">
            <div className="flex-1 p-4 bg-muted/30 overflow-auto font-mono">
              <pre className="text-xs">{`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mon Site Web</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <nav>
      <div class="logo">Logo</div>
      <ul>
        <li><a href="#accueil">Accueil</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section id="accueil">
      <h1>Bienvenue sur Mon Site</h1>
      <p>Un site web professionnel pour votre entreprise.</p>
    </section>
    
    <!-- Autres sections -->
  </main>
  
  <footer>
    <p>© 2025 Mon Site. Tous droits réservés.</p>
  </footer>
</body>
</html>`}</pre>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <div className="h-[calc(100vh-280px)] border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Paramètres du site</h3>
            <p className="text-muted-foreground">
              Configurez les paramètres généraux de votre site web, le SEO, et les options de publication.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteEditor;
