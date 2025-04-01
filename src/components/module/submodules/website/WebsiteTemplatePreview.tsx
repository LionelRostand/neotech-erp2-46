
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import WebsitePreview from './website-preview/WebsitePreview';

interface PreviewTemplateContent {
  id: string;
  type: string;
  content: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  category: string;
  tags: string[];
  elements: PreviewTemplateContent[];
}

const templates: Record<string, Template> = {
  'business-1': {
    id: 'business-1',
    name: 'Entreprise Moderne',
    description: 'Template professionnel avec sections pour services, équipe et témoignages.',
    previewImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Business',
    tags: ['professionnel', 'entreprise', 'services'],
    elements: [
      {
        id: 'header-1',
        type: 'header',
        content: `
          <header class="bg-white shadow-sm">
            <div class="container mx-auto px-4 py-6 flex justify-between items-center">
              <h1 class="text-2xl font-bold text-gray-800">Entreprise Moderne</h1>
              <nav>
                <ul class="flex space-x-6">
                  <li><a href="#" class="text-gray-600 hover:text-primary">Accueil</a></li>
                  <li><a href="#" class="text-gray-600 hover:text-primary">Services</a></li>
                  <li><a href="#" class="text-gray-600 hover:text-primary">À propos</a></li>
                  <li><a href="#" class="text-gray-600 hover:text-primary">Contact</a></li>
                </ul>
              </nav>
            </div>
          </header>
        `
      },
      {
        id: 'hero-1',
        type: 'hero',
        content: `
          <div class="bg-gray-50 py-16">
            <div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
              <div class="md:w-1/2 mb-10 md:mb-0">
                <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Solutions professionnelles pour votre entreprise</h2>
                <p class="text-lg text-gray-600 mb-8">Découvrez comment nous pouvons aider votre entreprise à se développer avec nos services personnalisés.</p>
                <div class="flex space-x-4">
                  <button class="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">En savoir plus</button>
                  <button class="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">Nous contacter</button>
                </div>
              </div>
              <div class="md:w-1/2">
                <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Équipe d'entreprise" class="rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'services-1',
        type: 'section',
        content: `
          <section class="py-16">
            <div class="container mx-auto px-4">
              <h2 class="text-3xl font-bold text-center mb-12">Nos Services</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold mb-2">Conseil Stratégique</h3>
                  <p class="text-gray-600">Nous vous aidons à élaborer des stratégies efficaces pour développer votre activité.</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold mb-2">Transformation Digitale</h3>
                  <p class="text-gray-600">Accompagnement personnalisé pour moderniser vos processus et outils.</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold mb-2">Solutions Innovantes</h3>
                  <p class="text-gray-600">Des technologies de pointe pour répondre aux défis de votre secteur.</p>
                </div>
              </div>
            </div>
          </section>
        `
      },
      {
        id: 'footer-1',
        type: 'footer',
        content: `
          <footer class="bg-gray-800 text-white py-12">
            <div class="container mx-auto px-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 class="text-lg font-bold mb-4">À propos de nous</h3>
                  <p class="text-gray-300">Entreprise Moderne est votre partenaire de confiance pour tous vos besoins professionnels.</p>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-4">Liens rapides</h3>
                  <ul class="space-y-2 text-gray-300">
                    <li><a href="#" class="hover:text-white">Accueil</a></li>
                    <li><a href="#" class="hover:text-white">Services</a></li>
                    <li><a href="#" class="hover:text-white">À propos</a></li>
                    <li><a href="#" class="hover:text-white">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-4">Contact</h3>
                  <address class="not-italic text-gray-300">
                    <p>123 Rue Principale</p>
                    <p>75001 Paris, France</p>
                    <p class="mt-2">contact@entreprise-moderne.fr</p>
                    <p>+33 1 23 45 67 89</p>
                  </address>
                </div>
              </div>
              <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                <p>&copy; 2024 Entreprise Moderne. Tous droits réservés.</p>
              </div>
            </div>
          </footer>
        `
      }
    ]
  },
  'blog-standard': {
    id: 'blog-standard',
    name: 'Blog Standard',
    description: 'Layout classique pour blog avec sections articles et catégories',
    previewImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'blog',
    tags: ['blog', 'articles', 'contenu'],
    elements: [
      {
        id: 'header-blog',
        type: 'header',
        content: `
          <header class="bg-white border-b">
            <div class="container mx-auto px-4 py-4">
              <div class="flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-800">Blog Standard</h1>
                <nav>
                  <ul class="flex space-x-6">
                    <li><a href="#" class="text-gray-600 hover:text-primary">Accueil</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-primary">Articles</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-primary">Catégories</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-primary">À propos</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-primary">Contact</a></li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
        `
      },
      {
        id: 'featured-article',
        type: 'section',
        content: `
          <section class="py-10 bg-gray-50">
            <div class="container mx-auto px-4">
              <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="md:flex">
                  <div class="md:w-1/2">
                    <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Article à la une" class="w-full h-64 md:h-full object-cover" />
                  </div>
                  <div class="md:w-1/2 p-8">
                    <span class="inline-block bg-primary/10 text-primary px-3 py-1 rounded text-sm font-medium mb-4">À la une</span>
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Comment rédiger du contenu engageant pour votre blog</h2>
                    <p class="text-gray-600 mb-4">Découvrez nos conseils d'experts pour créer du contenu qui captive votre audience et améliore votre référencement.</p>
                    <div class="flex items-center mb-6">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Auteur" class="w-10 h-10 rounded-full mr-4" />
                      <div>
                        <p class="text-sm font-medium">Thomas Dubois</p>
                        <p class="text-xs text-gray-500">12 juin 2024 • 8 min de lecture</p>
                      </div>
                    </div>
                    <button class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">Lire l'article</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        `
      },
      {
        id: 'recent-articles',
        type: 'section',
        content: `
          <section class="py-16">
            <div class="container mx-auto px-4">
              <h2 class="text-3xl font-bold mb-8">Articles récents</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Article image" class="w-full h-48 object-cover" />
                  <div class="p-6">
                    <span class="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium mb-3">Marketing</span>
                    <h3 class="text-xl font-bold mb-2">Stratégies de contenu pour 2024</h3>
                    <p class="text-gray-600 mb-4">Les tendances et stratégies de contenu à adopter pour l'année à venir.</p>
                    <div class="flex justify-between items-center">
                      <p class="text-sm text-gray-500">7 min de lecture</p>
                      <a href="#" class="text-primary font-medium">Lire la suite →</a>
                    </div>
                  </div>
                </article>
                
                <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Article image" class="w-full h-48 object-cover" />
                  <div class="p-6">
                    <span class="inline-block bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium mb-3">Productivité</span>
                    <h3 class="text-xl font-bold mb-2">5 astuces pour mieux gérer son temps</h3>
                    <p class="text-gray-600 mb-4">Optimisez votre journée avec ces techniques simples mais efficaces.</p>
                    <div class="flex justify-between items-center">
                      <p class="text-sm text-gray-500">5 min de lecture</p>
                      <a href="#" class="text-primary font-medium">Lire la suite →</a>
                    </div>
                  </div>
                </article>
                
                <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Article image" class="w-full h-48 object-cover" />
                  <div class="p-6">
                    <span class="inline-block bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-medium mb-3">Technologie</span>
                    <h3 class="text-xl font-bold mb-2">L'IA au service de la rédaction</h3>
                    <p class="text-gray-600 mb-4">Comment l'intelligence artificielle peut améliorer votre processus d'écriture.</p>
                    <div class="flex justify-between items-center">
                      <p class="text-sm text-gray-500">10 min de lecture</p>
                      <a href="#" class="text-primary font-medium">Lire la suite →</a>
                    </div>
                  </div>
                </article>
              </div>
              
              <div class="mt-12 text-center">
                <button class="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">Voir plus d'articles</button>
              </div>
            </div>
          </section>
        `
      },
      {
        id: 'newsletter',
        type: 'section',
        content: `
          <section class="py-16 bg-primary/10">
            <div class="container mx-auto px-4 max-w-3xl text-center">
              <h2 class="text-2xl md:text-3xl font-bold mb-4">Abonnez-vous à notre newsletter</h2>
              <p class="text-gray-600 mb-8">Recevez nos derniers articles et conseils directement dans votre boîte mail.</p>
              <form class="flex flex-col md:flex-row gap-3">
                <input type="email" placeholder="Votre email" class="flex-1 px-6 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="submit" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">S'abonner</button>
              </form>
              <p class="text-xs text-gray-500 mt-4">En vous inscrivant, vous acceptez notre politique de confidentialité.</p>
            </div>
          </section>
        `
      },
      {
        id: 'footer-blog',
        type: 'footer',
        content: `
          <footer class="bg-gray-800 text-white py-12">
            <div class="container mx-auto px-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div class="md:col-span-2">
                  <h3 class="text-xl font-bold mb-4">Blog Standard</h3>
                  <p class="text-gray-300 mb-6">Un blog dédié au partage de connaissances et d'expériences pour vous aider à grandir personnellement et professionnellement.</p>
                  <div class="flex space-x-4">
                    <a href="#" class="text-white hover:text-primary">
                      <span class="sr-only">Facebook</span>
                      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
                      </svg>
                    </a>
                    <a href="#" class="text-white hover:text-primary">
                      <span class="sr-only">Twitter</span>
                      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.531A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                    <a href="#" class="text-white hover:text-primary">
                      <span class="sr-only">Instagram</span>
                      <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path>
                      </svg>
                    </a>
                  </div>
                </div>
                <div>
                  <h4 class="text-lg font-bold mb-4">Catégories</h4>
                  <ul class="space-y-2 text-gray-300">
                    <li><a href="#" class="hover:text-primary">Marketing</a></li>
                    <li><a href="#" class="hover:text-primary">Productivité</a></li>
                    <li><a href="#" class="hover:text-primary">Technologie</a></li>
                    <li><a href="#" class="hover:text-primary">Lifestyle</a></li>
                  </ul>
                </div>
                <div>
                  <h4 class="text-lg font-bold mb-4">Liens utiles</h4>
                  <ul class="space-y-2 text-gray-300">
                    <li><a href="#" class="hover:text-primary">À propos</a></li>
                    <li><a href="#" class="hover:text-primary">Contact</a></li>
                    <li><a href="#" class="hover:text-primary">Mentions légales</a></li>
                    <li><a href="#" class="hover:text-primary">Politique de confidentialité</a></li>
                  </ul>
                </div>
              </div>
              <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                <p>&copy; 2024 Blog Standard. Tous droits réservés.</p>
              </div>
            </div>
          </footer>
        `
      }
    ]
  }
  // Add other templates here
};

