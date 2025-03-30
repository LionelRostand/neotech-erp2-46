
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  Save, 
  Code, 
  Eye, 
  Layout, 
  Type, 
  Image, 
  FileText, 
  Sidebar, 
  FormInput, 
  Video, 
  ListOrdered,
  Table,
  Grid3X3,
  MessageSquare,
  Search,
  Settings,
  PanelLeft,
  PanelRight,
  Layers,
  BoxSelect,
  Edit3
} from 'lucide-react';
import EditorSidebar from './editor/EditorSidebar';
import EditorToolbar from './editor/EditorToolbar';
import EditorCanvas from './editor/EditorCanvas';
import DevModePanel from './editor/DevModePanel';
import EditorTemplatesPanel from './editor/EditorTemplatesPanel';
import EditorPropertiesPanel from './editor/EditorPropertiesPanel';
import { useToast } from '@/components/ui/use-toast';

const WebsiteEditor = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showProperties, setShowProperties] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeTab, setActiveTab] = useState<'elements' | 'components' | 'blocks'>('elements');

  const handlePreviewClick = () => {
    // URL à adapter selon la structure de votre application
    const previewUrl = `/preview/website?page=${currentPage}`;
    window.open(previewUrl, '_blank');
  };
  
  const handleDeleteElement = (elementId: string) => {
    // Cette fonction sera passée à EditorCanvas via EditorPropertiesPanel
    // Elle est définie ici pour être cohérente avec l'état global
    toast({
      description: "Élément supprimé avec succès",
    });
    setSelectedElement(null);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="border-b pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold mr-4">Éditeur de site web</h2>
            <div className="border rounded-md p-1 flex">
              <Button 
                variant={viewMode === 'desktop' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('desktop')}
              >
                <Laptop className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Bureau</span>
              </Button>
              <Button 
                variant={viewMode === 'tablet' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('tablet')}
              >
                <Tablet className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Tablette</span>
              </Button>
              <Button 
                variant={viewMode === 'mobile' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Mobile</span>
              </Button>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => setShowCode(!showCode)}>
              <Code className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Code</span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowTemplates(!showTemplates)}>
              <Layout className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Templates</span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowProperties(!showProperties)}>
              <Settings className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Propriétés</span>
            </Button>
            <Button size="sm" onClick={handlePreviewClick}>
              <Eye className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Aperçu</span>
            </Button>
            <Button size="sm" variant="default">
              <Save className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Enregistrer</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 mt-2 overflow-hidden">
        {/* Left Sidebar - Elements */}
        {!showTemplates && (
          <div className="w-64 border-r pr-2 overflow-y-auto">
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'elements' | 'components' | 'blocks')} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="elements">Éléments</TabsTrigger>
                <TabsTrigger value="components">Composants</TabsTrigger>
                <TabsTrigger value="blocks">Blocs</TabsTrigger>
              </TabsList>
              <TabsContent value="elements" className="mt-2">
                <EditorSidebar />
              </TabsContent>
              <TabsContent value="components" className="mt-2">
                <div className="space-y-3">
                  <Card className="p-3 cursor-move hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-2">
                      <Grid3X3 className="h-4 w-4 text-primary" />
                      <span>Navigation</span>
                    </div>
                  </Card>
                  <Card className="p-3 cursor-move hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-2">
                      <FormInput className="h-4 w-4 text-primary" />
                      <span>Formulaire de contact</span>
                    </div>
                  </Card>
                  <Card className="p-3 cursor-move hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-2">
                      <Image className="h-4 w-4 text-primary" />
                      <span>Galerie d'images</span>
                    </div>
                  </Card>
                  <Card className="p-3 cursor-move hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span>Témoignages</span>
                    </div>
                  </Card>
                  <Card className="p-3 cursor-move hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-primary" />
                      <span>Recherche</span>
                    </div>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="blocks" className="mt-2">
                <div className="space-y-3">
                  <Card className="p-3 cursor-move hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-2">
                      <Layers className="h-4 w-4 text-primary" />
                      <span>En-tête avec bannière</span>
                    </div>
                  </Card>
                  <Card className="p-3 cursor-move hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-2">
                      <BoxSelect className="h-4 w-4 text-primary" />
                      <span>Grille de services</span>
                    </div>
                  </Card>
                  <Card className="p-3 cursor-move hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-2">
                      <Edit3 className="h-4 w-4 text-primary" />
                      <span>Section blog</span>
                    </div>
                  </Card>
                  <Card className="p-3 cursor-move hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-2">
                      <PanelLeft className="h-4 w-4 text-primary" />
                      <span>Bloc CTA</span>
                    </div>
                  </Card>
                  <Card className="p-3 cursor-move hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-2">
                      <PanelRight className="h-4 w-4 text-primary" />
                      <span>Pied de page complet</span>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Templates Panel (Conditional) */}
        {showTemplates && (
          <div className="w-72 border-r pr-2 overflow-y-auto">
            <EditorTemplatesPanel onClose={() => setShowTemplates(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto flex flex-col">
          <EditorToolbar />
          
          <div className={`flex-1 p-4 overflow-auto ${viewMode === 'tablet' ? 'max-w-[768px] mx-auto' : viewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`}>
            <EditorCanvas 
              viewMode={viewMode} 
              onSelectElement={setSelectedElement} 
            />
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        {showProperties && (
          <div className="w-72 border-l pl-2 overflow-y-auto">
            <EditorPropertiesPanel 
              selectedElement={selectedElement} 
              onDeleteElement={handleDeleteElement}
            />
          </div>
        )}

        {/* Code Panel (Conditional) */}
        {showCode && (
          <div className="w-96 border-l pl-2 overflow-y-auto">
            <DevModePanel onClose={() => setShowCode(false)} />
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t mt-2 py-1 px-2 flex justify-between text-xs text-muted-foreground">
        <div>Page: {currentPage}</div>
        <div>Version: 1.0</div>
      </div>
    </div>
  );
};

export default WebsiteEditor;
