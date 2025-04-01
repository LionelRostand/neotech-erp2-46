
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useToast } from '@/components/ui/use-toast';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PlusCircle, Save, Eye, Undo, Redo, ScreenShare, PanelLeft, Blocks, Settings2, Palette } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import WebsitePreview from './website-preview/WebsitePreview';
import DynamicBlocks from './editor/components/DynamicBlocks';
import ContentEditor from './editor/components/ContentEditor';
import AnimationsPanel from './editor/components/AnimationsPanel';
import { AnimationConfig } from './editor/components/AnimationsPanel';

const WebsiteCMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState('blocks');
  const [defaultLayout, setDefaultLayout] = useState([25, 75]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [pageContent, setPageContent] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSelectBlock = (blockId: string) => {
    toast({
      title: "Bloc ajouté",
      description: `Le bloc '${blockId}' a été ajouté à la page.`,
      duration: 3000,
    });
  };

  const handleSave = () => {
    toast({
      title: "Page sauvegardée",
      description: "Les modifications ont été enregistrées avec succès.",
      duration: 3000,
    });
  };

  const handleApplyAnimation = (animation: AnimationConfig) => {
    toast({
      title: "Animation appliquée",
      description: `Animation '${animation.type}' appliquée avec une durée de ${animation.duration}ms.`,
      duration: 3000,
    });
  };

  const handleContentChange = (content: string) => {
    setPageContent(content);
  };

  const dummyPages = [
    { id: 'home', title: 'Accueil', url: '/' },
    { id: 'about', title: 'À propos', url: '/about' },
    { id: 'services', title: 'Services', url: '/services' },
    { id: 'blog', title: 'Blog', url: '/blog' },
    { id: 'contact', title: 'Contact', url: '/contact' },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gestion du Contenu (CMS)</h1>
            <p className="text-sm text-muted-foreground">
              Créez et gérez le contenu de votre site avec notre éditeur drag & drop
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? "Éditer" : "Aperçu"}
            </Button>
            <Button variant="outline" size="sm">
              <Undo className="h-4 w-4 mr-1" />
              Annuler
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="h-4 w-4 mr-1" />
              Rétablir
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Enregistrer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 space-y-4">
            <div className="border rounded-md">
              <div className="bg-muted p-2 font-medium flex items-center">
                <PanelLeft className="h-4 w-4 mr-2" />
                Pages
              </div>
              <div className="p-2">
                <div className="mb-3">
                  <Button variant="outline" size="sm" className="w-full flex justify-between">
                    <span>Nouvelle page</span>
                    <PlusCircle className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {dummyPages.map(page => (
                    <div 
                      key={page.id}
                      className={`
                        rounded-md px-3 py-2 text-sm cursor-pointer flex justify-between items-center
                        ${selectedPage === page.id ? 'bg-muted' : 'hover:bg-muted/50'}
                      `}
                      onClick={() => setSelectedPage(page.id)}
                    >
                      <span className="font-medium">{page.title}</span>
                      <span className="text-xs text-muted-foreground">{page.url}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-9 border rounded-lg overflow-hidden">
            <ResizablePanelGroup 
              direction="horizontal" 
              className="min-h-[650px]"
              onLayout={(sizes) => setDefaultLayout(sizes as number[])}
            >
              <ResizablePanel 
                defaultSize={defaultLayout[0]} 
                minSize={previewMode ? 0 : 15}
                maxSize={previewMode ? 0 : 40} 
                className={previewMode ? 'hidden' : ''}
              >
                <Tabs defaultValue="blocks" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="blocks" className="flex items-center gap-1">
                      <Blocks className="h-3.5 w-3.5" /> Blocs
                    </TabsTrigger>
                    <TabsTrigger value="content" className="flex items-center gap-1">
                      <ScreenShare className="h-3.5 w-3.5" /> Contenu
                    </TabsTrigger>
                    <TabsTrigger value="animations" className="flex items-center gap-1">
                      <Palette className="h-3.5 w-3.5" /> Animations
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="blocks" className="mt-0 h-[calc(100vh-250px)] overflow-y-auto">
                    <DynamicBlocks onSelectBlock={handleSelectBlock} />
                  </TabsContent>
                  
                  <TabsContent value="content" className="mt-0">
                    <div className="p-4 space-y-6">
                      <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
                        Édition du contenu
                      </h3>
                      <ContentEditor 
                        initialContent={pageContent}
                        onChange={handleContentChange}
                        onSave={handleSave}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="animations" className="mt-0">
                    <AnimationsPanel onApplyAnimation={handleApplyAnimation} />
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
              
              {!previewMode && <ResizableHandle withHandle />}
              
              <ResizablePanel 
                defaultSize={defaultLayout[1]} 
                className="bg-background"
                minSize={60}
              >
                <div className={`${previewMode ? 'absolute inset-0 z-10 bg-background' : ''} h-full`}>
                  <div className="p-0 h-full">
                    <WebsitePreview 
                      previewMode={true} 
                      activeTemplate="cms-preview" 
                      initialContent={[]}
                    />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default WebsiteCMS;
