
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WebsitePreview from '@/components/module/submodules/website/website-preview/WebsitePreview';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  category: string;
  tags: string[];
}

interface PreviewContentItem {
  id: string;
  type: string;
  content: string;
}

const WebsiteTemplatePreviewPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [template, setTemplate] = useState<Template | null>(null);
  const [previewContent, setPreviewContent] = useState<PreviewContentItem[]>([]);

  // Fetch template data based on templateId
  useEffect(() => {
    // This would ideally come from an API, but for now we'll use static data
    const fetchTemplateData = () => {
      // This is the same template data from WebsiteTemplates.tsx
      const templates = [
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
          id: 'transport-1',
          name: 'Transport & Réservation',
          description: 'Template avec système de réservation intégré pour services de transport.',
          previewImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          category: 'Transport',
          tags: ['transport', 'réservation', 'services']
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

      const foundTemplate = templates.find(t => t.id === templateId);
      if (foundTemplate) {
        setTemplate(foundTemplate);
        
        // Generate preview content for the template
        const content = [
          {
            id: `header-${Date.now()}`,
            type: 'header',
            content: `
              <header class="bg-white shadow-sm sticky top-0 z-50">
                <div class="container mx-auto px-4 py-4 flex items-center justify-between">
                  <div class="flex items-center">
                    <h1 class="text-2xl font-bold text-primary">${foundTemplate.name}</h1>
                  </div>
                  <nav class="hidden md:block">
                    <ul class="flex space-x-6">
                      <li><a href="#" class="text-gray-600 hover:text-primary transition-colors">Accueil</a></li>
                      <li><a href="#" class="text-gray-600 hover:text-primary transition-colors">Services</a></li>
                      <li><a href="#" class="text-gray-600 hover:text-primary transition-colors">À propos</a></li>
                      <li><a href="#" class="text-gray-600 hover:text-primary transition-colors">Contact</a></li>
                    </ul>
                  </nav>
                  <button class="md:hidden text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </header>
            `
          },
          {
            id: `banner-${Date.now() + 1}`,
            type: 'banner',
            content: `
              <div class="bg-primary/90 text-white py-16 px-4">
                <div class="container mx-auto max-w-4xl text-center">
                  <h2 class="text-3xl md:text-5xl font-bold mb-6">${foundTemplate.name}</h2>
                  <p class="text-lg md:text-xl mb-8">${foundTemplate.description}</p>
                  <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button class="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Commencer maintenant
                    </button>
                    <button class="bg-transparent border border-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                      En savoir plus
                    </button>
                  </div>
                </div>
              </div>
            `
          },
          {
            id: `section-${Date.now() + 2}`,
            type: 'section',
            content: `
              <section class="py-16 px-4 bg-gray-50">
                <div class="container mx-auto max-w-6xl">
                  <h2 class="text-3xl font-bold text-center mb-12">Nos services</h2>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                      <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 class="text-xl font-semibold mb-2">Service rapide</h3>
                      <p class="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                      <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 class="text-xl font-semibold mb-2">Sécurisé</h3>
                      <p class="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                      <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 class="text-xl font-semibold mb-2">Fiable</h3>
                      <p class="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                    </div>
                  </div>
                </div>
              </section>
            `
          },
          {
            id: `footer-${Date.now() + 3}`,
            type: 'footer',
            content: `
              <footer class="bg-gray-800 text-white py-12 px-4">
                <div class="container mx-auto max-w-6xl">
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <h3 class="text-lg font-bold mb-4">À propos</h3>
                      <p class="text-gray-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                    </div>
                    <div>
                      <h3 class="text-lg font-bold mb-4">Liens rapides</h3>
                      <ul class="space-y-2">
                        <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Accueil</a></li>
                        <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Services</a></li>
                        <li><a href="#" class="text-gray-300 hover:text-white transition-colors">À propos</a></li>
                        <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Contact</a></li>
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
                    <div>
                      <h3 class="text-lg font-bold mb-4">Suivez-nous</h3>
                      <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white transition-colors">
                          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                        </a>
                        <a href="#" class="text-gray-300 hover:text-white transition-colors">
                          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                          </svg>
                        </a>
                        <a href="#" class="text-gray-300 hover:text-white transition-colors">
                          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                    <p>&copy; 2024 ${foundTemplate.name}. Tous droits réservés.</p>
                  </div>
                </div>
              </footer>
            `
          }
        ];
        
        setPreviewContent(content);
      } else {
        console.error('Template not found:', templateId);
      }
    };

    fetchTemplateData();
  }, [templateId]);

  // Handle template installation
  const handleInstallTemplate = () => {
    if (!template) return;
    
    try {
      // Store template content to localStorage
      localStorage.setItem('website-elements', JSON.stringify(previewContent));
      
      toast({
        title: "Template installé avec succès !",
        description: "Rendez-vous dans l'éditeur pour personnaliser votre template.",
        action: (
          <Button variant="outline" size="sm" onClick={() => navigate('/modules/website/editor')}>
            Éditer
          </Button>
        )
      });
    } catch (error) {
      console.error("Erreur lors de l'installation du template:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'installer le template.",
      });
    }
  };

  if (!template) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/modules/website/templates')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Retour aux templates
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 flex justify-center items-center">
            <p>Template non trouvé. Veuillez sélectionner un autre template.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/modules/website/templates')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux templates
        </Button>
        <Button 
          onClick={handleInstallTemplate}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" /> Installer ce template
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{template.name}</h1>
            <p className="text-muted-foreground">{template.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {template.tags.map(tag => (
                <span key={tag} className="bg-muted text-xs px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <WebsitePreview 
              previewMode={true} 
              initialContent={previewContent}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteTemplatePreviewPage;