const WebsiteTemplatePreview: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [previewContent, setPreviewContent] = useState<PreviewTemplateContent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Find the requested template
    if (templateId && templates[templateId]) {
      setTemplate(templates[templateId]);
      setPreviewContent(templates[templateId].elements);
    } else {
      // Template not found
      console.error(`Template not found: ${templateId}`);
    }
  }, [templateId]);

  const handleInstallTemplate = () => {
    if (!template) return;

    // Store template elements in localStorage for use by the editor
    try {
      localStorage.setItem('website-elements', JSON.stringify(template.elements));
      
      toast({
        title: "Template installé !",
        description: `Le template ${template.name} a été installé avec succès.`,
        duration: 3000,
      });
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

  if (!template) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Template non trouvé</h2>
          <p className="text-gray-600 mb-6">Le template demandé n'existe pas ou n'est pas disponible.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Preview Header */}
      <div className="bg-white border-b py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => window.history.back()} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour
          </Button>
          <h1 className="text-xl font-bold">{template.name}</h1>
        </div>
        <Button onClick={handleInstallTemplate}>
          <Download className="h-4 w-4 mr-2" /> Installer ce template
        </Button>
      </div>

      {/* Preview Content */}
      <div className="flex-grow overflow-auto bg-gray-100">
        <WebsitePreview initialContent={previewContent} />
      </div>
    </div>
  );
};

export default WebsiteTemplatePreview;
