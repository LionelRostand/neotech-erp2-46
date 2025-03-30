
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Upload, 
  Image, 
  FileText, 
  FilePlus2, 
  Film, 
  Download, 
  Trash2, 
  Copy,
  ExternalLink,
  Link,
  LayoutGrid,
  LayoutList
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'other';
  url: string;
  size: string;
  dimensions?: string;
  uploadedAt: string;
}

const WebsiteMedia = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Mock media data
  const mediaItems: MediaItem[] = [
    { 
      id: '1', 
      name: 'hero-image.jpg', 
      type: 'image', 
      url: 'https://via.placeholder.com/800x600?text=Hero+Image',
      size: '1.2 MB',
      dimensions: '1920x1080',
      uploadedAt: '2023-08-10 14:30'
    },
    { 
      id: '2', 
      name: 'team-photo.jpg', 
      type: 'image', 
      url: 'https://via.placeholder.com/400x300?text=Team+Photo',
      size: '850 KB',
      dimensions: '1200x800',
      uploadedAt: '2023-08-05 11:45'
    },
    { 
      id: '3', 
      name: 'product-demo.mp4', 
      type: 'video', 
      url: 'https://via.placeholder.com/640x360?text=Product+Demo+Video',
      size: '15.7 MB',
      uploadedAt: '2023-08-08 09:20'
    },
    { 
      id: '4', 
      name: 'company-brochure.pdf', 
      type: 'document', 
      url: 'https://via.placeholder.com/210x297?text=PDF+Document',
      size: '3.5 MB',
      uploadedAt: '2023-07-28 16:15'
    },
    { 
      id: '5', 
      name: 'logo-dark.png', 
      type: 'image', 
      url: 'https://via.placeholder.com/200x200?text=Logo',
      size: '120 KB',
      dimensions: '500x500',
      uploadedAt: '2023-06-15 10:30'
    },
    { 
      id: '6', 
      name: 'product-specs.pdf', 
      type: 'document', 
      url: 'https://via.placeholder.com/210x297?text=Specs+Document',
      size: '2.8 MB',
      uploadedAt: '2023-08-02 13:10'
    },
    { 
      id: '7', 
      name: 'testimonial-video.mp4', 
      type: 'video', 
      url: 'https://via.placeholder.com/640x360?text=Testimonial+Video',
      size: '24.5 MB',
      uploadedAt: '2023-07-20 15:45'
    },
    { 
      id: '8', 
      name: 'background-pattern.jpg', 
      type: 'image', 
      url: 'https://via.placeholder.com/1000x1000?text=Pattern',
      size: '1.8 MB',
      dimensions: '2000x2000',
      uploadedAt: '2023-08-09 12:20'
    },
  ];

  const filteredMedia = mediaItems.filter(item => {
    // Filter by search term
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab type
    const matchesType = activeTab === 'all' || item.type === activeTab;
    
    return matchesSearch && matchesType;
  });

  const handleUploadStart = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploadDialogOpen(false);
          toast({
            title: "Téléchargement réussi",
            description: "Vos fichiers ont été téléchargés avec succès.",
          });
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiée",
      description: "L'URL du média a été copiée dans le presse-papiers.",
    });
  };

  const handleDelete = (id: string, name: string) => {
    // In a real app, you would delete the file here
    toast({
      title: "Fichier supprimé",
      description: `Le fichier "${name}" a été supprimé.`,
    });
    if (selectedMedia?.id === id) {
      setSelectedMedia(null);
      setIsDetailsOpen(false);
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Film className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      default:
        return <FilePlus2 className="h-5 w-5" />;
    }
  };

  const getMediaTypeLabel = (type: string) => {
    switch (type) {
      case 'image':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Image</Badge>;
      case 'video':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Vidéo</Badge>;
      case 'document':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Document</Badge>;
      default:
        return <Badge>Autre</Badge>;
    }
  };

  const getMediaThumbnail = (item: MediaItem) => {
    switch (item.type) {
      case 'image':
        return (
          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
        );
      case 'video':
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Film className="h-8 w-8 text-muted-foreground" />
          </div>
        );
      case 'document':
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <FilePlus2 className="h-8 w-8 text-muted-foreground" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Médias</h2>
          <p className="text-muted-foreground">Gérez les images, vidéos et documents de votre site</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Télécharger des médias</DialogTitle>
              <DialogDescription>
                Ajoutez des images, vidéos ou documents à votre bibliothèque de médias.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <div className="mt-2">
                  <Label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                    Sélectionner des fichiers
                  </Label>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={() => handleUploadStart()}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  ou glissez-déposez des fichiers ici
                </p>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Téléchargement en cours...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleUploadStart} disabled={isUploading}>Télécharger</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un média..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex">
          <Tabs 
            defaultValue="all" 
            className="mr-2"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="all">Tout</TabsTrigger>
              <TabsTrigger value="image">Images</TabsTrigger>
              <TabsTrigger value="video">Vidéos</TabsTrigger>
              <TabsTrigger value="document">Documents</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-6">
            {filteredMedia.length === 0 ? (
              <div className="text-center py-10">
                <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Aucun média trouvé</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Essayez de modifier votre recherche ou téléchargez de nouveaux médias.
                </p>
                <Button className="mt-4" onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Télécharger des médias
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredMedia.map((item) => (
                  <div 
                    key={item.id} 
                    className="border rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedMedia(item);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <div className="aspect-square bg-gray-100">
                      {getMediaThumbnail(item)}
                    </div>
                    <div className="p-2">
                      <div className="text-sm truncate" title={item.name}>{item.name}</div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">{item.size}</span>
                        <div className="flex items-center">
                          {getMediaIcon(item.type)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMedia.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center border rounded-md p-2 hover:bg-accent cursor-pointer"
                    onClick={() => {
                      setSelectedMedia(item);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center mr-4 overflow-hidden">
                      {getMediaThumbnail(item)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium truncate" title={item.name}>{item.name}</div>
                      <div className="flex space-x-4 text-xs text-muted-foreground">
                        <span>{item.size}</span>
                        {item.dimensions && <span>{item.dimensions}</span>}
                        <span>{item.uploadedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {getMediaTypeLabel(item.type)}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(item.url);
                      }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id, item.name);
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedMedia && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Détails du média</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 rounded-md aspect-square flex items-center justify-center overflow-hidden">
                {getMediaThumbnail(selectedMedia)}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedMedia.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Téléchargé le {selectedMedia.uploadedAt}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span>{selectedMedia.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Taille</span>
                    <span>{selectedMedia.size}</span>
                  </div>
                  {selectedMedia.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Dimensions</span>
                      <span>{selectedMedia.dimensions}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">URL</span>
                    <div className="flex items-center">
                      <span className="text-sm truncate max-w-[120px]">{selectedMedia.url}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyUrl(selectedMedia.url)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => window.open(selectedMedia.url, '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ouvrir dans un nouvel onglet
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleCopyUrl(selectedMedia.url)}>
                    <Link className="mr-2 h-4 w-4" />
                    Copier l'URL
                  </Button>
                  <Button variant="destructive" className="w-full" onClick={() => {
                    handleDelete(selectedMedia.id, selectedMedia.name);
                    setIsDetailsOpen(false);
                  }}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WebsiteMedia;
