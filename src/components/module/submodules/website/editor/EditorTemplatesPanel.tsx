
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X, ArrowRight } from 'lucide-react';
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
      description: 'Template professionnel pour entreprises'
    },
    {
      id: 'business-2',
      name: 'Corporate',
      category: 'business',
      thumbnail: 'https://via.placeholder.com/300x200?text=Corporate',
      description: 'Design élégant pour sociétés'
    },
    {
      id: 'ecommerce-1',
      name: 'Shop Modern',
      category: 'ecommerce',
      thumbnail: 'https://via.placeholder.com/300x200?text=Shop+Modern',
      description: 'Template e-commerce moderne'
    },
    {
      id: 'ecommerce-2',
      name: 'Boutique',
      category: 'ecommerce',
      thumbnail: 'https://via.placeholder.com/300x200?text=Boutique',
      description: 'Design boutique avec fonctions avancées'
    },
    {
      id: 'blog-1',
      name: 'Blog Standard',
      category: 'blog',
      thumbnail: 'https://via.placeholder.com/300x200?text=Blog+Standard',
      description: 'Layout classique pour blog'
    },
    {
      id: 'blog-2',
      name: 'Magazine',
      category: 'blog',
      thumbnail: 'https://via.placeholder.com/300x200?text=Magazine',
      description: 'Style magazine pour contenus riches'
    },
    {
      id: 'portfolio-1',
      name: 'Portfolio Grid',
      category: 'portfolio',
      thumbnail: 'https://via.placeholder.com/300x200?text=Portfolio+Grid',
      description: 'Présentation en grille pour portfolios'
    },
    {
      id: 'portfolio-2',
      name: 'Showcase',
      category: 'portfolio',
      thumbnail: 'https://via.placeholder.com/300x200?text=Showcase',
      description: 'Mise en avant de projets créatifs'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center py-2 px-4 border-b">
        <h3 className="font-medium">Templates</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="flex-1">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100%-40px)]">
          <TabsContent value="all" className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {templates.map(template => (
                <Card key={template.id} className="overflow-hidden">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={template.thumbnail} 
                      alt={template.name} 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="p-3">
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                    <div className="mt-2 flex justify-between">
                      <Button size="sm" variant="outline">Aperçu</Button>
                      <Button size="sm">
                        Utiliser
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="business" className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {templates.filter(t => t.category === 'business').map(template => (
                <Card key={template.id} className="overflow-hidden">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={template.thumbnail} 
                      alt={template.name} 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="p-3">
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                    <div className="mt-2 flex justify-between">
                      <Button size="sm" variant="outline">Aperçu</Button>
                      <Button size="sm">
                        Utiliser
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ecommerce" className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {templates.filter(t => t.category === 'ecommerce').map(template => (
                <Card key={template.id} className="overflow-hidden">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={template.thumbnail} 
                      alt={template.name} 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="p-3">
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                    <div className="mt-2 flex justify-between">
                      <Button size="sm" variant="outline">Aperçu</Button>
                      <Button size="sm">
                        Utiliser
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="blog" className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {templates.filter(t => t.category === 'blog').map(template => (
                <Card key={template.id} className="overflow-hidden">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={template.thumbnail} 
                      alt={template.name} 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="p-3">
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                    <div className="mt-2 flex justify-between">
                      <Button size="sm" variant="outline">Aperçu</Button>
                      <Button size="sm">
                        Utiliser
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio" className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {templates.filter(t => t.category === 'portfolio').map(template => (
                <Card key={template.id} className="overflow-hidden">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={template.thumbnail} 
                      alt={template.name} 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="p-3">
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                    <div className="mt-2 flex justify-between">
                      <Button size="sm" variant="outline">Aperçu</Button>
                      <Button size="sm">
                        Utiliser
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default EditorTemplatesPanel;
