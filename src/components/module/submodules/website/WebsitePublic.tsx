
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronsUpDown } from '@/components/ui/ui-utils';
import { Globe, Copy, ExternalLink, ArrowLeft, Edit, Share2 } from 'lucide-react';
import WebsitePreview from './website-preview/WebsitePreview';
import { useToast } from '@/components/ui/use-toast';

// Contenu d'exemple pour la prévisualisation
const exampleContent = [
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
        <p>Ceci est un exemple de section. Vous pouvez modifier ce contenu en double-cliquant dessus.</p>
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

const WebsitePublic = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'browser' | 'fullscreen'>('browser');

  const handleCopyUrl = () => {
    navigator.clipboard.writeText('https://monsite.example.com');
    toast({
      description: 'URL copiée dans le presse-papier',
    });
  };

  const handleShare = () => {
    toast({
      description: 'Options de partage ouvertes',
    });
  };

  const handleBackToEditor = () => {
    window.location.href = '/modules/website/editor';
  };

  return (
    <div className="space-y-6">
      {viewMode === 'browser' ? (
        <Card>
          <CardHeader className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-2 top-2 rounded-full h-8 w-8"
              onClick={handleBackToEditor}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="flex justify-between items-center ml-8">
              <div className="flex items-center">
                <Globe className="mr-2 h-5 w-5 text-primary" />
                Site Public
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="text-xs" size="sm" onClick={handleCopyUrl}>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copier l'URL
                </Button>
                <Button variant="outline" className="text-xs" size="sm" onClick={handleShare}>
                  <Share2 className="h-3.5 w-3.5 mr-1" />
                  Partager
                </Button>
                <Button variant="default" className="text-xs" size="sm" onClick={() => setViewMode('fullscreen')}>
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Plein écran
                </Button>
                <Button variant="outline" className="text-xs" size="sm" onClick={handleBackToEditor}>
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Éditer
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview">
              <TabsList className="mb-4">
                <TabsTrigger value="preview">Prévisualisation</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
                <TabsTrigger value="domain">Domaine</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-lg overflow-hidden bg-muted/30">
                  <WebsitePreview previewMode={true} initialContent={exampleContent} />
                </div>
              </TabsContent>
              <TabsContent value="settings">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Paramètres du site</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Titre du site</div>
                        <div className="font-medium">Mon Site Web</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">État</div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          <span>Publié</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="domain">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Domaines</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <div>monsite.domaine.com</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Principal</div>
                          <Button variant="ghost" size="icon" onClick={handleCopyUrl}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button variant="outline" className="mr-2" onClick={handleBackToEditor}>
              Retourner à l'éditeur
            </Button>
            <Button>
              Publier les modifications
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="bg-background p-2 border-b flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={() => setViewMode('browser')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-1 text-primary" />
              <span className="text-sm font-medium">monsite.domaine.com</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleBackToEditor}>
              <Edit className="h-4 w-4 mr-1" />
              Éditer
            </Button>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            <WebsitePreview previewMode={true} initialContent={exampleContent} customContent={
              <div className="min-h-screen bg-white">
                <header className="bg-primary text-white p-6">
                  <div className="container mx-auto">
                    <h1 className="text-3xl font-bold">Mon Site Web</h1>
                    <p className="mt-2">Bienvenue sur mon site professionnel</p>
                  </div>
                </header>
                
                <main className="container mx-auto py-8 px-4">
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Nos Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-muted/30 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">Service 1</h3>
                        <p>Description détaillée du premier service offert par notre entreprise.</p>
                      </div>
                      <div className="bg-muted/30 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">Service 2</h3>
                        <p>Description détaillée du deuxième service offert par notre entreprise.</p>
                      </div>
                      <div className="bg-muted/30 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">Service 3</h3>
                        <p>Description détaillée du troisième service offert par notre entreprise.</p>
                      </div>
                    </div>
                  </section>
                  
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">À Propos</h2>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="md:w-1/2">
                        <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
                        <p>Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.</p>
                      </div>
                      <div className="md:w-1/2">
                        <img src="https://via.placeholder.com/600x400" alt="À propos" className="rounded-lg w-full" />
                      </div>
                    </div>
                  </section>
                  
                  <section>
                    <h2 className="text-2xl font-bold mb-6">Contactez-nous</h2>
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Nom</label>
                            <input type="text" className="w-full p-2 border rounded-md" placeholder="Votre nom" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" className="w-full p-2 border rounded-md" placeholder="votre@email.com" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Message</label>
                          <textarea className="w-full p-2 border rounded-md" rows={4} placeholder="Votre message"></textarea>
                        </div>
                        <div>
                          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                            Envoyer
                          </button>
                        </div>
                      </form>
                    </div>
                  </section>
                </main>
                
                <footer className="bg-gray-900 text-white py-6">
                  <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">Mon Site Web</h3>
                        <p className="text-sm text-gray-400 mt-1">© 2025 Tous droits réservés</p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <ul className="flex space-x-4">
                          <li><a href="#" className="hover:text-primary">Accueil</a></li>
                          <li><a href="#" className="hover:text-primary">Services</a></li>
                          <li><a href="#" className="hover:text-primary">À propos</a></li>
                          <li><a href="#" className="hover:text-primary">Contact</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            } />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsitePublic;
