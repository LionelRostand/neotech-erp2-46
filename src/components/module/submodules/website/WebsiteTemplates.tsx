
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Check, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

interface Template {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  category: string;
  tags: string[];
}

const templates: Template[] = [
  {
    id: 'business-1',
    name: 'Entreprise Moderne',
    description: 'Template professionnel avec sections pour services, équipe et témoignages.',
    previewImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Business',
    tags: ['professionnel', 'entreprise', 'services']
  },
  {
    id: 'portfolio-1',
    name: 'Portfolio Créatif',
    description: 'Présentez vos projets avec style grâce à ce template minimaliste.',
    previewImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Portfolio',
    tags: ['créatif', 'portfolio', 'projets']
  },
  {
    id: 'restaurant-1',
    name: 'Restaurant Élégant',
    description: 'Template parfait pour restaurants avec menu, réservations et galerie photos.',
    previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Restaurant',
    tags: ['restaurant', 'alimentation', 'gastronomie']
  },
  {
    id: 'hotel-1',
    name: 'Hôtel & Hébergement',
    description: 'Présentez votre établissement avec élégance et style.',
    previewImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Hôtellerie',
    tags: ['hôtel', 'hébergement', 'tourisme']
  },
  {
    id: 'transport-1',
    name: 'Transport & Réservation',
    description: 'Template avec système de réservation intégré pour services de transport.',
    previewImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Transport',
    tags: ['transport', 'réservation', 'services']
  },
  {
    id: 'retail-1',
    name: 'Boutique en ligne',
    description: 'Template e-commerce avec catalogue de produits et panier.',
    previewImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'E-commerce',
    tags: ['boutique', 'e-commerce', 'vente']
  },
  {
    id: 'blog-standard',
    name: 'Blog Standard',
    description: 'Layout classique pour blog avec sections articles et catégories.',
    previewImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Blog',
    tags: ['blog', 'articles', 'contenu']
  }
];

const WebsiteTemplates = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [installedTemplates, setInstalledTemplates] = useState<string[]>([]);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = !activeCategory || template.category === activeCategory;
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const handleInstallTemplate = (templateId: string) => {
    if (installedTemplates.includes(templateId)) {
      toast({
        description: "Ce template est déjà installé sur votre site.",
      });
      return;
    }

    // Simulate installation
    setInstalledTemplates([...installedTemplates, templateId]);
    
    // Store to localStorage for persistence
    const template = templates.find(t => t.id === templateId);
    const elements = localStorage.getItem('website-elements');
    const templateElements = [
      {
        id: `header-${Date.now()}`,
        type: 'header',
        content: '<div class="p-4 bg-primary/10"><h1 class="text-2xl font-bold">' + template?.name + '</h1><p>' + template?.description + '</p></div>'
      },
      {
        id: `banner-${Date.now() + 1}`,
        type: 'banner',
        content: `
          <div class="bg-primary/90 text-white p-10 text-center relative overflow-hidden">
            <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('${template?.previewImage}');"></div>
            <div class="relative z-10 space-y-4 max-w-4xl mx-auto">
              <h1 class="text-3xl md:text-5xl font-bold">${template?.name}</h1>
              <p class="text-lg md:text-xl">${template?.description}</p>
              <div class="flex justify-center space-x-4 pt-4">
                <button class="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors">Découvrir</button>
                <button class="bg-transparent border border-white px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors">En savoir plus</button>
              </div>
            </div>
          </div>
        `
      },
      {
        id: `section-${Date.now() + 2}`,
        type: 'section',
        content: `
          <div class="p-6">
            <h2 class="text-xl font-bold mb-4">Section principale</h2>
            <p>Ceci est un exemple de section pour votre nouveau template. Vous pouvez modifier ce contenu selon vos besoins.</p>
          </div>
        `
      }
    ];
    
    localStorage.setItem('website-elements', elements ? JSON.stringify([...JSON.parse(elements), ...templateElements]) : JSON.stringify(templateElements));
    
    toast({
      title: "Template installé avec succès !",
      description: "Rendez-vous dans l'éditeur pour personnaliser votre template.",
      action: (
        <Button variant="outline" size="sm" onClick={() => window.location.href = '/modules/website/editor'}>
          Éditer
        </Button>
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-3xl font-bold">Templates</h2>
        <p className="text-muted-foreground">Choisissez un template pour votre site web</p>
      </div>
      
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          onClick={() => setActiveCategory(null)}
          className="whitespace-nowrap"
        >
          Tous
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden flex flex-col h-full">
            <div className="relative aspect-video">
              <img
                src={template.previewImage}
                alt={template.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.category}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p>{template.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {template.tags.map(tag => (
                  <span key={tag} className="bg-muted text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-1/2"
                asChild
              >
                <Link to={`/modules/website/templates/${template.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Aperçu
                </Link>
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="w-1/2" 
                onClick={() => handleInstallTemplate(template.id)}
              >
                {installedTemplates.includes(template.id) ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Installé
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Installer
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="text-center p-10 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Aucun template ne correspond à vos critères</p>
        </div>
      )}
    </div>
  );
};

export default WebsiteTemplates;
