
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X, ArrowRight, Eye } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface EditorTemplatesPanelProps {
  onClose: () => void;
}

const EditorTemplatesPanel: React.FC<EditorTemplatesPanelProps> = ({ onClose }) => {
  const templates = [
    {
      id: 'business-1',
      name: 'Business Pro',
      category: 'business',
      thumbnail: 'https://via.placeholder.com/300x200?text=Business+Pro',
      description: 'Template professionnel pour entreprises',
      previewUrl: '/preview/templates/business-pro'
    },
    {
      id: 'business-2',
      name: 'Corporate',
      category: 'business',
      thumbnail: 'https://via.placeholder.com/300x200?text=Corporate',
      description: 'Design élégant pour sociétés',
      previewUrl: '/preview/templates/corporate'
    },
    {
      id: 'ecommerce-1',
      name: 'Shop Modern',
      category: 'ecommerce',
      thumbnail: 'https://via.placeholder.com/300x200?text=Shop+Modern',
      description: 'Template e-commerce moderne',
      previewUrl: '/preview/templates/shop-modern'
    },
    {
      id: 'ecommerce-2',
      name: 'Boutique',
      category: 'ecommerce',
      thumbnail: 'https://via.placeholder.com/300x200?text=Boutique',
      description: 'Design boutique avec fonctions avancées',
      previewUrl: '/preview/templates/boutique'
    },
    {
      id: 'blog-1',
      name: 'Blog Standard',
      category: 'blog',
      thumbnail: 'https://via.placeholder.com/300x200?text=Blog+Standard',
      description: 'Layout classique pour blog',
      previewUrl: '/preview/templates/blog-standard'
    },
    {
      id: 'blog-2',
      name: 'Magazine',
      category: 'blog',
      thumbnail: 'https://via.placeholder.com/300x200?text=Magazine',
      description: 'Style magazine pour contenus riches',
      previewUrl: '/preview/templates/magazine'
    },
    {
      id: 'portfolio-1',
      name: 'Portfolio Grid',
      category: 'portfolio',
      thumbnail: 'https://via.placeholder.com/300x200?text=Portfolio+Grid',
      description: 'Présentation en grille pour portfolios',
      previewUrl: '/preview/templates/portfolio-grid'
    },
    {
      id: 'portfolio-2',
      name: 'Showcase',
      category: 'portfolio',
      thumbnail: 'https://via.placeholder.com/300x200?text=Showcase',
      description: 'Mise en avant de projets créatifs',
      previewUrl: '/preview/templates/showcase'
    }
  ];

  const handlePreview = (previewUrl: string) => {
    window.open(previewUrl, '_blank');
  };

  const renderTemplateCards = (filteredTemplates: typeof templates) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredTemplates.map(template => (
        <Card key={template.id} className="overflow-hidden h-full flex flex-col">
          <AspectRatio ratio={16/9}>
            <img 
              src={template.thumbnail} 
              alt={template.name} 
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          <div className="p-3 flex-grow flex flex-col">
            <h4 className="font-medium">{template.name}</h4>
            <p className="text-xs text-muted-foreground mb-auto">{template.description}</p>
            <div className="mt-3 flex justify-between">
              <Button size="sm" variant="outline" onClick={() => handlePreview(template.previewUrl)}>
                <Eye className="mr-1 h-4 w-4" />
                Aperçu
              </Button>
              <Button size="sm">
                Utiliser
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center py-2 px-4 border-b">
        <h3 className="font-medium">Templates</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="all">
              {renderTemplateCards(templates)}
            </TabsContent>
            
            <TabsContent value="business">
              {renderTemplateCards(templates.filter(t => t.category === 'business'))}
            </TabsContent>
            
            <TabsContent value="ecommerce">
              {renderTemplateCards(templates.filter(t => t.category === 'ecommerce'))}
            </TabsContent>
            
            <TabsContent value="blog">
              {renderTemplateCards(templates.filter(t => t.category === 'blog'))}
            </TabsContent>
            
            <TabsContent value="portfolio">
              {renderTemplateCards(templates.filter(t => t.category === 'portfolio'))}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default EditorTemplatesPanel;
