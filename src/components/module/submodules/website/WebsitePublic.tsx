
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronsUpDown } from '@/components/ui/ui-utils';
import { Globe, Copy, ExternalLink, ArrowLeft, Edit, Share2, Link2 } from 'lucide-react';
import WebsitePreview from './website-preview/WebsitePreview';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PreviewContentItem {
  id: string;
  type: string;
  content: string;
}

const WebsitePublic = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'browser' | 'fullscreen'>('browser');
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [domainType, setDomainType] = useState<'lovable' | 'custom'>('lovable');
  const [customDomain, setCustomDomain] = useState('');
  const [publishedContent, setPublishedContent] = useState<PreviewContentItem[]>([]);
  
  useEffect(() => {
    // Charger le contenu publié depuis le localStorage
    const savedContent = localStorage.getItem('website-published');
    if (savedContent) {
      setPublishedContent(JSON.parse(savedContent));
    } else {
      // Contenu d'exemple pour la prévisualisation si aucun contenu n'est publié
      setPublishedContent([
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
      ]);
    }
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(domainType === 'custom' && customDomain ? customDomain : 'https://monsite.lovable.app');
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

  const handlePublish = () => {
    toast({
      description: `Site web publié avec succès sur ${domainType === 'custom' && customDomain ? customDomain : 'monsite.lovable.app'}`,
    });
    setPublishDialogOpen(false);
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
                  <WebsitePreview previewMode={true} initialContent={publishedContent} />
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
                          <div>{domainType === 'custom' && customDomain ? customDomain : 'monsite.lovable.app'}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Principal</div>
                          <Button variant="ghost" size="icon" onClick={handleCopyUrl}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="sm"
                        onClick={() => setPublishDialogOpen(true)}
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        Configurer un domaine personnalisé
                      </Button>
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
            <Button onClick={() => setPublishDialogOpen(true)}>
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
              <span className="text-sm font-medium">{domainType === 'custom' && customDomain ? customDomain : 'monsite.lovable.app'}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleBackToEditor}>
              <Edit className="h-4 w-4 mr-1" />
              Éditer
            </Button>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            <WebsitePreview previewMode={true} initialContent={publishedContent} />
          </div>
        </div>
      )}

      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Publier votre site web</DialogTitle>
            <DialogDescription>
              Configurez votre domaine et publiez votre site pour le rendre accessible au public.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Options de publication</h4>
              <RadioGroup defaultValue="lovable" value={domainType} onValueChange={(value) => setDomainType(value as 'lovable' | 'custom')}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="lovable" id="lovable" />
                  <Label htmlFor="lovable">Utiliser un sous-domaine Lovable</Label>
                </div>
                <div className={`pl-6 mb-4 ${domainType === 'lovable' ? 'block' : 'hidden'}`}>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">https://</span>
                    <Input value="monsite.lovable.app" readOnly className="bg-muted/50" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Utiliser un domaine personnalisé</Label>
                </div>
                <div className={`pl-6 ${domainType === 'custom' ? 'block' : 'hidden'}`}>
                  <div className="flex flex-col space-y-2">
                    <Input 
                      placeholder="www.mondomaine.com" 
                      value={customDomain} 
                      onChange={(e) => setCustomDomain(e.target.value)} 
                    />
                    <p className="text-xs text-muted-foreground">
                      Vous devez configurer votre DNS pour pointer vers nos serveurs. Instructions détaillées disponibles après la publication.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handlePublish}>
              Publier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsitePublic;
