
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronsUpDown } from '@/components/ui/ui-utils';
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
  Edit3,
  Globe,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import EditorSidebar from './editor/EditorSidebar';
import EditorToolbar from './editor/EditorToolbar';
import EditorCanvas from './editor/EditorCanvas';
import DevModePanel from './editor/DevModePanel';
import EditorTemplatesPanel from './editor/EditorTemplatesPanel';
import EditorPropertiesPanel from './editor/EditorPropertiesPanel';
import EditorFloatingToolbar from './editor/EditorFloatingToolbar';
import WebsitePreview from './website-preview/WebsitePreview';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const WebsiteEditor = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showProperties, setShowProperties] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeTab, setActiveTab] = useState<'elements' | 'components' | 'blocks'>('elements');
  
  // Nouvel état pour l'édition directe (inline editing)
  const [isDirectEditMode, setIsDirectEditMode] = useState(false);
  const [floatingToolbarVisible, setFloatingToolbarVisible] = useState(false);
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState({ top: 0, left: 0 });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentPageContent, setCurrentPageContent] = useState<any[]>([]);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  
  // Nouvel état pour la sélection de page
  const [pageSelectDialogOpen, setPageSelectDialogOpen] = useState(false);
  const [availablePages, setAvailablePages] = useState([
    { id: 'home', name: 'Page d\'accueil', path: '/' },
    { id: 'about', name: 'À propos', path: '/about' },
    { id: 'services', name: 'Services', path: '/services' },
    { id: 'contact', name: 'Contact', path: '/contact' },
    { id: 'blog', name: 'Blog', path: '/blog' },
  ]);
  
  // Nouveaux états pour la publication
  const [domainSettings, setDomainSettings] = useState({
    customDomain: '',
    useLovableDomain: true
  });

  // Importer les éléments existants lors du chargement initial
  useEffect(() => {
    // Simuler le chargement du contenu de la page
    const savedContent = [
      {
        id: 'header-1',
        type: 'header',
        content: '<div class="p-4 bg-primary/10"><h1 class="text-2xl font-bold">Mon Site Web</h1><p>Bienvenue sur mon site</p></div>'
      },
      {
        id: 'section-1',
        type: 'section',
        content: `
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">Section Principale</h2>
            <p>Ceci est un exemple de section. Vous pouvez modifier ce contenu en cliquant dessus.</p>
            <div class="mt-4">
              <button class="bg-primary text-white px-4 py-2 rounded">En savoir plus</button>
            </div>
          </div>
        `
      },
      {
        id: 'image-1',
        type: 'image',
        content: '<div class="p-4"><img src="https://via.placeholder.com/800x400" class="w-full h-auto rounded" alt="Placeholder" /></div>'
      }
    ];
    
    setCurrentPageContent(savedContent);
  }, [currentPage]);

  const handlePreviewClick = () => {
    setIsPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      toast({
        description: "Mode prévisualisation activé",
      });
    } else {
      toast({
        description: "Mode édition réactivé",
      });
    }
  };
  
  const handleDeleteElement = (elementId: string) => {
    toast({
      description: "Élément supprimé avec succès",
    });
    setSelectedElement(null);
    
    // Mettre à jour la liste des éléments
    setCurrentPageContent(prevContent => 
      prevContent.filter(element => element.id !== elementId)
    );
  };
  
  const toggleDirectEditMode = () => {
    setIsDirectEditMode(!isDirectEditMode);
    toast({
      description: !isDirectEditMode 
        ? "Mode d'édition directe activé - Cliquez sur un élément pour l'éditer" 
        : "Mode d'édition directe désactivé",
    });
  };
  
  const handleFloatingToolbarAction = (action: string) => {
    // Implémenter les actions de mise en forme du texte
    toast({
      description: `Format ${action} appliqué`,
    });
  };
  
  const handleElementSelection = (element: any) => {
    setSelectedElement(element);
    
    // Afficher la barre d'outils flottante
    if (isDirectEditMode) {
      // Calculer la position basée sur les propriétés de l'élément sélectionné
      // (Cette partie serait normalement basée sur la position DOM réelle de l'élément)
      setFloatingToolbarPosition({
        top: 200,
        left: 300
      });
      setFloatingToolbarVisible(true);
    }
  };
  
  const handleSave = () => {
    toast({
      description: "Page enregistrée avec succès",
    });
  };

  const handlePublishClick = () => {
    // Simuler la publication du site
    setPublishDialogOpen(true);
  };

  const handleOpenPublishedSite = () => {
    // Ouvrir le site publié dans un nouvel onglet
    let url = '/modules/website/public';
    
    // Si un domaine personnalisé est configuré et actif
    if (!domainSettings.useLovableDomain && domainSettings.customDomain) {
      url = `https://${domainSettings.customDomain}`;
    }
    
    window.open(url, '_blank');
    setPublishDialogOpen(false);
    toast({
      description: "Site ouvert dans un nouvel onglet",
    });
  };
  
  // Nouvelle fonction pour gérer l'ouverture du sélecteur de page
  const handleOpenPageSelector = () => {
    setPageSelectDialogOpen(true);
  };
  
  // Nouvelle fonction pour gérer la sélection d'une page
  const handlePageSelection = (pageId: string) => {
    const selectedPage = availablePages.find(page => page.id === pageId);
    if (selectedPage) {
      setCurrentPage(pageId);
      toast({
        description: `Page "${selectedPage.name}" chargée`,
      });
    }
    setPageSelectDialogOpen(false);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="border-b pb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center flex-wrap gap-2">
          <h2 className="text-2xl font-bold mr-4">Éditeur de site web</h2>
          <div>
            <Button variant="outline" size="sm" className="mr-2" onClick={handleOpenPageSelector}>
              <Globe className="h-4 w-4 mr-1" />
              <span>
                {availablePages.find(p => p.id === currentPage)?.name || 'Page d\'accueil'}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </div>
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
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant={isDirectEditMode ? "default" : "outline"} onClick={toggleDirectEditMode}>
            <Edit3 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Édition directe</span>
          </Button>
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
          <Button size="sm" variant={isPreviewMode ? "default" : "outline"} onClick={handlePreviewClick}>
            <Eye className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Aperçu</span>
          </Button>
          <Button size="sm" variant="default" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Enregistrer</span>
          </Button>
          <Button size="sm" variant="outline" onClick={handlePublishClick}>
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Publier</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 mt-2 overflow-hidden">
        {/* Left Sidebar - Elements (pas affiché en mode prévisualisation) */}
        {!showTemplates && !isPreviewMode && (
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

        {/* Templates Panel (Conditional) - pas affiché en mode prévisualisation */}
        {showTemplates && !isPreviewMode && (
          <div className="w-72 border-r pr-2 overflow-y-auto">
            <EditorTemplatesPanel onClose={() => setShowTemplates(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto flex flex-col">
          {!isPreviewMode && <EditorToolbar />}
          
          {isPreviewMode ? (
            <div className="flex-1 p-4 overflow-auto">
              <WebsitePreview 
                previewMode={true} 
                initialContent={currentPageContent} 
              />
            </div>
          ) : isDirectEditMode ? (
            <div className="flex-1 p-4 overflow-auto">
              <WebsitePreview 
                previewMode={false} 
                initialContent={currentPageContent} 
              />
            </div>
          ) : (
            <div className={`flex-1 p-4 overflow-auto ${viewMode === 'tablet' ? 'max-w-[768px] mx-auto' : viewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`}>
              <EditorCanvas 
                viewMode={viewMode} 
                onSelectElement={handleElementSelection} 
              />
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties (pas affiché en mode prévisualisation) */}
        {showProperties && !isPreviewMode && (
          <div className="w-72 border-l pl-2 overflow-y-auto">
            <EditorPropertiesPanel 
              selectedElement={selectedElement} 
              onDeleteElement={handleDeleteElement}
            />
          </div>
        )}

        {/* Code Panel (Conditional) */}
        {showCode && !isPreviewMode && (
          <div className="w-96 border-l pl-2 overflow-y-auto">
            <DevModePanel onClose={() => setShowCode(false)} />
          </div>
        )}
      </div>

      {/* Floating Toolbar for Direct Editing */}
      <EditorFloatingToolbar 
        position={floatingToolbarPosition}
        onFormatClick={handleFloatingToolbarAction}
        onClose={() => setFloatingToolbarVisible(false)}
        visible={floatingToolbarVisible && isDirectEditMode}
      />

      {/* Bottom Status Bar */}
      <div className="border-t mt-2 py-1 px-2 flex justify-between text-xs text-muted-foreground">
        <div>Page: {availablePages.find(p => p.id === currentPage)?.name || 'Page d\'accueil'}</div>
        <div>Mode: {isPreviewMode ? 'Prévisualisation' : isDirectEditMode ? 'Édition directe' : 'Édition standard'}</div>
      </div>
      
      {/* Publication Dialog - Modifié pour inclure les options de domaine */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-primary" />
              Publication du site
            </DialogTitle>
            <DialogDescription>
              Configurez les options de publication et publiez votre site.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Domaine</h3>
              
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="lovable-domain"
                    name="domain-type"
                    checked={domainSettings.useLovableDomain}
                    onChange={() => setDomainSettings({...domainSettings, useLovableDomain: true})}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="lovable-domain">
                    Utiliser un sous-domaine Lovable
                    <span className="block text-sm text-muted-foreground">votresite.lovable.app</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="custom-domain"
                    name="domain-type"
                    checked={!domainSettings.useLovableDomain}
                    onChange={() => setDomainSettings({...domainSettings, useLovableDomain: false})}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="custom-domain">
                    Utiliser mon propre domaine
                  </Label>
                </div>
                
                {!domainSettings.useLovableDomain && (
                  <div className="pl-6">
                    <Input
                      placeholder="www.mondomaine.com"
                      value={domainSettings.customDomain}
                      onChange={(e) => setDomainSettings({...domainSettings, customDomain: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Vous devrez configurer les DNS de votre domaine pour pointer vers nos serveurs.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Paramètres de publication</h3>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Choisir les pages à publier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les pages</SelectItem>
                  <SelectItem value="selected">Pages sélectionnées</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                La publication peut prendre quelques minutes avant que les changements ne soient visibles.
              </p>
            </div>
          </div>
          
          <DialogFooter className="gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleOpenPublishedSite}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Publier et voir le site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Page Selection Dialog */}
      <Dialog open={pageSelectDialogOpen} onOpenChange={setPageSelectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sélectionner une page</DialogTitle>
            <DialogDescription>
              Choisissez la page que vous souhaitez éditer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select 
              value={currentPage} 
              onValueChange={handlePageSelection}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une page" />
              </SelectTrigger>
              <SelectContent>
                {availablePages.map(page => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.name} <span className="text-muted-foreground ml-2 text-xs">({page.path})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPageSelectDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={() => setPageSelectDialogOpen(false)}>
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsiteEditor;
