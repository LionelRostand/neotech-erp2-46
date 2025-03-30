
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { FileCode, Search, ArrowRight, Plus, LayoutGrid, LayoutList, Eye } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { WebsitePreview } from './website-preview/WebsitePreview';
import TransportBookingTemplate from './templates/TransportBookingTemplate';

const WebsiteTemplates = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const templates = [
    {
      id: 'business-1',
      name: 'Business Pro',
      category: 'business',
      thumbnail: '/business-template.jpg',
      description: 'Template professionnel pour entreprises de services',
      previewComponent: null,
      isPremium: false,
    },
    {
      id: 'business-2',
      name: 'Corporate',
      category: 'business',
      thumbnail: '/corporate-template.jpg',
      description: 'Design élégant pour sociétés et grandes entreprises',
      previewComponent: null,
      isPremium: true,
    },
    {
      id: 'ecommerce-1',
      name: 'Shop Modern',
      category: 'ecommerce',
      thumbnail: '/ecommerce-template.jpg',
      description: 'Template e-commerce moderne avec fonctionnalités avancées',
      previewComponent: null,
      isPremium: true,
    },
    {
      id: 'ecommerce-2',
      name: 'Boutique',
      category: 'ecommerce',
      thumbnail: '/boutique-template.jpg',
      description: 'Design boutique pour commerce en ligne',
      previewComponent: null,
      isPremium: false,
    },
    {
      id: 'blog-1',
      name: 'Blog Standard',
      category: 'blog',
      thumbnail: '/blog-template.jpg',
      description: 'Layout classique pour blog et sites d\'actualités',
      previewComponent: null,
      isPremium: false,
    },
    {
      id: 'blog-2',
      name: 'Magazine',
      category: 'blog',
      thumbnail: '/magazine-template.jpg',
      description: 'Style magazine pour contenus riches et médias',
      previewComponent: null,
      isPremium: true,
    },
    {
      id: 'portfolio-1',
      name: 'Portfolio Grid',
      category: 'portfolio',
      thumbnail: '/portfolio-template.jpg',
      description: 'Présentation en grille pour portfolios créatifs',
      previewComponent: null,
      isPremium: false,
    },
    {
      id: 'portfolio-2',
      name: 'Showcase',
      category: 'portfolio',
      thumbnail: '/portfolio-showcase.jpg',
      description: 'Mise en avant de projets créatifs avec animations',
      previewComponent: null,
      isPremium: true,
    },
    {
      id: 'transport-1',
      name: 'Transport Booking',
      category: 'transport',
      thumbnail: '/transport-template.jpg',
      description: 'Système de réservation de transport avec formulaire interactif',
      previewComponent: <TransportBookingTemplate primaryColor="#3b82f6" secondaryColor="#6b7280" />,
      isPremium: false,
    },
  ];

  const filteredTemplates = templates.filter(template => {
    if (!searchQuery) return true;
    return template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           template.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handlePreview = (templateId: string) => {
    setPreviewTemplate(templateId);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  const handleUseTemplate = (templateId: string) => {
    toast({
      title: "Template sélectionné",
      description: `Le template ${templates.find(t => t.id === templateId)?.name} va être appliqué à votre site.`,
    });
  };

  const getTemplatePreview = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.previewComponent || (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100">
        <h3 className="text-xl font-medium mb-2">{template?.name}</h3>
        <p className="text-sm text-muted-foreground">Aperçu du template</p>
      </div>
    );
  };

  const renderGridView = (templates: typeof filteredTemplates) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map(template => (
        <Card key={template.id} className="overflow-hidden h-full flex flex-col">
          <AspectRatio ratio={16/9} className="relative group">
            <img 
              src={template.thumbnail} 
              alt={template.name} 
              className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-200"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
              <Button variant="secondary" size="sm" className="mr-2" onClick={() => handlePreview(template.id)}>
                <Eye className="h-4 w-4 mr-1" />
                Aperçu
              </Button>
            </div>
            {template.isPremium && (
              <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary">Premium</Badge>
            )}
          </AspectRatio>
          <CardContent className="py-4 flex-grow">
            <h3 className="font-medium text-lg">{template.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
          </CardContent>
          <CardFooter className="border-t pt-3 pb-3">
            <Button 
              className="w-full" 
              onClick={() => handleUseTemplate(template.id)}
              disabled={template.isPremium}
            >
              {template.isPremium ? 'Premium' : 'Utiliser ce template'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderListView = (templates: typeof filteredTemplates) => (
    <div className="space-y-4">
      {templates.map(template => (
        <Card key={template.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4">
              <AspectRatio ratio={16/9} className="md:h-full">
                <img 
                  src={template.thumbnail} 
                  alt={template.name} 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col flex-grow p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                </div>
                {template.isPremium && (
                  <Badge>Premium</Badge>
                )}
              </div>
              <div className="flex mt-auto pt-4 justify-end">
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handlePreview(template.id)}>
                  <Eye className="h-4 w-4 mr-1" /> Aperçu
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleUseTemplate(template.id)}
                  disabled={template.isPremium}
                >
                  {template.isPremium ? 'Premium' : 'Utiliser'}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {previewTemplate ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-medium">
              Aperçu: {templates.find(t => t.id === previewTemplate)?.name}
            </h2>
            <Button variant="outline" onClick={closePreview}>
              Fermer
            </Button>
          </div>
          <div className="h-[600px]">
            <WebsitePreview 
              previewMode={true}
              initialContent={[]}
              customContent={getTemplatePreview(previewTemplate)}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Templates</h2>
              <p className="text-muted-foreground">Choisissez un template pour votre site</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Template personnalisé
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un template..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="transport">Transport</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-10">
                  <FileCode className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Aucun template trouvé</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Essayez avec d'autres termes de recherche</p>
                </div>
              ) : viewMode === 'grid' ? renderGridView(filteredTemplates) : renderListView(filteredTemplates)}
            </TabsContent>
            
            <TabsContent value="business">
              {viewMode === 'grid' 
                ? renderGridView(filteredTemplates.filter(t => t.category === 'business')) 
                : renderListView(filteredTemplates.filter(t => t.category === 'business'))}
            </TabsContent>
            
            <TabsContent value="ecommerce">
              {viewMode === 'grid' 
                ? renderGridView(filteredTemplates.filter(t => t.category === 'ecommerce')) 
                : renderListView(filteredTemplates.filter(t => t.category === 'ecommerce'))}
            </TabsContent>
            
            <TabsContent value="blog">
              {viewMode === 'grid' 
                ? renderGridView(filteredTemplates.filter(t => t.category === 'blog')) 
                : renderListView(filteredTemplates.filter(t => t.category === 'blog'))}
            </TabsContent>
            
            <TabsContent value="portfolio">
              {viewMode === 'grid' 
                ? renderGridView(filteredTemplates.filter(t => t.category === 'portfolio')) 
                : renderListView(filteredTemplates.filter(t => t.category === 'portfolio'))}
            </TabsContent>
            
            <TabsContent value="transport">
              {viewMode === 'grid' 
                ? renderGridView(filteredTemplates.filter(t => t.category === 'transport')) 
                : renderListView(filteredTemplates.filter(t => t.category === 'transport'))}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default WebsiteTemplates;
