
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Grid2X2, 
  List, 
  Upload, 
  Trash2, 
  Search, 
  Image as ImageIcon, 
  FileVideo, 
  File, 
  FolderPlus
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: string;
  date: string;
}

const sampleMedia: MediaItem[] = [
  {
    id: '1',
    name: 'voiture-principale.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d',
    size: '1.2 MB',
    date: '12/05/2023'
  },
  {
    id: '2',
    name: 'logo-entreprise.png',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1586880244406-8c84e87180df',
    size: '345 KB',
    date: '02/04/2023'
  },
  {
    id: '3',
    name: 'video-presentation.mp4',
    type: 'video',
    url: 'https://example.com/video.mp4',
    size: '14.8 MB',
    date: '28/03/2023'
  },
  {
    id: '4',
    name: 'banniere-site.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d',
    size: '2.4 MB',
    date: '15/04/2023'
  },
  {
    id: '5',
    name: 'conditions-utilisation.pdf',
    type: 'document',
    url: 'https://example.com/document.pdf',
    size: '567 KB',
    date: '05/02/2023'
  },
  {
    id: '6',
    name: 'flotte-vehicules.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537',
    size: '1.8 MB',
    date: '22/05/2023'
  },
];

const MediaManager: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mediaFilter, setMediaFilter] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      toast({
        title: "Fichier(s) téléchargé(s)",
        description: `${e.target.files.length} fichier(s) en cours de traitement.`,
        duration: 3000,
      });
    }
  };

  const handleMediaSelect = (id: string) => {
    if (selectedMedia.includes(id)) {
      setSelectedMedia(selectedMedia.filter((mediaId) => mediaId !== id));
    } else {
      setSelectedMedia([...selectedMedia, id]);
    }
  };

  const handleDeleteSelected = () => {
    toast({
      title: "Médias supprimés",
      description: `${selectedMedia.length} élément(s) supprimé(s) avec succès.`,
      duration: 3000,
    });
    setSelectedMedia([]);
  };

  const filteredMedia = sampleMedia.filter((media) => {
    const matchesType = mediaFilter === 'all' || media.type === mediaFilter;
    const matchesSearch = media.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <FileVideo className="h-8 w-8 text-purple-500" />;
      case 'document':
        return <File className="h-8 w-8 text-amber-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher des médias..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex border rounded-md p-1">
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setView('grid')}
            >
              <Grid2X2 className="h-4 w-4" />
              <span className="sr-only">Vue grille</span>
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Vue liste</span>
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSelectedMedia([])}>
            Annuler la sélection
          </Button>
          <Button variant="outline" onClick={handleDeleteSelected} disabled={selectedMedia.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer ({selectedMedia.length})
          </Button>
          <div className="relative">
            <Input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              multiple 
              onChange={handleFileUpload}
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Télécharger
              </label>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setMediaFilter(value)}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Vidéos</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderMediaContent(filteredMedia)}
        </TabsContent>
        <TabsContent value="image" className="mt-6">
          {renderMediaContent(filteredMedia)}
        </TabsContent>
        <TabsContent value="video" className="mt-6">
          {renderMediaContent(filteredMedia)}
        </TabsContent>
        <TabsContent value="document" className="mt-6">
          {renderMediaContent(filteredMedia)}
        </TabsContent>
      </Tabs>

      {filteredMedia.length === 0 && (
        <div className="text-center p-12 border rounded-lg bg-muted/20">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Aucun média trouvé</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Aucun média ne correspond à votre recherche. Essayez avec d'autres termes.
          </p>
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t">
        <span>{filteredMedia.length} élément(s)</span>
        <Button variant="outline" size="sm">
          <FolderPlus className="h-4 w-4 mr-2" />
          Nouveau dossier
        </Button>
      </div>
    </div>
  );

  function renderMediaContent(media: MediaItem[]) {
    if (view === 'grid') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <Card 
              key={item.id} 
              className={`overflow-hidden cursor-pointer transition-all ${
                selectedMedia.includes(item.id) ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleMediaSelect(item.id)}
            >
              <div className="aspect-square relative">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    {getIconForType(item.type)}
                  </div>
                )}
                {selectedMedia.includes(item.id) && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      ✓
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{item.size}</span>
                  <span>{item.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr className="border-b">
              <th className="text-left py-2 pl-4 font-medium">Nom</th>
              <th className="text-left py-2 font-medium hidden md:table-cell">Type</th>
              <th className="text-left py-2 font-medium hidden md:table-cell">Taille</th>
              <th className="text-left py-2 font-medium hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {media.map((item) => (
              <tr 
                key={item.id} 
                className={`border-b hover:bg-muted/50 cursor-pointer ${
                  selectedMedia.includes(item.id) ? 'bg-primary/10' : ''
                }`}
                onClick={() => handleMediaSelect(item.id)}
              >
                <td className="py-2 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getIconForType(item.type)}
                    </div>
                    <span>{item.name}</span>
                  </div>
                </td>
                <td className="py-2 hidden md:table-cell">{item.type}</td>
                <td className="py-2 hidden md:table-cell">{item.size}</td>
                <td className="py-2 hidden md:table-cell">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default MediaManager;
