
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, LineChart, Share2, BarChart2, Globe } from 'lucide-react';

const WebsiteSEO: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">SEO & Marketing</h1>
          <p className="text-sm text-muted-foreground">
            Optimisez votre site pour les moteurs de recherche et suivez vos performances
          </p>
        </div>
        <Button variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Analyser le SEO
        </Button>
      </div>

      <Tabs defaultValue="seo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="seo" className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Analyses
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            Réseaux sociaux
          </TabsTrigger>
          <TabsTrigger value="sitemap" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Sitemap
          </TabsTrigger>
        </TabsList>

        <TabsContent value="seo" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres SEO</CardTitle>
              <CardDescription>
                Optimisez chaque page de votre site pour les moteurs de recherche
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Métadonnées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configurez les titres et descriptions pour chaque page
                    </p>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">URLs optimisées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Structure des URLs pour une meilleure indexation
                    </p>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Mots-clés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Définissez et suivez vos mots-clés cibles
                    </p>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Optimisez la vitesse de chargement de votre site
                    </p>
                    <Button variant="outline" size="sm">Analyser</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Analyses de trafic
              </CardTitle>
              <CardDescription>
                Suivez les performances de votre site web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12">
                <BarChart2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Connectez votre compte Google Analytics</h3>
                <p className="text-muted-foreground mb-6">
                  Intégrez Google Analytics pour suivre les visiteurs, pages vues et autres métriques importantes.
                </p>
                <Button>
                  Connecter Google Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteSEO;
