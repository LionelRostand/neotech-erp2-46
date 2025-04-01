import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, FileVideo, File, Search, FolderPlus, SlidersHorizontal } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { formatFileSize } from '@/components/module/documents/utils/formatUtils';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnailUrl?: string;
  size: number;
  uploadDate: Date;
  dimensions?: { width: number; height: number };
}

const WebsiteMedia: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'banner-image.jpg',
      type: 'image',
      url: 'https://via.placeholder.com/800x400',
      thumbnailUrl: 'https://via.placeholder.com/200x100',
      size: 256000,
      uploadDate: new Date('2023-12-15'),
      dimensions: { width: 800, height: 400 }
    },
    {
      id: '2',
      name: 'product-video.mp4',
      type: 'video',
      url: 'https://example.com/video.mp4',
      thumbnailUrl: 'https://via.placeholder.com/200x100',
      size: 4500000,
      uploadDate: new Date('2023-12-10')
    },
    {
      id: '3',
      name: 'catalog.pdf',
      type: 'document',
      url: 'https://example.com/catalog.pdf',
      size: 2800000,
      uploadDate: new Date('2023-12-05')
    },
    {
      id: '4',
      name: 'team-photo.jpg',
      type: 'image',
      url: 'https://via.placeholder.com/600x400',
      thumbnailUrl: 'https://via.placeholder.com/150x100',
      size: 184000,
      uploadDate: new Date('2023-11-20'),
      dimensions: { width: 600, height: 400 }
    }
  ]);
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Téléversement réussi",
      description: "Vos fichiers ont été téléversés avec succès.",
      duration: 3000,
    });
    setShowUploadDialog(false);
  };

  const filteredItems = mediaItems.filter(item => {
    // Filter by tab type
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    
    // Filter by search term
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });

  const handleDeleteMedia = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Fichier supprimé",
      description: "Le fichier a été supprimé avec succès.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des médias</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setShowUploadDialog(true)} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Téléverser</span>
          </Button>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Téléverser des médias</DialogTitle>
              </DialogHeader>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-primary transition-colors">
                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Glissez et déposez des fichiers ici, ou cliquez pour sélectionner des fichiers
                </p>
                <Input type="file" className="hidden" multiple />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={handleUpload}>Téléverser</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => setShowUploadDialog(true)} className="flex items-center gap-2">
            <FolderPlus className="h-4 w-4" />
            <span>Nouveau dossier</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher des médias..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
          <TabsTrigger value="video">Vidéos</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <MediaCard 
                key={item.id} 
                item={item} 
                onDelete={handleDeleteMedia} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <MediaCard 
                key={item.id} 
                item={item} 
                onDelete={handleDeleteMedia} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <MediaCard 
                key={item.id} 
                item={item} 
                onDelete={handleDeleteMedia} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="document" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <MediaCard 
                key={item.id} 
                item={item} 
                onDelete={handleDeleteMedia} 
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MediaCardProps {
  item: MediaItem;
  onDelete: (id: string) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, onDelete }) => {
  const [showPreview, setShowPreview] = useState(false);

  const renderThumbnail = () => {
    switch(item.type) {
      case 'image':
        return <img src={item.thumbnailUrl || item.url} alt={item.name} className="w-full h-32 object-cover" />;
      case 'video':
        return (
          <div className="relative bg-black w-full h-32 flex items-center justify-center">
            <FileVideo className="h-12 w-12 text-gray-300" />
            {item.thumbnailUrl && <img src={item.thumbnailUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />}
          </div>
        );
      case 'document':
        return (
          <div className="bg-gray-100 w-full h-32 flex items-center justify-center">
            <File className="h-12 w-12 text-gray-400" />
          </div>
        );
      default:
        return <div className="bg-gray-100 w-full h-32" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="cursor-pointer" onClick={() => setShowPreview(true)}>
          {renderThumbnail()}
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="truncate font-medium">{item.name}</div>
        <div className="text-xs text-muted-foreground flex justify-between mt-1">
          <span>{formatFileSize(item.size)}</span>
          <span>{item.uploadDate.toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between">
        <Button variant="ghost" size="sm" onClick={() => setShowPreview(true)}>
          Aperçu
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Renommer</DropdownMenuItem>
            <DropdownMenuItem>Télécharger</DropdownMenuItem>
            <DropdownMenuItem>Copier le lien</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(item.id)}>
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center min-h-[300px]">
            {item.type === 'image' && (
              <img src={item.url} alt={item.name} className="max-w-full max-h-[500px] object-contain" />
            )}
            {item.type === 'video' && (
              <video controls className="max-w-full max-h-[500px]">
                <source src={item.url} type="video/mp4" />
                Votre navigateur ne prend pas en charge la lecture de vidéos.
              </video>
            )}
            {item.type === 'document' && (
              <div className="text-center">
                <File className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p>Aperçu non disponible pour ce type de document</p>
                <Button className="mt-4">
                  Télécharger
                </Button>
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Dimensions: {item.dimensions ? `${item.dimensions.width}x${item.dimensions.height}` : 'Non disponible'}</p>
            <p>Taille: {formatFileSize(item.size)}</p>
            <p>Téléversé le: {item.uploadDate.toLocaleDateString()}</p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WebsiteMedia;
