
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X, ArrowRight, Eye, Download } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/components/ui/use-toast';

interface EditorTemplatesPanelProps {
  onClose: () => void;
}

const EditorTemplatesPanel: React.FC<EditorTemplatesPanelProps> = ({ onClose }) => {
  const { toast } = useToast();

  // Templates inspirés d'Odoo avec des catégories similaires
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
      thumbnail: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      description: 'Template e-commerce moderne style Odoo',
      previewUrl: '/preview/templates/shop-modern'
    },
    {
      id: 'ecommerce-2',
      name: 'Boutique',
      category: 'ecommerce',
      thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      description: 'Design boutique avec fonctions avancées',
      previewUrl: '/preview/templates/boutique'
    },
    {
      id: 'blog-1',
      name: 'Blog Standard',
      category: 'blog',
      thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      description: 'Layout classique pour blog',
      previewUrl: '/preview/templates/blog-standard'
    },
    {
      id: 'blog-2',
      name: 'Magazine',
      category: 'blog',
      thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      description: 'Style magazine pour contenus riches',
      previewUrl: '/preview/templates/magazine'
    },
    {
      id: 'portfolio-1',
      name: 'Portfolio Grid',
      category: 'portfolio',
      thumbnail: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      description: 'Présentation en grille pour portfolios',
      previewUrl: '/preview/templates/portfolio-grid'
    },
    {
      id: 'portfolio-2',
      name: 'Showcase',
      category: 'portfolio',
      thumbnail: 'https://images.unsplash.com/photo-1620912189866-474843ba5aee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      description: 'Mise en avant de projets créatifs',
      previewUrl: '/preview/templates/showcase'
    },
    {
      id: 'odoo-1',
      name: 'Odoo Business',
      category: 'odoo',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      description: 'Template inspiré du design Odoo ERP',
      previewUrl: '/preview/templates/odoo-business'
    },
    {
      id: 'odoo-2',
      name: 'Odoo Commerce',
      category: 'odoo',
      thumbnail: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      description: 'E-commerce inspiré de la boutique Odoo',
      previewUrl: '/preview/templates/odoo-commerce'
    }
  ];

  const handleInstallTemplate = (templateId: string) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    
    try {
      // Créer les éléments du template
      const templateElements = [
        {
          id: `header-${Date.now()}`,
          type: 'menu',
          content: `
            <nav class="p-4 bg-primary text-white">
              <div class="container mx-auto flex justify-between items-center">
                <div class="font-bold text-xl">Logo</div>
                <div class="hidden md:flex space-x-6">
                  <a href="#" class="hover:opacity-80 transition-opacity">Accueil</a>
                  <a href="#" class="hover:opacity-80 transition-opacity">Services</a>
                  <a href="#" class="hover:opacity-80 transition-opacity">À Propos</a>
                  <a href="#" class="hover:opacity-80 transition-opacity">Contact</a>
                </div>
                <div class="md:hidden">
                  <button class="p-2">Menu</button>
                </div>
              </div>
            </nav>
          `
        },
        {
          id: `banner-${Date.now() + 1}`,
          type: 'banner',
          content: `
            <div class="bg-gradient-to-r from-primary/90 to-primary/70 text-white p-10 text-center relative overflow-hidden">
              <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('${selectedTemplate?.thumbnail || 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=1200'}');"></div>
              <div class="relative z-10 space-y-4 max-w-4xl mx-auto">
                <h1 class="text-3xl md:text-5xl font-bold">${selectedTemplate?.name || 'Nouveau Template'}</h1>
                <p class="text-lg md:text-xl">${selectedTemplate?.description || 'Une description attractive pour votre site web.'}</p>
                <div class="flex justify-center space-x-4 pt-4">
                  <button class="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors">Découvrir</button>
                  <button class="bg-transparent border border-white px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors">En savoir plus</button>
                </div>
              </div>
            </div>
          `
        }
      ];
      
      // Ajouter des sections spécifiques selon la catégorie
      if (selectedTemplate?.category === 'odoo' || selectedTemplate?.category === 'business') {
        templateElements.push({
          id: `features-${Date.now() + 2}`,
          type: 'section',
          content: `
            <section class="py-16 bg-white">
              <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-12">Nos Solutions</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div class="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Analyse Business</h3>
                    <p class="text-gray-600">Solutions complètes pour l'analyse et le suivi de vos performances commerciales.</p>
                  </div>
                  <div class="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Gestion de Projet</h3>
                    <p class="text-gray-600">Optimisez vos projets avec nos outils de planification et de suivi avancés.</p>
                  </div>
                  <div class="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Solutions de Paiement</h3>
                    <p class="text-gray-600">Acceptez et gérez les paiements en ligne de manière simple et sécurisée.</p>
                  </div>
                </div>
              </div>
            </section>
          `
        });
      }
      
      if (selectedTemplate?.category === 'ecommerce') {
        templateElements.push({
          id: `products-${Date.now() + 3}`,
          type: 'section',
          content: `
            <section class="py-16 bg-gray-50">
              <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-4">Nos Produits</h2>
                <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Découvrez notre sélection de produits de qualité supérieure.</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-48 bg-gray-200"></div>
                    <div class="p-4">
                      <h3 class="font-semibold text-lg mb-1">Produit Premium</h3>
                      <p class="text-gray-600 text-sm mb-2">Catégorie</p>
                      <div class="flex justify-between items-center">
                        <span class="font-bold text-primary">89,99 €</span>
                        <button class="bg-primary text-white px-3 py-1 rounded text-sm">Ajouter</button>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-48 bg-gray-200"></div>
                    <div class="p-4">
                      <h3 class="font-semibold text-lg mb-1">Produit Standard</h3>
                      <p class="text-gray-600 text-sm mb-2">Catégorie</p>
                      <div class="flex justify-between items-center">
                        <span class="font-bold text-primary">49,99 €</span>
                        <button class="bg-primary text-white px-3 py-1 rounded text-sm">Ajouter</button>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-48 bg-gray-200"></div>
                    <div class="p-4">
                      <h3 class="font-semibold text-lg mb-1">Produit Classique</h3>
                      <p class="text-gray-600 text-sm mb-2">Catégorie</p>
                      <div class="flex justify-between items-center">
                        <span class="font-bold text-primary">29,99 €</span>
                        <button class="bg-primary text-white px-3 py-1 rounded text-sm">Ajouter</button>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="h-48 bg-gray-200"></div>
                    <div class="p-4">
                      <h3 class="font-semibold text-lg mb-1">Produit Basique</h3>
                      <p class="text-gray-600 text-sm mb-2">Catégorie</p>
                      <div class="flex justify-between items-center">
                        <span class="font-bold text-primary">19,99 €</span>
                        <button class="bg-primary text-white px-3 py-1 rounded text-sm">Ajouter</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          `
        });
      }

      // Ajouter un footer
      templateElements.push({
        id: `footer-${Date.now() + 4}`,
        type: 'footer',
        content: `
          <footer class="bg-gray-800 text-white p-8">
            <div class="container mx-auto">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 class="text-lg font-bold mb-4">À propos</h3>
                  <p class="text-gray-300">Une brève description de votre entreprise et de ses services. Ajoutez ici des informations importantes.</p>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-4">Liens rapides</h3>
                  <ul class="space-y-2 text-gray-300">
                    <li><a href="#" class="hover:text-white transition-colors">Accueil</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">Services</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">À propos</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-4">Contact</h3>
                  <ul class="space-y-2 text-gray-300">
                    <li>Email: contact@example.com</li>
                    <li>Téléphone: +33 1 23 45 67 89</li>
                    <li>Adresse: 123 Rue des Exemples, 75000 Paris</li>
                  </ul>
                </div>
              </div>
              <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                <p>&copy; 2024 Votre Entreprise. Tous droits réservés.</p>
              </div>
            </div>
          </footer>
        `
      });
      
      // Enregistrer dans le localStorage
      localStorage.setItem('website-elements', JSON.stringify(templateElements));
      
      toast({
        title: "Template installé !",
        description: `Le template ${selectedTemplate?.name} a été installé avec succès.`,
        duration: 3000,
      });
      
      // Fermer le panneau de templates
      onClose();
      
    } catch (error) {
      console.error("Erreur lors de l'installation du template:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'installer le template.",
        duration: 3000,
      });
    }
  };

  const handlePreview = (previewUrl: string) => {
    // Ouvrir dans une nouvelle fenêtre
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  const renderTemplateCards = (filteredTemplates: typeof templates) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredTemplates.map(template => (
        <Card key={template.id} className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-lg transition-shadow">
          <AspectRatio ratio={16/9} className="bg-muted">
            <img 
              src={template.thumbnail} 
              alt={template.name} 
              className="object-cover w-full h-full transition-transform hover:scale-105 duration-200"
            />
          </AspectRatio>
          <div className="p-3 flex-grow flex flex-col">
            <h4 className="font-medium text-lg">{template.name}</h4>
            <p className="text-xs text-muted-foreground mb-auto py-1">{template.description}</p>
            <div className="mt-3 flex justify-between">
              <Button size="sm" variant="outline" onClick={() => handlePreview(template.previewUrl)}>
                <Eye className="mr-1 h-4 w-4" />
                Aperçu
              </Button>
              <Button size="sm" onClick={() => handleInstallTemplate(template.id)}>
                <Download className="mr-1 h-4 w-4" />
                Installer
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
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="odoo">Odoo</TabsTrigger>
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
            
            <TabsContent value="odoo">
              {renderTemplateCards(templates.filter(t => t.category === 'odoo'))}
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
