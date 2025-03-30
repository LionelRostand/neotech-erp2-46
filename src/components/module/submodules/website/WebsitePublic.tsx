
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronsUpDown } from '@/components/ui/ui-utils';
import { Globe, Copy, ExternalLink } from 'lucide-react';
import WebsitePreview from './website-preview/WebsitePreview';

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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-primary" />
              Site Public
            </div>
            <Button variant="outline" className="text-xs" size="sm">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Voir le site
            </Button>
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
                        <Button variant="ghost" size="icon">
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
          <Button variant="outline" className="mr-2">
            Régénérer le site
          </Button>
          <Button>
            Publier les modifications
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WebsitePublic;
