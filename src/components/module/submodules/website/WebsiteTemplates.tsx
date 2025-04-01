
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Eye, Download, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  isNew?: boolean;
  isPopular?: boolean;
}

const templates: Template[] = [
  {
    id: 'transport-1',
    name: 'Transport Booking',
    description: 'Template pour réservation de transport avec formulaire intégré',
    thumbnail: 'https://placehold.co/300x200/e4e4e7/71717a?text=Transport+Booking',
    category: 'transport',
    isPopular: true
  },
  {
    id: 'business-1',
    name: 'Business Landing',
    description: 'Template professionnel pour entreprise',
    thumbnail: 'https://placehold.co/300x200/e4e4e7/71717a?text=Business+Landing',
    category: 'business'
  },
  {
    id: 'portfolio-1',
    name: 'Portfolio Créatif',
    description: 'Showcase pour professionnels créatifs',
    thumbnail: 'https://placehold.co/300x200/e4e4e7/71717a?text=Portfolio',
    category: 'portfolio'
  },
  {
    id: 'ecommerce-1',
    name: 'Boutique en ligne',
    description: 'Template e-commerce avec catalogue de produits',
    thumbnail: 'https://placehold.co/300x200/e4e4e7/71717a?text=E-commerce',
    category: 'ecommerce',
    isNew: true
  },
  {
    id: 'restaurant-1',
    name: 'Restaurant & Menu',
    description: 'Site pour restaurant avec menu interactif',
    thumbnail: 'https://placehold.co/300x200/e4e4e7/71717a?text=Restaurant',
    category: 'food',
    isNew: true
  },
  {
    id: 'blog-1',
    name: 'Blog Moderne',
    description: 'Template pour blog avec sections personnalisables',
    thumbnail: 'https://placehold.co/300x200/e4e4e7/71717a?text=Blog',
    category: 'blog',
    isPopular: true
  },
];

const WebsiteTemplates: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [installedTemplates, setInstalledTemplates] = useState<string[]>(() => {
    const saved = localStorage.getItem('website-installed-templates');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'transport', name: 'Transport' },
    { id: 'business', name: 'Business' },
    { id: 'portfolio', name: 'Portfolio' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'food', name: 'Restauration' },
    { id: 'blog', name: 'Blog' }
  ];

  const handlePreview = (templateId: string) => {
    navigate(`/modules/website/preview/templates/${templateId}`);
  };

  const handleInstall = (template: Template) => {
    // Vérifier si le template est déjà installé
    if (installedTemplates.includes(template.id)) {
      toast({
        title: "Déjà installé",
        description: `Le template "${template.name}" est déjà installé.`,
        duration: 3000,
      });
      return;
    }

    // Ajouter le template à la liste des templates installés
    const newInstalledTemplates = [...installedTemplates, template.id];
    setInstalledTemplates(newInstalledTemplates);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('website-installed-templates', JSON.stringify(newInstalledTemplates));
    
    // Sauvegarder également les données du template pour l'éditeur
    localStorage.setItem(`website-template-${template.id}`, JSON.stringify(template));

    toast({
      title: "Template installé !",
      description: `Le template "${template.name}" a été ajouté à votre éditeur.`,
      duration: 3000,
    });
    
    // Redirection vers l'éditeur après un court délai
    setTimeout(() => navigate('/modules/website/editor'), 1500);
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center">
        <h2 className="text-3xl font-bold">Templates</h2>
        <div className="flex overflow-x-auto pb-2 gap-2">
          {categories.map(category => (
            <Button 
              key={category.id} 
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video relative bg-muted">
              <img 
                src={template.thumbnail} 
                alt={template.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {template.isNew && (
                  <Badge className="bg-green-500">Nouveau</Badge>
                )}
                {template.isPopular && (
                  <Badge className="bg-amber-500">Populaire</Badge>
                )}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePreview(template.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
                <Button 
                  size="sm"
                  variant={installedTemplates.includes(template.id) ? "outline" : "default"}
                  onClick={() => handleInstall(template)}
                  disabled={installedTemplates.includes(template.id)}
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WebsiteTemplates;
